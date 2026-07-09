/** Tool picker items — Domain 3/5 high yield. */
export const TOOLS = [
  {
    id: 'ping',
    name: 'ping',
    category: 'CLI',
    use: 'Test basic IP reachability and round-trip time using ICMP echo.',
  },
  {
    id: 'traceroute',
    name: 'tracert / traceroute',
    category: 'CLI',
    use: 'Show the path packets take hop-by-hop to a destination.',
  },
  {
    id: 'ipconfig',
    name: 'ipconfig / ifconfig / ip',
    category: 'CLI',
    use: 'View or renew host IP, mask, gateway, and DNS settings.',
  },
  {
    id: 'nslookup',
    name: 'nslookup / dig',
    category: 'CLI',
    use: 'Query DNS records and verify name resolution.',
  },
  {
    id: 'netstat',
    name: 'netstat / ss',
    category: 'CLI',
    use: 'List active connections, listening ports, and routing tables.',
  },
  {
    id: 'nmap',
    name: 'nmap',
    category: 'CLI',
    use: 'Scan hosts for open ports and service fingerprints.',
  },
  {
    id: 'tcpdump',
    name: 'tcpdump / Wireshark',
    category: 'Capture',
    use: 'Capture and inspect packets on the wire.',
  },
  {
    id: 'arp',
    name: 'arp',
    category: 'CLI',
    use: 'View or clear IP-to-MAC address mappings on a host.',
  },
  {
    id: 'toner',
    name: 'Toner probe',
    category: 'Hardware',
    use: 'Trace a cable run through walls or a messy patch panel.',
  },
  {
    id: 'cable-tester',
    name: 'Cable certifier / tester',
    category: 'Hardware',
    use: 'Verify wiremap, length, and faults on copper cabling.',
  },
  {
    id: 'otdr',
    name: 'OTDR',
    category: 'Hardware',
    use: 'Locate breaks and loss events on fiber runs.',
  },
  {
    id: 'loopback',
    name: 'Loopback adapter',
    category: 'Hardware',
    use: 'Test a NIC or serial interface without the network path.',
  },
  {
    id: 'protocol-analyzer',
    name: 'Protocol analyzer',
    category: 'Capture',
    use: 'Decode application and transport protocols for deep troubleshooting.',
  },
  {
    id: 'spectrum',
    name: 'Spectrum analyzer',
    category: 'Wireless',
    use: 'Find RF interference and non-Wi-Fi noise sources.',
  },
  {
    id: 'wifi-analyzer',
    name: 'Wi-Fi analyzer',
    category: 'Wireless',
    use: 'Survey channels, SSID strength, and overlapping BSS.',
  },
];

export const TOOL_PROMPTS = [
  {
    prompt: 'Users can resolve internal hostnames but cannot reach the internet by name. IP connectivity to 8.8.8.8 works. What do you run first on a client?',
    answerId: 'nslookup',
    explain: 'Confirm which DNS server the client is using and whether public names resolve.',
  },
  {
    prompt: 'You need to see every hop between a PC and a remote web server that feels slow.',
    answerId: 'traceroute',
    explain: 'Traceroute maps the path and highlights where latency jumps.',
  },
  {
    prompt: 'A wall jack might be punched down wrong. You need to verify pinout end-to-end.',
    answerId: 'cable-tester',
    explain: 'A cable tester checks wiremap and common copper faults.',
  },
  {
    prompt: 'You must identify which patch panel port maps to a desk jack buried in a cubicle farm.',
    answerId: 'toner',
    explain: 'Tone and probe lets you chase the cable without unpatching everything blindly.',
  },
  {
    prompt: 'Confirm whether a host has an address, correct mask, and default gateway.',
    answerId: 'ipconfig',
    explain: 'Host IP config is step one for Layer 3 client issues.',
  },
  {
    prompt: 'Security wants a list of listening ports on a Linux server before an audit.',
    answerId: 'netstat',
    explain: 'netstat/ss shows listening sockets and established sessions.',
  },
  {
    prompt: 'You suspect a duplex mismatch. You want to inspect actual Ethernet frames and retransmits.',
    answerId: 'tcpdump',
    explain: 'Packet capture reveals errors, retransmissions, and odd traffic patterns.',
  },
  {
    prompt: 'Find open ports on a new IoT camera someone plugged into the LAN.',
    answerId: 'nmap',
    explain: 'Port scanning maps exposed services quickly.',
  },
  {
    prompt: 'Two hosts on the same VLAN cannot talk. You wonder if ARP is failing.',
    answerId: 'arp',
    explain: 'Check ARP tables for incomplete or wrong MAC mappings.',
  },
  {
    prompt: 'Users report Wi-Fi drops only near a microwave and Bluetooth hub.',
    answerId: 'spectrum',
    explain: 'A spectrum analyzer sees non-802.11 interference Wi-Fi tools may miss.',
  },
  {
    prompt: 'After a fiber cut repair, locate remaining loss events along the strand.',
    answerId: 'otdr',
    explain: 'OTDR characterizes fiber distance and reflectance events.',
  },
  {
    prompt: 'Prove a server NIC can send and receive without involving the switch.',
    answerId: 'loopback',
    explain: 'Loopback isolates the interface from the rest of the path.',
  },
  {
    prompt: 'Can this host reach its default gateway at all?',
    answerId: 'ping',
    explain: 'Ping is the fastest reachability check to gateway or target.',
  },
  {
    prompt: 'Survey which 5 GHz channels neighboring APs are using before channel planning.',
    answerId: 'wifi-analyzer',
    explain: 'Wi-Fi analyzers show channel utilization and overlapping BSS.',
  },
  {
    prompt: 'Decode a SIP call setup that fails mid-handshake.',
    answerId: 'protocol-analyzer',
    explain: 'Protocol analyzers break down application exchanges beyond raw packets.',
  },
];
