import type { ProjectPreset } from "../types";

export const PRESETS: ProjectPreset[] = [
  {
    id: "autonomous-coder",
    name: "Autonomous Code Agent",
    icon: "Code2",
    description: "Multi-step pair programmer with file editing, test execution, and linter auto-correction loop.",
    defaultModel: "Claude 3.7 Sonnet (Thinking)",
    pattern: "Plan-and-Execute + ReAct",
    vectorDb: "pgvector (Hybrid Search)",
    capabilities: ["File System Access", "Terminal Execution", "AST Parser", "Self-Correction Loop"]
  },
  {
    id: "multimodal-research",
    name: "Multimodal Deep Research",
    icon: "Sparkles",
    description: "Extracts insights from PDFs, diagrams, live web queries, and synthesizes structured reports.",
    defaultModel: "Gemini 2.5 Pro",
    pattern: "Hierarchical Multi-Agent Swarm",
    vectorDb: "Pinecone Serverless",
    capabilities: ["Web Retrieval", "Vision OCR", "Citation Graph", "Markdown Report Synthesis"]
  },
  {
    id: "realtime-voice",
    name: "Realtime Voice Concierge",
    icon: "Mic",
    description: "Ultra-low latency bidirectional audio agent with tool calling and conversational interruptions.",
    defaultModel: "GPT-4o Realtime Audio",
    pattern: "Event-Driven State Machine",
    vectorDb: "Upstash Redis Vector",
    capabilities: ["Sub-300ms Audio Stream", "Function Calling", "Semantic Caching", "Emotion Modulation"]
  },
  {
    id: "enterprise-rag",
    name: "Enterprise Knowledge Forge",
    icon: "Database",
    description: "Private documentation Q&A with Cohere reranking, role-based access control, and audit logs.",
    defaultModel: "DeepSeek R1 + Claude 3.5",
    pattern: "Corrective RAG (CRAG)",
    vectorDb: "Qdrant Distributed",
    capabilities: ["Hybrid Dense/Sparse Search", "Reranker Model", "Access Control Lists", "Hallucination Scorer"]
  }
];
