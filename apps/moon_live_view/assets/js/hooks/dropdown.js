const DROPDOWN_ANIMATION_DURATION = 200;
const DROPDOWN_TIMING_ANIMATION_EASE_STANDARD =
  "cubic-bezier(0.2, 0, 0.38, 0.9)";
const MIN_DROPDOWN_CONTENT = 150;
const DROPDOWN_SKIP_OPTS_NULL = {
  duration: 0,
  iterations: 1,
  easing: "linear",
};
const DROPDOWN_ENTER_ANIMATION = {
  keyframes: [
    { opacity: 0, filter: "blur(2px)", transform: "translateY(-10px)" },
    { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
  ],
  opts: {
    duration: DROPDOWN_ANIMATION_DURATION,
    easing: DROPDOWN_TIMING_ANIMATION_EASE_STANDARD,
  },
};

const DROPDOWN_LEAVE_ANIMATION = {
  keyframes: [
    { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
    { opacity: 0, filter: "blur(2px)", transform: "translateY(-10px)" },
  ],
  opts: {
    duration: DROPDOWN_ANIMATION_DURATION,
    easing: DROPDOWN_TIMING_ANIMATION_EASE_STANDARD,
  },
};

const MoonDropdown = {
  mounted() {
    this.toggleFunc = this.toggle.bind(this);
    this.keyDownFunc = this.onKeyDown.bind(this);

    this.el.addEventListener("mds:dropdown:toggle", this.toggleFunc);
    this.el.addEventListener("keydown", this.keyDownFunc);

    this.handleEvent("mds:dropdown:toggle", (event) => {
      const isMyEvent = "#" + this.el.id == event.id || this.el.id == event.id;
      if (isMyEvent) {
        this.toggle();
      }
    });

    this.disposeFunc = this.dispose.bind(this);
    this.chaseFunc = this.chase.bind(this);

    window.addEventListener("scroll", this.chaseFunc);
    window.addEventListener("resize", this.chaseFunc);
    document.addEventListener("click", this.disposeFunc);

    // Declare the dropdown state
    this.isOpen = false;

    // Parse initial state
    const isInitialOpen = this.el.dataset.initialState === "visible";
    if (isInitialOpen) {
      this.show(true);
    }
  },
  updated() {
    if (this.isOpen) {
      this.show(true);
    } else {
      this.hide(true);
    }
  },
  destroyed() {
    if (this.toggleFunc) {
      this.el.removeEventListener("mds:dropdown:toggle", this.toggleFunc);
    }
    if (this.disposeFunc) {
      document.removeEventListener("click", this.disposeFunc);
    }
    if (this.chaseFunc) {
      window.removeEventListener("scroll", this.chaseFunc);
      window.removeEventListener("resize", this.chaseFunc);
    }
    if (this.keyDownFunc) {
      this.el.removeEventListener("keydown", this.keyDownFunc);
    }
  },
  dispose(event) {
    const target = this.getTarget(event);

    const isClosest = !!target.closest("#" + this.el.id);
    if (!isClosest) {
      this.hide();
    }
  },
  /**
   * Get the target of the event
   * ---------------------------
   *  @param {Event} Event
   *  @returns {HTMLElement}
   *  @private
   */
  getTarget(event) {
    const target = event.detail?.dispatcher ?? event.target;
    if (typeof target === "string") {
      return document.querySelector(target);
    }
    return target;
  },
  toggle() {
    const dropdown = this.el.querySelector("[mds-dropdown-content]");
    if (dropdown.dataset.hidden === "true") {
      this.show();
    } else {
      this.hide();
    }
  },
  show(skipAnimation = false) {
    const dropdown = this.el.querySelector("[mds-dropdown-content]");
    const dropdownIcon = this.el.querySelector(".dropdown-select-icon");

    // Handle dropdown icon if it exists
    if (dropdownIcon) {
      dropdownIcon.classList.add("rotate-180");
      dropdownIcon.classList.remove("rotate-0");
    }

    dropdown.dataset.hidden = "false";
    this.chaseFunc();
    if (!skipAnimation) {
      dropdown.animate(
        DROPDOWN_ENTER_ANIMATION.keyframes,
        this.el.dataset.skipAnimation === "true"
          ? DROPDOWN_SKIP_OPTS_NULL
          : DROPDOWN_ENTER_ANIMATION.opts
      );
    }
    this.isOpen = true;
  },
  hide(skipAnimation = false) {
    const dropdown = this.el.querySelector("[mds-dropdown-content]");
    const dropdownIcon = this.el.querySelector(".dropdown-select-icon");

    // Handle dropdown icon if it exists
    if (dropdownIcon) {
      dropdownIcon.classList.add("rotate-0");
      dropdownIcon.classList.remove("rotate-180");
    }

    if (dropdown.dataset.hidden === "true" || !this.isOpen) {
      return;
    }
    if (!skipAnimation) {
      dropdown.animate(
        DROPDOWN_LEAVE_ANIMATION.keyframes,
        this.el.dataset.skipAnimation === "true"
          ? DROPDOWN_SKIP_OPTS_NULL
          : DROPDOWN_LEAVE_ANIMATION.opts
      );
    }

    setTimeout(
      () => {
        dropdown.dataset.hidden = "true";
        this.isOpen = false;
      },
      skipAnimation || this.el.dataset.skipAnimation === "true"
        ? 0
        : DROPDOWN_ANIMATION_DURATION
    );
  },
  /**
   * This function is called when the window is scrolled, and check the correct vertical side of Dropdown
   * @returns {void}
   */
  chase() {
    const dropdown = this.el.querySelector("[mds-dropdown-content]");
    const trigger = this.el.querySelector("[mds-dropdown-trigger]");

    if (dropdown.dataset.hidden === "true" || !dropdown || !trigger) {
      return;
    }

    const anchorRect = trigger.getBoundingClientRect();
    const selfRect = dropdown.getBoundingClientRect();

    const status = {
      anchorHeight: Math.round(anchorRect.height),
      dropdownHeight: Math.round(selfRect.height),
      dropdownWidth: Math.round(selfRect.width),
      availableSpaceTop: Math.max(Math.round(anchorRect.top), 0),
      availableSpaceBottom: Math.max(
        Math.round(window.innerHeight - anchorRect.bottom),
        0
      ),
    };
    if (status.dropdownHeight > status.availableSpaceBottom) {
      dropdown.style.top = `-${status.dropdownHeight + 8}px`;
    } else {
      dropdown.style.top = `${status.anchorHeight + 8}px`;
    }
  },
  onKeyDown(event) {
    const dropdown = document.getElementById(this.el.id);
    if (!dropdown) return;

    const dropdownContent = this.el.querySelector("[mds-dropdown-content]");
    if (!dropdownContent) return;

    const items = dropdownContent.querySelectorAll("li");
    if (!items.length) return;

    let currentIndex = Array.from(items).findIndex(
      (item) => item === document.activeElement
    );

    const showDropdown = () => {
      event.preventDefault();
      this.show();
    };

    const handleNavigation = (direction) => {
      event.preventDefault();
      currentIndex = (currentIndex + direction + items.length) % items.length;
      items[currentIndex].focus();
    };

    const handleSelection = () => {
      event.preventDefault();
      if (currentIndex !== -1) {
        items[currentIndex].click();
      }
      this.hide();
      dropdown.focus();
    };

    const hideDropdown = () => {
      event.preventDefault();
      this.hide();
    };

    switch (event.key) {
      case "ArrowDown":
        handleNavigation(1);
        break;
      case "ArrowUp":
        handleNavigation(-1);
        break;
      case "Enter":
      case " ":
        if (!this.isOpen) {
          showDropdown();
        } else {
          handleSelection();
        }
        break;
      case "Escape":
        hideDropdown();
        break;
    }
  },
};
export default MoonDropdown;
