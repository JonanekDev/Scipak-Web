---
title: 'Proxmox HA Cluster ze starých noťasů'
description: 'Jak funguje Proxmox HA cluster postavený ze starého hardwaru, co jsem našel doma a jak dlouho trvá failover?'
tags: ['Proxmox']
date: 2026-06-11
thumbnail: '/imgs/blog/proxmox-junk-cluster/hardware.png'
---

## Proxmox VE HA Cluster na starém hardwaru

Vysoká dostupnost (HA) zní jako enterprise záležitost. Drahý hardware, drahé úložiště. Ale co když to celé postavíte ze starých počítačů, které už skoro nezvládají ani procházení webů a jen doma sbírají prach?

![Fotka mého Proxmox clusteru](/imgs/blog/proxmox-junk-cluster/hardware.png)

## Hardware

Cluster tvoří tři nody:

- [Acer TravelMate 6460](https://notebook.napicu.eu/) (Intel Core 2 Duo, 3GB RAM)
- Lenovo T420 (Intel Core i5 2. generace, 4GB RAM)
- Fujitsu Desktop (Intel Core i3 4. generace, 16GB RAM)

Pro produkční nasazení je samozřejmě nejlepší použít identické, případně výkonnostně srovnatelné nody. Klíčové je dodržet pravidlo, aby zbývající nody měly dostatek výkonu a paměti pro převzetí všech běžících virtuálek, když jeden z nodů vypadne.

## Proč 3 nody ne 2

Proxmox HA stojí na Corosync clusteru, který pro své fungování potřebuje **quorum** – vyžaduje tedy, aby byla online nadpoloviční většina nodů.

Kdybych použil jen dva nody a přerušilo by se mezi nimi spojení, cluster by nevěděl, jestli druhý node spadl, nebo jen spadla síť. Výsledkem by byl tzv. **split-brain scénář**: oba nody by si myslely, že jsou jako jediné funkční, a začaly by nezávisle na sobě manipulovat s daty. Třetí node tento problém přirozeně řeší a slouží jako rozhodovací hlas.

## Úložiště

Sdílené úložiště je podmínkou pro HA cluster podmínkou. Disk virtuálky musí být dostupný ze všech nodů. Já jsem použil NFS share na dalším počítači, což s sebou samozřejmě nese architektonické nevýhody.

Můj NFS server zde totiž tvoří **single point of failure**. Pokud vypadne úložiště, padají všechny virtuálky. V produkci se tohle nejčastěji řeší pomocí **Cephu** (distribuovaného úložiště přímo mezi nody clusteru). K tomu bych ale na každém nodu potřeboval další vyhrazený disk mimo ten systémový, proto jsem pro tento experiment zvolil jednodušší cestu s NFS.

## Co se stane při výpadku nodu?

Failover je hlavním důvodem nasazení HA clusteru. Představme si, že nám odejde jeden node (např. kvůli hardwarové poruše). Zbylé dva nody situaci detekují a okamžitě si mezi sebe rozdělí virtuálky a LXC kontejnery, které na vypadlém nodu běžely.

Na mém historickém hardwaru trval celý failover proces přes 2 minuty. Důvodem je slabý výpočetní výkon nodů a také propustnost gigabitové sítě, přes kterou tečou data z NFS, což prodlužuje samotný boot systémů. HA ale i tak zafungovalo přesně podle očekávání (i když v produkci je dvouminutový výpadek samozřejmě příliš dlouhý).

## Live migrace

HA cluster neřeší jen nečekané havárie, ale ohromně pomáhá i při plánované údržbě. Pokud potřebuji některý server restartovat, mohu virtuálky za běhu migrovat na jiný node.

Na rozdíl od failoveru zde nedochází k restartu virtuálky. Obsah RAM se po síti přesune na cílový node s téměř nulovým výpadkem. Bohužel i live migrace na tomto hardwaru znamenala zhruba půlminutový "zářez", zatímco na moderních serverech a 10Gbps+ sítích probíhá v řádu zlomků sekundy a uživatel si ničeho nevšimne.

## Závěr

Proxmox HA na starém hardwaru reálně funguje, i když délkou výpadků má logicky daleko do produkčních standardů. Pokud si ale chcete osahat proces nastavování clusteru, konfiguraci sdíleného úložiště a zajistit svému homelab Minecraft serveru co největší uptime, určitě doporučuji si to vyzkoušet!
