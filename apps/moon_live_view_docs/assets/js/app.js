// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix";
import { LiveSocket } from "phoenix_live_view";

// please note - events are added automatically with this import - few `window.addEventListener(...)`
// Also direction autoset is under the hood - see "Advanced tuning" section in docs/install.md for details
import hooks from "./hooks/index.js";

let csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");
let liveSocket = new LiveSocket("/live", Socket, {
  // longPollFallbackMs: 2500,
  hooks,
  params: {
    _csrf_token: csrfToken,
    theme: localStorage.getItem("moon-theme") || "light",
    dir: localStorage.getItem("moon-dir") || "ltr",
  },
  dom: {
    onBeforeElUpdated: (fromEl, toEl) => {
      // Required to make it works live navigation inside modal
      if (["DIALOG", "DETAILS"].indexOf(fromEl.tagName) >= 0) {
        Array.from(fromEl.attributes).forEach((attr) => {
          toEl.setAttribute(attr.name, attr.value);
        });
      }
    },
  },
});

window.addEventListener("phx:set_dir_layout", (event) => {
  if (event.detail.dir === "rtl") {
    document.documentElement.setAttribute("dir", "rtl");
    localStorage.setItem("moon-dir", "rtl");
    document.cookie = "moon-dir=rtl; max-age=31536000; path=/";
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    localStorage.setItem("moon-dir", "ltr");
    document.cookie = "moon-dir=ltr; max-age=31536000; path=/";
  }
});

window.addEventListener("phx:set_theme", (event) => {
  if (event.detail.theme === "dark") {
    localStorage.setItem("moon-theme", "dark");
    document.cookie = "moon-theme=dark; max-age=31536000; path=/";
    document.body.classList.remove("theme-moon-light");
    document.body.classList.remove("light-theme");
    document.body.classList.remove("[color-scheme:light]");
    document.body.classList.add("theme-moon-dark");
    document.body.classList.add("dark-theme");
    document.body.classList.add("dark");
    document.body.classList.add("[color-scheme:dark]");
  } else {
    localStorage.setItem("moon-theme", "light");
    document.cookie = "moon-theme=light; max-age=31536000; path=/";
    document.body.classList.remove("theme-moon-dark");
    document.body.classList.remove("dark-theme");
    document.body.classList.remove("[color-scheme:dark]");
    document.body.classList.remove("dark");
    document.body.classList.add("theme-moon-light");
    document.body.classList.add("light-theme");
    document.body.classList.add("[color-scheme:light]");
  }
});

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;

// Allows to execute JS commands from the server
window.addEventListener("phx:js-exec", ({ detail }) => {
  document.querySelectorAll(detail.to).forEach((el) => {
    liveSocket.execJS(el, el.getAttribute(detail.attr));
  });
});
