const generateSvgIcon = (name, iconPath = "") => {
  const fragment = document.createDocumentFragment();

  if (!name) {
    return fragment;
  }

  const iconUrl = iconPath
    ? `${iconPath}/${name}.svg#${name}`
    : `/moon_live_view/icons/${name}.svg#${name}`;

  const template = document.createElement("template");
  template.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <use href="${iconUrl}"></use>
  </svg>`;

  return fragment.appendChild(template.content.firstElementChild);
};

export default generateSvgIcon;
