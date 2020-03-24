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
            router-group          {{ model.routerGroup }}
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

                services

                    snmp-server
                        enabled                true
                        port                   162

                        notification-receiver  {{ model.trapServer1 }} 162 trap
                            ip-address  {{ model.trapServer1 }}
                            port        162
                            type        trap
                        exit
                    exit
                exit
            exit

            node                        {{ model.node1Name }}
                name                    {{ model.node1Name }}
                role                    combo

                device-interface          AVPN1-enp1s0
                    name                  AVPN1-enp1s0
                    type                  ethernet
                    pci-address           {{ model.wanNode1PciAddr1 }}

                    network-interface     AVPN1-vlan{{ model.wanVlan1 }}
                        name                 AVPN1-vlan{{ model.wanVlan1 }}
                        global-id            1
                        type                 external
                        vlan                 {{ model.wanVlan1 }}
                        conductor            true

                        neighborhood         {{ model.wanHood1 }}
                            name                {{ model.wanHood1 }}
                            topology            {{ model.wanTopology1 }}
                            vector              {{ model.wanVector1 }}
                        exit
                        inter-router-security   internal
                        source-nat           true

                        address              {{ model.wanAddr1 }}
                            ip-address     {{ model.wanAddr1 }}
                            prefix-length  {{ model.wanPrefix1 }}
                            gateway        {{ model.wanGw1 }}
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

                device-interface         loopback
                    name                 loopback
                    type                 host

                    network-interface    loopback-mgmt
                        name                 loopback-mgmt
                        default-route        true
                        tenant               _internal_

                        management-vector
                            name           loopback
                            priority       100
                        exit

                        address            100.111.1.1
                            ip-address        100.111.1.1
                            gateway           {{ model.node1OSNLoopback }}
                            prefix-length     31
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

                device-interface          ADI-enp1s0
                    name                  ADI-enp1s0
                    type                  ethernet
                    pci-address           {{ model.wanNode2PciAddr2 }}

                    network-interface     WAN2-vlan{{ model.wanVlan2 }}
                        name                 WAN2-vlan{{ model.wanVlan2 }}
                        global-id            2
                        type                 external
                        vlan                 {{ model.wanVlan2 }}
                        conductor            true

                        neighborhood         {{ model.wanHood2 }}
                            name                {{ model.wanHood2 }}
                            topology            {{ model.wanTopology2 }}
                            vector              {{ model.wanVector2 }}
                        exit
                        inter-router-security   internal
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
                    exit
                exit

                device-interface         loopback
                    name                 loopback
                    type                 host

                    network-interface    loopback-mgmt
                        name                 loopback-mgmt
                        default-route        true
                        tenant               _internal_

                        management-vector
                            name           loopback
                            priority       100
                        exit

                        address            100.111.1.1
                            ip-address        100.111.1.1
                            gateway           {{ model.node2OSNLoopback }}
                            prefix-length     20
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

            access-policy         {{ model.lanTenant }}
                source               _internal_
            exit

            service-policy        {{ model.wanVector1 }}-{{ model.wanVector2 }}-no-failover
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
  routerGroup: '',
  ntp1: '',
  ntp2: '',
  trapServer1: '',
  node1Name: '',
  node2Name: '',
  wanVlan1: '',
  wanNode1PciAddr1: '',
  wanHood1: '',
  wanTopology1: '',
  wanVector1: '',
  wanAddr1: '',
  wanPrefix1: '',
  wanGw1: '',
  wanVlan2: '',
  wanNode2PciAddr2: '',
  wanHood2: '',
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
  node1OSNLoopback: '',
  node2OSNLoopback: '',
  DNS1: '',
  DNS2: '',
}
