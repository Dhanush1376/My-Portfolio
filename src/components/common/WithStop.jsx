import React from 'react';

/**
 * Text ending in the round accent full stop. The dot is an inline-block (so it can be drawn as a
 * circle), and browsers may wrap before an inline-block, so the last word and the dot are glued
 * together in a no-wrap span and the dot never lands alone on a new line.
 */
export default function WithStop({ text = '', className = 'pcs-dot' }) {
  const value = String(text);
  const cut = value.lastIndexOf(' ') + 1;
  return (
    <>
      {value.slice(0, cut)}
      <span className="stop-nowrap">
        {value.slice(cut)}
        <span className={className}>.</span>
      </span>
    </>
  );
}
