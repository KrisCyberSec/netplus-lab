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
| 3. Network Operations | 19% | **Partial** | Ops, DR, monitoring banks expanded in v0.2 |
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
| Timed mock exam | all | Shipped (v0.2) |
| Cheatsheets | all | Shipped (v0.2) |
| Weak-domain dashboard hints | all | Shipped (v0.2) |
| Miss bank + review until mastered | all | Shipped (v0.3) |
| Post-session review CTAs | quiz/mock | Shipped (v0.3) |
| Domain deep-links (`/quiz?domain=N`) | all | Shipped (v0.3) |
| Subnet timed challenge | 1, 5 | Shipped (v0.3) |
| ACL order puzzles | 4 | Later |
| Topology / packet-path visual | 1, 2, 5 | Later |
| Mini CLI sim | 2, 5 | Later |

## Full coverage milestone

- [ ] Every exam objective ID has ≥ 3 questions
- [ ] Mock exam weighting matches domain %
- [ ] D2/D3/D4 banks no longer thin
- [ ] Scenario set spans cable, wireless, routing, security, ops

Questions live in `src/data/` and are tagged with `domain` and optional `objective` IDs.
