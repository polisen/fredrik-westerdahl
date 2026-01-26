# Fredrik Westerdahl
**Senior Software Engineer (Systems & Architecture)**

End-to-end problem solver designing, shipping, and operating production systems under real technical, product, and business constraints.

---

## Portfolio
Selected systems and platforms I’ve designed and delivered. Each case below is a concise, self-contained summary. Deeper technical and architectural thinking is expanded in related articles.

---

## Sublink — Co‑Founder & CTO
*Funded modular SaaS platform*

**Context**  
Sublink was a funded platform exploring modular content, identity, and social structures for creative work. I served as co‑founder and CTO with full ownership of technical architecture and production delivery.

**Problem**  
The core challenge was designing a system flexible enough to support multiple product directions while remaining maintainable under startup constraints such as limited resources, legal considerations, and evolving requirements.

**Key decisions**  
I designed a modular, domain‑driven architecture with clear boundaries and integration points, allowing features to evolve independently without collapsing into a monolith. Analytics, permissions, and external integrations were treated as first‑class concerns. I also scoped and coordinated deliverables from external consultants to maintain architectural coherence.

**Outcome**  
The platform was built and operated end‑to‑end under real constraints, demonstrating scalable system design, execution discipline, and technical ownership. The company was later dissolved, with IP retained.

→ Read article: *Architecture under startup uncertainty*

---

## Arbitrage Platform
*High‑throughput document analysis system*

**Context**  
The arbitrage platform was built to automatically surface time‑sensitive market opportunities by continuously ingesting and analyzing large volumes of unstructured documents across multiple sources.

**Problem**  
Processing hundreds of thousands of documents per day using AI‑based analysis quickly became cost‑prohibitive due to token overhead, instruction bloat, and inefficient context handling.

**Key decisions**  
I designed a high‑throughput ingestion pipeline with cost‑aware AI orchestration. A custom MCP‑based control layer handled context modeling, instruction reuse, and batching to keep inference predictable and scalable.

**Outcome**  
The system scaled document analysis while maintaining tight cost controls, demonstrating production‑grade AI system design under economic constraints.

→ Read article: *Designing cost‑aware AI pipelines at scale*

---

## Social Graph
*Graph‑based market and audience analysis*

**Context**  
This project focused on understanding market structure by modeling relationships between users, communities, and influence patterns.

**Problem**  
Traditional analytics failed to explain how influence and discovery propagated through the market, limiting the usefulness of demographic or funnel‑based approaches.

**Key decisions**  
I designed a graph‑based data model and applied community detection and centrality analysis to identify meaningful clusters and influential actors relevant to product and go‑to‑market strategy.

**Outcome**  
The system provided clearer insight into audience structure and influence, demonstrating the value of graph‑based architectures for strategic decision‑making.

→ Read article: *Using graph models to understand real markets*

---

## Renewcell / Circulose Toolkit
*High‑scale embeddable web system*

**Context**  
Renewcell required an embeddable solution to educate end‑users about a new textile material at the point of purchase, operating across third‑party websites with potentially millions of daily impressions.

**Problem**  
The challenge was delivering a branded, interactive experience at massive scale while keeping payload size, execution cost, and legal risk extremely low.

**Key decisions**  
I designed a lightweight, CDN‑delivered widget supporting multiple brand variants. Analytics were implemented using privacy‑preserving Beacon APIs, balancing insight with performance and regulatory constraints.

**Outcome**  
The system enabled large‑scale rollout with predictable performance and compliant analytics, balancing scale, branding, and legality.

→ Read article: *Embedding at scale under performance and legal constraints*

---

## Auction House Platform
*Domain‑specific production platform*

**Context**  
An early‑stage auction house startup required a production‑ready web platform tailored to live and online auction workflows, delivered under a strict budget.

**Problem**  
The system needed to support domain‑specific flows while remaining maintainable and cost‑efficient.

**Key decisions**  
I implemented a lean, domain‑aligned architecture with deliberate scoping to avoid unnecessary complexity while preserving future flexibility.

**Outcome**  
The platform was delivered as a live production system within budget, demonstrating pragmatic engineering and delivery discipline.

→ Read article: *Shipping production systems under tight constraints*

---

## How I Work
I design systems around constraints: performance, cost, legal boundaries, and change. I own frontend and backend execution end‑to‑end and treat analytics and feedback loops as core system components. AI is integrated as infrastructure—observable, cost‑aware, and replaceable—rather than novelty.

---

## Technical Scope
**Frontend:** React, Next.js, TypeScript  
**Backend & Infrastructure:** Firebase, Google Cloud Platform, Docker  
**Data:** GraphQL, Neo4j / Cypher, SQL  
**Analytics & Observability:** PostHog, Mixpanel, Sentry  
**AI Systems:** LLM APIs, MCP

---

## CV
→ Download PDF CV

---

## Contact
- Email: fredrik.westerdahl@email.com
- GitHub: https://github.com/polisen

