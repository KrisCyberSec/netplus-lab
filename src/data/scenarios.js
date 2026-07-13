/** Scenario cards — multi-domain “what’s wrong?” cases (D5 heavy historically; D1–D4 expanded). */
export const SCENARIOS = [
  {
    id: 's1',
    domain: 5,
    title: 'Internet is down (sort of)',
    symptoms:
      'A user can open shared drives on the LAN and ping 192.168.1.1. Browsing to websites by name fails. Pinging 8.8.8.8 succeeds.',
    question: 'What is the most likely root cause?',
    choices: [
      'Failed default gateway',
      'DNS resolution problem',
      'Bad access switch uplink',
      'Duplex mismatch on the core',
    ],
    answer: 1,
    explain:
      'IP path to the internet works (ping 8.8.8.8) and LAN works. Name-based access failing points at DNS.',
  },
  {
    id: 's2',
    domain: 5,
    title: 'New PC, no joy',
    symptoms:
      'A freshly imaged laptop shows IP 169.254.42.17. No internal resources load. The wall jack works for another machine.',
    question: 'What should you check first?',
    choices: [
      'Replace the core firewall',
      'DHCP server reachability / client DHCP settings',
      'BGP peering with the ISP',
      'Certificate expiry on the laptop',
    ],
    answer: 1,
    explain:
      'APIPA means DHCP failed. Verify VLAN/DHCP relay, scope availability, and client config before blaming the internet edge.',
  },
  {
    id: 's3',
    domain: 5,
    title: 'Slow as molasses',
    symptoms:
      'One server link shows high CRC errors. Throughput is terrible. Autonegotiation is on at the server; the switch port is hard-set to 100/full.',
    question: 'Most likely issue?',
    choices: [
      'DNS TTL mismatch',
      'Duplex mismatch',
      'Wrong SSID',
      'Missing default route on a PC across the building',
    ],
    answer: 1,
    explain:
      'Hard-setting one side while the other autonegotiates often yields duplex mismatch and errors.',
  },
  {
    id: 's4',
    domain: 5,
    title: 'VLAN strangers',
    symptoms:
      'PC-A is in VLAN 10, PC-B in VLAN 20 on the same switch stack. They cannot ping each other. Same-VLAN pings work.',
    question: 'What is missing?',
    choices: [
      'A longer patch cable',
      'Inter-VLAN routing',
      'Disabling 802.1Q everywhere',
      'APIPA on both PCs',
    ],
    answer: 1,
    explain: 'Different VLANs are separate L2 domains. You need L3 routing between them.',
  },
  {
    id: 's5',
    domain: 5,
    title: 'Gateway ghost',
    symptoms:
      'Host IP is 10.0.5.50/24. Gateway is configured as 10.0.6.1. Local same-subnet hosts respond; nothing beyond the LAN works.',
    question: 'What is wrong?',
    choices: [
      'Gateway is on a different subnet than the host',
      'DNS is set to the broadcast address',
      'The switch has no MAC table',
      'HTTP is blocked globally',
    ],
    answer: 0,
    explain: 'The default gateway must be an address on the host’s local subnet.',
  },
  {
    id: 's6',
    domain: 5,
    title: 'Wi-Fi channel chaos',
    symptoms:
      'Office 2.4 GHz network is flaky. Survey shows three neighbor APs on channel 6 at high power. Your AP is also on 6.',
    question: 'Best first remediation?',
    choices: [
      'Move your AP to a less congested channel (1 or 11) or use 5 GHz',
      'Disable all encryption',
      'Change the default gateway to 8.8.8.8',
      'Replace every copper run with twinax',
    ],
    answer: 0,
    explain: 'Co-channel interference on 2.4 GHz is classic. Plan channels or shift clients to 5 GHz.',
  },
  {
    id: 's7',
    domain: 5,
    title: 'Trunk trouble',
    symptoms:
      'VLAN 30 works on Switch A access ports but not on Switch B. The link between A and B is an access port in VLAN 1 on both sides.',
    question: 'What is the problem?',
    choices: [
      'The inter-switch link is not trunking VLAN 30',
      'DNS secondary is offline',
      'SMTP is using port 25',
      'The rack is 42U',
    ],
    answer: 0,
    explain: 'To carry VLAN 30 between switches, the link must trunk (or be an access port in VLAN 30, which rarely scales).',
  },
  {
    id: 's8',
    domain: 4,
    title: 'Suspicious gateway',
    symptoms:
      'Several users suddenly have gateway 10.0.0.99 instead of 10.0.0.1. A cheap travel router was found under a desk.',
    question: 'What attack or issue is this?',
    choices: [
      'Rogue DHCP server',
      'BGP route leak only',
      'Fiber macrobend',
      'Normal APIPA behavior',
    ],
    answer: 0,
    explain: 'Unauthorized DHCP hands out attacker-controlled gateway/DNS settings.',
  },
  {
    id: 's9',
    domain: 5,
    title: 'Name works, path does not',
    symptoms:
      'nslookup resolves correctly. ping to the resolved IP fails. traceroute dies at the first hop (local gateway).',
    question: 'Where should you focus?',
    choices: [
      'DNS zone transfers',
      'Local gateway / routing / firewall on the path',
      'SMTP relay ACLs only',
      'Cable category labels',
    ],
    answer: 1,
    explain: 'Resolution works; forwarding past the gateway does not. Investigate L3 path and filtering.',
  },
  {
    id: 's10',
    domain: 5,
    title: 'Patch panel mystery',
    symptoms:
      'A desk jack shows no link. The switch port is up when a known-good cable is plugged in the closet. The horizontal run is unknown in a dense panel.',
    question: 'Best tool?',
    choices: ['Toner probe', 'OTDR only', 'load balancer', 'nslookup'],
    answer: 0,
    explain: 'Tone and probe traces which panel port maps to the desk.',
  },
  {
    id: 's11',
    domain: 5,
    title: 'Methodology check',
    symptoms:
      'After a change window, VPN users cannot connect. You already confirmed the outage scope and gathered recent change notes.',
    question: 'Next step in a structured approach?',
    choices: [
      'Establish a theory of probable cause (e.g. bad firewall rule from the change)',
      'Document and close without testing',
      'Replace every laptop VPN client immediately',
      'Disable logging to reduce noise',
    ],
    answer: 0,
    explain: 'After identifying the problem, form and then test a probable-cause theory.',
  },
  {
    id: 's12',
    domain: 5,
    title: 'Asymmetric pain',
    symptoms:
      'Large uploads fail; small pings succeed. Packet capture shows many retransmissions from the server side. Interface counters show runts and CRC on the switch port.',
    question: 'Most likely layer to investigate first?',
    choices: [
      'Physical / data link (cable, NIC, port errors)',
      'Application layer certificate CN only',
      'Layer 7 HTTP verbs only',
      'NTP authentication',
    ],
    answer: 0,
    explain: 'CRC/runts and retransmits scream Layer 1/2 path issues before app rewrites.',
  },
  {
    id: 's13',
    domain: 2,
    title: 'Native VLAN surprise',
    symptoms:
      'PCs on VLAN 10 work on each switch alone. After trunking two switches, some untagged management traffic appears on the wrong VLAN. Native VLAN is 1 on Switch A and 10 on Switch B.',
    question: 'What should you fix?',
    choices: [
      'Match native VLANs on both ends of the trunk (and avoid using it for user data)',
      'Disable all IP routing forever',
      'Change every access port to VLAN 999',
      'Replace DNS with APIPA',
    ],
    answer: 0,
    explain: 'Native VLAN mismatches leak untagged frames into unexpected VLANs.',
  },
  {
    id: 's14',
    domain: 4,
    title: 'Evil twin cafe',
    symptoms:
      'At a conference, users join “FreeConf-WiFi” and later report credential prompts that look like the corporate portal. A second AP with the same SSID is found nearby.',
    question: 'What is happening?',
    choices: [
      'Evil twin / rogue AP phishing clients',
      'Normal DHCP exhaustion only',
      'Beneficial STP reconvergence',
      'Fiber polarity inversion',
    ],
    answer: 0,
    explain: 'Rogue APs clone SSIDs to harvest credentials or intercept traffic.',
  },
  {
    id: 's15',
    domain: 3,
    title: 'Change window regret',
    symptoms:
      'After an undocumented ACL change, a partner VPN fails. No recent diagram exists. Logs were not reviewed before the change.',
    question: 'Which ops gap contributed most?',
    choices: [
      'Weak change management and documentation',
      'Too many cable labels',
      'Excessive monitoring',
      'Using SSH instead of Telnet',
    ],
    answer: 0,
    explain: 'Undocumented changes without rollback planning are classic ops failures.',
  },
  {
    id: 's16',
    domain: 5,
    title: 'Half the floor is dark',
    symptoms:
      'Odd-numbered cubicles on one wing have no link lights. Even-numbered jacks work. Closet shows a damaged bundle crushed by a ladder.',
    question: 'Best next step?',
    choices: [
      'Inspect/replace damaged horizontal cabling; certify with a tester',
      'Reboot the internet edge firewall only',
      'Change all users to static APIPA',
      'Upgrade BGP to OSPF on PCs',
    ],
    answer: 0,
    explain: 'Physical damage to a cable bundle explains a pattern of dead jacks.',
  },
  {
    id: 's17',
    domain: 5,
    title: 'Optics mystery',
    symptoms:
      'A new 10G link will not come up. The switch logs “unsupported transceiver.” Copper DAC in the same port works with a different peer.',
    question: 'Most likely issue?',
    choices: [
      'Transceiver compatibility / coding / type mismatch',
      'DNS TTL too high',
      'Missing default route on a PC',
      'WPA3 disabled',
    ],
    answer: 0,
    explain: 'Optics must match speed, media, and often vendor allow-lists — classic physical/interface issue.',
  },
  {
    id: 's18',
    domain: 5,
    title: 'Pool’s closed',
    symptoms:
      'Morning rush: many new laptops show 169.254.x.x. Existing workstations that stayed online overnight still work. DHCP server CPU is fine; the scope shows 0 free leases.',
    question: 'What happened?',
    choices: [
      'DHCP address pool exhaustion',
      'Spine-leaf miswire only',
      'SMTP relay full',
      'NTP stratum zero failure only',
    ],
    answer: 0,
    explain: 'No free DHCP addresses → new clients fail (APIPA on Windows) while existing leases continue.',
  },
  {
    id: 's19',
    domain: 4,
    title: 'Flat and dangerous',
    symptoms:
      'HVAC controllers and corporate laptops share one VLAN with no ACLs. A worm on a laptop begins scanning industrial IPs.',
    question: 'What design control was missing?',
    choices: [
      'Segmentation between IT and OT/ICS networks',
      'More colorful patch cables',
      'Disabling all logging',
      'Using hubs for OT',
    ],
    answer: 0,
    explain: 'OT/ICS should be segmented and tightly controlled relative to enterprise IT.',
  },
  {
    id: 's20',
    domain: 3,
    title: 'No diagrams, long outage',
    symptoms:
      'After a core failure, rebuild takes hours because nobody knows which subnets, VLANs, or firewall rules were in production. Configs were never backed up.',
    question: 'Which ops practices failed?',
    choices: [
      'Documentation and configuration backup/baselines',
      'Using fiber instead of copper',
      'Having too many study guides',
      'Enabling LLDP',
    ],
    answer: 0,
    explain: 'Logical/physical docs plus config backups and baselines cut MTTR dramatically.',
  },

  // --- v0.8 rebalance: more D1–D4 scenarios ---
  {
    id: 's21',
    domain: 1,
    title: 'Wrong glass, no light',
    symptoms:
      'A tech installs a new uplink. The switch port is SFP+ for single-mode LC. They inserted a multimode SR optic into a long OS2 run. Link stays down; DOM shows no usable light.',
    question: 'What concept was mismatched?',
    choices: [
      'Transceiver / fiber type (SMF vs MMF optics and plant)',
      'DNS TTL only',
      'WPA3 passphrase length',
      'SMTP banner',
    ],
    answer: 0,
    explain: 'Optics, connectors, and fiber plant must match mode, wavelength, and distance class.',
  },
  {
    id: 's22',
    domain: 1,
    title: 'Everyone hears everything',
    symptoms:
      'A small office grew by daisy-chaining cheap hubs. One chatty device floods the segment; everyone’s NICs spike and apps time out. A modern switch is available in the closet unused.',
    question: 'What topology/device change best contains the problem?',
    choices: [
      'Replace hubs with a switch to create separate collision domains per port',
      'Add more hubs in a bigger ring',
      'Disable all IP addresses',
      'Force every host to the same MAC address',
    ],
    answer: 0,
    explain: 'Switches isolate collision domains; hubs share one big collision domain and amplify chatter.',
  },
  {
    id: 's23',
    domain: 1,
    title: 'Cloud “private” that isn’t',
    symptoms:
      'A team spun up cloud VMs and opened the database security group to 0.0.0.0/0 “just for testing.” The VPC has no bastion and no private subnets for data tiers.',
    question: 'Which cloud networking concept was skipped?',
    choices: [
      'Segmentation with private subnets / tight security-group (NSG) rules',
      'Using only copper DAC in the region',
      'Disabling all IAM',
      'Replacing DNS with static hosts files on the Internet',
    ],
    answer: 0,
    explain: 'Cloud designs still need private tiers and least-privilege network rules — not wide-open SG/NSGs.',
  },
  {
    id: 's24',
    domain: 2,
    title: 'LAG that isn’t',
    symptoms:
      'Two uplinks between access and distribution are plugged in for redundancy. Spanning tree blocks one. Throughput never exceeds a single link. Neither side has LACP configured.',
    question: 'What is missing for active-active bandwidth?',
    choices: [
      'A link aggregation group (e.g. LACP) on both ends',
      'A longer DHCP lease',
      'Disabling all VLANs',
      'Static APIPA on the uplink',
    ],
    answer: 0,
    explain: 'Without EtherChannel/LACP, STP treats parallel links as a loop and blocks one.',
  },
  {
    id: 's25',
    domain: 2,
    title: 'PoE math fails',
    symptoms:
      'A new closet switch advertises PoE+. After adding a dozen cameras and APs, random devices reboot. The switch log shows power budget exceeded; some ports disabled power.',
    question: 'Root cause?',
    choices: [
      'PoE power budget / planning insufficient for connected PDs',
      'DNS secondary missing',
      'Wrong BGP AS only',
      'SMTP relay full',
    ],
    answer: 0,
    explain: 'PoE switches have finite watts; oversubscription drops or reboots powered devices.',
  },
  {
    id: 's26',
    domain: 2,
    title: 'SSID works, apps don’t',
    symptoms:
      'Corporate SSID uses WPA3-Enterprise. Guests use an open captive-portal SSID on the same AP. A user joins the guest SSID by habit and cannot reach file servers that require domain auth on the corp VLAN.',
    question: 'What is the most accurate explanation?',
    choices: [
      'They are on the isolated guest WLAN/VLAN by design',
      'WPA3 always blocks file servers even on corp SSID',
      'The core has no power',
      'IPv6 ULA is required for SMB',
    ],
    answer: 0,
    explain: 'Guest networks are segmented; connecting to the wrong SSID yields expected isolation.',
  },
  {
    id: 's27',
    domain: 2,
    title: 'OSPF neighbors silent',
    symptoms:
      'Two routers share a /30 on a point-to-point link. OSPF is enabled on both, but no adjacency forms. ACLs on the path block protocol 89. Ping between the /30 addresses works.',
    question: 'What is blocking the adjacency?',
    choices: [
      'ACL filtering OSPF (IP protocol 89) between neighbors',
      'Missing default gateway on a PC in another building',
      'Wrong Wi-Fi channel',
      'Expired DHCP lease on a printer',
    ],
    answer: 0,
    explain: 'ICMP success does not mean routing-protocol packets are allowed — check ACLs for OSPF.',
  },
  {
    id: 's28',
    domain: 3,
    title: 'Certs expired everywhere',
    symptoms:
      'After a long holiday, VPN and 802.1X suddenly fail for many users. Clocks on several switches show 2019. NTP was pointed at an internal server that was decommissioned.',
    question: 'What operational service failed?',
    choices: [
      'Time sync (NTP) — bad clocks break cert/auth validity',
      'Cable category rating only',
      'Fiber polish angle only',
      'SMTP banner grammar',
    ],
    answer: 0,
    explain: 'Auth and certificates depend on accurate time; monitor and redundant NTP sources matter.',
  },
  {
    id: 's29',
    domain: 3,
    title: 'Community string nostalgia',
    symptoms:
      'Monitoring can read every router with SNMPv2c community “public.” An intern scans the management VLAN and pulls full configs via poorly controlled read-write strings on old gear.',
    question: 'What should operations fix first?',
    choices: [
      'SNMP hardening: strong creds/version (prefer v3), least privilege, management ACLs',
      'Disable all monitoring forever',
      'Use hubs for the management VLAN',
      'Publish community strings on the wiki homepage',
    ],
    answer: 0,
    explain: 'Legacy SNMPv2c with default strings is a classic ops/security debt item.',
  },
  {
    id: 's30',
    domain: 3,
    title: 'Friday night special',
    symptoms:
      'An engineer pushes an untested ACL during peak hours with no ticket. Traffic black-holes. No recent config backup exists on the jump host.',
    question: 'Which practices were skipped?',
    choices: [
      'Change management, maintenance windows, and configuration backups',
      'Using LC instead of SC connectors',
      'Enabling more broadcast storms',
      'Removing all documentation on purpose',
    ],
    answer: 0,
    explain: 'Change control + backups turn scary incidents into recoverable rollbacks.',
  },
  {
    id: 's31',
    domain: 4,
    title: 'Helpful IT email',
    symptoms:
      'Users receive a polished email: “Re-auth your VPN or access will be removed” with a lookalike domain. Several enter passwords. Hours later, unusual VPN sessions appear from another country.',
    question: 'What attack started the incident?',
    choices: [
      'Phishing leading to credential theft',
      'Fiber macrobend',
      'Duplex mismatch on a printer',
      'MTU discovery only',
    ],
    answer: 0,
    explain: 'Phishing steals identities; pair user training with MFA and anomaly detection.',
  },
  {
    id: 's32',
    domain: 4,
    title: 'Password-only VPN',
    symptoms:
      'Remote access VPN allows username/password only. A reused password from a breach dumps list works. No device posture checks exist.',
    question: 'Which control most directly reduces this risk?',
    choices: [
      'MFA (and preferably device/posture checks) on VPN',
      'Longer copper patch cords',
      'Disabling all firewalls',
      'Putting VPN pools on the OT VLAN',
    ],
    answer: 0,
    explain: 'MFA stops many password-only account takeovers for remote access.',
  },
  {
    id: 's33',
    domain: 4,
    title: 'MAC flood free-for-all',
    symptoms:
      'A compromised host floods thousands of source MACs into an access switch. The CAM table fills; the switch begins behaving like a hub and traffic is easier to sniff.',
    question: 'Which defensive feature helps on the access port?',
    choices: [
      'Port security (limit learned MACs) / storm control where appropriate',
      'Disabling STP everywhere',
      'Open guest SSID on the same port',
      'SNMPv2c community public on the port',
    ],
    answer: 0,
    explain: 'Port security limits MAC learning; without it, CAM overflow enables promiscuous sniffing.',
  },
  {
    id: 's34',
    domain: 1,
    title: 'Anycast DNS surprise',
    symptoms:
      'The company advertises the same DNS service address from multiple POPs so clients hit the nearest instance. A junior tech thinks duplicate IPs must mean a misconfiguration.',
    question: 'What traffic type/pattern is this?',
    choices: [
      'Anycast — same prefix/service IP from multiple locations',
      'Broadcast to 255.255.255.255 only',
      'APIPA collision only',
      'Layer-1 crossover cabling only',
    ],
    answer: 0,
    explain: 'Anycast routes the same destination to the topologically nearest provider instance.',
  },
  {
    id: 's35',
    domain: 2,
    title: 'Native VLAN mismatch',
    symptoms:
      'Two switches trunk successfully for most VLANs, but untagged traffic is mis-classified. Side A native VLAN 1; side B native VLAN 999. Intermittent weirdness for management.',
    question: 'What should be aligned?',
    choices: [
      'Native (untagged) VLAN on both ends of the trunk',
      'DHCP scope names only',
      'Wi-Fi country code only',
      'SMTP banner only',
    ],
    answer: 0,
    explain: 'Native VLAN mismatches cause untagged frames to land in different VLANs — a classic trunk footgun.',
  },
];
