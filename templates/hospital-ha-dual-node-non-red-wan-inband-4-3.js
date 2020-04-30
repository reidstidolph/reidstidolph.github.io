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
            router-group          hospitals
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
                    pci-address           0000:01:00.0

                    network-interface     AVPN1-vlan0
                        name                 AVPN1-vlan0
                        type                 external
                        vlan                 {{ model.wanVlan1 }}

                        neighborhood         DC-MPLS-01
                            name                DC-MPLS-01
                            topology            spoke
                            vector              MPLS-01
                        exit

                        neighborhood         DC-MPLS-02
                            name               DC-MPLS-02
                            topology           spoke
                            vector             MPLS-02
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

                 device-interface         LAN-enp2s0
                    name                  LAN-enp2s0
                    type                  ethernet
                    pci-address           0000:02:00.0
                    shared-phys-address   {{ model.lanSharedMAC }}

                    network-interface     LAN-vlan2020
                        name                 LAN-vlan2020
                        global-id            3
                        type                 external
                        vlan                 2020
                        neighborhood         {{ model.routerName }}-lan1
                            name  {{ model.routerName }}-lan1
                        exit

                        neighborhood         {{ model.routerName }}-lan2
                            name  {{ model.routerName }}-lan2
                        exit
                        inter-router-security  peer-sec
                        rewrite-dscp           true

                        address              {{ model.lanAddr }}
                            ip-address     {{ model.lanAddr }}
                            prefix-length  {{ model.lanPrefix }}
                            gateway        {{ model.lanGw }}
                        exit
                    exit

                    network-interface     LAN-vlan2030
                        name                 LAN-vlan2030
                        global-id            4
                        type                 external
                        vlan                 2030
                        tenant               chs-guest

                        address                   192.168.0.1
                            ip-address     192.168.0.1
                            prefix-length  18

                            host-service   dhcp-server
                                service-type    dhcp-server
                                max-lease-time  7200

                                address-pool    192.168.0.10
                                    start-address  192.168.0.10
                                    end-address    192.168.63.254
                                    router         192.168.0.1
                                    domain-server  8.8.8.8
                                    domain-server  4.4.2.2
                                exit
                            exit
                        exit
                    exit
                exit

                device-interface            fabr-enp3s0
                    name               fabr-enp3s0
                    description        "HA fabric/dogleg link"
                    type               ethernet
                    pci-address        0000:03:00.0

                    network-interface  ha-fabric
                        name               ha-fabric
                        type               fabric

                        address            169.254.252.1
                            ip-address     169.254.252.1
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface            sync-enp4s0
                    name               sync-enp4s0
                    description        "HA state synchronization link"
                    type               ethernet
                    pci-address        0000:04:00.0
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

                device-interface       msbr-enp5s0
                    name               msbr-enp5s0
                    description        "Internal interface between OSN and MSBR"
                    type               ethernet
                    pci-address        0000:05:00.0

                    network-interface  msbr-mgmt
                        name               msbr-mgmt
                        type               external
                        vlan               128
                        tenant             ics-mgmt
                        source-nat         true

                        address            100.111.15.254
                            ip-address     100.111.15.254
                            prefix-length  20
                        exit
                    exit

                    network-interface     msbr-vlan{{ model.MSBRVoiceVlan }}
                        name                 LAN-vlan{{ model.MSBRVoiceVlan }}
                        type                 external
                        vlan                 {{ model.MSBRVoiceVlan }}
                        tenant               voice.chs-site

                        address              {{ model.MSBRVoiceAddr }}
                            ip-address     {{ model.MSBRVoiceAddr }}
                            prefix-length  {{ model.MSBRVoicePrefix }}
                        exit
                    exit
                exit

                device-interface         loopback
                    name                 loopback
                    type                 host

                    network-interface    loopback-mgmt
                        name                 loopback-mgmt
                        default-route        true
                        tenant               ics-mgmt

                        management-vector
                            name           loopback
                            priority       100
                        exit

                        address            100.111.0.1
                            ip-address        100.111.0.1
                            gateway           {{ model.node1OSNLoopback }}
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

            node                        {{ model.node2Name }}
                name                    {{ model.node2Name }}
                role                    combo

                device-interface          ADI-enp1s0
                    name                  ADI-enp1s0
                    type                  ethernet
                    pci-address           0000:01:00.0

                    network-interface     ADI-vlan0
                        name                 ADI-vlan0
                        type                 external
                        conductor            true

                        neighborhood         DC-Internet-Broadband-01
                            name                DC-Internet-Broadband-01
                            topology            spoke
                            vector              Broadband-01
                        exit

                        neighborhood         DC-Internet-Broadband-02
                            name                DC-Internet-Broadband-02
                            topology            spoke
                            vector              Broadband-02
                        exit

                        neighborhood         ICS-NOC-Broadband
                            name                ICS-NOC-Broadband
                            topology            spoke
                            vector              Broadband-01
                        exit

                        neighborhood         CRWD-Internet-Broadband
                            name                CRWD-Internet-Broadband
                            topology            hub
                            vector              Broadband-01
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

                 device-interface         LAN-enp2s0
                    name                  LAN-enp2s0
                    type                  ethernet
                    pci-address           0000:02:00.0
                    shared-phys-address   {{ model.lanSharedMAC }}

                    network-interface     LAN-vlan2020
                        name                 LAN-vlan2020
                        global-id            3
                        type                 external
                        vlan                 2020
                        neighborhood         {{ model.routerName }}-lan1
                            name  {{ model.routerName }}-lan1
                        exit

                        neighborhood         {{ model.routerName }}-lan2
                            name  {{ model.routerName }}-lan2
                        exit
                        inter-router-security  peer-sec
                        rewrite-dscp           true

                        address              {{ model.lanAddr }}
                            ip-address     {{ model.lanAddr }}
                            prefix-length  {{ model.lanPrefix }}
                            gateway        {{ model.lanGw }}
                        exit
                    exit

                    network-interface     LAN-vlan2030
                        name                 LAN-vlan2030
                        global-id            4
                        type                 external
                        vlan                 2030
                        tenant               chs-guest

                        address                   192.168.0.1
                            ip-address     192.168.0.1
                            prefix-length  18

                            host-service   dhcp-server
                                service-type    dhcp-server
                                max-lease-time  7200

                                address-pool    192.168.0.10
                                    start-address  192.168.0.10
                                    end-address    192.168.63.254
                                    router         192.168.0.1
                                    domain-server  8.8.8.8
                                    domain-server  4.4.2.2
                                exit
                            exit
                        exit
                    exit
                exit

                device-interface            fabr-enp3s0
                    name               fabr-enp3s0
                    description        "HA fabric/dogleg link"
                    type               ethernet
                    pci-address        0000:03:00.0

                    network-interface  ha-fabric
                        name               ha-fabric
                        type               fabric

                        address            169.254.252.2
                            ip-address     169.254.252.2
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface            sync-enp4s0
                    name               sync-enp4s0
                    description        "HA state synchronization link"
                    type               ethernet
                    pci-address        0000:04:00.0
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

                device-interface       msbr-enp5s0
                    name               msbr-enp5s0
                    description        "Internal interface between OSN and MSBR"
                    type               ethernet
                    pci-address        0000:05:00.0

                    network-interface  msbr-mgmt
                        name               msbr-mgmt
                        type               external
                        vlan               128
                        tenant             ics-mgmt
                        source-nat         true

                        address            100.111.15.254
                            ip-address     100.111.15.254
                            prefix-length  20
                        exit
                    exit

                    network-interface     msbr-vlan{{ model.MSBRVoiceVlan }}
                        name                 LAN-vlan{{ model.MSBRVoiceVlan }}
                        type                 external
                        vlan                 {{ model.MSBRVoiceVlan }}
                        tenant               voice.chs-site

                        address              {{ model.MSBRVoiceAddr }}
                            ip-address     {{ model.MSBRVoiceAddr }}
                            prefix-length  {{ model.MSBRVoicePrefix }}
                        exit
                    exit
                exit

                device-interface  LTE-ATT
                    name               LTE-ATT
                    type               lte
                    target-interface   wwp0s21f0u4i4

                    lte
                        apn-name  {{ model.LTEnode2APN }}
                    exit

                    network-interface  lte-dhcp
                        name                   lte-dhcp
                        conductor            true

                        neighborhood           DC-Internet-LTE-01
                            name                DC-Internet-LTE-01
                            peer-connectivity   outbound-only
                            vector              LTE-01

                            bfd
                                state                     enabled
                                desired-tx-interval       60000
                                required-min-rx-interval  60000
                                link-test-interval        120
                            exit

                            udp-transform
                                mode  always-transform
                            exit

                            path-mtu-discovery
                                enabled  true
                            exit
                        exit

                        neighborhood           DC-Internet-LTE-02
                            name                DC-Internet-LTE-02
                            peer-connectivity   outbound-only
                            vector              LTE-02

                            bfd
                                state                     enabled
                                desired-tx-interval       60000
                                required-min-rx-interval  60000
                                link-test-interval        120
                            exit

                            udp-transform
                                mode  always-transform
                            exit

                            path-mtu-discovery
                                enabled  true
                            exit
                        exit
                        inter-router-security  peer-sec
                        source-nat             true

                        management-vector
                            name      lte
                            priority  128
                        exit
                        dhcp                   v4
                    exit
                exit

                device-interface         loopback
                    name                 loopback
                    type                 host

                    network-interface    loopback-mgmt
                        name                 loopback-mgmt
                        default-route        true
                        tenant               ics-mgmt

                        management-vector
                            name           loopback
                            priority       100
                        exit

                        address            100.111.0.1
                            ip-address        100.111.0.1
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

                ipsec-client        {{ model.routerName }}
                    name            {{ model.routerName }}
                    enabled         true
                    tenant          sfc-palo

                    remote          prisma-srv
                        name     prisma-srv
                        host     {{ model.prismaIPtunnelIP }}
                        profile  prisma
                        tenant   hospitals.chs-site
                    exit
                    plugin-network  169.254.129.0/28
                exit
            exit

            service-route     local-{{ model.routerName }}-LAN-summary
                name          local-{{ model.routerName }}-LAN-summary
                service-name  {{ model.routerName }}-LAN-summary

                next-hop      {{ model.node1Name }} LAN-vlan2020
                        node-name   {{ model.node1Name }}
                        interface   LAN-vlan2020
                        gateway-ip  {{ model.lanGw }}
                exit

                next-hop      {{ model.node2Name }} LAN-vlan2020
                        node-name   {{ model.node1Name }}
                        interface   LAN-vlan2020
                        gateway-ip  {{ model.lanGw }}
                exit
            exit

            service-route     local-{{ model.routerName }}-mgmt-LAN-summary
                name          local-{{ model.routerName }}-mgmt-LAN-summary
                service-name  {{ model.routerName }}-mgmt-LAN-summary

                next-hop      {{ model.node1Name }} LAN-vlan2020
                        node-name   {{ model.node1Name }}
                        interface   LAN-vlan2020
                        gateway-ip  {{ model.lanGw }}
                exit

                next-hop      {{ model.node2Name }} LAN-vlan2020
                        node-name   {{ model.node1Name }}
                        interface   LAN-vlan2020
                        gateway-ip  {{ model.lanGw }}
                exit
            exit

            service-route  static-prisma-ipsec
                name          static-prisma-ipsec
                service-name  prisma-ipsec

                next-hop      {{ model.node2Name }} ADI-vlan0
                        node-name   {{ model.node2Name }}
                        interface   ADI-vlan0
                        gateway-ip  {{ model.wanGw2 }}
                exit
            exit

            service-route  svr-bdc-prisma-chs-internet
                name          svr-bdc-prisma-chs-internet
                service-name  chs-internet
                generated     false
                next-peer     BHMAL1-P-SDW-01
                next-peer     BHMAL1-P-SDW-02
                service-route-policy  sessions-second
            exit

            service-route  sfc-prisma-chs-internet
                name          sfc-prisma-chs-internet
                service-name  chs-internet

                next-hop      {{ model.node2Name }} prisma-srv-intf
                        node-name   {{ model.node2Name }}
                        interface   prisma-srv-intf
                        gateway-ip  169.254.129.6
                exit
                service-route-policy  sessions-first
            exit

            service-route     static-guest-wifi
               name          static-guest-wifi
               service-name  guest-wifi

               next-hop      {{ model.node2Name }} ADI-vlan0
                        node-name  {{ model.node2Name }}
                        interface  ADI-vlan0
                        gateway-ip {{ model.wanGw2 }}
               exit
            exit

            service-route     static-{{ model.node1Name }}-osn-mgmt
                name          static-{{ model.node1Name }}-osn-mgmt
                service-name  {{ model.node1Name }}-osn-mgmt

                next-hop      {{ model.node1Name }} loopback-mgmt
                        node-name  {{ model.node1Name }}
                        interface  loopback-mgmt
                exit
            exit

            service-route     static-{{ model.node2Name }}-osn-mgmt
                name          static-{{ model.node2Name }}-osn-mgmt
                service-name  {{ model.node2Name }}-osn-mgmt

                next-hop      {{ model.node2Name }} loopback-mgmt
                        node-name  {{ model.node2Name }}
                        interface  loopback-mgmt
                exit
            exit

            service-route     static-{{ model.node1Name }}-msbr-mgmt
                name          static-{{ model.node1Name }}-msbr-mgmt
                service-name  {{ model.node1Name }}-msbr-mgmt

                next-hop      {{ model.node1Name }} msbr-mgmt
                        node-name  {{ model.node1Name }}
                        interface  msbr-mgmt
                exit
            exit

            service-route     static-{{ model.node2Name }}-msbr-mgmt
                name          static-{{ model.node2Name }}-msbr-mgmt
                service-name  {{ model.node2Name }}-msbr-mgmt

                next-hop      {{ model.node2Name }} msbr-mgmt
                        node-name  {{ model.node2Name }}
                        interface  msbr-mgmt
                exit
            exit

            service-route     static-router-internet
               name          static-router-internet
               service-name  router-internet

               next-hop      {{ model.node2Name }} ADI-vlan0
                        node-name  {{ model.node2Name }}
                        interface  ADI-vlan0
                        gateway-ip {{ model.wanGw2 }}
               exit

               next-hop      {{ model.node2Name }} lte-dhcp
                        node-name  {{ model.node2Name }}
                        interface  lte-dhcp
               exit
            exit

            service-route    static-ics-noc-tools-md
               name          static-ics-noc-tools-md
               service-name  ics-noc-tools
               peer          CHSSDWHAMD
               service-route-policy  sessions-first
            exit

            service-route    static-ics-noc-tools-chi
               name          static-ics-noc-tools-chi
               service-name  ics-noc-tools
               peer          CHSSDWHACHI
               service-route-policy  sessions-second
            exit

            service-route-policy  sessions-first
               name          sessions-first
               description   "Highest Priority Path"
               max-sessions  1000000000
            exit

            service-route-policy  sessions-second
               name          sessions-second
               description   "Second Priority Path"
               max-sessions  100000000
            exit

            ipsec-profile         prisma
               name                     prisma
               ike-encryption           aes256
               ike-digest               sha2
               ike-modp                 modp2048
               ikev2                    insist
               authentication-protocol  esp
               phase2-encryption        aes256
               phase2-digest            sha2
               phase2-modp              modp2048
               ike-lifetime             8h
               connection-lifetime      16h
               compress                 false
               perfect-forward-secrecy  false
               pre-shared-key           {{ model.prismaPSK }}
            exit
        exit

        tenant  hospitals.chs-site
            name      hospitals.chs-site

            member  {{ model.routerName }}-lan1
                neighborhood  {{ model.routerName }}-lan1
                address       {{ model.dataIPBlock1 }}
            exit
            member  {{ model.routerName }}-lan2
                neighborhood  {{ model.routerName }}-lan2
                address       {{ model.dataIPBlock2 }}
            exit
        exit

        service  {{ model.routerName }}-LAN-summary
            name           {{ model.routerName }}-LAN-summary

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  bdc
            exit
            security       service-sec

            transport       tcp
                protocol  tcp
            exit

            transport       udp
                protocol  udp
            exit

            transport       icmp
                protocol  icmp
            exit
            address        {{ model.dataIPBlock1 }}
            address        {{ model.dataIPBlock2 }}

            access-policy   chs-dc
                source      chs-dc
                permission  allow
            exit

            access-policy   chs-site
                source      chs-site
                permission  allow
            exit
            service-policy  Default-MPLS-no-LTE
        exit

        service  {{ model.routerName }}-mgmt-LAN-summary
            name           {{ model.routerName }}-mgmt-LAN-summary

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  bdc
            exit
            security       service-sec

            transport       tcp
                protocol    tcp

                port-range  22
                    start-port  22
                    end-port    22
                exit

                port-range  3389
                    start-port  3389
                    end-port    3389
                exit
            exit

            transport       udp
                protocol    udp

                port-range  161
                    start-port  161
                    end-port    161
                exit
            exit
            address        {{ model.dataIPBlock1 }}
            address        {{ model.dataIPBlock2 }}

            access-policy   chs-dc
                source      chs-dc
                permission  allow
            exit

            access-policy   chs-site
                source      chs-site
                permission  allow
            exit
            service-policy  Mission-Critical-MPLS
        exit

        service  chs-internet
            name           chs-internet

            applies-to      router-group
                type        router-group
                group-name  clinics
                group-name  hospitals
                group-name  bdc
            exit
            security       encrypt-hmac-disabled
            address        0.0.0.0/0

            access-policy   chs-site
                source      chs-site
                permission  allow
            exit
            service-policy        Default-BB-no-LTE
            share-service-routes  false
        exit

        service  prisma-ipsec
            name           prisma-ipsec

            applies-to      router-group
                type        router-group
                group-name  clinics
                group-name  hospitals
            exit

            security       encrypt-hmac-disabled
            address        0.0.0.0/0

            access-policy   sfc-palo
                source      sfc-palo
                permission  allow
            exit
            share-service-routes  false
        exit

        service  {{ model.node1Name }}-osn-mgmt
            name           {{ model.node1Name }}-osn-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node1OSNLoopback }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  {{ model.node2Name }}-osn-mgmt
            name           {{ model.node2Name }}-osn-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node2OSNLoopback }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  {{ model.node1Name }}-msbr-mgmt
            name           {{ model.node1Name }}-msbr-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node1MSBRMgmt }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  {{ model.node2Name }}-msbr-mgmt
            name           {{ model.node2Name }}-msbr-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node2MSBRMgmt }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
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
  trapServer1: '',
  node1Name: '',
  node2Name: '',
  wanVlan1: '',
  wanAddr1: '',
  wanPrefix1: '',
  wanGw1: '',
  wanAddr2: '',
  wanPrefix2: '',
  wanGw2: '',
  lanSharedMAC: '',
  lanAddr: '',
  lanPrefix: '',
  lanGw: '',
  dataIPBlock1: '',
  dataIPBlock2: '',
  prismaIPtunnelIP: '',
  prismaPSK: '',
  LTEnode2APN: '',
  node1OSNLoopback: '',
  node2OSNLoopback: '',
  MSBRVoiceVlan: '',
  MSBRVoiceAddr: '',
  MSBRVoicePrefix: '',
  DNS1: '',
  DNS2: '',
  node1MSBRMgmt: '',
  node2MSBRMgmt: '',
}
