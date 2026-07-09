/** N10-009 domain metadata and honest MVP coverage status. */
export const DOMAINS = [
  {
    id: 1,
    key: 'concepts',
    name: 'Networking Concepts',
    weight: 23,
    status: 'strong',
    blurb: 'OSI, ports, addressing, appliances, and core models.',
    drills: ['osi', 'ports', 'subnet', 'quiz'],
  },
  {
    id: 2,
    key: 'implementation',
    name: 'Network Implementation',
    weight: 20,
    status: 'partial',
    blurb: 'Routing, VLANs, wireless, and physical install high-yield items.',
    drills: ['quiz'],
  },
  {
    id: 3,
    key: 'operations',
    name: 'Network Operations',
    weight: 19,
    status: 'thin',
    blurb: 'Monitoring, docs, HA, and day-to-day ops concepts.',
    drills: ['tools', 'quiz'],
  },
  {
    id: 4,
    key: 'security',
    name: 'Network Security',
    weight: 14,
    status: 'partial',
    blurb: 'Attacks, hardening, access control, and segmentation.',
    drills: ['quiz', 'scenarios'],
  },
  {
    id: 5,
    key: 'troubleshooting',
    name: 'Network Troubleshooting',
    weight: 24,
    status: 'strong',
    blurb: 'Methodology, tool choice, and classic fault scenarios.',
    drills: ['scenarios', 'tools', 'subnet', 'quiz'],
  },
];

export const STATUS_LABEL = {
  strong: 'Strong',
  partial: 'Partial',
  thin: 'Thin',
};

export const DRILL_META = {
  home: { path: '/', label: 'Dashboard', icon: '◈' },
  subnet: { path: '/subnet', label: 'Subnetting', icon: '⬡' },
  ports: { path: '/ports', label: 'Ports', icon: '⚡' },
  osi: { path: '/osi', label: 'OSI Map', icon: '☰' },
  quiz: { path: '/quiz', label: 'Practice Quiz', icon: '?' },
  scenarios: { path: '/scenarios', label: 'Scenarios', icon: '⚑' },
  tools: { path: '/tools', label: 'Tool Picker', icon: '⚒' },
  coverage: { path: '/coverage', label: 'Coverage', icon: '▣' },
};
