/**
 * Multi-step PBQ-style scenarios — sequential decisions like the exam feel.
 * Not official CompTIA items; practice for multi-part troubleshooting.
 */
export const MULTI_STEP_SCENARIOS = [
  {
    id: 'ms1',
    title: 'No internet after move',
    domain: 5,
    setup:
      'A user moved desks. Same switch stack, new wall jack. PC shows a valid 10.20.5.44/24 address. They cannot reach the internet or other subnets. Same-subnet file share works.',
    steps: [
      {
        prompt: 'What should you verify first on the client?',
        choices: [
          'Default gateway and whether it responds to ping',
          'SMTP relay settings',
          'Fiber polarity in the core',
          'WPA3 passphrase on the AP',
        ],
        answer: 0,
        explain: 'Off-subnet failure with working local traffic points at gateway/path beyond the LAN.',
      },
      {
        prompt: 'Gateway 10.20.5.1 does not reply. The access port is in VLAN 50; SVI for users is VLAN 40. Next?',
        choices: [
          'Correct the access VLAN (or fix DHCP/SVI alignment)',
          'Disable STP globally',
          'Change the public DNS only',
          'Replace the ISP handoff',
        ],
        answer: 0,
        explain: 'Wrong VLAN → wrong broadcast domain → gateway that is not on-link.',
      },
      {
        prompt: 'After fixing VLAN, internet works. What do you document?',
        choices: [
          'Jack ID, port, VLAN, symptoms, root cause, fix',
          'Only the ticket number with no details',
          'Nothing — it works now',
          'Only the cable color',
        ],
        answer: 0,
        explain: 'Methodology ends with documentation so the next tech is not starting from zero.',
      },
    ],
  },
  {
    id: 'ms2',
    title: 'Intermittent Wi-Fi in the open office',
    domain: 2,
    setup:
      'Open office, 2.4 GHz SSID only. Users report drops near the kitchen. Laptops show low SNR. Three neighbor SSIDs are loud on channel 6; your AP is also on 6.',
    steps: [
      {
        prompt: 'Best first RF action?',
        choices: [
          'Move your AP to channel 1 or 11 (or prefer 5 GHz)',
          'Disable all encryption',
          'Set every client to static APIPA',
          'Remove the default gateway',
        ],
        answer: 0,
        explain: 'Co-channel interference on 2.4 GHz is classic; non-overlapping channels or 5 GHz help.',
      },
      {
        prompt: 'After channel change, kitchen area is still weak. Survey shows the AP is behind a fridge wall. Next?',
        choices: [
          'Reposition AP or add coverage; avoid RF obstacles',
          'Enable Telnet on the core',
          'Shorten the DHCP lease to 30 seconds',
          'Turn off DHCP entirely',
        ],
        answer: 0,
        explain: 'Placement and obstacles dominate coverage more than another channel tweak.',
      },
      {
        prompt: 'Guests must not reach corporate servers. Design choice?',
        choices: [
          'Separate guest SSID/VLAN with firewall isolation',
          'Same VLAN as domain controllers',
          'Open guest with no client isolation on the corp LAN',
          'Bridge guest to OT network',
        ],
        answer: 0,
        explain: 'Guest wireless should be segmented from production.',
      },
    ],
  },
  {
    id: 'ms3',
    title: 'New switch, loops and chaos',
    domain: 5,
    setup:
      'A junior admin added a second uplink between two access switches “for redundancy” without configuring aggregation. Broadcast storms and CAM thrash follow.',
    steps: [
      {
        prompt: 'What protocol should have blocked the loop?',
        choices: ['Spanning Tree (STP/RSTP)', 'OSPF', 'NTP', 'SMTP'],
        answer: 0,
        explain: 'STP blocks redundant L2 paths to prevent loops.',
      },
      {
        prompt: 'Proper way to use both uplinks for bandwidth?',
        choices: [
          'LAG/LACP (EtherChannel) so STP sees one logical link',
          'Disable STP and hope',
          'Use hubs between switches',
          'Assign both ports to different native VLANs randomly',
        ],
        answer: 0,
        explain: 'Link aggregation combines links; STP then treats the bundle as one path.',
      },
      {
        prompt: 'Immediate containment while you plan the fix?',
        choices: [
          'Shut one of the redundant access uplinks',
          'Delete all VLANs',
          'Factory-reset every phone',
          'Disable logging',
        ],
        answer: 0,
        explain: 'Break the loop first, then implement a designed redundant topology.',
      },
    ],
  },
  {
    id: 'ms4',
    title: 'Site-to-site VPN is up, apps are not',
    domain: 4,
    setup:
      'IPsec tunnel between HQ and branch shows up/up. Branch users can ping the HQ tunnel interface but cannot reach HQ application servers on 10.10.20.0/24.',
    steps: [
      {
        prompt: 'Most likely missing piece?',
        choices: [
          'Interesting traffic / routes / firewall rules for 10.10.20.0/24 over the tunnel',
          'Cat 6A instead of Cat 5e on desks',
          'WPA3 on the branch SSID only',
          'Disabling DNS everywhere',
        ],
        answer: 0,
        explain: 'Tunnel up ≠ app path allowed. Check crypto ACLs, routes, and firewall policy.',
      },
      {
        prompt: 'HQ firewall allows the subnet but servers reply to the wrong path. Symptom of?',
        choices: [
          'Asymmetric routing / missing return route to the branch',
          'APIPA on the servers',
          'Bad RJ11 connectors',
          'NTP stratum only',
        ],
        answer: 0,
        explain: 'Return path must exist; otherwise one-way or broken sessions.',
      },
      {
        prompt: 'Security hardening still needed on the tunnel?',
        choices: [
          'Strong crypto, least-privilege policies, monitoring, patch edge devices',
          'Telnet for tunnel management from the Internet',
          'Shared admin password on a sticky note',
          'No logging by policy',
        ],
        answer: 0,
        explain: 'VPNs need ongoing hygiene: crypto suites, access control, visibility.',
      },
    ],
  },
  {
    id: 'ms5',
    title: 'DHCP looks fine until it doesn’t',
    domain: 5,
    setup:
      'Morning rush: new laptops get 169.254.x.x. Overnight machines still work. DHCP server is up; scope shows 0 free addresses.',
    steps: [
      {
        prompt: 'Root cause?',
        choices: [
          'DHCP scope exhaustion',
          'BGP flapping',
          'Missing STP root',
          'Broken SMTP only',
        ],
        answer: 0,
        explain: 'No free leases → new clients fail; existing leases continue until renew.',
      },
      {
        prompt: 'Immediate relief?',
        choices: [
          'Expand scope / reclaim stale leases / shorten lease time carefully',
          'Disable the DHCP server permanently',
          'Set every PC to the same static IP',
          'Unplug the core firewall forever',
        ],
        answer: 0,
        explain: 'Restore free addresses; then design capacity properly.',
      },
      {
        prompt: 'How do you reduce recurrence?',
        choices: [
          'Capacity planning, IPAM tracking, monitoring free leases, appropriate lease times',
          'Never document scopes',
          'Use APIPA by design for all clients',
          'Put DHCP on the guest SSID only',
        ],
        answer: 0,
        explain: 'Ops maturity: track utilization before the pool hits zero.',
      },
    ],
  },
  {
    id: 'ms6',
    title: 'Suspicious gateway on the LAN',
    domain: 4,
    setup:
      'Several users suddenly have gateway 10.0.0.99 instead of 10.0.0.1. A cheap travel router was found under a desk with DHCP enabled.',
    steps: [
      {
        prompt: 'What attack/issue is this?',
        choices: [
          'Rogue DHCP server',
          'Normal APIPA behavior',
          'Fiber macrobend only',
          'Healthy FHRP failover',
        ],
        answer: 0,
        explain: 'Unauthorized DHCP hands out attacker-controlled gateway/DNS.',
      },
      {
        prompt: 'Immediate containment?',
        choices: [
          'Unplug/disable the rogue, clear bad leases, restore legitimate DHCP',
          'Give the rogue a static public IP',
          'Turn off all corporate DHCP and leave rogues running',
          'Ignore and reboot PCs only once',
        ],
        answer: 0,
        explain: 'Remove the bad server and heal clients with correct options.',
      },
      {
        prompt: 'Longer-term control?',
        choices: [
          'DHCP snooping / port security / 802.1X where appropriate',
          'Disable all logging',
          'Use hubs in every closet',
          'Share the domain admin password with guests',
        ],
        answer: 0,
        explain: 'Switch features and access control stop casual rogue DHCP.',
      },
    ],
  },
  {
    id: 'ms7',
    title: 'Small office appliance design',
    domain: 1,
    setup:
      'A 40-person office needs Internet, a handful of wired desks, Wi-Fi, and basic perimeter filtering. Leadership wants simple, standard roles — not a data-center spine.',
    steps: [
      {
        prompt: 'Which device should terminate the ISP handoff and enforce allow/deny policy for the site?',
        choices: [
          'Firewall / UTM at the edge',
          'Unmanaged L2-only switch only',
          'Patch panel with no electronics',
          'Toner probe',
        ],
        answer: 0,
        explain: 'Edge firewalls (or router+firewall appliances) own Internet policy and often NAT.',
      },
      {
        prompt: 'Wired desks need many access ports that forward by MAC. Best fit?',
        choices: [
          'Access layer switch(es)',
          'Another Internet firewall per desk',
          'Only wireless bridges with no switching',
          'A modem per user',
        ],
        answer: 0,
        explain: 'Access switches provide density and L2 connectivity for endpoints.',
      },
      {
        prompt: 'Guests need Internet but must not reach finance file shares. Concept to apply?',
        choices: [
          'Separate guest SSID/VLAN with firewall isolation from corporate VLANs',
          'Put guests on the domain admin VLAN',
          'Disable all encryption so isolation is easier',
          'Bridge guests directly to the SAN',
        ],
        answer: 0,
        explain: 'Segmentation + policy keeps untrusted guests off corporate resources.',
      },
    ],
  },
  {
    id: 'ms8',
    title: 'IPv6 dual-stack pilot',
    domain: 1,
    setup:
      'You are enabling IPv6 alongside existing IPv4. Hosts should keep working if either stack has a glitch. Addressing must include on-link discovery and private site space for lab gear.',
    steps: [
      {
        prompt: 'What deployment model runs IPv4 and IPv6 concurrently on the same interfaces?',
        choices: [
          'Dual stack',
          'IPv4-only NAT444 forever',
          'Disabling all routers',
          'APIPA-only networks',
        ],
        answer: 0,
        explain: 'Dual stack means both protocols are configured and can be used in parallel.',
      },
      {
        prompt: 'A host needs an address that only works on its local link for neighbor discovery. Which kind?',
        choices: [
          'Link-local (fe80::/10)',
          'Global public only with no link-local',
          'RFC 1918 IPv4 mapped as the only option',
          'Multicast 224.0.0.1 as a host unicast',
        ],
        answer: 0,
        explain: 'Every IPv6 interface gets a link-local address for on-link communication.',
      },
      {
        prompt: 'Lab servers should use private IPv6 that is not meant for the global Internet. Choose:',
        choices: [
          'Unique local addresses (ULA, fc00::/7 / commonly fd00::/8)',
          'Only ::1 on every host',
          'Only fe80:: addresses for multi-hop routing',
          'IPv4 Class D multicast ranges',
        ],
        answer: 0,
        explain: 'ULA is the IPv6 analogue of site-private addressing for internal use.',
      },
    ],
  },
  {
    id: 'ms9',
    title: 'Finance VLAN rollout',
    domain: 2,
    setup:
      'Finance needs VLAN 40 on access switches. DHCP lives on a server in VLAN 10. Users must reach other subnets via the L3 core. Uplinks already carry multiple VLANs.',
    steps: [
      {
        prompt: 'Access ports for finance PCs should be configured as:',
        choices: [
          'Access mode in VLAN 40',
          'Trunks carrying all VLANs with no native VLAN care',
          'Routed ports with public /8 masks',
          'SPAN destinations only',
        ],
        answer: 0,
        explain: 'End hosts sit on access ports in a single VLAN unless they need trunking.',
      },
      {
        prompt: 'Uplinks between access and distribution that carry VLAN 10 and 40 must be:',
        choices: [
          '802.1Q trunks allowing the required VLANs',
          'Access ports in VLAN 1 only',
          'Wireless SSIDs',
          'Console cables',
        ],
        answer: 0,
        explain: 'Trunks tag multiple VLANs across inter-switch links.',
      },
      {
        prompt: 'DHCP offers from VLAN 10 must reach VLAN 40 clients. What is required?',
        choices: [
          'DHCP relay (IP helper) on the VLAN 40 SVI/gateway toward the DHCP server',
          'Disable all routing so broadcasts flood everywhere',
          'Put DHCP on every access port as a rogue',
          'Use only APIPA in finance',
        ],
        answer: 0,
        explain: 'DHCP is broadcast-scoped; relays forward requests across L3 boundaries.',
      },
    ],
  },
  {
    id: 'ms10',
    title: 'Branch static route vs dynamic',
    domain: 2,
    setup:
      'A small branch has one router to HQ over a private circuit and a backup Internet VPN. You need predictable primary path selection and automatic failover awareness.',
    steps: [
      {
        prompt: 'For a single primary path to HQ prefixes, the simplest reliable choice is often:',
        choices: [
          'A static route (with a less-preferred floating static or dynamic backup)',
          'Running every end-user PC as an OSPF ASBR',
          'Disabling the default gateway',
          'Using only DNS round-robin for L3 forwarding',
        ],
        answer: 0,
        explain: 'Static routes are common on simple branches; floating statics or dynamic routing cover backup.',
      },
      {
        prompt: 'NAT overload (PAT) is appropriate at the branch when:',
        choices: [
          'Many internal hosts share a small pool of public addresses toward the Internet',
          'You need unique public IPs for every printer on the LAN forever',
          'You are only bridging two VLANs at L2',
          'You want to disable all return traffic',
        ],
        answer: 0,
        explain: 'PAT maps many private clients through fewer public addresses using port translation.',
      },
      {
        prompt: 'First-hop redundancy (FHRP) at HQ user gateways primarily solves:',
        choices: [
          'Default-gateway availability if one first-hop router fails',
          'Fiber polishing technique',
          'SMTP greylisting',
          'Cable category certification',
        ],
        answer: 0,
        explain: 'HSRP/VRRP/GLBP-style protocols keep a virtual gateway alive for hosts.',
      },
    ],
  },
  {
    id: 'ms11',
    title: 'Firewall change done right',
    domain: 3,
    setup:
      'App team wants a new inbound rule from partners to a payment API. Last time someone pushed a permit-any on Friday night and caused an incident.',
    steps: [
      {
        prompt: 'Before implementing, what process should you follow?',
        choices: [
          'Change management: request, risk review, approval, maintenance window, rollback plan',
          'Push to production immediately with no ticket',
          'Disable logging so auditors cannot see it',
          'Delete all existing rules first',
        ],
        answer: 0,
        explain: 'Formal change control reduces unplanned outages and risky “cowboy” edits.',
      },
      {
        prompt: 'How should the rule itself be written?',
        choices: [
          'Least privilege: specific sources, destinations, ports/apps — not any/any',
          'Permit IP any any with no expiry',
          'Block the partner entirely and hope they go away',
          'Only filter by color of the patch cable',
        ],
        answer: 0,
        explain: 'Tight rules limit blast radius if credentials or hosts are abused.',
      },
      {
        prompt: 'After the change succeeds, what ops step closes the loop?',
        choices: [
          'Update documentation/baselines and confirm monitoring still reflects expected traffic',
          'Wipe configs so nobody can see the rule',
          'Turn off NTP',
          'Remove all backups',
        ],
        answer: 0,
        explain: 'Docs and baselines keep the next change and the next outage recovery honest.',
      },
    ],
  },
  {
    id: 'ms12',
    title: 'Monitoring that actually helps',
    domain: 3,
    setup:
      'A WAN link “felt slow” for weeks. Nobody had graphs. When it finally died, MTTR suffered because no one knew normal utilization or error counters.',
    steps: [
      {
        prompt: 'What should you establish first for key interfaces and services?',
        choices: [
          'A performance baseline (latency, loss, utilization, errors)',
          'A policy to never collect metrics',
          'Static APIPA on all routers',
          'Disabling SNMP community strings by publishing them online',
        ],
        answer: 0,
        explain: 'Baselines turn raw counters into meaningful “is this abnormal?” signals.',
      },
      {
        prompt: 'Which telemetry best shows top talkers across the WAN?',
        choices: [
          'Flow data (NetFlow/IPFIX/sFlow) or equivalent traffic analytics',
          'Only the wall-jack toner probe',
          'Console baud rate logs',
          'DHCP lease times alone',
        ],
        answer: 0,
        explain: 'Flows summarize conversations and volume without full packet capture everywhere.',
      },
      {
        prompt: 'Critical link-down events should preferably arrive as:',
        choices: [
          'Timely alerts (e.g. SNMP traps/syslog) into a watched system — not only weekly reports',
          'Printed memos mailed once a quarter',
          'Silent failures with no tickets',
          'Random Wi-Fi channel changes',
        ],
        answer: 0,
        explain: 'Push alerts and watched dashboards cut detection time, which cuts overall downtime.',
      },
    ],
  },
];
