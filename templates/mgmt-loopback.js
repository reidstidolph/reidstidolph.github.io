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
        service            management-{{ model.routerName }}-{{ model.nodeName }}
            name           management-{{ model.routerName }}-{{ model.nodeName }}
            service-group  router-management
            description    "{{ model.routerName }} {{ model.nodeName }} router management"
            security       {{ model.securityPolicy }}
            address        {{ model.hostAddr }}

            access-policy  {{ model.tenantName }}
                source     {{ model.tenantName }}
                permission allow
            exit
        exit

        router                    {{ model.routerName }}
            node                  {{ model.nodeName }}
                device-interface  host-link
                    name          host-link
                    description   "Link to host kernel from forwarding plane."
                    type          host

                    network-interface  host
                        name           host
                        description    "Forwarding plane gateway for host management loopback interface."
                        type           external
                        default-route  true
                        tenant         {{ model.tenantName }}

                        management-vector
                            priority  100
                        exit

                        address            {{ gwAddr }}
                            ip-address     {{ gwAddr }}
                            prefix-length  31
                            gateway        {{ model.hostAddr }}
                        exit

                        ifcfg-option       ZONE
                            name           ZONE
                            value          trusted
                        exit
                    exit
                exit
            exit

            service-route     management-{{ model.routerName }}-{{ model.nodeName }}
                name          management-{{ model.routerName }}-{{ model.nodeName }}
                service-name  management-{{ model.routerName }}-{{ model.nodeName }}

                next-hop        {{ model.nodeName }} host
                    node-name   {{ model.nodeName }}
                    interface   host
                    gateway-ip  {{ model.hostAddr }}
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
  hostAddr: '',
  tenantName: '_internal_',
  securityPolicy: 'internal'
}
