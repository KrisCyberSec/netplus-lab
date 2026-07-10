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
];
