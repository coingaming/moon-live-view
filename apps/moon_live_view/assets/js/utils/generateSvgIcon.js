const generateSvgIcon = (name) => {
  const fragment = document.createDocumentFragment();

  if (!name) {
    return fragment;
  }

  const template = document.createElement("template");
  template.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <use href="/moon_assets/icons/${name}.svg#${name}"></use>
  </svg>`;

  return fragment.appendChild(template.content.firstElementChild);
};

export default generateSvgIcon;
