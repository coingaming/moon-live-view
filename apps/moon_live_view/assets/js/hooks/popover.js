// The duration of the popover animation in ms
const POPOVER_ANIMATION_DURATION = 200;
const TIMING_ANIMATION_EASE_STANDARD = "cubic-bezier(0.2, 0, 0.38, 0.9)";
/*
 * Skip Animation constant
 * ---------------
 * The keyframes and options for the skip animation
 * @type {Object}
 */
const POPOVER_SKIP_OPTS_NULL = {
  duration: 0,
  iterations: 1,
  easing: "linear",
};
/**
 * Entry animation constant
 * ---------------
 * The keyframes and options for the entry animation
 * @type {Object}
 */
const POPOVER_ENTRY_ANIMATION = {
  keyframes(origin = "top") {
    return [
      {
        opacity: 0,
        filter: "blur(1px)",
        top: origin === "top" ? "10px" : "-10px",
      },
      { opacity: 1, filter: "blur(0px)", top: "0px" },
    ];
  },
  opts: {
    duration: POPOVER_ANIMATION_DURATION,
    iterations: 1,
    easing: TIMING_ANIMATION_EASE_STANDARD,
  },
};
/**
 * Exit animation
 * ---------------
 *  The keyframes and options for the exit animation
 *  @type {Object}
 */
const POPOVER_EXIT_ANIMATION = {
  keyframes(origin = "top") {
    return [
      { filter: "blur(0px)", top: "0px", opacity: 1 },
      {
        filter: "blur(1px)",
        top: origin === "top" ? "3px" : "-3px",
        opacity: 0,
      },
    ];
  },
  opts: {
    duration: POPOVER_ANIMATION_DURATION,
    iterations: 1,
    easing: TIMING_ANIMATION_EASE_STANDARD,
  },
};

