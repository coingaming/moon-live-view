// If your components require any hooks or custom uploaders, or if your pages
// require connect parameters, uncomment the following lines and declare them as
// such:
//
import Hooks from "./hooks";

(function () {
  function initGoogleAnalytics() {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-QBJ97ZRCSY";
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", "G-QBJ97ZRCSY");
  }

  if (
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    initGoogleAnalytics();
  }

  window.storybook = { Hooks };
  document.documentElement.dir = "ltr";

  window.addEventListener("phx:update", ({ target }) => {
    const { baseURI: to } = target;

    if (to.includes("theme=dark")) {
      localStorage.setItem("moon-theme", "dark");
      document.cookie = "moon-theme=dark; max-age=31536000; path=/";
      document.body.classList.remove("light-theme");
      document.body.classList.remove("[color-scheme:light]");
      document.body.classList.add("dark-theme");
      document.body.classList.add("dark");
      document.body.classList.add("[color-scheme:dark]");
    } else {
      localStorage.setItem("moon-theme", "light");
      document.cookie = "moon-theme=light; max-age=31536000; path=/";
      document.body.classList.remove("dark-theme");
      document.body.classList.remove("[color-scheme:dark]");
      document.body.classList.remove("dark");
      document.body.classList.add("light-theme");
      document.body.classList.add("[color-scheme:light]");
    }
  });
})();
