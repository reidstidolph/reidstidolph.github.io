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
BOOTPROTO=none
BROWSER_ONLY=no
DEFROUTE=yes
DEVICE={{ model.wanInt1}}
DNS1={{ model.DNS1 }}
DNS2={{ model.DNS2 }}
GATEWAY={{ model.wanGw1 }}
IPADDR={{ model.wanAddr1 }}
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_ADDR_GEN_MODE=stable-privacy
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
METRIC=100
MTU=1500
NAME=enp0s20f3
NM_CONTROLLED=no
ONBOOT=yes
PREFIX={{ model.wanPrefix1 }}
PROXY_METHOD=none
TYPE=Ethernet
USERCTL=no
ZONE=drop`

document.getElementById('configText').innerHTML = template

var model = {
/*
################################################################################
#                                                                              #
# Define each variable in the 'data' object, within the following script.      #
#                                                                              #
################################################################################
*/
  wanInt1: '',
  wanAddr1: '',
  wanPrefix1: '',
  wanGw1: '',
  DNS1: '',
  DNS2: '',
}
