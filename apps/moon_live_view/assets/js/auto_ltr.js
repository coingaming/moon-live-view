// Setting dir HTML attribute to html tag based on browser's settings - see "Advanced tuning" section in docs/install.md for details 
// and https://flowbite.com/docs/customize/rtl/

((el) => {
  if(!el.hasAttribute("dir"))
    el.setAttribute("dir", getComputedStyle(el).getPropertyValue('direction'));
})(document.documentElement);

  