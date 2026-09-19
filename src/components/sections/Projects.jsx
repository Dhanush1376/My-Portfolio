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

      // 1. Tilted tape tag bounce-pop on scroll (Third pic animation)
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
              start: 'top 92%',
              once: true,
            },
          }
        );
      }

      // 2. Kinetic Headline Mask Reveal on scroll (Third pic animation)
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
              start: 'top 92%',
              once: true,
            },
          }
        );
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section why-projects-section stack-section" id="work">

      {/* Background Matrix/Grid is handled via CSS */}
      <div className="why-projects-grid-overlay" aria-hidden="true">
        <div className="why-grid-pattern" />
        <div className="why-grid-v-line v-line-left" />
        <div className="why-grid-v-line v-line-center" />
        <div className="why-grid-v-line v-line-right" />
      </div>

      <div className="why-projects-container">
        {/* Visual Climax Header (Matching Pic 2 Design & Pic 3 Animation) */}
        <div className="why-projects-climax-header" ref={headerRef}>
          <div className="tilted-tag-wrapper">
            <span className="tilted-tag">PROJECTS</span>
          </div>

          <h2 className="why-projects-huge-headline">
            <div className="title-line-mask">
              <span className="title-line-inner">SELECTED</span>
            </div>
            <div className="title-line-mask">
              <span className="title-line-inner">WORK<span className="title-accent">.</span></span>
            </div>
          </h2>
        </div>

        {/* Project Showcase Flow (Card + Text Beside on Laptop) */}
        <div className="why-projects-flow">
          {projectsList.map((project, index) => (
            <NotchedProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenCaseStudy={onOpenCaseStudy}
              className="why-project-row-item"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