const Popover = {
  /**
   * Show the popover
   * -------------------
   * This function is called when the `mds:popover:show` event is fired
   *
   * @param {Event} Event
   * @returns {void}
   */
  show(event) {
    const target = this.getTarget(event);
    const currentSide = this.el.dataset.side || "bottom";

    // In case the target not found, throw an error
    if (!target) {
      throw Error("MDS Popover: Target not found");
      return; // Can't do anything without a target
    }

    // Fix multiple spam click
    if (this.closingTimeout) {
      clearTimeout(this.closingTimeout);
      this.closingTimeout = null;
    }

    // Calculate the position of the target
    const targetRect = target.getBoundingClientRect();

    this.applyCSSVars({
      anchorHeight: targetRect.height,
      anchorWidth: targetRect.width,
      top: targetRect.top,
      bottom: window.innerHeight - targetRect.bottom,
    });

    // Set the position of the popover
    this.el.style.transform = this.getTransform(targetRect);

    // Apply the entry animation
    this.el.animate(
      POPOVER_ENTRY_ANIMATION.keyframes(currentSide),
      this.el.dataset.skipAnimation === "true"
        ? POPOVER_SKIP_OPTS_NULL
        : POPOVER_ENTRY_ANIMATION.opts
    );
    requestAnimationFrame(() => {
      // Remove the class hidden
      this.el.classList.remove("hidden");
    });

    // Setup the dispose function, which have the event listener to hide the popover on click outside
    this.disposeFunc = this.dispose.bind(this);
    document.addEventListener("click", this.disposeFunc);

    // Setup the chase function, which have the event listener to chase the target on scroll
    this.chaseFunc = () => this.chase.bind(this)(target);

    // Add the event listener to chase the target on scroll
    window.addEventListener("scroll", this.chaseFunc);
    window.addEventListener("resize", this.chaseFunc);

    // Run the first chase
    requestAnimationFrame(() => this.chaseFunc());
    setTimeout(() => requestAnimationFrame(() => this.chaseFunc()), 400);

    // Set the state to visible
    this.el.dataset.state = "visible";
  },
  /**
   * Hide the popover
   * ----------------
   *
   *  @param {Event} Event
   *  @returns {void}
   */
  hide(event) {
    // Current Side
    const currentSide = this.el.dataset.side || "bottom";
    // On Close Callback
    const onCloseCallback = this.el.dataset.onClose;

    // Apply the exit animation
    this.el.animate(
      POPOVER_EXIT_ANIMATION.keyframes(currentSide),
      this.el.dataset.skipAnimation == "true"
        ? POPOVER_SKIP_OPTS_NULL
        : POPOVER_EXIT_ANIMATION.opts
    );

    if (this.closingTimeout) {
      clearTimeout(this.closingTimeout);
      this.closingTimeout = null;
    }

    // Apply the class hidden after the animation
    this.closingTimeout = setTimeout(() => {
      // Add the class hidden
      this.el.classList.add("hidden");
    }, POPOVER_ANIMATION_DURATION);

    // Remove the dispose function in case exists
    if (this.disposeFunc) {
      document.removeEventListener("click", this.disposeFunc);
      this.disposeFunc = null;
    }

    // Remove the chase function in case exists
    if (this.chaseFunc) {
      window.removeEventListener("scroll", this.chaseFunc);
      window.removeEventListener("resize", this.chaseFunc);
    }

    // Set the state to hidden
    this.el.dataset.state = "hidden";

    if (onCloseCallback && onCloseCallback !== "") {
      this.liveSocket.execJS(this.el, this.el.getAttribute("data-on-close"));
    }
  },
  /**
   * Toggle the popover visibility
   * -----------------------------
   *  @param {Event} Event
   *  @returns {void}
   */
  toggle(event) {
    if (this.el.dataset.state === "hidden") {
      this.show(event);
    } else {
      this.hide(event);
    }
  },

  /**
   * Get the transform property for the popover
   * -----------------------------------------
   *  @param {DOMRect} target
   *  @returns {string}
   *  @private
   */
  getTransform(targetRect) {
    const currentSide = this.el.dataset.side || "bottom";
    const currentAlign = this.getAlign();

    const currentOffset = parseInt(
      this.getElStyle(this.el).getPropertyValue(
        "--mds-popover-transform-origin"
      ) || "0"
    );
    const finalTransform = {
      top:
        currentSide === "top"
          ? targetRect.top - this.el.offsetHeight - 4
          : targetRect.top + targetRect.height + 4,
      left:
        ((clientWidth) => {
          if (currentAlign === "right") {
            return targetRect.left + targetRect.width - clientWidth;
          }

          if (currentAlign === "middle") {
            return targetRect.left + (targetRect.width - clientWidth) / 2;
          }

          return targetRect.left;
        })(this.el.clientWidth) || 0,
    };

    return `translate3d(${Math.ceil(finalTransform.left)}px, ${
      Math.ceil(finalTransform.top) + currentOffset
    }px, 0)`;
  },
  /**
   * Check if the direction is RTL
   *
   * @returns {Boolean}
   */
  isRTL() {
    return window.getComputedStyle(document.body).direction === "rtl";
  },
  /**
   * Get the current align based also on the RTL di
   */
  getAlign() {
    // Check if the direction is RTL
    const isRTL = this.isRTL();
    // Get the current align
    const currentAlign = this.el.dataset.align || "left";
    // Return the current align
    return isRTL ? (currentAlign === "left" ? "right" : "left") : currentAlign;
  },

  /**
   * Get Computed Style
   */
  getElStyle(el) {
    return window.getComputedStyle(el);
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
  /**
   * Should apply origin?
   * --------------------
   *  @param {Object} status
   *  @param {String} currentSide
   *  @param {Number} offsetHeight
   *  @returns {Boolean}
   *  @private
   */
  isOutsideViewport(status, currentSide, offsetHeight) {
    // Check if the popover is outside the viewport
    if (
      (status.availableSpaceTop <= offsetHeight && currentSide === "top") ||
      (status.availableSpaceBottom <= offsetHeight && currentSide === "bottom")
    ) {
      return true;
    }
    return false;
  },
  /**
   * Dispose the popover
   * -------------------
   *  @param {Event} Event
   *  @returns {void}
   */
  dispose(event) {
    // Ignore if the popover is hidden
    if (this.el.dataset.state == "hidden") {
      return;
    }

    const target = this.getTarget(event);
    if (!target) {
      // No Target
      return;
    }

    if (!!target.closest("[data-ignore-mds-popover-dispose]")) {
      return;
    }

    // Check if the target is a child of the popover, if not, hide the popover
    const isClosest = !!target.closest("#" + this.el.id);
    if (!isClosest) {
      this.hide(event);
    }
  },
  /**
   * This function is called when the window is scrolled and chase the viewport
   * --------------------------------------------------------------------------
   *  @param {HTMLElement} target
   *  @returns {void}
   */
  chase(target) {
    const targetRect = target.getBoundingClientRect();
    const currentSide = this.el.dataset.side || "bottom";
    const status = {
      anchorHeight: Math.round(targetRect.height),
      anchorWidth: Math.round(targetRect.width),
      top: Math.max(Math.round(targetRect.top), 0),
      bottom: Math.max(Math.round(window.innerHeight - targetRect.bottom), 0),
      left: Math.max(Math.round(targetRect.left), 0),
      right: Math.max(Math.round(window.innerWidth - targetRect.right), 0),
    };

    // Apply the status to the popover
    this.applyCSSVars(status);

    // Support for reverse side
    const transformHeight =
      currentSide === "top"
        ? this.el.offsetHeight + status.anchorHeight + 8
        : (this.el.offsetHeight + status.anchorHeight + 8) * -1;

    if (this.isOutsideViewport(status, currentSide, this.el.offsetHeight)) {
      this.el.style.setProperty(
        "--mds-popover-transform-origin",
        `${transformHeight}`
      );
      let offsetTop = status.availableSpaceTop - this.el.offsetHeight;
      if (currentSide === "top") {
        offsetTop = status.availableSpaceTop;
      }
      if (offsetTop < 0) {
        this.el.style.top = `${Math.abs(offsetTop)}px`;
      } else {
        this.el.style.top = "0px";
      }
    } else {
      this.el.style.setProperty("--mds-popover-transform-origin", "0");
      this.el.style.top = "0px";
    }

    // Apply the transform
    this.el.style.transform = this.getTransform(targetRect);
  },
  /**
   * Apply CSS Variables
   * -------------------
   *  @param {Object} values
   *  @returns {void}
   */
  applyCSSVars(values) {
    const style = this.el.style;
    const objectKeys = Object.keys(values);

    if (objectKeys.includes("anchorHeight"))
      style.setProperty(
        "--mds-popover-anchor-height",
        `${Math.round(values.anchorHeight)}px`
      );

    if (objectKeys.includes("anchorWidth"))
      style.setProperty(
        "--mds-popover-anchor-width",
        `${Math.round(values.anchorWidth)}px`
      );

    if (objectKeys.includes("top"))
      this.el.style.setProperty(
        "--mds-popover-available-space-top",
        `${Math.round(values.top)}px`
      );

    if (objectKeys.includes("bottom"))
      style.setProperty(
        "--mds-popover-available-space-bottom",
        `${Math.round(values.bottom)}px`
      );

    if (objectKeys.includes("right"))
      style.setProperty(
        "--mds-popover-available-space-right",
        `${Math.round(values.right)}px`
      );

    if (objectKeys.includes("left"))
      style.setProperty(
        "--mds-popover-available-space-left",
        `${Math.round(values.left)}px`
      );
  },
  /**
   * The mounted hook
   * -----------------
   * This function is called when the component is mounted
   *
   * @returns {void}
   */
  mounted() {
    // Define the show and hide functions
    this.showFunc = this.show.bind(this);
    this.hideFunc = this.hide.bind(this);
    this.toggleFunc = this.toggle.bind(this);

    // Add the event listeners
    this.el.addEventListener("mds:popover:show", this.showFunc);
    this.el.addEventListener("mds:popover:hide", this.hideFunc);
    this.el.addEventListener("mds:popover:toggle", this.toggleFunc);

    // Listen to the events (LiveView events)
    this.handleEvent("mds:popover:show", (event) => {
      const isMyEvent = "#" + this.el.id == event.id || this.el.id == event.id;
      if (isMyEvent) {
        this.show(event);
      }
    });
    this.handleEvent("mds:popover:hide", (event) => {
      const isMyEvent = "#" + this.el.id == event.id || this.el.id == event.id;
      if (isMyEvent) {
        this.hide(event);
      }
    });
    this.handleEvent("mds:popover:toggle", (event) => {
      const isMyEvent = "#" + this.el.id == event.id || this.el.id == event.id;
      if (isMyEvent) {
        this.toggle(event);
      }
    });

    // Setup the hover triggers
    this.hovers = [];

    // Setup the popover
    this.setup();

    // Check for initial status
    this.checkForInitialStatus();
  },
  /**
   * The destroyed hook
   * -------------------
   *  This function is called when the component is destroyed
   *  @returns {void}
   */
  destroyed() {
    this.el.removeEventListener("mds:popover:show", this.showFunc);
    this.el.removeEventListener("mds:popover:hide", this.hideFunc);
    this.el.removeEventListener("mds:popover:toggle", this.toggleFunc);

    // Destroy elements event listeners
    this.hovers.forEach((el) => {
      if (el) {
        el.removeEventListener("mouseenter", this.showFunc);
        el.removeEventListener("mouseleave", this.hideFunc);
      }
    });

    if (this.disposeFunc) {
      document.removeEventListener("click", this.disposeFunc);
    }
    if (this.chaseFunc) {
      window.removeEventListener("scroll", this.chaseFunc);
      window.removeEventListener("resize", this.chaseFunc);
    }
  },
  /**
   * Setup the popover
   * -----------------
   *  @returns {void}
   */
  setup() {
    // Setup the hover triggers
    document.querySelectorAll("[data-mds-popover-hover]").forEach((el) => {
      if (el.dataset.mdsPopoverHover === this.el.id) {
        el.addEventListener("mouseenter", this.showFunc);
        el.addEventListener("mouseleave", this.hideFunc);

        // Add the element to the hovers array to be destroyed later
        this.hovers.push(el);
      }
    });

    // Calculate the maximum z-index of the page
    let currentZIndex = 50;
    const treeWalker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT
    );

    /*
     * Limit to 5000 the max iterations
     * to avoid infinite loops
     */
    let maxBoundCycle = 0;
    while (treeWalker.nextNode() && maxBoundCycle < 5000) {
      currentZIndex = Math.max(
        currentZIndex,
        parseInt(this.getElStyle(treeWalker.currentNode).zIndex, 10) || 0
      );
      maxBoundCycle += 1;
    }

    if (currentZIndex >= 50) {
      this.el.style.zIndex = currentZIndex + 1;
    }
  },
  /**
   * This function is called when the component is created
   * -----------------------------------------------------
   */
  checkForInitialStatus() {
    // Get the target
    const target = this.el.dataset.popoverTarget;

    // Check if the popover should be visible
    if (this.el.dataset.initialState === "visible" && target) {
      this.show({ target });
    }
  },
};

export default Popover;
