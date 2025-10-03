const ResponsiveScreen = {
  mounted() {
    this.haveMin = !!this.el.dataset.min;
    this.haveMax = !!this.el.dataset.max;

    this.mediaQuery = this.genMediaQuery();

    // Sending the first event
    if (this.mediaQuery.matches) {
      this.pushEventTo(this.el, "show");
    }

    // Add the listener
    this.mediaQuery.addEventListener("change", ({ matches }) => {
      if (matches) {
        this.pushEventTo(this.el, "show");
      } else {
        this.pushEventTo(this.el, "hide");
      }
    });
  },
  updated() {
    if (this.mediaQuery.matches) {
      this.pushEventTo(this.el, "show");
    }
  },
  genMediaQuery() {
    if (this.haveMin && this.haveMax) {
      return window.matchMedia(
        `(min-width: ${this.el.dataset.min}px) and (max-width: ${this.el.dataset.max}px)`,
      );
    }
    if (this.haveMin) {
      return window.matchMedia(`(min-width: ${this.el.dataset.min}px)`);
    }
    if (this.haveMax) {
      return window.matchMedia(`(max-width: ${this.el.dataset.max}px)`);
    }

    return window.matchMedia(`(min-width: 1px)`);
  },
};
export default ResponsiveScreen;
