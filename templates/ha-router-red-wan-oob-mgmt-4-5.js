/*
################################################################################
#                                                                              #
# Put config text with variables enclosed in the following <pre></pre> tags.   #
# Variables enclosed in double curly braces.  Example:                         #
#  {{ variableName }}                                                          #
#                                                                              #
################################################################################
*/
let template = `config
    authority
        name               {{ model.authorityName }}
        conductor-address  {{ model.conductorAddr1 }}

        router       {{ model.routerName }}
            name                  {{ model.routerName }}
            location              "{{ model.siteAddress }}"
            location-coordinates  {{ model.siteCoordinates }}
            inter-node-security   encrypt-hmac-disabled

            system
                ntp

                    server  {{ model.ntp1 }}
                        ip-address  {{ model.ntp1 }}
                    exit

                    server  {{ model.ntp2 }}
                        ip-address  {{ model.ntp2 }}
                    exit
                exit
            exit

            node                        {{ model.node1Name }}
                name                    {{ model.node1Name }}
                role                    combo

                device-interface          WAN1
                    name                  WAN1
                    type                  ethernet
                    pci-address           {{ model.wanNode1PciAddr1 }}
                    shared-phys-address   {{ model.wanSharedMAC1 }}

                    network-interface     WAN1-vlan{{ model.wanVlan1 }}
                        name                 WAN1-vlan{{ model.wanVlan1 }}
                        global-id            1
                        type                 external
                        vlan                 {{ model.wanVlan1 }}

                        neighborhood         WAN1
                            name                WAN1
                            topology            {{ model.wanTopology1 }}
                            vector              {{ model.wanVector1 }}
                        exit
                        inter-router-security   peer-sec
                        source-nat           true

                        address              {{ model.wanAddr1 }}
                            ip-address     {{ model.wanAddr1 }}
                            prefix-length  {{ model.wanPrefix1 }}
                            gateway        {{ model.wanGw1 }}
                        exit
                    exit
                 exit

                device-interface          WAN2
                    name                  WAN2
                    type                  ethernet
                    pci-address           {{ model.wanNode1PciAddr2 }}
                    shared-phys-address   {{ model.wanSharedMAC2 }}

                    network-interface     WAN2-vlan{{ model.wanVlan2 }}
                        name                 WAN2-vlan{{ model.wanVlan2 }}
                        global-id            2
                        type                 external
                        vlan                 {{ model.wanVlan2 }}

                        neighborhood         WAN2
                            name                WAN2
                            topology            {{ model.wanTopology2 }}
                            vector              {{ model.wanVector2 }}
                        exit
                        inter-router-security   peer-sec
                        source-nat           true

                        address              {{ model.wanAddr2 }}
                            ip-address     {{ model.wanAddr2 }}
                            prefix-length  {{ model.wanPrefix2 }}
                            gateway        {{ model.wanGw2 }}
                        exit
                    exit
                 exit

                 device-interface         LAN
                    name                  LAN
                    type                  ethernet
                    pci-address           {{ model.lanNode1PciAddr }}
                    shared-phys-address   {{ model.lanSharedMAC }}

                    network-interface     LAN-vlan{{ model.lanVlan }}
                        name                 LAN-vlan{{ model.lanVlan }}
                        global-id            3
                        type                 external
                        vlan                 {{ model.lanVlan }}
                        tenant               {{ model.lanTenant }}

                        address              {{ model.lanAddr }}
                            ip-address     {{ model.lanAddr }}
                            prefix-length  {{ model.lanPrefix }}
                        exit
                    exit
                exit

                device-interface            ha-fabric
                    name               ha-fabric
                    description        "HA fabric/dogleg link"
                    type               ethernet
                    pci-address        {{ model.fabricNode1PciAddr }}

                    network-interface  ha-fabric
                        name               ha-fabric
                        type               fabric

                        address            169.254.252.1
                            ip-address     169.254.252.1
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface            ha-sync
                    name               ha-sync
                    description        "HA state synchronization link"
                    type               ethernet
                    pci-address        {{ model.syncNode1PciAddr }}
                    forwarding         false

                    network-interface  ha-sync
                        name               ha-sync
                        type               fabric

                        address            169.254.253.1
                            ip-address     169.254.253.1
                            prefix-length  30
                        exit

                        ifcfg-option     ZONE
                            name            ZONE
                            value           trusted
                        exit
                    exit
                exit

                device-interface         mgmt
                    name               mgmt
                    description        "Out of band node management"
                    type               ethernet

                    network-interface    mgmt
                        name                 mgmt
                        default-route        true
                        pci-address        {{ model.mgmtNode1PciAddr }}
                        forwarding         false

                        address              {{ model.node1mgmtAddress }}
                            ip-address     {{ model.node1mgmtAddress }}
                            prefix-length  {{ model.node1mgmtPrefix }}
                            gateway        {{ model.node1mgmtGw }}
                        exit

                        ifcfg-option     DNS1
                            name            DNS1
                            value           {{ model.DNS1 }}
                        exit

                        ifcfg-option     DNS2
                            name            DNS2
                            value           {{ model.DNS2 }}
                        exit
                    exit
                exit
            exit

            node                        {{ model.node2Name }}
                name                    {{ model.node2Name }}
                role                    combo

                device-interface          WAN1
                    name                  WAN1
                    type                  ethernet
                    pci-address           {{ model.wanNode2PciAddr1 }}
                    shared-phys-address   {{ model.wanSharedMAC1 }}

                    network-interface     WAN1-vlan{{ model.wanVlan1 }}
                        name                 WAN1-vlan{{ model.wanVlan1 }}
                        global-id            1
                        type                 external
                        vlan                 {{ model.wanVlan1 }}

                        neighborhood         WAN1
                            name                WAN1
                            topology            {{ model.wanTopology1 }}
                            vector              {{ model.wanVector1 }}
                        exit
                        inter-router-security   peer-sec
                        source-nat           true

                        address              {{ model.wanAddr1 }}
                            ip-address     {{ model.wanAddr1 }}
                            prefix-length  {{ model.wanPrefix1 }}
                            gateway        {{ model.wanGw1 }}
                        exit
                    exit
                 exit

                device-interface          WAN2
                    name                  WAN2
                    type                  ethernet
                    pci-address           {{ model.wanNode2PciAddr2 }}
                    shared-phys-address   {{ model.wanSharedMAC2 }}

                    network-interface     WAN2-vlan{{ model.wanVlan2 }}
                        name                 WAN2-vlan{{ model.wanVlan2 }}
                        global-id            2
                        type                 external
                        vlan                 {{ model.wanVlan2 }}

                        neighborhood         WAN2
                            name                WAN2
                            topology            {{ model.wanTopology2 }}
                            vector              {{ model.wanVector2 }}
                        exit
                        inter-router-security   peer-sec
                        source-nat           true

                        address              {{ model.wanAddr2 }}
                            ip-address     {{ model.wanAddr2 }}
                            prefix-length  {{ model.wanPrefix2 }}
                            gateway        {{ model.wanGw2 }}
                        exit
                    exit
                 exit

                 device-interface         LAN
                    name                  LAN
                    type                  ethernet
                    pci-address           {{ model.lanNode2PciAddr }}
                    shared-phys-address   {{ model.lanSharedMAC }}

                    network-interface     LAN-vlan{{ model.lanVlan }}
                        name                 LAN-vlan{{ model.lanVlan }}
                        global-id            3
                        type                 external
                        vlan                 {{ model.lanVlan }}
                        tenant               {{ model.lanTenant }}

                        address              {{ model.lanAddr }}
                            ip-address     {{ model.lanAddr }}
                            prefix-length  {{ model.lanPrefix }}
                        exit
                    exit
                exit

                device-interface            ha-fabric
                    name               ha-fabric
                    description        "HA fabric/dogleg link"
                    type               ethernet
                    pci-address        {{ model.fabricNode2PciAddr }}

                    network-interface  ha-fabric
                        name               ha-fabric
                        type               fabric

                        address            169.254.252.2
                            ip-address     169.254.252.2
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface            ha-sync
                    name               ha-sync
                    description        "HA state synchronization link"
                    type               ethernet
                    pci-address        {{ model.syncNode2PciAddr }}
                    forwarding         false

                    network-interface  ha-sync
                        name               ha-sync
                        type               fabric

                        address            169.254.253.2
                            ip-address     169.254.253.2
                            prefix-length  30
                        exit

                        ifcfg-option     ZONE
                            name            ZONE
                            value           trusted
                        exit
                    exit
                exit

                device-interface         mgmt
                    name               mgmt
                    description        "Out of band node management"
                    type               ethernet

                    network-interface    mgmt
                        name                 mgmt
                        default-route        true
                        pci-address        {{ model.mgmtNode2PciAddr }}
                        forwarding         false

                        address              {{ model.node2mgmtAddress }}
                            ip-address     {{ model.node2mgmtAddress }}
                            prefix-length  {{ model.node2mgmtPrefix }}
                            gateway        {{ model.node2mgmtGw }}
                        exit

                        ifcfg-option     DNS1
                            name            DNS1
                            value           {{ model.DNS1 }}
                        exit

                        ifcfg-option     DNS2
                            name            DNS2
                            value           {{ model.DNS2 }}
                        exit
                    exit
                exit
            exit

            service-route               static-internet-route
                name          static-internet-route
                service-name  internet

                next-hop      {{ model.node1Name }} WAN1-vlan{{ model.wanVlan1 }}
                    node-name  {{ model.node1Name }}
                    interface  WAN1-vlan{{ model.wanVlan1 }}
                    gateway-ip  {{ model.wanGw1 }}
                exit

                next-hop      {{ model.node1Name }} WAN2-vlan{{ model.wanVlan2 }}
                    node-name  {{ model.node1Name }}
                    interface  WAN2-vlan{{ model.wanVlan2 }}
                    gateway-ip  {{ model.wanGw2 }}
                exit

                next-hop      {{ model.node2Name }} WAN1-vlan{{ model.wanVlan1 }}
                    node-name  {{ model.node2Name }}
                    interface  WAN1-vlan{{ model.wanVlan1 }}
                    gateway-ip  {{ model.wanGw1 }}
                exit

                next-hop      {{ model.node2Name }} WAN2-vlan{{ model.wanVlan2 }}
                    node-name  {{ model.node2Name }}
                    interface  WAN2-vlan{{ model.wanVlan2 }}
                    gateway-ip  {{ model.wanGw2 }}
                exit
            exit
        exit

        security  peer-sec
            name                 peer-sec
            description          "Router peer security policy"
            encryption-cipher    aes-cbc-256
        exit

        security  encrypt-hmac-disabled
            name                 encrypt-hmac-disabled
            description          "Encryption and message authentication disabled"
            encrypt              false
            hmac-mode            disabled
            adaptive-encryption  false
        exit

        tenant  {{ model.lanTenant }}
            name      {{ model.lanTenant }}
        exit

        service  internet
            name                  internet
            scope                 private
            security              encrypt-hmac-disabled
            address               0.0.0.0/0

            access-policy         {{ model.lanTenant }}
                source               {{ model.lanTenant }}
            exit

            service-policy        {{ model.wanVector1 }}-{{ model.wanVector2 }}-no-failover
            share-service-routes  false
        exit

        service-policy  {{ model.wanVector1 }}-{{ model.wanVector2 }}-no-failover
            name                  {{ model.wanVector1 }}-{{ model.wanVector2 }}-no-failover

            vector                {{ model.wanVector1 }}
                name                 {{ model.wanVector1 }}
                priority             ordered
            exit

            vector                {{ model.wanVector2 }}
                name                 {{ model.wanVector2 }}
                priority             ordered
            exit
        exit
    exit
exit`

