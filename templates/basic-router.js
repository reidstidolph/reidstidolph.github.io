/*
################################################################################
#                                                                              #
# Put config text with variables enclosed in the following <pre></pre> tags.   #
# Variables enclosed in double curly braces. Example:                          #
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

            node                        {{ model.nodeName }}
                name                    {{ model.nodeName }}
                role                    combo

                device-interface          WAN
                    name                  WAN
                    type                  ethernet
                    pci-address           {{ model.wanPciAddr }}

                    network-interface     WAN
                        name                 WAN
                        type                 external
                        source-nat           true

                        address              {{ model.wanAddr }}
                            ip-address     {{ model.wanAddr }}
                            prefix-length  {{ model.wanPrefix }}
                            gateway        {{ model.wanGw }}
                        exit
                    exit
                 exit

                 device-interface         LAN
                    name                  LAN
                    type                  ethernet
                    pci-address           {{ model.lanPciAddr }}

                    network-interface     LAN
                        name                 LAN
                        type                 external
                        tenant               {{ model.lanTenant }}

                        address              {{ model.lanAddr }}
                            ip-address     {{ model.lanAddr }}
                            prefix-length  {{ model.lanPrefix }}
                        exit
                    exit
                exit
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
  nodeName: '',
  siteAddress: '',
  siteCoordinates: '',
  wanPciAddr: '',
  wanAddr: '',
  wanPrefix: '',
  wanGw: '',
  lanPciAddr: '',
  lanAddr: '',
  lanPrefix: '',
  lanTenant: '',
}
