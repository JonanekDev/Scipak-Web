---
title: 'Windows Hyper-V HA Cluster'
description: 'How to build a Windows HA cluster with Hyper-V, Active Directory and iSCSI using nested virtualization. Step by step guide, fixes for common errors and tests of failover and live migration.'
tags: ['Windows', 'Hyper-V', 'Proxmox']
date: 2026-10-25
thumbnail: '/imgs/blog/hyper-v-ha-cluster/thumbnail.jpeg'
---

## Hyper-V HA Cluster on virtualized hardware

In the previous article I built [Proxmox HA Cluster from old laptops](/blog/junk-proxmox-ha-cluster) from old junk that I found at home. But Proxmox is Linux solution and Microsoft of course has its own one. And maybe it is even better? So I decided to build Hyper-V HA Cluster.

Windows eats more RAM than Proxmox and the RAM I have at home would not be enough. So I **built the cluster virtualized on one Proxmox server** using so called nested virtualization (virtualization inside of virtualization). Let's see how I got this fully virtualized cluster running.

![Video thumbnail](/imgs/blog/hyper-v-ha-cluster/thumbnail.jpeg)

## Architecture

| VM name | Role in the cluster | vCPU | RAM | Disks |
|---|---|---|---|---|
| WIN-AD | Domain controller, DNS, iSCSI Target (data + witness) | 6 | 8 GB | OS + 100 GB for iSCSI |
| Hyper-1 | Hyper-V node 1 | 8 | 24 GB | Only OS (VMs are on iSCSI) |
| Hyper-2 | Hyper-V node 2 | 8 | 24 GB | Only OS (VMs are on iSCSI) |

- **Why Active Directory?** The cluster normally depends of a domain: it handles permissions between the nodes through it and creates its own objects there. Workgroup cluster exist, but in Hyper-V the live migration doesn't work in it.

- **Why Witness (and why 2 nodes are enough instead of 3)?** Same as in [Proxmox](/blog/junk-proxmox-ha-cluster) the Windows cluster needs **quorum**, so more than half of the votes. Thanks to this there is no **split-brain** scenario when the network goes down (both nodes would think that the other one is dead and start writing to the same disk independently). In Proxmox I solved this with a third full node, but in Windows I don't need to feed another Hyper-V server. The third vote is given by **Disk Witness**, a small shared disk on the iSCSI storage.

- **Where is the Single Point of Failure?** Except the Proxmox server itself, the critical point is the VM with AD and iSCSI. When it goes down, the cluster loses the domain, witness and most important the iSCSI disks with the virtual machines, so everything stops working.

## Setup

### 1. Nested virtualization in Proxmox

To turn on Hyper-V inside of virtual Windows Server we need to use nested virtualization (virtualization inside of virtual machine). Proxmox has it enabled in most cases, but you can check it with this command:

```
root@rizek-pve:~# cat /sys/module/kvm_intel/parameters/nested 
Y
```

