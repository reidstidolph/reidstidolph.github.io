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

            node                        {{ model.node1Name }}

                device-interface          AVPN1-enp1s0

                    network-interface     AVPN1-vlan{{ model.wanVlan1 }}

                        neighborhood         {{ model.hubRouterName }}-MPLS
                            name                {{ model.hubRouterName }}-MPLS
                            topology            spoke
                            vector              MPLS-01
                        exit
                    exit
                exit
            exit

            node                        {{ model.node2Name }}

                device-interface          ADI-enp1s0

                    network-interface     ADI-vlan{{ model.wanVlan2 }}

                        neighborhood         {{ model.hubRouterName }}-Internet-Broadband
                            name                {{ model.hubRouterName }}-Internet-Broadband
                            topology            spoke
                            vector              Broadband-01
                        exit
                    exit
                exit
            exit
        exit

        service  {{ model.hubRouterName }}-citrix-hub
            name           {{ model.hubRouterName }}-citrix-hub

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
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
  hubRouterName: '',
  node1Name: '',
  node2Name: '',
  wanVlan1: '',
  wanVlan2: '',
}
