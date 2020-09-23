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
        conductor-address  {{ model.conductorAddr1 }}

        router       L3NID-{{ model.routerName }}
            name                  L3NID-{{ model.routerName }}
            location              "{{ model.siteAddress }}"
            location-coordinates  {{ model.siteCoordinates }}
            inter-node-security   encrypt-hmac-disabled

            dns-config            static
               mode     static
               address  {{ model.DNS1 }}
               address  {{ model.DNS2 }}
            exit

            entitlement
                id             128T-FSE-L3NID-{{ model.licenseBW }}M-{{ model.licenseExpires }}
                max-bandwidth  {{ model.licenseBitsBW }}
            exit

            application-identification
                mode    tls
                mode    module
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

                device-interface          provider
                    name                  provider
                    type                  ethernet
                    pci-address           {{ model.providerPciAddr1 }}

                    network-interface     provider
                        name                 provider
                        type                 external
                        conductor            true
                        default-route        true

                        neighborhood         l3nid-management
                            name                l3nid-management
                            topology            spoke
                            vector              choice1
                        exit
                        inter-router-security   peer-sec
                        management           true

                        management-vector
                            name      l3nid-management
                            priority  10
                        exit

                        address              {{ model.customerAddr1 }}
                            ip-address     {{ model.customerAddr1 }}
                            prefix-length  {{ model.providerPrefix1 }}
                            gateway        {{ model.providerGw1 }}
                        exit
                    exit
                 exit

                 device-interface         customer
                    name                  customer
                    type                  ethernet
                    pci-address           {{ model.customerPciAddr1 }}

                    network-interface     customer
                        name                 customer
                        type                 external
                        tenant               customer

                        address              {{ model.providerGw1 }}
                            ip-address     {{ model.providerGw1 }}
                            prefix-length  {{ model.providerPrefix1 }}
                        exit
                    exit
                exit

                device-interface         loopback
                    name                 loopback
                    type                 host

                    network-interface    loopback-mgmt
                        name                 loopback-mgmt
                        default-route        true
                        tenant               {{ model.datacenterTenant }}

                        address            {{ model.loopbackGw }}
                            ip-address        {{ model.loopbackGw }}
                            gateway           {{ model.loopbackIP }}
                            prefix-length     {{ model.loopbackPrefix }}
                        exit

                        ifcfg-option     ZONE
                            name            ZONE
                            value           trusted
                        exit
                    exit
                exit
            exit

            service-route                       static-inbound-route
                name          static-inbound-route
                service-name  l3nid-inbound

                next-hop      {{ model.nodeName }} customer
                    node-name   {{ model.nodeName }}
                    interface   customer
                    gateway-ip  {{ model.customerAddr1 }}
                exit
            exit

            service-route                       static-outbound-route
                name          static-outbound-route
                service-name  l3nid-outbound

                next-hop      {{ model.nodeName }} provider
                    node-name   128t-customer-premises-node1
                    interface   provider
                    gateway-ip  {{ model.providerGw1 }}
                exit
            exit

            service-route     static-{{ model.routerName }}-mgmt
                name          static-{{ model.routerName }}-mgmt
                service-name  {{ model.routerName }}-mgmt

                next-hop      {{ model.node1Name }} loopback-mgmt
                        node-name  {{ model.node1Name }}
                        interface  loopback-mgmt
                exit
            exit
        exit

        security  peer-sec
            name                 peer-sec
            description          "Router peer security policy"
            encryption-cipher    aes-cbc-256
        exit

        security  service-sec
            name                 service-sec
            description          "Service security policy"
            encryption-cipher    aes-cbc-256
        exit

        security  encrypt-hmac-disabled
            name                 encrypt-hmac-disabled
            description          "Encryption and message authentication disabled"
            encrypt              false
            hmac-mode            disabled
            adaptive-encryption  false
        exit

        tenant  customer
            name      customer
        exit

        service            l3nid-inbound
            name                  l3nid-inbound
            security              encrypt-hmac-disabled
            address               0.0.0.0/0

            access-policy         provider
                source            provider
            exit
            share-service-routes  false
        exit

        service            l3nid-outbound
            name                  l3nid-outbound
            security              encrypt-hmac-disabled
            address               0.0.0.0/0

            access-policy         customer
                source            customer
            exit
            share-service-routes  false
        exit

        service            M365.internet
            name              M365.internet
            application-name  O365-Common
            application-name  O365-Exchange
            application-name  O365-SharePoint
            application-name  O365-Skype
        exit

        service  {{ model.routerName }}-mgmt
            name           {{ model.routerName }}-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  datacenter
            exit
            security       service-sec
            address        {{ model.loopbackIP }}

            access-policy  {{ model.datacenterTenant }}
                source      {{ model.datacenterTenant }}
            exit
        exit

        service  monitoring-agent-server
            name           monitoring-agent-server
            security       service-sec
            address        {{ model.monAgentIP }}

            access-policy  _internal_
                source      _internal_
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
  conductorAddr1: '',
  routerName: '',
  siteAddress: '',
  siteCoordinates: '',
  ntp1: '',
  ntp2: '',
  DNS1: '',
  DNS2: '',
  monAgentIP: '',
  licenseBW: '',
  licenseBitsBW: '',
  licenseExpires: '',
  nodeName: '',
  providerPciAddr1: '',
  customerPciAddr1: '',
  customerAddr1: '',
  providerPrefix1: '',
  providerGw1: '',
  datacenterTenant: '',
  loopbackGw: '',
  loopbackIP: '',
  loopbackPrefix: '',
}
