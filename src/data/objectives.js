/**
 * CompTIA Network+ N10-009 (V9) topic map.
 * Sourced from CompTIA’s published exam objectives summary (network+ V9 / N10-009).
 * Not a substitute for the official PDF — always verify against CompTIA before exam day.
 * https://www.comptia.org/en-us/certifications/network/
 */
export const EXAM_META = {
  code: 'N10-009',
  version: 'V9',
  launch: 'June 20, 2024',
  durationMin: 90,
  maxQuestions: 90,
  passingScore: 720,
  scoreScale: '100–900',
  format: 'Multiple-choice and performance-based (PBQ)',
  disclaimer:
    'Not affiliated with CompTIA. Objectives summarized from CompTIA’s public Network+ materials. Confirm against the official exam objectives PDF.',
};

export const OBJECTIVE_MAP = [
  {
    domain: 1,
    name: 'Networking Concepts',
    weight: 23,
    topics: [
      { id: '1.1', title: 'OSI model layers', tags: ['osi', 'pdu'] },
      { id: '1.2', title: 'Networking appliances', tags: ['router', 'switch', 'firewall', 'ids', 'ips', 'load balancer', 'proxy', 'nas', 'san', 'wap'] },
      { id: '1.3', title: 'Cloud concepts', tags: ['nfv', 'vpc', 'nsg', 'gateway', 'saas', 'iaas', 'paas', 'public', 'private', 'hybrid'] },
      { id: '1.4', title: 'Ports and protocols', tags: ['ftp', 'sftp', 'ssh', 'smtp', 'dns', 'dhcp', 'http', 'https', 'snmp', 'ldap', 'rdp', 'sip'] },
      { id: '1.5', title: 'Traffic types', tags: ['unicast', 'multicast', 'anycast', 'broadcast'] },
      { id: '1.6', title: 'Transmission media', tags: ['802.11', 'cellular', 'satellite', 'fiber', 'coaxial', 'dac', 'copper'] },
      { id: '1.7', title: 'Transceivers and connectors', tags: ['sc', 'lc', 'st', 'mpo', 'rj11', 'rj45', 'f-type', 'bnc', 'sfp'] },
      { id: '1.8', title: 'Network topologies', tags: ['mesh', 'hybrid', 'star', 'spine-leaf', 'point-to-point', 'three-tier', 'collapsed core'] },
      { id: '1.9', title: 'IPv4 addressing', tags: ['public', 'private', 'apipa', 'rfc1918', 'loopback', 'cidr', 'vlsm', 'classes'] },
      { id: '1.10', title: 'IPv6 and related concepts', tags: ['global', 'link-local', 'ula', 'slaac', 'dual-stack'] },
      { id: '1.11', title: 'SDN / modern fabric concepts', tags: ['sdn', 'vxlan', 'zero trust', 'iac'] },
    ],
  },
  {
    domain: 2,
    name: 'Network Implementation',
    weight: 20,
    topics: [
      { id: '2.1', title: 'Routing technologies', tags: ['static', 'bgp', 'eigrp', 'ospf', 'nat', 'pat', 'fhrp', 'vip', 'subinterface'] },
      { id: '2.2', title: 'Switching technologies', tags: ['vlan', 'stp', 'mtu', 'jumbo', 'trunk', 'svi', 'lacp'] },
      { id: '2.3', title: 'Wireless devices and WLAN', tags: ['channels', 'ssid', 'encryption', 'guest', 'antenna', 'ap', 'bands'] },
      { id: '2.4', title: 'Physical installations', tags: ['power', 'poe', 'rack', 'environment', 'airflow', 'cabling'] },
    ],
  },
  {
    domain: 3,
    name: 'Network Operations',
    weight: 19,
    topics: [
      { id: '3.1', title: 'Documentation', tags: ['physical diagram', 'logical diagram', 'rack', 'cable map', 'ipam', 'sla', 'survey', 'inventory'] },
      { id: '3.2', title: 'Life-cycle and change management', tags: ['eol', 'eos', 'change', 'decommission', 'software'] },
      { id: '3.3', title: 'Configuration management', tags: ['baseline', 'backup', 'production config'] },
      { id: '3.4', title: 'Network monitoring', tags: ['snmp', 'flow', 'pcap', 'logs', 'api', 'port mirror', 'baseline'] },
      { id: '3.5', title: 'Disaster recovery and availability', tags: ['rpo', 'rto', 'mttr', 'mtbf', 'hot site', 'active-active'] },
      { id: '3.6', title: 'Network services', tags: ['dhcp', 'slaac', 'dns', 'ntp', 'ptp', 'nts'] },
      { id: '3.7', title: 'Access and management methods', tags: ['vpn', 'ssh', 'gui', 'api', 'console'] },
    ],
  },
  {
    domain: 4,
    name: 'Network Security',
    weight: 14,
    topics: [
      { id: '4.1', title: 'Logical security and identity', tags: ['encryption', 'pki', 'iam', 'mfa', 'sso', 'radius', 'tacacs+', 'saml', 'ldap', 'rbac'] },
      { id: '4.2', title: 'Physical security and deception', tags: ['cameras', 'locks', 'honeypot', 'honeynet'] },
      { id: '4.3', title: 'Security terminology and compliance', tags: ['cia', 'risk', 'threat', 'vulnerability', 'pci', 'gdpr', 'data locality'] },
      { id: '4.4', title: 'Segmentation and zones', tags: ['iot', 'ot', 'scada', 'guest', 'byod', 'dmz', 'screened subnet'] },
      { id: '4.5', title: 'Attacks', tags: ['ddos', 'vlan hop', 'mac flood', 'arp', 'dns poison', 'rogue', 'evil twin', 'on-path', 'phishing'] },
      { id: '4.6', title: 'Defense features', tags: ['hardening', 'nac', 'acl', 'url filter', 'zones', 'key management'] },
    ],
  },
  {
    domain: 5,
    name: 'Network Troubleshooting',
    weight: 24,
    topics: [
      { id: '5.1', title: 'Troubleshooting methodology', tags: ['identify', 'theory', 'test', 'plan', 'implement', 'verify', 'document'] },
      { id: '5.2', title: 'Cabling and physical interface issues', tags: ['termination', 'tx/rx', 'poe', 'transceiver', 'signal', 'counters'] },
      { id: '5.3', title: 'Network services and path issues', tags: ['stp', 'vlan', 'acl', 'routing table', 'gateway', 'dhcp pool', 'mask'] },
      { id: '5.4', title: 'Performance issues', tags: ['congestion', 'latency', 'loss', 'interference'] },
      { id: '5.5', title: 'Tools and protocols', tags: ['analyzer', 'cli', 'cable tester', 'wifi analyzer', 'toner', 'otdr'] },
    ],
  },
];

export function allTopicIds() {
  return OBJECTIVE_MAP.flatMap((d) => d.topics.map((t) => t.id));
}
