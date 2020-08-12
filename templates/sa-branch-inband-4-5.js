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

            dns-config            static
               mode     static
               address  {{ model.DNS1 }}
               address  {{ model.DNS2 }}
            exit

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

            node                        {{ model.nodeName }}
                name                    {{ model.nodeName }}
                role                    combo

                device-interface          WAN1
                    name                  WAN1
                    type                  ethernet
                    pci-address           {{ model.wanPciAddr1 }}

                    network-interface     WAN1-vlan{{ model.wanVlan1 }}
                        name                 WAN1-vlan{{ model.wanVlan1 }}
                        type                 external
                        vlan                 {{ model.wanVlan1 }}
                        conductor            true

                        neighborhood         WAN1
                            name                WAN1
                            topology            spoke
                            vector              {{ model.wanVector1 }}
                        exit
                        inter-router-security   peer-sec
                        source-nat           true
                        management           true

                        management-vector
                            name      wan1-mgmt
                            priority  10
                        exit

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
                    pci-address           {{ model.wanPciAddr2 }}

                    network-interface     WAN2-vlan{{ model.wanVlan2 }}
                        name                 WAN2-vlan{{ model.wanVlan2 }}
                        type                 external
                        vlan                 {{ model.wanVlan2 }}
                        conductor            true
                        management           true

                        neighborhood         WAN2
                            name                WAN2
                            topology            spoke
                            vector              {{ model.wanVector2 }}
                        exit
                        inter-router-security   peer-sec
                        source-nat           true
                        management           true

                        management-vector
                            name      wan2-mgmt
                            priority  20
                        exit

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
                    pci-address           {{ model.lanPciAddr }}

                    network-interface     LAN-vlan{{ model.lanVlan }}
                        name                 LAN-vlan{{ model.lanVlan }}
                        type                 external
                        vlan                 {{ model.lanVlan }}
                        tenant               {{ model.lanTenant }}

                        address              {{ model.lanAddr }}
                            ip-address     {{ model.lanAddr }}
                            prefix-length  {{ model.lanPrefix }}
                        exit
                    exit
                exit
            exit

            service-route               static-internet-route
                name          static-internet-route
                service-name  internet

                next-hop      {{ model.nodeName }} WAN1-vlan{{ model.wanVlan1 }}
                    node-name  {{ model.nodeName }}
                    interface  WAN1-vlan{{ model.wanVlan1 }}
                    gateway-ip  {{ model.wanGw1 }}
                exit

                next-hop      {{ model.nodeName }} WAN2-vlan{{ model.wanVlan2 }}
                    node-name  {{ model.nodeName }}
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

            access-policy         {{ model.lanTenant }}
                source               _internal_
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
  nodeName: '',
  wanVlan1: '',
  wanPciAddr1: '',
  wanVector1: '',
  wanAddr1: '',
  wanPrefix1: '',
  wanGw1: '',
  wanVlan2: '',
  wanPciAddr2: '',
  wanVector2: '',
  wanAddr2: '',
  wanPrefix2: '',
  wanGw2: '',
  lanVlan: '',
  lanPciAddr: '',
  lanAddr: '',
  lanPrefix: '',
  lanTenant: '',
  loAddress: '',
  loGateway: '',
  DNS1: '',
  DNS2: '',
}
