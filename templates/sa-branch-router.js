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
        router       {{ model.routerName }}
            name                  {{ model.routerName }}
            location              "{{ model.siteAddress }}"
            location-coordinates  {{ model.siteCoordinates }}

            system
                ntp

                    server  {{ mode1.ntp1 }}
                        ip-address  {{ mode1.ntp1 }}
                    exit

                    server  {{ mode1.ntp2 }}
                        ip-address  {{ mode1.ntp2 }}
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

                        neighborhood            WAN1
                            name    WAN1
                            vector  choice1
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
                    pci-address           {{ model.wanPciAddr2 }}

                    network-interface     WAN2-vlan{{ model.wanVlan2 }}
                        name                 WAN2-vlan{{ model.wanVlan2 }}
                        type                 external
                        vlan                 {{ model.wanVlan2 }}
                        conductor            true

                        neighborhood            WAN2
                            name    WAN2
                            vector  choice2
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

            service-route               internet-route
                name          internet-route
                service-name  internet

                next-hop      {{ model.nodeName }} WAN1-vlan{{ model.wanVlan1 }}
                    node-name  {{ model.nodeName }}
                    interface  WAN1-vlan{{ model.wanVlan1 }}
                    gateway-ip  {{ model.wanGw1 }}

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
            hmac                 false
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
                source  {{ model.lanTenant }}
            exit

            service-policy        choice1-choice2
            share-service-routes  false
        exit

        service-policy  choice1-choice2
            name                         choice1-choice2

            vector                       choice1
                name      choice1
                priority  ordered
            exit

            vector                       choice2
                name      choice2
                priority  ordered
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
  routerName: '',
  siteAddress: '',
  siteCoordinates: '',
  ntp1: '',
  ntp2: '',
  nodeName: '',
  wanVlan1: '',
  wanPciAddr1: '',
  wanAddr1: '',
  wanPrefix1: '',
  wanGw1: '',
  wanVlan2: '',
  wanPciAddr2: '',
  wanAddr2: '',
  wanPrefix2: '',
  wanGw2: '',
  lanVlan: '',
  lanPciAddr: '',
  lanAddr: '',
  lanPrefix: '',
  lanTenant: '',
}