document.getElementById('configText').innerHTML = template

var model = {
/*
################################################################################
#                                                                              #
# Define each variable in the 'data' object, within the following script.      #
#                                                                              #
################################################################################
*/
  authorityName: '',
  conductorAddr1: '',
  routerName: '',
  siteAddress: '',
  siteCoordinates: '',
  ntp1: '',
  ntp2: '',
  node1Name: '',
  node2Name: '',
  wanVlan1: '',
  wanNode1PciAddr1: '',
  wanNode2PciAddr1: '',
  wanSharedMAC1: '',
  wanTopology1: '',
  wanVector1: '',
  wanAddr1: '',
  wanPrefix1: '',
  wanGw1: '',
  wanVlan2: '',
  wanNode1PciAddr2: '',
  wanNode2PciAddr2: '',
  wanSharedMAC2: '',
  wanTopology2: '',
  wanVector2: '',
  wanAddr2: '',
  wanPrefix2: '',
  wanGw2: '',
  lanVlan: '',
  lanNode1PciAddr: '',
  lanNode2PciAddr: '',
  lanSharedMAC: '',
  lanAddr: '',
  lanPrefix: '',
  lanTenant: '',
  fabricNode1PciAddr: '',
  fabricNode2PciAddr: '',
  syncNode1PciAddr: '',
  syncNode2PciAddr: '',
  mgmtNode1PciAddr: '',
  mgmtNode2PciAddr: '',
  node1mgmtAddress: '',
  node1mgmtPrefix: '',
  node1mgmtGw: '',
  node2mgmtAddress: '',
  node2mgmtPrefix: '',
  node2mgmtGw: '',
  DNS1: '',
  DNS2: '',
}
