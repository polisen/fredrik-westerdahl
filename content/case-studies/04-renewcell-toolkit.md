---

title: Re:Newcell
subtitle: High-scale embeddable web system
tagline: Embedding product education at scale under performance and legal constraints
order: 2
insightSlugs: ["embedded-systems", "privacy-aware-analytics"]
theme:
  background: "#F1EFEA"
  foreground: "#1A1A1A"
  primary: "#D6CFC2"
------------------

**Context**
Renewcell required an embeddable web solution to educate end-users about a new textile material at the point of purchase. The system needed to operate across third-party websites with potentially millions of daily impressions.

**Problem**
The challenge was delivering a branded, interactive experience at massive scale while keeping payload size, execution cost, and legal risk extremely low. Traditional analytics and third-party scripts were not viable due to performance and privacy constraints.

**Key decisions**
I designed a lightweight, CDN-delivered widget with strict limits on bundle size and execution overhead. Multiple brand variants were supported without duplicating code. Analytics were implemented using privacy-preserving Beacon APIs, optimizing for insight while minimizing data ingress, storage, and regulatory exposure.

**Outcome**
The system enabled large-scale rollout with predictable performance and compliant analytics, demonstrating careful balance between scale, branding, performance, and legal considerations.
