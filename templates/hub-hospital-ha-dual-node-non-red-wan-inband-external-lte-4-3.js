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
            description           "{{ model.siteDescription }}"
            router-group          hospitals
            router-group          hub-hospitals
            maintenance-mode      true
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
                        port                   161

                        access-control         NDS_Polling
                            name       NDS_Polling
                            community  NDSSNMPRO
                        exit

                        access-control         Internal_Proxy
                            name       Internal_Proxy
                            community  INTERNALPROXY
                        exit

                        access-control         CHS_Polling
                           name       CHS_Polling
                           community  CHSSNMPro
                        exit

                        notification-receiver  {{ model.trapServer1 }} 162 trap
                            ip-address  {{ model.trapServer1 }}
                            port        162
                            type        trap
                            community   NDSSNMPRO
                        exit
                    exit
                exit
            exit

            node                        {{ model.node1Name }}
                name                    {{ model.node1Name }}
                role                    combo

                device-interface          AVPN1-ens3f1
                    name                  AVPN1-enp3f1
                    type                  ethernet
                    pci-address           0000:09:00.1

                    traffic-engineering
                       enabled            true
                       transmit-cap       195000000
                       traffic-profile    AVPN-22717
                    exit

                    network-interface     AVPN1
                        name                 AVPN1
                        type                 external
                        vlan                 {{ model.wanVlan1 }}
                        conductor            true

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

                        neighborhood         {{ model.routerName }}-MPLS
                            name                {{ model.routerName }}-MPLS
                            topology            hub
                            vector              MPLS-01
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

                 device-interface         LAN-eno2
                    name                  LAN-eno2
                    type                  ethernet
                    pci-address           {{ model.lanPCI }}
                    shared-phys-address   {{ model.lanSharedMAC }}

                    network-interface     LAN-vlan2020
                        name                 LAN-vlan2020
                        global-id            3
                        type                 external
                        vlan                 2020
                        neighborhood         {{ model.routerName }}-lan1
                            name  {{ model.routerName }}-lan1
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

                device-interface            fabr-eno1
                    name               fabr-eno1
                    description        "HA fabric/dogleg link"
                    type               ethernet
                    pci-address        0000:b0:00.2

                    network-interface  ha-fabric
                        name               ha-fabric
                        type               fabric

                        address            169.254.252.1
                            ip-address     169.254.252.1
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface            sync-eno4
                    name               sync-eno4
                    description        "HA state synchronization link"
                    type               ethernet
                    pci-address        0000:b0:00.1
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

                device-interface       xcc-mgt-eno3
                    name               xcc-mgt-eno3
                    description        "Interface for Lenovo XCC managment of other node"
                    type               ethernet
                    pci-address        0000:b0:00.0

                    network-interface  xcc-mgmt
                        name               xcc-mgmt
                        type               external
                        tenant             ics-mgmt
                        source-nat         true

                        address            100.111.252.1
                            ip-address     100.111.252.1
                            prefix-length  24
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
                            gateway           {{ model.node1Loopback }}
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

                        ifcfg-option     ZONE
                            name            ZONE
                            value           trusted
                        exit
                    exit
                exit
            exit

            node                        {{ model.node2Name }}
                name                    {{ model.node2Name }}
                role                    combo

                device-interface          ADI-ens3f1
                    name                  ADI-enp3f1
                    type                  ethernet
                    pci-address           0000:09:00.1

                    traffic-engineering
                       enabled            true
                       transmit-cap       195000000
                       traffic-profile    ADI-Profile
                    exit

                    network-interface     ADI
                        name                 ADI
                        type                 external
                        vlan                 {{ model.wanVlan2 }}
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

                        neighborhood         {{ model.routerName }}-Internet-Broadband
                            name                {{ model.routerName }}-Internet-Broadband
                            topology            hub
                            vector              Broadband-01
                        exit

                        neighborhood         {{ model.routerName }}-Internet-LTE
                            name                {{ model.routerName }}-Internet-LTE
                            topology            hub
                            vector              LTE-01

                            bfd
                                state                     enabled
                                desired-tx-interval       60000
                                required-min-rx-interval  60000
                                link-test-interval        120
                                link-test-length          0
                            exit

                            udp-transform
                                mode  always-transform
                            exit

                            path-mtu-discovery
                                enabled  true
                            exit
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

                 device-interface         LAN-eno2
                    name                  LAN-eno2
                    type                  ethernet
                    pci-address           {{ model.lanPCI }}
                    shared-phys-address   {{ model.lanSharedMAC }}

                    network-interface     LAN-vlan2020
                        name                 LAN-vlan2020
                        global-id            3
                        type                 external
                        vlan                 2020
                        neighborhood         {{ model.routerName }}-lan1
                            name  {{ model.routerName }}-lan1
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

                device-interface            fabr-eno1
                    name               fabr-eno1
                    description        "HA fabric/dogleg link"
                    type               ethernet
                    pci-address        0000:b0:00.2

                    network-interface  ha-fabric
                        name               ha-fabric
                        type               fabric

                        address            169.254.252.2
                            ip-address     169.254.252.2
                            prefix-length  30
                        exit
                    exit
                exit

                device-interface            sync-eno4
                    name               sync-eno4
                    description        "HA state synchronization link"
                    type               ethernet
                    pci-address        0000:b0:00.1
                    forwarding         false

                    network-interface  ha-sync
                        name               ha-sync
                        type               fabric

                        address            169.254.253.2
                            ip-address     169.254.253.2
                            prefix-length  30
                        exit

                        ifcfg-option     ZONE
                            name            ZONE
                            value           trusted
                        exit
                    exit
                exit

                device-interface  LTE-ens1f0
                    name               LTE-ens1f0
                    type                  ethernet
                    pci-address           0000:08:00.0

                    network-interface  lte-dhcp
                        name                   lte-dhcp
                        type                 external

                        neighborhood           DC-Internet-LTE-01
                            name                DC-Internet-LTE-01
                            peer-connectivity   outbound-only
                            vector              LTE-01

                            bfd
                                state                     enabled
                                desired-tx-interval       60000
                                required-min-rx-interval  60000
                                link-test-interval        120
                                link-test-length          0
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
                                link-test-length          0
                            exit

                            udp-transform
                                mode  always-transform
                            exit

                            path-mtu-discovery
                                enabled  true
                            exit
                        exit

                        neighborhood         {{ model.routerName }}-LTE-Internet
                            name                {{ model.routerName }}-LTE-Internet
                            topology            hub
                            vector              Broadband-02

                            bfd
                                state                     enabled
                                desired-tx-interval       60000
                                required-min-rx-interval  60000
                                link-test-interval        120
                                link-test-length          0
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

                device-interface       xcc-mgt-eno3
                    name               xcc-mgt-eno3
                    description        "Interface for Lenovo XCC managment of other node"
                    type               ethernet
                    pci-address        0000:b0:00.0

                    network-interface  xcc-mgmt
                        name               xcc-mgmt
                        type               external
                        tenant             ics-mgmt
                        source-nat         true

                        address            100.111.252.1
                            ip-address     100.111.252.1
                            prefix-length  24
                        exit
                    exit
                exit

                device-interface       crad-ens1f2
                    name               crad-ens1f2
                    description        "Interface for Cradlepoint LTE system managment"
                    type               ethernet
                    pci-address        0000:08:00.2

                    network-interface  cpt-mgmt
                        name               cpt-mgmt
                        type               external
                        tenant             ics-mgmt
                        source-nat         true

                        address            100.111.253.1
                            ip-address     100.111.253.1
                            prefix-length  24
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
                            gateway           {{ model.node2Loopback }}
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

                        ifcfg-option     ZONE
                            name            ZONE
                            value           trusted
                        exit
                    exit
                exit

                ipsec-client        prisma-site
                    name            prisma-site
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

            redundancy-group     {{ model.node1Name }}-RG
                name             {{ model.node1Name }}-RG

                member           {{ model.node1Name }} LAN-eno2
                    node         {{ model.node1Name }}
                    device-id    LAN-eno2
                exit
                priority         50
            exit

            redundancy-group     {{ model.node2Name }}-RG
                name             {{ model.node2Name }}-RG

                member           {{ model.node2Name }} LAN-eno2
                    node         {{ model.node2Name }}
                    device-id    LAN-eno2
                exit
                priority         100
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

            service-route     local-{{ model.routerName }}-citrix-hub
                name          local-{{ model.routerName }}-citrix-hub
                service-name  {{ model.routerName }}-citrix-hub

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

                next-hop      {{ model.node2Name }} ADI
                        node-name   {{ model.node2Name }}
                        interface   ADI
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

            service-route  static-Athena
                name          static-Athena
                service-name  Athena

                next-hop      {{ model.node2Name }} ADI
                         node-name  {{ model.node2Name }}
                         interface  ADI
                         gateway-ip {{ model.wanGw2 }}
                exit
                service-route-policy  sessions-first
            exit

            service-route  svr-bdc-prisma-Vidistar
                name          svr-bdc-prisma-Vidistar
                service-name  Vidistar
                generated     false
                next-peer     BHMAL1-P-SDW-01
                next-peer     BHMAL1-P-SDW-02
                service-route-policy  sessions-second
            exit

            service-route  sfc-prisma-Vidistar
                name          sfc-prisma-Vidistar
                service-name  Vidistar

                next-hop      {{ model.node2Name }} prisma-srv-intf
                        node-name   {{ model.node2Name }}
                        interface   prisma-srv-intf
                        gateway-ip  169.254.129.6
                exit
                service-route-policy  sessions-first
            exit

            service-route  svr-bdc-prisma-ClinicalViewHealthLanguage
                name          svr-bdc-prisma-ClinicalViewHealthLanguage
                service-name  ClinicalViewHealthLanguage
                generated     false
                next-peer     BHMAL1-P-SDW-01
                next-peer     BHMAL1-P-SDW-02
                service-route-policy  sessions-second
            exit

            service-route  sfc-prisma-ClinicalViewHealthLanguage
                name          sfc-prisma-ClinicalViewHealthLanguage
                service-name  ClinicalViewHealthLanguage

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

               next-hop      {{ model.node2Name }} ADI
                        node-name  {{ model.node2Name }}
                        interface  ADI
                        gateway-ip {{ model.wanGw2 }}
               exit
            exit

            service-route     static-{{ model.node1Name }}-mgmt
                name          static-{{ model.node1Name }}-mgmt
                service-name  {{ model.node1Name }}-mgmt

                next-hop      {{ model.node1Name }} loopback-mgmt
                        node-name  {{ model.node1Name }}
                        interface  loopback-mgmt
                exit
            exit

            service-route     static-{{ model.node2Name }}-mgmt
                name          static-{{ model.node2Name }}-mgmt
                service-name  {{ model.node2Name }}-mgmt

                next-hop      {{ model.node2Name }} loopback-mgmt
                        node-name  {{ model.node2Name }}
                        interface  loopback-mgmt
                exit
            exit

            service-route     static-{{ model.node1Name }}-xcc-mgmt
                name          static-{{ model.node1Name }}-xcc-mgmt
                service-name  {{ model.node1Name }}-xcc-mgmt

                next-hop      {{ model.node2Name }} xcc-mgmt
                        node-name  {{ model.node2Name }}
                        interface  xcc-mgmt
                exit
            exit

            service-route     static-{{ model.node2Name }}-xcc-mgmt
                name          static-{{ model.node2Name }}-xcc-mgmt
                service-name  {{ model.node2Name }}-xcc-mgmt

                next-hop      {{ model.node1Name }} xcc-mgmt
                        node-name  {{ model.node1Name }}
                        interface  xcc-mgmt
                exit
            exit

            service-route     static-{{ model.node2Name }}-cradlepoint-mgmt
                name          static-{{ model.node2Name }}-cradlepoint-mgmt
                service-name  {{ model.node2Name }}-cradlepoint-mgmt

                next-hop      {{ model.node2Name }} cpt-mgmt
                        node-name  {{ model.node2Name }}
                        interface  cpt-mgmt
                exit
            exit

            service-route     static-router-internet
               name          static-router-internet
               service-name  router-internet

               next-hop      {{ model.node2Name }} ADI
                        node-name  {{ model.node2Name }}
                        interface  ADI
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

            service-route  static-conductor3-backup
               name          static-conductor3-backup
               service-name  _conductor_3
               service-route-policy  sessions-second

               next-hop      {{ model.node2Name }} lte-dhcp
                        node-name  {{ model.node2Name }}
                        interface  lte-dhcp
               exit
            exit

            service-route  static-conductor4-backup
               name          static-conductor4-backup
               service-name  _conductor_4
               service-route-policy  sessions-second

               next-hop      {{ model.node2Name }} lte-dhcp
                        node-name  {{ model.node2Name }}
                        interface  lte-dhcp
               exit
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
               dpddelay                 30
               dpdtimeout               60
               dpdaction                restart
               local-id                 {{ model.wanAddr2 }}
               pre-shared-key           {{ model.prismaPSK }}
            exit
        exit

        tenant  hospitals.chs-site
            name      hospitals.chs-site

            member  {{ model.routerName }}-lan1
                neighborhood  {{ model.routerName }}-lan1
                address       {{ model.dataIPBlock1 }}
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
                group-name  cer
            exit
            security       service-sec

            transport             tcp
                protocol    tcp

                port-range  0
                    start-port  0
                    end-port    21
                exit

                port-range  23
                    start-port  23
                    end-port    3388
                exit

                port-range  3390
                    start-port  3390
                    end-port    65535
                exit
            exit

            transport             udp
                protocol    udp

                port-range  0
                    start-port  0
                    end-port    160
                exit

                port-range  162
                    start-port  162
                    end-port    65535
                exit
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
            service-policy        Default-MPLS-no-LTE
            share-service-routes  false
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
                group-name  cer
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
            service-policy        Mission-Critical-MPLS
            share-service-routes  false
        exit

        service  {{ model.routerName }}-citrix-hub
            name           {{ model.routerName }}-citrix-hub

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit
            security       service-sec

            transport       tcp
                protocol    tcp

                port-range  80
                    start-port  80
                    end-port    80
                exit

                port-range  443
                    start-port  443
                    end-port    443
                exit

                port-range  1494
                    start-port  1494
                    end-port    1494
                exit

                port-range  2598
                    start-port  2598
                    end-port    2598
                exit
            exit
            address        {{ model.citrixIPBlock1 }}

            access-policy   chs-site
                source      chs-site
                permission  allow
            exit
            service-policy        Mission-Critical-MPLS
            share-service-routes  true
        exit

        service  chs-internet
            name           chs-internet

            applies-to      router-group
                type        router-group
                group-name  clinics
                group-name  hospitals
                group-name  bdc
                group-name  corp
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
                group-name  corp
            exit

            security       encrypt-hmac-disabled
            address        0.0.0.0/0

            access-policy   sfc-palo
                source      sfc-palo
                permission  allow
            exit
            share-service-routes  false
        exit

        service  {{ model.node1Name }}-mgmt
            name           {{ model.node1Name }}-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
                group-name  bdc
            exit
            security       service-sec
            address        {{ model.node1Loopback }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit

            access-policy  bdc.chs-dc
                source      bdc.chs-dc
                permission  allow
            exit
        exit

        service  {{ model.node2Name }}-mgmt
            name           {{ model.node2Name }}-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
                group-name  bdc
            exit
            security       service-sec
            address        {{ model.node2Loopback }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit

            access-policy  bdc.chs-dc
                source      bdc.chs-dc
                permission  allow
            exit
        exit

        service  {{ model.node1Name }}-xcc-mgmt
            name           {{ model.node1Name }}-xcc-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node1XCCMgmt }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  {{ model.node2Name }}-xcc-mgmt
            name           {{ model.node2Name }}-xcc-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node2XCCMgmt }}

            access-policy  ics-mgmt
                source      ics-mgmt
                permission  allow
            exit
        exit

        service  {{ model.node2Name }}-cradlepoint-mgmt
            name           {{ model.node2Name }}-cradlepoint-mgmt

            applies-to       router
                type         router
                router-name  {{ model.routerName }}
            exit

            applies-to      router-group
                type        router-group
                group-name  nds-dc
            exit
            security       service-sec
            address        {{ model.node2CradlepointMgmt }}

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
  siteDescription: '',
  ntp1: '',
  ntp2: '',
  trapServer1: '',
  node1Name: '',
  node2Name: '',
  wanVlan1: '',
  wanAddr1: '',
  wanPrefix1: '',
  wanGw1: '',
  wanVlan2: '',
  wanAddr2: '',
  wanPrefix2: '',
  wanGw2: '',
  lanPCI: '',
  lanSharedMAC: '',
  lanAddr: '',
  lanPrefix: '',
  lanGw: '',
  dataIPBlock1: '',
  dataIPBlock2: '',
  citrixIPBlock1: '',
  prismaIPtunnelIP: '',
  prismaPSK: '',
  node1Loopback: '',
  node2Loopback: '',
  DNS1: '',
  DNS2: '',
  node1XCCMgmt: '',
  node2XCCMgmt: '',
  node2CradlepointMgmt: '',
}
