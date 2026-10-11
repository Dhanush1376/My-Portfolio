import React from 'react';
import { MonitorSmartphone, Search, Plug, Code2 } from 'lucide-react';
import { getBrandIcon } from '../../data/brandIcons';
import { getToolBrandMeta } from '../service/serviceVisuals';

/**
 * Clean tech stack chips: no heavy cards, no drop shadows.
 * Each tool renders as a sleek pill chip with its official brand icon and name.
 */
export default function BrandStack({ tools }) {
  return (
    <ul className="pcs-stack-chips">
      {tools.map((tool, index) => {
        const brand = getBrandIcon(tool);
        const iconPath = brand?.path || getToolBrandMeta(tool, false).icon;
        const brandColor = brand?.hex || 'var(--accent)';
        return (
          <li
            key={tool}
            className="pcs-tech-chip"
            style={{ '--chip-color': brandColor, '--chip-i': index }}
          >
            <span className="pcs-tech-chip-icon" aria-hidden="true">
              {iconPath ? (
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d={iconPath} fill="currentColor" />
                </svg>
              ) : (
                <GenericMark name={tool} />
              )}
            </span>
            <span className="pcs-tech-chip-name">{tool}</span>
          </li>
        );
      })}
    </ul>
  );
}

function GenericMark({ name }) {
  const n = name.toLowerCase();
  if (n.includes('responsive')) return <MonitorSmartphone size={15} strokeWidth={2.2} />;
  if (n.includes('seo')) return <Search size={15} strokeWidth={2.2} />;
  if (n.includes('api')) return <Plug size={15} strokeWidth={2.2} />;
  return <Code2 size={15} strokeWidth={2.2} />;
}
