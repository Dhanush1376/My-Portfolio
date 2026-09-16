import React from 'react';

export default function Journey() {
  const milestones = [
    {
      year: "2023",
      tag: "FOUNDATIONS",
      title: "Computer Science & Engineering Matriculation",
      institution: "Lovely Professional University",
      desc: "Immersed in systems engineering, low-level data structures, algorithmic complexity, relational databases, and computer networks."
    },
    {
      year: "2024",
      tag: "FULL-STACK ARCHITECTURE",
      title: "End-to-End Production Systems & Payment Webhooks",
      institution: "Commercial Platforms",
      desc: "Designed full-lifecycle commercial platforms with automated cart pipelines, cryptographic webhooks with Razorpay, and MongoDB database indexing."
    },
    {
      year: "2024",
      tag: "COMPUTER VISION & RAPID PROTOTYPING",
      title: "Edge Vision & Campus Hackathons",
      institution: "Engineering Projects",
      desc: "Built high-speed biometric face recognition attendance prototypes with OpenCV, dlib landmarks, and anti-spoof liveness detection."
    },
    {
      year: "2025",
      tag: "INTELLIGENT AI SYSTEMS",
      title: "RAG Pipelines, Vector Databases & Predictive Models",
      institution: "AI Systems Engineering",
      desc: "Constructed low-latency retrieval systems with ChromaDB and LangChain, automated NLP semantic resume parsers, and urban time-series forecasting models."
    },
    {
      year: "2026",
      tag: "PRESENT",
      title: "Independent Creative Technologist & Builder",
      institution: "Digital Product Studio",
      desc: "Engineering modern web products, intelligent systems, and bespoke digital experiences for founders, businesses, and engineering teams."
    }
  ];

  return (
    <section className="section journey-editorial-section" id="journey">

      <div className="journey-header">
        <div className="header-left">
          <span className="section-label">• 06 / JOURNEY &amp; TRAJECTORY</span>
          <h2 className="section-title">
            THE TECHNICAL <span className="title-accent">ARC.</span>
          </h2>
        </div>
        <p className="journey-header-desc">
          Key academic milestones, system breakthroughs, and engineering growth.
          Built without fabricated corporate titles or vanity metrics.
        </p>
      </div>

      {/* Editorial Timeline Grid */}
      <div className="journey-milestones-stream">
        {milestones.map((item, idx) => (
          <div className="milestone-row" key={idx}>
            <div className="milestone-year-col">
              <span className="m-year">{item.year}</span>
              <span className="m-tag">{item.tag}</span>
            </div>
            
            <div className="milestone-card">
              <div className="m-card-header">
                <h3 className="m-title">{item.title}</h3>
                <span className="m-inst">{item.institution}</span>
              </div>
              <p className="m-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
