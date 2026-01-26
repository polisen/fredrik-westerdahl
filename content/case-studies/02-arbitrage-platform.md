---

title: Arbitrage Platform
subtitle: High-throughput document analysis system
tagline: Designing cost-aware AI pipelines for large-scale document ingestion
order: 2
insightSlugs: ["cost-aware-ai-pipelines"]
theme:
  background: "#C3E9E3"
  foreground: "#0B1A17"
  primary: "#C3E9E3"
------------------

**Context**
The arbitrage platform was built to automatically surface time-sensitive market opportunities by continuously ingesting and analyzing large volumes of unstructured documents across multiple sources.

**Problem**
Processing hundreds of thousands of documents per day using AI-based analysis quickly became cost-prohibitive due to token overhead, instruction bloat, and inefficient context handling.

**Key decisions**
I designed a high-throughput ingestion pipeline with cost-aware AI orchestration. A custom MCP-based control layer handled context modeling, instruction reuse, and batching strategies to keep inference predictable and scalable.

**Outcome**
The system scaled document analysis while maintaining tight cost controls, demonstrating production-grade AI system design under economic constraints.
