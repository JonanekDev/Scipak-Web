---
title: 'Windows Hyper-V HA Cluster'
description: 'Jak postavit Windows HA cluster s Hyper-V, Active Directory a iSCSI pomocí nested virtualizace. Postup krok za krokem, řešení častých chyb a test failoveru i live migrace.'
tags: ['Windows', 'Hyper-V', 'Proxmox']
date: 2026-10-25
thumbnail: '/imgs/blog/hyper-v-ha-cluster/thumbnail.jpeg'
---

## Hyper-V HA Cluster na virtualizovaném hardwaru

V předchozím článku jsem postavil [Proxmox HA Cluster ze starých noťasů](/cs/blog/proxmox-ha-junk-cluster) ze starého železa, co dům dal. Jenže Proxmox je řešení postavené na Linuxu a Microsoft má samozřejmě to svoje. A třeba je i lepší? Proto jsem se rozhodl postavit Hyper-V HA Cluster.

Windows papají víc RAM než Proxmox a RAM, kterou mám doma, by nestačila. Cluster jsem proto **postavil virtualizovaně na jednom Proxmox serveru** pomocí tzv. nested virtualizace (virtualizace uvnitř virtualizace). Ukážeme si, jak jsem takový plně virtualizovaný cluster rozjel.

![Náhled videa](/imgs/blog/hyper-v-ha-cluster/thumbnail.jpeg)

## Architektura

| Název VM | Role v clusteru | vCPU | RAM | Disky |
|---|---|---|---|---|
| WIN-AD | Doménový řadič, DNS, iSCSI Target (data + witness) | 6 | 8 GB | OS + 100 GB pro iSCSI |
| Hyper-1 | Hyper-V node 1 | 8 | 24 GB | Jen OS (VM jsou na iSCSI) |
| Hyper-2 | Hyper-V node 2 | 8 | 24 GB | Jen OS (VM jsou na iSCSI) |


- **Proč Active Directory?** Cluster se standardně opírá o doménu: řeší přes ni oprávnění mezi nody a vytváří si v ní vlastní objekty. Workgroup cluster sice existuje, ale u Hyper-V v něm nefunguje live migrace.

- **Proč Witness (a proč stačí 2 nody místo 3)?** Stejně jako u [Proxmoxu](/cs/blog/proxmox-ha-junk-cluster) potřebuje i Windows cluster **quorum**, tedy nadpoloviční většinu hlasů. Díky tomu při výpadku sítě nedojde ke **split-brain** scénáři (oba nody by si mysleli, že ten druhý umřel, a začaly by nezávisle zapisovat na stejný disk). U Proxmoxu jsem to řešil třetím plnohodnotným nodem, ve Windows ale další Hyper-V server živit nemusím. Třetí hlas tu dává **Disk Witness**, malý sdílený disk na iSCSI úložišti.

- **Kde je Single Point of Failure?** Kromě samotného Proxmox serveru je kritickým bodem virtuálka s AD a iSCSI. Když spadne, cluster přijde o doménu, witness a hlavně o iSCSI disky s virtuálkami, takže přestane fungovat úplně všechno.

## Postup

### 1. Nested virtualizace v Proxmoxu

Aby šlo uvnitř virtuálního Windows Serveru zapnout Hyper-V, musíme použít nested virtualizaci (virtualizaci uvnitř virtuálky). Proxmox ji má ve většině případů povolenou, ale můžete si to ověřit příkazem:

```
root@rizek-pve:~# cat /sys/module/kvm_intel/parameters/nested 
Y
```

