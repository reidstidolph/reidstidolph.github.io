/*
################################################################################
#                                                                              #
# Put config text with variables enclosed in the following <pre></pre> tags.   #
# Variables enclosed in double curly braces. Example:                          #
#  {{ variableName }}                                                          #
#                                                                              #
################################################################################
*/
let template = `config authority tenant {{ model.tenantName }} name {{ model.tenantName }}

config authority service {{ model.serviceName }}-1 name {{ model.serviceName }}-1

config authority service {{ model.serviceName }}-1 applies-to router type router
config authority service {{ model.serviceName }}-1 applies-to router router-name {{ model.router1Name }}
config authority service {{ model.serviceName }}-1 applies-to router router-name {{ model.router2Name }}
config authority service {{ model.serviceName }}-1 security {{ model.security }}
config authority service {{ model.serviceName }}-1 address 10.128.128.1

config authority service {{ model.serviceName }}-1 access-policy {{ model.tenantName }} source {{ model.tenantName }}
config authority service {{ model.serviceName }}-1 access-policy {{ model.tenantName }} permission  allow

config authority service {{ model.serviceName }}-2 name {{ model.serviceName }}-2

config authority service {{ model.serviceName }}-2 applies-to router type router
config authority service {{ model.serviceName }}-2 applies-to router router-name {{ model.router1Name }}
config authority service {{ model.serviceName }}-2 applies-to router router-name {{ model.router2Name }}
config authority service {{ model.serviceName }}-2 security {{ model.security }}
config authority service {{ model.serviceName }}-2 address 10.128.128.2

config authority service {{ model.serviceName }}-2 access-policy {{ model.tenantName }} source {{ model.tenantName }}
config authority service {{ model.serviceName }}-2 access-policy {{ model.tenantName }} permission  allow

config authority router {{ model.router1Name }} node {{ model.node1Name }} device-interface test-kni name test-kni
config authority router {{ model.router1Name }} node {{ model.node1Name }} device-interface test-kni type host

config authority router {{ model.router1Name }} node {{ model.node1Name }} device-interface test-kni network-interface test-kni name test-kni
config authority router {{ model.router1Name }} node {{ model.node1Name }} device-interface test-kni network-interface test-kni tenant {{ model.tenantName }}
config authority router {{ model.router1Name }} node {{ model.node1Name }} device-interface test-kni network-interface test-kni source-nat true

config authority router {{ model.router1Name }} node {{ model.node1Name }} device-interface test-kni network-interface test-kni address 10.128.128.2 ip-address 10.128.128.2
config authority router {{ model.router1Name }} node {{ model.node1Name }} device-interface test-kni network-interface test-kni address 10.128.128.2 prefix-length 30
config authority router {{ model.router1Name }} node {{ model.node1Name }} device-interface test-kni network-interface test-kni address 10.128.128.2 gateway 10.128.128.1

config authority router {{ model.router1Name }} service-route test-service-1 name test-service-1
config authority router {{ model.router1Name }} service-route test-service-1 service-name test-service-1

config authority router {{ model.router1Name }} service-route test-service-1 next-hop {{ model.node1Name }} test-kni node-name   {{ model.node1Name }}
config authority router {{ model.router1Name }} service-route test-service-1 next-hop {{ model.node1Name }} test-kni interface   test-kni
config authority router {{ model.router1Name }} service-route test-service-1 next-hop {{ model.node1Name }} test-kni gateway-ip  10.128.128.1

config authority router {{ model.router2Name }} node {{ model.node2Name }} device-interface test-kni name test-kni
config authority router {{ model.router2Name }} node {{ model.node2Name }} device-interface test-kni type host

config authority router {{ model.router2Name }} node {{ model.node2Name }} device-interface test-kni network-interface test-kni name test-kni
config authority router {{ model.router2Name }} node {{ model.node2Name }} device-interface test-kni network-interface test-kni tenant {{ model.tenantName }}
config authority router {{ model.router2Name }} node {{ model.node2Name }} device-interface test-kni network-interface test-kni source-nat true

config authority router {{ model.router2Name }} node {{ model.node2Name }} device-interface test-kni network-interface test-kni address 10.128.128.1 ip-address 10.128.128.1
config authority router {{ model.router2Name }} node {{ model.node2Name }} device-interface test-kni network-interface test-kni address 10.128.128.1 prefix-length 30
config authority router {{ model.router2Name }} node {{ model.node2Name }} device-interface test-kni network-interface test-kni address 10.128.128.1 gateway 10.128.128.2

config authority router {{ model.router2Name }} service-route test-service-2 name test-service-2
config authority router {{ model.router2Name }} service-route test-service-2 service-name test-service-2

config authority router {{ model.router2Name }} service-route test-service-2 next-hop {{ model.node2Name }} test-kni node-name   {{ model.node2Name }}
config authority router {{ model.router2Name }} service-route test-service-2 next-hop {{ model.node2Name }} test-kni interface   test-kni
config authority router {{ model.router2Name }} service-route test-service-2 next-hop {{ model.node2Name }} test-kni gateway-ip  10.128.128.2
`

document.getElementById('configText').innerHTML = template

var model = {
/*
################################################################################
#                                                                              #
# Define each variable in the 'data' object, within the following script.      #
#                                                                              #
################################################################################
*/
  router1Name: '',
  router2Name: '',
  node1Name: '',
  node2Name: '',
  serviceName: 'test-service',
  security: 'internal',
  tenantName: 'test-tenant'
}
