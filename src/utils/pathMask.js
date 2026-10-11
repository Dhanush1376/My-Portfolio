/**
 * Shapes an element with an SVG path using a CSS mask instead of clip-path.
 *
 * Safari (iOS especially) stops repainting a playing <video> inside an ancestor clipped with
 * clip-path: path()/url(): the video keeps decoding but the frame on screen freezes until a touch
 * forces a repaint. Masks are composited on the GPU together with the video layer, so frames keep
 * flowing. Returns style props to spread onto the element (empty when there is no path yet).
 */
export function pathMaskStyle(d, width, height) {
  if (!d || !width || !height) return {};
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`;
  const image = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return {
    WebkitMaskImage: image,
    maskImage: image,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: '0 0',
    maskPosition: '0 0',
  };
}