Pokud vypíše `Y` je povolená. U AMD procesoru se kontroluje `kvm_amd`. Případně najdete návod na povolení v [dokumentaci Proxmoxu](https://pve.proxmox.com/wiki/Nested_Virtualization).

U virtuálek pak stačí nastavit CPU type na `host`. U Windows VM je potřeba to udělat **před instalací** (viz [Problémy](#problémy-a-řešení)).

### 2. Instalace Windows serverů

Stačí si stáhnout [Evaluation Windows Server](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025), který můžeme 180 dní používat bez omezení. Pokud se vám nechce procházet instalací 3×, můžete nainstalovanou VM naklonovat, ale je potřeba ji nejdřív zgeneralizovat přes `C:\Windows\System32\Sysprep\sysprep.exe` (Generalize + Shutdown).

### 3. Drivery

Windows defaultně neobsahuje drivery pro virtio zařízení (VirtIO SCSI, VirtIO síťovka atd.). To jde vyřešit dvěma způsoby:

* **Jednodušší:** při vytváření VM zvolit IDE disk a síťovku Intel E1000E, pro které má Windows drivery rovnou.
* **Lepší:** stáhnout si ISO s [VirtIO drivery pro Windows](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/). Proxmox při zvolení Windows rovnou nabídne přidání tohoto ISO vedle systémového.

Já jsem zvolil VirtIO drivery. Při instalaci pak uvidíme, že Windows nevidí náš disk, ale to nevadí. Stačí kliknout na Load driver, najít ISO s VirtIO drivery a driver pro diskový řadič je v `vioscsi\2k25\amd64` (případně podle vaší verze Windows). Potom se disk objeví. Zbytek driverů (síť a další) doinstalujeme až po instalaci systému pomocí `virtio-win-gt-x64.exe` ze stejného ISO.

### 4. Active Directory

Na všech serverech jsem nastavil statické IP adresy. Na Hyper-V nodech jsem jako DNS zadal adresu budoucího AD serveru. Na serveru s AD je potřeba DNS nastavit na `127.0.0.1` ještě předtím, než vytvoříme doménu (DNS server se doinstaluje spolu s AD, viz [Problémy](#problémy-a-řešení)).

Pak stačí přidat roli Active Directory Domain Services a projít jednoduchým průvodcem, kde vytvoříme nový les (forest).

![Create AD](/imgs/blog/hyper-v-ha-cluster/create-ad.png)

Potom do stejné domény připojíme oba Hyper-V nody. Je potřeba se přihlásit účtem Administrátora z naší domény a následně restartovat.

![Join AD](/imgs/blog/hyper-v-ha-cluster/join-ad.png)

### 5. Instalace Hyper-V

Na obou nodech nainstalujeme roli **Hyper-V** (po instalaci restart) a feature **Failover Clustering**.

### 6. Sdílené iSCSI úložiště

Aby mohly virtuálky cestovat mezi nody za běhu, musí ležet na sdíleném úložišti:

1. Na WIN-AD jsem doinstaloval roli iSCSI Target Server, vytvořil dva virtuální disky (jeden pro data a menší pro witness) a povolil k nim přístup oběma Hyper-V nodům.
2. Na obou nodech jsem otevřel iSCSI Initiator, zadal IP adresu WIN-AD a disky připojil.
3. Ve správci disků jsem na prvním nodu disky inicializoval a naformátoval (na druhém nodu zůstanou offline, o jejich vlastnictví se pak postará cluster).

### 7. Validace a vytvoření clusteru

Ve Failover Cluster Manageru jsem nejdřív spustil **Validate Configuration**, který zkontroluje síť, disky i nastavení obou serverů. U některých testů (třeba Validate Software Update Levels) mi to vyhodilo chyby. V labu jsem je ignoroval a pokračoval, v produkci by ale validace měla projít bez chyb. Potom stačilo kliknout na **Create Cluster**, vybrat oba nody a přiřadit clusteru vlastní IP adresu.

![Výsledek Validate COnfiguration](/imgs/blog/hyper-v-ha-cluster/validate-errors.png)

### 8. Cluster Shared Volume a Witness

Připojené iSCSI disky se ve Failover Cluster Manageru (Storage → Disks) objeví po kliknutí na Add Disk a stačí je přidat. Na větší disk (pro data virtuálek) pak klikneme pravým tlačítkem a vybereme Add to Cluster Shared Volumes. Disk se tím objeví v cestě `C:\ClusterStorage\Volume1`.

Witness se nastaví kliknutím pravým na celý cluster → More Actions → Configure Cluster Quorum Settings, kde vybereme disk witness a menší z disků.

![Failover Cluster Manager - nody UP](/imgs/blog/hyper-v-ha-cluster/hyper-v-nodes.png)


### 9. Vytvoření virtuálek

Testovací virtuálky se nevytvářejí v obyčejném Hyper-V Manageru, ale přímo ve Failover Cluster Manageru (Roles → Virtual Machines → New Virtual Machine) s umístěním na již zmíněný `C:\ClusterStorage\Volume1`. ISO soubor můžeme klidně vybrat z lokálního disku serveru, jen ho po instalaci musíme odebrat, jinak nebude fungovat failover ani live migrace.

Pro test jsem vytvořil dvě virtuálky: Windows s Remote Desktop aplikacemi (RemoteApp) a Windows s Minecraft serverem (Pomocí Crafty). Samozřejmě si tam můžete spustit i Linuxové virtuálky, ale když už máme ten Hyper-V cluster, tak zůstaneme u Windows.

![RDApp](/imgs/blog/hyper-v-ha-cluster/rdapp.png)

## Testy

Vedle jsem si pustil Uptime Kuma a sledoval, co se stane při přesunu za běhu a při neplánovaném výpadku.

* **Live migrace (Move → Live Migration):** RAM běžící virtuálky se na pozadí přelila přes síť na druhý node. Uptime Kuma nezaznamenala žádný výpadek. U RDP byl poznat krátký zásek při psaní, u Minecraftu nebylo poznat vůbec nic.

* **Neplánovaný failover:** Výpadek jsem nasimuloval odpojením sítě jednoho nodu a testoval jsem ho na virtuálce s RDP. Druhý node ho po asi minutě zjistil, VM se na něm ale spustila až po cca 4 minutách a RDP bylo dostupné až po skoro 6 minutách. U Minecraft serveru jsem failover nezkoušel, výsledek ale bude podobný, jen o něco delší, protože po startu Windows musí naběhnout ještě Java a samotný server.

| Test | Výsledek |
|---|---|
| Live migrace (RDP) | krátký zásek při psaní |
| Live migrace (Minecraft) | bez znatelného výpadku |
| Failover: VM spuštěna na druhém nodu (RDP) | cca 4 min |
| Failover: RDP znovu dostupné | cca 6 min |

## Problémy a řešení

Naklikat průvodce je fajn, ale cestou jsem narazil na pár problémů, kterým se vyplatí vyhnout.

### 1. Změna procesoru po instalaci

Při první instalaci jsem zapomněl nastavit CPU type na `host` a chtěl jsem ho změnit až po instalaci Windows. Proxmox změnu umožní, ale Windows potom nenabootoval a zasekl se. Opravit se mi to nepodařilo, takže jsem instalaci spustil znovu už s CPU typem `host`.

### 2. Hyper-V ve virtualizovaném Proxmoxu

S tímhle problémem se běžně nesetkáte, ale já chtěl cluster původně postavit na školním serveru. Na něm ale nemáme přístup na fyzický stroj, jen do našich virtualizovaných Proxmoxů, takže tam bylo víc vrstev virtualizace za sebou. Proxmox s tím problém neměl, ale Windows po instalaci Hyper-V role zůstával zaseklý při bootu. Vyřešil jsem to přesunem všech virtuálek na jiný server, kde Proxmox běží přímo na hardwaru.

### 3. Active Directory a DNS

I když jsem Active Directory už párkrát instaloval, naivně jsem si myslel, že si Windows při instalaci AD nastaví DNS na `127.0.0.1` sám. Tak to ale není a instalace se zasekne v nekonečném čekání bez chyby. Stačilo ji přerušit, správně nastavit DNS a spustit ji znovu.

## Závěr

Byl to zajímavý experiment a pokud máte rádi Windows a dostatek hardwaru, doporučuju si ho vyzkoušet. Oproti Proxmoxu je ale složitější, hlavně pokud nejste zvyklí na Windows.