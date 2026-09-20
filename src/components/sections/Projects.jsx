import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA } from '../../data/projectsData';
import NotchedProjectCard from './NotchedProjectCard';

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ onOpenCaseStudy }) {
  const projectsList = Object.values(PROJECTS_DATA);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      const tagEl = headerRef.current.querySelector('.tilted-tag-wrapper');
      const lines = headerRef.current.querySelectorAll('.title-line-inner');

      // 1. Tilted tape tag bounce-pop on scroll
      if (tagEl) {
        gsap.fromTo(
          tagEl,
          { opacity: 0, scale: 0.65, y: 24, rotate: 8 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
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
            yPercent: 125,
            opacity: 0,
            rotate: 2.2,
            skewY: 1.2,
            filter: 'blur(6px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            skewY: 0,
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
    }, headerRef);

    // Refresh ScrollTrigger to calculate accurate layout with pinned sheets
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section className="section featured-projects-section stack-section" id="work">

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
