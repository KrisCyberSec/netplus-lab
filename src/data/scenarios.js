/** Troubleshooting scenario cards — Domain 5 hero content. */
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
];
