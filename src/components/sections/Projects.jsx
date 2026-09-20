import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA } from '../../data/projectsData';
import NotchedProjectCard from './NotchedProjectCard';

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ onOpenCaseStudy }) {
  const projectsList = Object.values(PROJECTS_DATA);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const tagEl = headerRef.current.querySelector('.tilted-tag-wrapper');
      const lines = headerRef.current.querySelectorAll('.title-line-inner');
      const vLines = sectionRef.current?.querySelectorAll('.canvas-grid-v-line');

      // 1. Tilted tape tag bounce-pop on scroll
      if (tagEl) {
        gsap.fromTo(
          tagEl,
          { opacity: 0.1, scale: 0.85, y: 18 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 2. Kinetic Headline Mask Reveal on scroll
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          {
            yPercent: 60,
            opacity: 0.1,
            filter: 'blur(3px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 3. Architectural vertical grid hairlines entrance
      if (vLines && vLines.length > 0) {
        gsap.fromTo(
          vLines,
          { opacity: 0.05, scaleY: 0.7 },
          {
            opacity: 1,
            scaleY: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    // Refresh ScrollTrigger to calculate accurate layout
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section featured-projects-section stack-section" id="work">

      {/* Background Matrix/Grid is handled via CSS */}
      <div className="projects-grid-overlay" aria-hidden="true">
        <div className="canvas-grid-pattern" />
        <div className="canvas-grid-v-line v-line-left" />
        <div className="canvas-grid-v-line v-line-center" />
        <div className="canvas-grid-v-line v-line-right" />
      </div>

      <div className="featured-projects-container">
        {/* Visual Climax Header (Matching Pic 2 Design & Pic 3 Animation) */}
        <div className="projects-climax-header" ref={headerRef}>
          <div className="tilted-tag-wrapper">
            <span className="tilted-tag">PROJECTS</span>
          </div>

          <h2 className="projects-huge-headline">
            <div className="title-line-mask">
              <span className="title-line-inner">SELECTED</span>
            </div>
            <div className="title-line-mask">
              <span className="title-line-inner">WORK<span className="title-accent">.</span></span>
            </div>
          </h2>
        </div>

        {/* Project Showcase Flow (Card + Text Beside on Laptop) */}
        <div className="featured-projects-flow">
          {projectsList.map((project, index) => (
            <NotchedProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenCaseStudy={onOpenCaseStudy}
              className="featured-project-row-item"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
