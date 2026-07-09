# Network+ Coverage Matrix (N10-009)

**Exam:** CompTIA Network+ (N10-009)  
**Not affiliated with CompTIA.** Official objectives are the source of truth.

## Legend

| Tag | Meaning |
|-----|---------|
| **MVP** | Ships in first release |
| **v1.x** | Soon after; still core product |
| **Later** | Nice-to-have / deeper fidelity |
| **External** | Point users to labs / hardware — not fully replaceable in-browser |

## Domain overview

| Domain | Weight | MVP depth | Notes |
|--------|--------|-----------|-------|
| 1. Networking Concepts | 23% | **Strong** | OSI, ports, subnetting, appliances |
| 2. Network Implementation | 20% | **Partial** | High-yield routing/VLAN/cabling |
| 3. Network Operations | 19% | **Thin** | Tools + basics; expanding |
| 4. Network Security | 14% | **Partial** | Attacks and controls fundamentals |
| 5. Network Troubleshooting | 24% | **Strong** | Methodology, tools, fault scenarios |

## Feature matrix

| Feature | Domains | Priority |
|---------|---------|----------|
| Subnetting trainer | 1, 5 | MVP |
| Port / protocol lightning round | 1 | MVP |
| OSI interactive map | 1 | MVP |
| Domain-weighted practice quiz | 1–5 | MVP |
| Weak-area review (localStorage) | all | MVP |
| Troubleshooting scenarios | 5 (+2/4) | MVP |
| Tool picker drill | 3, 5 | MVP |
| Domain progress dashboard | all | MVP |
| Full objective-tagged bank | all | v1.x |
| Timed mock exam | all | v1.x |
| ACL order puzzles | 4 | Later |
| Topology / packet-path visual | 1, 2, 5 | Later |
| Mini CLI sim | 2, 5 | Later |

## Full coverage milestone

- [ ] Every exam objective ID has ≥ 3 questions
- [ ] Mock exam weighting matches domain %
- [ ] D2/D3/D4 banks no longer thin
- [ ] Scenario set spans cable, wireless, routing, security, ops

Questions live in `src/data/` and are tagged with `domain` and optional `objective` IDs.
