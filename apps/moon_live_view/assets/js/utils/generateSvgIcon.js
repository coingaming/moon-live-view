// Only allows safe icon names: alphanumeric, dash, underscore.
function sanitizeIconName(name) {
  const SAFE_ICON_RE = /^[a-zA-Z0-9_\-]+$/;
  return SAFE_ICON_RE.test(name) ? name : '';
}

// Only allows iconPath with safe path segments (no '..', '<', '>', etc).
function sanitizeIconPath(iconPath) {
  // We'll allow empty string or safe path fragments.
  const SAFE_PATH_RE = /^[a-zA-Z0-9_\-\/]+$/;
  return SAFE_PATH_RE.test(iconPath) ? iconPath : '';
}

const generateSvgIcon = (name, iconPath = "") => {
  const fragment = document.createDocumentFragment();

  // Sanitize input
  const safeName = sanitizeIconName(name);
  const safeIconPath = sanitizeIconPath(iconPath);

  if (!safeName) {
    return fragment;
  }

  const iconUrl = safeIconPath
    ? `${safeIconPath}/${safeName}.svg#${safeName}`
    : `/moon_live_view/icons/${safeName}.svg#${safeName}`;

  // Instead of innerHTML, create elements safely:
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", iconUrl);
  svg.appendChild(use);

  return fragment.appendChild(svg);
};

export default generateSvgIcon;