If it prints `Y` it is enabled. For AMD processor you check `kvm_amd`. You can also find how to enable it in the [Proxmox documentation](https://pve.proxmox.com/wiki/Nested_Virtualization).

For the VMs it is enough to set CPU type to `host`. In Windows VMs you need to do it **before the installation** (see [Problems](#problems-and-solutions)).

### 2. Installing Windows servers

You can just download [Evaluation Windows Server](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025), which we can use for 180 days without limits. If you don't want to go through the installation 3 times, you can clone the installed VM, but you need to generalize it first with `C:\Windows\System32\Sysprep\sysprep.exe` (Generalize + Shutdown).

### 3. Drivers

Windows doesn't has drivers for virtio devices by default (VirtIO SCSI, VirtIO network card etc.). There are two ways how to solve it:

* **Easier:** choose IDE disk and Intel E1000E network card when creating the VM, Windows has drivers for these right away.
* **Better:** download the ISO with [VirtIO drivers for Windows](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/). Proxmox will offer adding this ISO next to the system one when you choose Windows.

I choose the VirtIO drivers. During the installation we see that Windows can't see our disk, but it's not a problem. Just click on Load driver, find the ISO with VirtIO drivers and the driver for disk controller is in `vioscsi\2k25\amd64` (or according to your Windows version). After that the disk appears. The rest of drivers (network and others) we install after the system installation with `virtio-win-gt-x64.exe` from the same ISO.

### 4. Active Directory

I set static IP addresses on all servers. On the Hyper-V nodes I put the address of the future AD server as DNS. On the AD server you need to set DNS to `127.0.0.1` before we create the domain (DNS server is installed together with AD, see [Problems](#problems-and-solutions)).

Then just add the role Active Directory Domain Services and go through the simple wizard, where we create a new forest.

![Create AD](/imgs/blog/hyper-v-ha-cluster/create-ad.png)

After that we join both Hyper-V nodes to the same domain. You need to log in with the Administrator account from our domain and restart after that.

![Join AD](/imgs/blog/hyper-v-ha-cluster/join-ad.png)

### 5. Installing Hyper-V

On both nodes we install the role **Hyper-V** (restart after the installation) and the feature **Failover Clustering**.

### 6. Shared iSCSI storage

The virtual machines need to be on a shared storage, so they can move between the nodes while running:

1. On WIN-AD I installed the role iSCSI Target Server, created two virtual disks (one for data and smaller one for witness) and allowed access for both Hyper-V nodes.
2. On both nodes I opened iSCSI Initiator, entered the IP address of WIN-AD and connected the disks.
3. In disk manager I initialized and formatted the disks on the first node (on the second node they stay offline, the cluster will take care of the ownership later).

### 7. Validation and creating the cluster

In Failover Cluster Manager I first ran **Validate Configuration**, which checks network, disks and settings of both servers. Some tests (for example Validate Software Update Levels) gave me errors. In lab I ignored them and continued, but in production the validation should pass without errors. Then I just clicked on **Create Cluster**, selected both nodes and gave the cluster its own IP address.

![Validate Configuration result](/imgs/blog/hyper-v-ha-cluster/validate-errors.png)

### 8. Cluster Shared Volume and Witness

The connected iSCSI disks appear in Failover Cluster Manager (Storage → Disks) after clicking Add Disk and we just add them. Then right click on the bigger disk (for the VM data) and choose Add to Cluster Shared Volumes. The disk then appears in the path `C:\ClusterStorage\Volume1`.

Witness is set by right clicking on the whole cluster → More Actions → Configure Cluster Quorum Settings, where we choose disk witness and the smaller disk.

![Failover Cluster Manager - nodes UP](/imgs/blog/hyper-v-ha-cluster/hyper-v-nodes.png)

### 9. Creating virtual machines

The test virtual machines are not created in normal Hyper-V Manager, but directly in Failover Cluster Manager (Roles → Virtual Machines → New Virtual Machine) with location on the already mentioned `C:\ClusterStorage\Volume1`. We can choose the ISO file from local disk of the server, but we must remove it after the installation, otherwise failover and live migration will not work.

For test I created two virtual machines: Windows with Remote Desktop apps (RemoteApp) and Windows with Minecraft server (using Crafty). Of course you can run Linux virtual machines there too, but when we already have this Hyper-V cluster, we stay with Windows.

![RDApp](/imgs/blog/hyper-v-ha-cluster/rdapp.png)

## Tests

Next to it I had Uptime Kuma running and watched what happens during the move while running and during unplanned outage.

* **Live migration (Move → Live Migration):** RAM of the running VM was copied over the network to the second node in the background. Uptime Kuma didn't record any outage. On RDP a short lag was noticeable when typing, on Minecraft nothing was noticeable at all.

* **Unplanned failover:** I simulated the outage by disconnecting the network of one node and I tested it on the VM with RDP. The second node detected it after about a minute, but the VM started on it after approx. 4 minutes and RDP was available after almost 6 minutes. I didn't try the failover on Minecraft server, but the result will be similar, just little bit longer, because after Windows starts, Java and the server itself must start too.

| Test | Result |
|---|---|
| Live migration (RDP) | short lag when typing |
| Live migration (Minecraft) | no noticeable outage |
| Failover: VM started on the second node (RDP) | approx. 4 min |
| Failover: RDP available again | approx. 6 min |

## Problems and solutions

Clicking through the wizard is fine, but I run into few problems on the way, which is good to avoid.

### 1. Changing the CPU after installation

During the first installation I forgot to set CPU type to `host` and I wanted to change it after Windows were installed. Proxmox allows the change, but then Windows didn't boot and got stuck. I wasn't able to fix it, so I started the installation again, this time with CPU type `host`.

### 2. Hyper-V in already virtualized Proxmox

You normally don't meet this problem, but I originally wanted to build the cluster on our school server. But on it we don't have access to the physical machine, only to our virtualized Proxmoxes, so there were more layers of virtualization behind each other. Proxmox had no problem with it, but Windows got stuck at boot after installing the Hyper-V role. I solved it by moving all virtual machines to another server, where Proxmox runs directly on hardware.

### 3. Active Directory and DNS

Even though I installed Active Directory already few times, I naively thought that Windows will set DNS to `127.0.0.1` by itself during the AD installation. But it doesn't and the installation gets stuck in endless waiting without any error. It was enough to stop it, set the DNS correctly and run the installation again.

## Conclusion

It was interesting experiment and if you like Windows and have enough hardware, I recommend to try it. Compared to Proxmox it is more complicated, especially if you aren't used to Windows.