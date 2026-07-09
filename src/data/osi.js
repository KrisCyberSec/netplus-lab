/** OSI model reference for the interactive map. */
export const OSI_LAYERS = [
  {
    layer: 7,
    name: 'Application',
    pdu: 'Data',
    devices: 'Host processes, gateways (app-aware)',
    examples: 'HTTP, HTTPS, DNS, SMTP, FTP, SSH',
    job: 'User-facing network services and APIs.',
  },
  {
    layer: 6,
    name: 'Presentation',
    pdu: 'Data',
    devices: '—',
    examples: 'TLS, JPEG, ASCII/Unicode, encryption/compression',
    job: 'Translate, encrypt, and format data for the app.',
  },
  {
    layer: 5,
    name: 'Session',
    pdu: 'Data',
    devices: '—',
    examples: 'RPC, SQL sessions, NetBIOS sessions',
    job: 'Set up, manage, and tear down dialogues.',
  },
  {
    layer: 4,
    name: 'Transport',
    pdu: 'Segment / Datagram',
    devices: 'Load balancers (L4), firewalls (ports)',
    examples: 'TCP, UDP, port numbers, windowing',
    job: 'End-to-end delivery, reliability (TCP), multiplexing.',
  },
  {
    layer: 3,
    name: 'Network',
    pdu: 'Packet',
    devices: 'Routers, L3 switches',
    examples: 'IP, ICMP, IPsec, routing protocols',
    job: 'Logical addressing and path selection between networks.',
  },
  {
    layer: 2,
    name: 'Data Link',
    pdu: 'Frame',
    devices: 'Switches, bridges, NICs (MAC)',
    examples: 'Ethernet, MAC, LLC, 802.1Q VLAN tags',
    job: 'Node-to-node delivery on a local segment.',
  },
  {
    layer: 1,
    name: 'Physical',
    pdu: 'Bits',
    devices: 'Hubs, repeaters, cables, SFPs',
    examples: 'Fiber, copper, radio, voltage, light',
    job: 'Put bits on the medium and recover them.',
  },
];

export const OSI_QUIZ = [
  {
    q: 'Which layer is responsible for reliable end-to-end delivery and port numbers?',
    answer: 4,
    options: [7, 4, 3, 2],
  },
  {
    q: 'A MAC address lives primarily at which layer?',
    answer: 2,
    options: [1, 2, 3, 4],
  },
  {
    q: 'Routers make forwarding decisions using which layer?',
    answer: 3,
    options: [2, 3, 4, 7],
  },
  {
    q: 'HTTP and DNS are associated with which layer?',
    answer: 7,
    options: [4, 5, 6, 7],
  },
  {
    q: 'Cables, signaling, and bit encoding are which layer?',
    answer: 1,
    options: [1, 2, 3, 4],
  },
  {
    q: 'VLAN tagging (802.1Q) is a function of which layer?',
    answer: 2,
    options: [1, 2, 3, 4],
  },
  {
    q: 'TCP windowing and retransmissions happen at which layer?',
    answer: 4,
    options: [3, 4, 5, 7],
  },
  {
    q: 'Encryption and data format translation are classically which layer?',
    answer: 6,
    options: [5, 6, 7, 4],
  },
];
