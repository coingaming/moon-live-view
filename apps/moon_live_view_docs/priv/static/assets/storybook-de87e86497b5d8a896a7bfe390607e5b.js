(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // js/hooks/CodePreview.js
  var CodePreview = {
    mounted() {
      this.button = this.el.querySelector("[data-code-preview-button]");
      this.wrapper = this.el.querySelector("[data-code-preview-wrapper]");
      this.toggleSpan = this.el.querySelector("#toggleSpan");
      this.buttonWrapper = this.el.querySelector(
        "[data-code-preview-button-wrapper]"
      );
      if (!this.hideButton()) {
        this.button.addEventListener("click", () => this.toggle());
      }
    },
    toggle() {
      if (this.wrapper.classList.contains("max-h-96")) {
        this.close();
      } else {
        this.open();
      }
    },
    open() {
      this.wrapper.classList.add("max-h-96", "overflow-auto");
      this.wrapper.classList.remove("max-h-space-128");
      this.buttonWrapper.classList.add("h-space-40", "[&_svg]:rotate-180");
      this.toggleSpan.textContent = "Collapse";
    },
    close() {
      this.wrapper.classList.remove("max-h-96", "overflow-auto");
      this.wrapper.classList.add("max-h-space-128");
      this.buttonWrapper.classList.remove("h-space-40", "[&_svg]:rotate-180");
      this.toggleSpan.textContent = "Expand";
    },
    hideButton() {
      const MIN_HEIGHT = 90;
      if (this.wrapper.clientHeight <= MIN_HEIGHT) {
        this.buttonWrapper.style.display = "none";
        return true;
      }
      return false;
    }
  };
  var CodePreview_default = CodePreview;

  // ../../moon-live/assets/js/hooks/accordion.js
  var TRANSITION_DURATION = 300;
  var TIMING_ANIMATION_EASE_EMPHASIZED = "cubic-bezier(0.4, 0.14, 0.3, 1)";
  var ACCORDION_OPENING = {
    container: {
      keyframes(px) {
        return {
          height: ["0px", `${px}px`]
        };
      },
      opts(px) {
        return {
          duration: TRANSITION_DURATION,
          easing: TIMING_ANIMATION_EASE_EMPHASIZED,
          iterations: 1
        };
      }
    },
    content: {
      keyframes: {
        opacity: [0, 1],
        filter: ["blur(1px)", "blur(0px)"]
      },
      opts(_px) {
        return {
          duration: TRANSITION_DURATION,
          easing: TIMING_ANIMATION_EASE_EMPHASIZED,
          iterations: 1
        };
      }
    }
  };
  var ACCORDION_CLOSING = {
    container: {
      keyframes(px) {
        return {
          height: [`${px}px`, "0px"]
        };
      },
      opts(px) {
        return {
          duration: TRANSITION_DURATION,
          easing: TIMING_ANIMATION_EASE_EMPHASIZED,
          iterations: 1
        };
      }
    },
    content: {
      keyframes: {
        opacity: [1, 0],
        filter: ["blur(0px)", "blur(1px)"]
      },
      opts(px) {
        return {
          duration: TRANSITION_DURATION,
          easing: TIMING_ANIMATION_EASE_EMPHASIZED,
          iterations: 1
        };
      }
    }
  };
  var Accordion = {
    /**
     * Mounting Hook
     */
    mounted() {
      this.currentlyOpen = /* @__PURE__ */ new Set();
      this.items = /* @__PURE__ */ new Set();
      this.mode = this.el.getAttribute("data-mode") || "single";
      this.scanForItems();
    },
    /**
     * Updated Hook
     */
    updated() {
      this.scanForItems();
    },
    /**
     * Destroyed Hook
     */
    destroyed() {
      if (this.items && this.items.size > 0) {
        this.items.forEach((item) => {
          if (!item || !item.id || !item.funcToggle) {
            return;
          }
          const { id, funcToggle } = item;
          const itemToRemove = document.getElementById(id);
          if (itemToRemove) {
            itemToRemove.removeEventListener("click", funcToggle);
          }
        });
        this.items.clear();
      }
    },
    /**
     * Scan for Accordion Items, this is called on mounted and updated
     *
     */
    scanForItems() {
      if (this.items && this.items.size > 0) {
        this.items.forEach((item) => {
          if (!item || !item.id || !item.funcToggle) {
            return;
          }
          const { id, funcToggle } = item;
          const itemParent = document.getElementById(id);
          if (itemParent) {
            const itemToRemove = itemParent.querySelector(
              "[mds-accordion-header]"
            );
            itemToRemove.removeEventListener("click", funcToggle);
          }
        });
        this.items.clear();
      }
      const newItems = /* @__PURE__ */ new Set();
      let i = 0;
      for (let item of this.el.querySelectorAll("[mds-accordion-item]")) {
        if (i > 1e4) {
          break;
        }
        i += 1;
        const id = item.getAttribute("mds-accordion-item");
        if (item.getAttribute("aria-expanded") === "true") {
          this.currentlyOpen.add(id);
          if (this.mode == "single" && this.currentlyOpen.size > 1) {
            this.close(id);
          }
        }
        const obj = { id, funcToggle: () => this.toggle(id) };
        if (!newItems.has(obj)) {
          newItems.add(obj);
        }
      }
      this.items = newItems;
      this.setup();
    },
    /**
     * Setup the Accordion Items click events
     *
     */
    setup() {
      this.items.forEach(({ id, funcToggle }) => {
        const item = document.getElementById(id);
        if (!item)
          return;
        const header = item.querySelector("[mds-accordion-header]");
        if (header) {
          header.addEventListener("click", funcToggle);
        }
      });
      this.el.addEventListener("mds::accordion:open", (e) => {
        const indexToOpen = e.detail.index;
        const item = this.utils.setAt(this.items, indexToOpen);
        if (item) {
          this.open(item.id);
        }
      });
      this.el.addEventListener("mds::accordion:close", (e) => {
        const indexToOpen = e.detail.index;
        const item = this.utils.setAt(this.items, indexToOpen);
        if (item) {
          this.close(item.id);
        }
      });
      this.el.addEventListener("mds::accordion:toggle", (e) => {
        const indexToOpen = e.detail.index;
        const item = this.utils.setAt(this.items, indexToOpen);
        if (item && item.funcToggle) {
          item.funcToggle();
        }
      });
    },
    toggle(id) {
      const itemEl = document.getElementById(id);
      const isOpen = itemEl.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        this.close(id);
      } else {
        this.open(id);
      }
    },
    /**
     * Open an Accordion Item
     * */
    open(id) {
      const buttonEl = document.getElementById(id);
      const contentEl = buttonEl.querySelector("[mds-accordion-content]");
      const innerContentEl = contentEl.querySelector(
        "[mds-accordion-inner-content]"
      );
      const gradientEl = contentEl.querySelector("[mds-accordion-gradient]");
      if (!contentEl || this.currentlyOpen.has(id)) {
        return;
      }
      const px = this.cloneAndCalculateHeight(contentEl);
      gradientEl.style.opacity = "1";
      if (this.mode === "single") {
        this.currentlyOpen.forEach((openId) => {
          this.close(openId);
        });
      }
      contentEl.animate(
        ACCORDION_OPENING.container.keyframes(px),
        ACCORDION_OPENING.container.opts(px)
      );
      innerContentEl.animate(
        ACCORDION_OPENING.content.keyframes,
        ACCORDION_OPENING.content.opts(px)
      );
      buttonEl.setAttribute("aria-expanded", "true");
      contentEl.setAttribute("data-open", "true");
      const svg_list = buttonEl.querySelectorAll("svg");
      svg_list.forEach((svg) => {
        if (svg) {
          svg.dataset.open = "true";
        }
      });
      if (TRANSITION_DURATION - 300 < 0) {
        gradientEl.style.opacity = "0";
      } else {
        setTimeout(() => {
          gradientEl.style.opacity = "0";
        }, TRANSITION_DURATION - 300);
      }
      this.currentlyOpen.add(id);
    },
    /**
     * Close an Accordion Item
     * */
    close(id) {
      const buttonEl = document.getElementById(id);
      const contentEl = buttonEl.querySelector("[mds-accordion-content]");
      if (!contentEl || this.currentlyOpen.has(id) === false) {
        return;
      }
      const innerContentEl = contentEl.querySelector(
        "[mds-accordion-inner-content]"
      );
      const gradientEl = contentEl.querySelector("[mds-accordion-gradient]");
      const px = contentEl.offsetHeight + this.utils.getPaddingSizeAccordion(contentEl);
      gradientEl.style.opacity = "1";
      contentEl.animate(
        ACCORDION_CLOSING.container.keyframes(px),
        ACCORDION_CLOSING.container.opts(px)
      );
      innerContentEl.animate(
        ACCORDION_CLOSING.content.keyframes,
        ACCORDION_CLOSING.content.opts(px)
      );
      const svg_list = buttonEl.querySelectorAll("svg");
      svg_list.forEach((svg) => {
        if (svg) {
          svg.dataset.open = "false";
        }
      });
      setTimeout(() => {
        buttonEl.setAttribute("aria-expanded", "false");
        contentEl.setAttribute("data-open", "false");
        this.currentlyOpen.delete(id);
        gradientEl.style.opacity = "0";
      }, TRANSITION_DURATION - 20);
    },
    utils: {
      convertRemToPixels(rem) {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
      },
      // Small Utils to fetch the element in the index from the set
      setAt(set, index) {
        if (Math.abs(index) > set.size) {
          return null;
        }
        let idx = index;
        if (idx < 0) {
          idx = set.size + index;
        }
        let counter = 0;
        for (const elem of set) {
          if (counter == idx) {
            return elem;
          }
          counter += 1;
        }
        return null;
      },
      getPaddingSizeAccordion(el) {
        let rem = window.getComputedStyle(el).getPropertyValue("--mds-accordion-padding");
        if (!rem || typeof rem !== "string") {
          return 0;
        }
        rem = rem.trim().replace("rem", "");
        return this.convertRemToPixels(parseFloat(rem));
      }
    },
    cloneAndCalculateHeight(element) {
      const clone = element.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.top = "-9999px";
      clone.style.left = "-9999px";
      clone.style.maxHeight = "4000px";
      clone.style.visibility = "hidden";
      clone.style.display = "block";
      clone.style.width = element.parentElement.offsetWidth + "px";
      clone.style.height = "auto";
      const parentPaddingVar = window.getComputedStyle(element.parentElement).getPropertyValue("--mds-accordion-padding");
      if (parentPaddingVar) {
        clone.style.setProperty(
          "--mds-accordion-padding",
          parentPaddingVar.trim()
        );
      }
      const tw = document.createTreeWalker(clone, NodeFilter.SHOW_ALL);
      let i = 0;
      while (tw.nextNode() && i < 1e3) {
        i++;
        const node = tw.currentNode;
        if (node.nodeType !== Node.ELEMENT_NODE) {
          continue;
        }
        if (typeof node.removeAttribute === "function") {
          node.removeAttribute("id");
          node.removeAttribute("name");
        }
      }
      document.body.appendChild(clone);
      const height = clone.offsetHeight;
      clone.remove();
      return height;
    }
  };
  var accordion_default = Accordion;

  // ../../moon-live/assets/js/hooks/authenticator.js
  var Authenticator = {
    mounted() {
      this.updateInputs();
    },
    updated() {
      this.updateInputs();
    },
    destroyed() {
      this.teardown();
    },
    updateInputs() {
      this.teardown();
      this.initializeInputs();
      this.setFocusOnFirstInputIfNeeded();
    },
    initializeInputs() {
      this.inputs = this.el.querySelectorAll("input");
      this.callback = this.el.dataset.callback;
      this.codeLength = this.inputs.length;
      this.eventListeners = [];
      this.inputs.forEach((input, index) => {
        this.bindListener(input, "input", (e) => this.handleInput(e, index));
        this.bindListener(input, "keydown", (e) => this.handleKeyDown(e, index));
        this.bindListener(input, "paste", (e) => this.handlePaste(e));
      });
    },
    setFocusOnFirstInputIfNeeded() {
      const active = document.activeElement;
      const shouldFocus = this.inputs.length > 0 && (active === document.body || Array.from(this.inputs).includes(active)) && Array.from(this.inputs).every((i) => !i.value);
      if (shouldFocus) {
        this.inputs[0].focus();
      }
    },
    bindListener(input, event, handler) {
      input.addEventListener(event, handler);
      this.eventListeners.push({ input, event, handler });
    },
    teardown() {
      if (!this.eventListeners)
        return;
      this.eventListeners.forEach(({ input, event, handler }) => {
        input.removeEventListener(event, handler);
      });
      this.eventListeners = [];
    },
    getCode() {
      return Array.from(this.inputs).map((i) => i.value).join("");
    },
    reset() {
      this.inputs.forEach((i) => i.value = "");
      this.inputs[0].focus();
    },
    handleInput(e, index) {
      const input = e.target;
      const val = input.value.toUpperCase();
      input.value = val;
      if (val && index < this.inputs.length - 1) {
        this.inputs[index + 1].focus();
      }
      const code = this.getCode();
      if (code.length === this.codeLength && this.callback) {
        this.pushEvent(this.callback, { code });
      }
    },
    handleKeyDown(e, index) {
      const input = e.target;
      if ((e.key === "Backspace" || e.key === "Delete") && input.value === "" && index > 0) {
        this.inputs[index - 1].focus();
      }
    },
    handlePaste(e) {
      const pasted = e.clipboardData.getData("text").slice(0, this.codeLength).toUpperCase();
      this.inputs.forEach((input, i) => {
        input.value = pasted[i] || "";
      });
      const lastIndex = pasted.length - 1;
      if (lastIndex >= 0 && lastIndex < this.inputs.length) {
        this.inputs[lastIndex].focus();
      }
      if (pasted.length === this.codeLength && this.callback) {
        this.pushEvent(this.callback, { code: pasted });
      }
    }
  };
  var authenticator_default = Authenticator;

  // ../../moon-live/assets/js/constants/variables.js
  var SCROLL_LOCK_CLASS = "moonds-scroll-lock";
  var DRAWER_ANIMATION_DURATION = 400;
  var DRAWER_ANIMATION_OPTS_NULL = { duration: 0, iterations: 1 };
  var TIMING_ANIMATION_EASE_STANDARD = "cubic-bezier(0.2, 0, 0.38, 0.9)";
  var TIMING_ANIMATION_EASE_EMPHASIZED2 = "cubic-bezier(0.4, 0.14, 0.3, 1)";
  var DRAWER_ENTRY_ANIMATION = {
    parent: {
      keyframes: [
        { transform: "translateX(calc(var(--moonds-translate-direction)*100%))" },
        { transform: "translateX(0)" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_STANDARD
      }
    },
    child: {
      keyframes: [
        { transform: "translate3d(30px, 0, 0)", opacity: 0, filter: "blur(2px)" },
        { transform: "translateX(0)", opacity: 1, filter: "blur(0)" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_EMPHASIZED2
      }
    }
  };
  var DRAWER_EXIT_ANIMATION = {
    parent: {
      keyframes: [
        { transform: "translateX(0)" },
        { transform: "translateX(calc(var(--moonds-translate-direction)*100%))" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_STANDARD
      }
    },
    child: {
      keyframes: [
        { transform: "translate3d(0, 0, 0)", opacity: 1, filter: "blur(0)" },
        { transform: "translate3d(30px, 0, 0)", opacity: 0, filter: "blur(2px)" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_EMPHASIZED2
      }
    }
  };
  var BOTTOMSHEET_ENTRY_ANIMATION = {
    parent: {
      keyframes: [
        { transform: "translateY(100%)" },
        { transform: "translateY(0)" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_STANDARD
      }
    },
    child: {
      keyframes: [
        { transform: "translate3d(0, 30px, 0)", opacity: 0, filter: "blur(2px)" },
        { transform: "translateY(0)", opacity: 1, filter: "blur(0)" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_EMPHASIZED2
      }
    }
  };
  var BOTTOMSHEET_EXIT_ANIMATION = {
    parent: {
      keyframes(y = 0) {
        return [
          { transform: `translateY(${y}px)` },
          { transform: "translateY(100%)" }
        ];
      },
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_STANDARD
      }
    },
    child: {
      keyframes: [
        { transform: "translate3d(0, 0, 0)", opacity: 1, filter: "blur(0)" },
        { transform: "translate3d(0, 0, 0)", opacity: 0, filter: "blur(2px)" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_EMPHASIZED2
      }
    }
  };
  var MODAL_ENTRY_ANIMATION = {
    parent: {
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_STANDARD
      }
    },
    child: {
      keyframes: [
        { transform: "translate3d(0, 0, 0)", opacity: 0, filter: "blur(2px)" },
        { transform: "translate3d(0, 0, 0)", opacity: 1, filter: "blur(0)" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_EMPHASIZED2
      }
    }
  };
  var MODAL_EXIT_ANIMATION = {
    parent: {
      keyframes: [{ opacity: 1 }, { opacity: 0 }],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_STANDARD
      }
    },
    child: {
      keyframes: [
        { transform: "translate3d(0, 0, 0)", opacity: 1, filter: "blur(0)" },
        { transform: "translate3d(0, 0, 0)", opacity: 0, filter: "blur(2px)" }
      ],
      opts: {
        duration: DRAWER_ANIMATION_DURATION,
        iterations: 1,
        easing: TIMING_ANIMATION_EASE_EMPHASIZED2
      }
    }
  };

  // ../../moon-live/assets/js/hooks/drawer.js
  var Drawer = {
    /**
     * Mount Function - Called when the LiveView is mounted
     *
     * @returns {void}
     */
    mounted() {
      this.setupLockers();
      this.setup();
      this.initialState = this.utils.getData(this.el, "initial-state") || "closed";
      this.isDisabledDialog = this.el.dataset.disabledNativeDialog === "true";
      if (this.initialState === "open") {
        this.open();
      } else {
        this.close(true);
      }
      if (this.el.dataset.mode === "bottomsheet") {
        this._onResize = () => {
          this.bottomSheetEventsConditional();
        };
      }
    },
    /**
     * The `updated` hook is called after the LiveView has been updated and
     * the DOM has been patched.
     *
     * @returns {void}
     */
    updated() {
      const currentInitialState = this.utils.getData(this.el, "initial-state");
      if (this.initialState !== currentInitialState && currentInitialState == "open") {
        this.open(true, false);
      } else if (window.mdsDrawerLocks.has(this.el.id)) {
        this.open(true, false);
      }
    },
    /**
     * Destroyed hook
     *
     * @returns {void}
     *
     */
    destroyed() {
      if (this._onResize) {
        window.removeEventListener("resize", this._onResize);
      }
    },
    /**
     * Open Function
     *
     * @param {boolean} skipEvents
     * @param {boolean} haveTransition
     * @returns {void}
     *
     * @private
     */
    open(skipEvents = false, haveTransition = true) {
      if (this.isTransitioning)
        return;
      this.runSafetyChecks();
      this.currentY = 0;
      const content = document.getElementById(this.el.dataset.contentId);
      const mode = this.el.dataset.mode;
      this.isOpened = true;
      if (!window.mdsDrawerLocks.has(this.el.id)) {
        window.mdsDrawerLocks.add(this.el.id);
      }
      this.setupDragEvents();
      this.liveSocket.execJS(this.el, this.el.dataset.moonOpen);
      this.lockBodyScrolling(this.el);
      if (this.el.dataset.mode === "bottomsheet" && typeof this._onResize === "function") {
        window.addEventListener("resize", this._onResize);
      }
      if (haveTransition) {
        this.el.dataset.isTransitioning = "open";
        this.isTransitioning = true;
      }
      this.animate(content, mode, "open", !haveTransition);
      if (this.isDisabledDialog) {
        requestAnimationFrame(() => this.el.classList.remove("hidden"));
      } else {
        this.el.showModal();
      }
      setTimeout(() => {
        if (!haveTransition)
          return;
        this.el.dataset.isTransitioning = "none";
        this.isTransitioning = false;
        if (!skipEvents) {
          const event = new CustomEvent("moonds:drawer:opened", {
            detail: { id: this.el.id }
          });
          window.dispatchEvent(event);
          const firstButton = this.el.querySelector("button");
          if (firstButton)
            firstButton.focus();
        }
      }, this.transitionDuration);
    },
    /**
     * Close Function
     * @param {boolean} skipEvents
     * @returns {void}
     * @private
     */
    close(skipEvents = false, haveTransition = true) {
      if (this.isTransitioning)
        return;
      if (this.el.dataset.forceOpen === "true")
        return;
      this.runSafetyChecks();
      const content = document.getElementById(this.el.dataset.contentId);
      const mode = this.el.dataset.mode;
      this.removeDragEvents();
      if (this.el.dataset.moonClose && this.isDisabledDialog) {
        this.liveSocket.execJS(this.el, this.el.dataset.moonClose);
      }
      if (haveTransition) {
        this.el.dataset.isTransitioning = "close";
        this.isTransitioning = true;
      }
      if (this.el.dataset.mode === "bottomsheet" && typeof this._onResize === "function") {
        window.removeEventListener("resize", this._onResize);
      }
      this.animate(content, mode, "close", !haveTransition);
      setTimeout(() => {
        this.isTransitioning = false;
        if (window.mdsDrawerLocks.has(this.el.id)) {
          window.mdsDrawerLocks.delete(this.el.id);
        }
        if (this.isDisabledDialog) {
          this.el.classList.add("hidden");
        } else {
          this.el.close();
        }
        this.unlockBodyScrolling(this.el);
        if (haveTransition) {
          this.el.dataset.isTransitioning = "none";
          this.isTransitioning = false;
        }
      }, this.transitionDuration - 20);
      if (skipEvents)
        return;
      if (this.el.dataset.onClose && this.el.dataset.onClose !== "") {
        this.liveSocket.execJS(this.el, this.el.getAttribute("data-on-close"));
      }
      setTimeout(() => {
        const event = new CustomEvent("moonds:drawer:closed", {
          detail: { id: this.el.id }
        });
        window.dispatchEvent(event);
      }, this.transitionDuration);
    },
    /**
     * Setup Lockers
     * @returns {void}
     * @private
     */
    setupLockers() {
      if (typeof window.mdsScrollLocks === "undefined") {
        window.mdsScrollLocks = /* @__PURE__ */ new Set();
      }
      if (typeof window.mdsDrawerLocks === "undefined") {
        window.mdsDrawerLocks = /* @__PURE__ */ new Set();
      }
    },
    /**
     * Setup
     * @returns {void}
     * @private
     */
    setup() {
      this.el.addEventListener("moonds:drawer:open", () => {
        this.open();
      });
      this.el.addEventListener("moonds:drawer:close", () => {
        this.close(false);
      });
      this.handleEvent("moonds:drawer:open", (event) => {
        const isMyEvent = "#" + this.el.id == event.id || this.el.id == event.id;
        if (isMyEvent) {
          this.open();
        }
      });
      this.handleEvent("moonds:drawer:close", (event) => {
        const isMyEvent = "#" + this.el.id == event.id || this.el.id == event.id;
        if (isMyEvent) {
          this.close(false);
        }
      });
      this.el.addEventListener("click", (e) => {
        if (e.target.id === this.el.id) {
          this.close();
        }
      });
      this.transitionDuration = DRAWER_ANIMATION_DURATION;
      if (!this.isDisabledDialog) {
        this.el.addEventListener("close", () => {
          this.unlockBodyScrolling(this.el);
          if (this.el.dataset.moonClose) {
            this.liveSocket.execJS(this.el, this.el.dataset.moonClose);
          }
        });
      }
    },
    /**
     * Setup Drag Events
     * @returns {void}
     * @private
     */
    setupDragEvents() {
      if (this.el.dataset.mode !== "bottomsheet")
        return;
      if (this._dragEventsSetup === true)
        return;
      const isModal = this.isBottomSheetAModal();
      if (isModal) {
        this.removeDragEvents();
        return;
      }
      this._dragEventsSetup = true;
      const content = document.getElementById(this.el.dataset.contentId);
      this._onPress = this.onPress.bind(this);
      this._onRelease = this.onRelease.bind(this);
      this._onDrag = this.onDrag.bind(this);
      content.addEventListener("touchstart", this._onPress);
      content.addEventListener("touchend", this._onRelease);
      content.addEventListener("touchmove", this._onDrag);
    },
    /**
     * Simple runner which attach or detach events drag on resize
     * */
    bottomSheetEventsConditional() {
      if (this.el.dataset.mode !== "bottomsheet") {
        return;
      }
      const isModal = this.isBottomSheetAModal();
      if (isModal) {
        this.removeDragEvents();
      } else {
        this.setupDragEvents();
      }
    },
    /**
     * Remove Drag Events
     * @returns {void}
     * @private
     */
    removeDragEvents() {
      if (this.el.dataset.mode !== "bottomsheet" && this._dragEventsSetup)
        return;
      const content = document.getElementById(this.el.dataset.contentId);
      if (this._onPress) {
        content.removeEventListener("touchstart", this._onPress);
      }
      if (this._onRelease) {
        content.removeEventListener("touchend", this._onRelease);
      }
      if (this._onDrag) {
        content.removeEventListener("touchmove", this._onDrag);
      }
      this._dragEventsSetup = false;
    },
    /**
     * Should be a Modal or a BottomSheet?
     * @returns {boolean}
     * @private
     */
    isBottomSheetAModal() {
      return this.el.dataset.mode === "bottomsheet" && window.getComputedStyle(this.el).getPropertyValue("--isDesktop") === "1";
    },
    /**
     * Run safety checks
     */
    runSafetyChecks() {
      if (this.runSafetyCheckTimeout)
        clearTimeout(this.runSafetyCheckTimeout);
      this.runSafetyCheckTimeout = setTimeout(() => {
        this.isTransitioning = false;
      }, this.transitionDuration + 150);
    },
    /**
     * Animate (Drawer)
     */
    animateDrawer(el, innerContent, direction, skipAnimation) {
      if (direction === "open") {
        el.animate(
          DRAWER_ENTRY_ANIMATION.parent.keyframes,
          skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : DRAWER_ENTRY_ANIMATION.parent.opts
        );
        if (this.isDisabledDialog) {
          const animateBackdrop = this.el.querySelector("[data-moon-backdrop]");
          if (animateBackdrop)
            animateBackdrop.animate(
              [{ opacity: 0 }, { opacity: 1 }],
              skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : {
                duration: DRAWER_ANIMATION_DURATION,
                iterations: 1,
                easing: TIMING_ANIMATION_EASE_STANDARD
              }
            );
        }
        if (innerContent) {
          innerContent.animate(
            DRAWER_ENTRY_ANIMATION.child.keyframes,
            skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : DRAWER_ENTRY_ANIMATION.child.opts
          );
        }
      } else {
        el.animate(
          DRAWER_EXIT_ANIMATION.parent.keyframes,
          skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : DRAWER_EXIT_ANIMATION.parent.opts
        );
        if (this.isDisabledDialog) {
          const animateBackdrop = this.el.querySelector("[data-moon-backdrop]");
          if (animateBackdrop)
            animateBackdrop.animate(
              [{ opacity: 1 }, { opacity: 0 }],
              skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : {
                duration: DRAWER_ANIMATION_DURATION,
                iterations: 1,
                easing: TIMING_ANIMATION_EASE_STANDARD
              }
            );
        }
        if (innerContent) {
          innerContent.animate(
            DRAWER_EXIT_ANIMATION.child.keyframes,
            skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : DRAWER_EXIT_ANIMATION.child.opts
          );
        }
      }
    },
    /**
     * Animate (Bottomsheet)
     */
    animateBottomSheet(el, innerContent, direction, skipAnimation) {
      if (direction === "open") {
        el.animate(
          BOTTOMSHEET_ENTRY_ANIMATION.parent.keyframes,
          skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : BOTTOMSHEET_ENTRY_ANIMATION.parent.opts
        );
        if (innerContent) {
          innerContent.animate(
            BOTTOMSHEET_ENTRY_ANIMATION.child.keyframes,
            skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : BOTTOMSHEET_ENTRY_ANIMATION.child.opts
          );
        }
      } else {
        el.animate(
          BOTTOMSHEET_EXIT_ANIMATION.parent.keyframes(this.currentY),
          skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : BOTTOMSHEET_EXIT_ANIMATION.parent.opts
        );
        if (this.currentY > 0)
          this.currentY = 0;
        if (innerContent) {
          innerContent.animate(
            BOTTOMSHEET_EXIT_ANIMATION.child.keyframes,
            skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : BOTTOMSHEET_EXIT_ANIMATION.child.opts
          );
        }
      }
    },
    /**
     * Animate (Modal)
     */
    animateModal(el, innerContent, direction, skipAnimation) {
      if (direction === "open") {
        this.el.animate(
          MODAL_ENTRY_ANIMATION.parent.keyframes,
          skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : MODAL_ENTRY_ANIMATION.parent.opts
        );
        if (innerContent) {
          innerContent.animate(
            MODAL_ENTRY_ANIMATION.child.keyframes,
            skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : MODAL_ENTRY_ANIMATION.child.opts
          );
        }
      } else {
        this.el.animate(
          MODAL_EXIT_ANIMATION.parent.keyframes,
          skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : MODAL_EXIT_ANIMATION.parent.opts
        );
        if (innerContent) {
          innerContent.animate(
            MODAL_EXIT_ANIMATION.child.keyframes,
            skipAnimation ? DRAWER_ANIMATION_OPTS_NULL : MODAL_EXIT_ANIMATION.child.opts
          );
        }
      }
    },
    /**
     * Animate func
     */
    animate(el, mode, direction, skipAnimation = false) {
      const innerContent = el.querySelector("[data-mds-inner-content]");
      switch (mode) {
        case "drawer":
          this.animateDrawer(el, innerContent, direction, skipAnimation);
          break;
        case "bottomsheet":
          if (!this.isBottomSheetAModal()) {
            this.animateBottomSheet(el, innerContent, direction, skipAnimation);
          } else {
            this.animateModal(el, innerContent, direction, skipAnimation);
          }
          break;
        case "modal":
          this.animateModal(el, innerContent, direction, skipAnimation);
          break;
        default:
      }
    },
    /**
     * Lock the body scrolling
     * @param {HTMLElement} element
     * @returns {void}
     */
    lockBodyScrolling(element) {
      window.mdsScrollLocks.add(element);
      if (!document.body.classList.contains(SCROLL_LOCK_CLASS)) {
        const scrollbarWidth = this.getScrollbarWidth();
        document.body.classList.add(SCROLL_LOCK_CLASS);
        document.body.style.setProperty(
          "--scroll-lock-size",
          `${scrollbarWidth}px`
        );
      }
    },
    /**
     * Unlock the body scrolling
     * @param {HTMLElement} lockingEl
     * @returns {void}
     */
    unlockBodyScrolling(lockingEl) {
      window.mdsScrollLocks.delete(lockingEl);
      if (window.mdsScrollLocks.size === 0) {
        document.body.classList.remove(SCROLL_LOCK_CLASS);
        document.body.style.removeProperty("--scroll-lock-size");
      }
    },
    /**
     * Get the scrollbar width
     * @returns {number}
     * @private
     */
    getScrollbarWidth() {
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    },
    /**
     * On Press Function
     * @param {Event} e
     * @returns {void}
     * @private
     */
    onPress(event) {
      const isInnerContent = event.target && event.target.closest("[data-mds-inner-content]");
      if (isInnerContent)
        return;
      this.dragTime = /* @__PURE__ */ new Date();
      this.isDragging = true;
      const t = event.touches[0] || event.changedTouches[0];
      this.startY = t.clientY;
    },
    /**
     * On Release Function
     *
     * @param {Event} event
     * @returns {void}
     * @private
     */
    onRelease(event) {
      const isInnerContent = event.target && event.target.closest("[data-mds-inner-content]");
      if (isInnerContent)
        return;
      this.isDragging = false;
      const t = event.touches[0] || event.changedTouches[0];
      const draggedDistance = this.startY - t.clientY;
      const content = document.getElementById(this.el.dataset.contentId);
      if (draggedDistance < -150) {
        this.close(false, true);
      } else {
        content.style.setProperty("--tw-translate-y", `0%`);
        content.style.transition = "transform 0.3s ease";
        setTimeout(() => {
          content.style.removeProperty("transition");
        }, 300);
      }
    },
    /**
     * On Drag Function
     * @param {Event} event
     * @returns {void}
     * @private
     */
    onDrag(event) {
      const isInnerContent = event.target && event.target.closest("[data-mds-inner-content]");
      if (isInnerContent)
        return;
      const t = event.touches[0] || event.changedTouches[0];
      if (this.isDragging && t.clientY > 0) {
        const y = parseInt(this.startY) - parseInt(t.clientY);
        if (y > 0)
          return;
        this.setYDrag(y * -1);
      } else {
        const content = document.getElementById(this.el.dataset.contentId);
        content.style.removeProperty("transition");
      }
    },
    /**
     * Set Y Drag Function
     * @param {number} n
     * @returns {void}
     * @private
     */
    setYDrag(n) {
      const content = document.getElementById(this.el.dataset.contentId);
      content.style.setProperty("--tw-translate-y", `${n}px`);
      content.style.removeProperty("transition");
      this.currentY = n;
    },
    utils: {
      getData: (el, key) => {
        return el.getAttribute(`data-${key}`);
      }
    }
  };
  var drawer_default = Drawer;

  // ../../moon-live/assets/js/hooks/dropdown.js
  var DROPDOWN_ANIMATION_DURATION = 200;
  var DROPDOWN_TIMING_ANIMATION_EASE_STANDARD = "cubic-bezier(0.2, 0, 0.38, 0.9)";
  var DROPDOWN_SKIP_OPTS_NULL = {
    duration: 0,
    iterations: 1,
    easing: "linear"
  };
  var DROPDOWN_ENTER_ANIMATION = {
    keyframes: [
      { opacity: 0, filter: "blur(2px)", transform: "translateY(-10px)" },
      { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" }
    ],
    opts: {
      duration: DROPDOWN_ANIMATION_DURATION,
      easing: DROPDOWN_TIMING_ANIMATION_EASE_STANDARD
    }
  };
  var DROPDOWN_LEAVE_ANIMATION = {
    keyframes: [
      { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
      { opacity: 0, filter: "blur(2px)", transform: "translateY(-10px)" }
    ],
    opts: {
      duration: DROPDOWN_ANIMATION_DURATION,
      easing: DROPDOWN_TIMING_ANIMATION_EASE_STANDARD
    }
  };
  var MoonDropdown = {
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
      this.isOpen = false;
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
      var _a, _b;
      const target = (_b = (_a = event.detail) == null ? void 0 : _a.dispatcher) != null ? _b : event.target;
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
      if (dropdownIcon) {
        dropdownIcon.classList.add("rotate-180");
        dropdownIcon.classList.remove("rotate-0");
      }
      dropdown.dataset.hidden = "false";
      this.chaseFunc();
      if (!skipAnimation) {
        dropdown.animate(
          DROPDOWN_ENTER_ANIMATION.keyframes,
          this.el.dataset.skipAnimation === "true" ? DROPDOWN_SKIP_OPTS_NULL : DROPDOWN_ENTER_ANIMATION.opts
        );
      }
      this.isOpen = true;
    },
    hide(skipAnimation = false) {
      const dropdown = this.el.querySelector("[mds-dropdown-content]");
      const dropdownIcon = this.el.querySelector(".dropdown-select-icon");
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
          this.el.dataset.skipAnimation === "true" ? DROPDOWN_SKIP_OPTS_NULL : DROPDOWN_LEAVE_ANIMATION.opts
        );
      }
      setTimeout(
        () => {
          dropdown.dataset.hidden = "true";
          this.isOpen = false;
        },
        skipAnimation || this.el.dataset.skipAnimation === "true" ? 0 : DROPDOWN_ANIMATION_DURATION
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
        )
      };
      if (status.dropdownHeight > status.availableSpaceBottom) {
        dropdown.style.top = `-${status.dropdownHeight + 8}px`;
      } else {
        dropdown.style.top = `${status.anchorHeight + 8}px`;
      }
    },
    onKeyDown(event) {
      const dropdown = document.getElementById(this.el.id);
      if (!dropdown)
        return;
      const dropdownContent = this.el.querySelector("[mds-dropdown-content]");
      if (!dropdownContent)
        return;
      const items = dropdownContent.querySelectorAll("li");
      if (!items.length)
        return;
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
    }
  };
  var dropdown_default = MoonDropdown;

  // ../../moon-live/assets/js/hooks/file_input.js
  var FileInput = {
    mounted() {
      const inputRef = this.el.dataset.inputRef;
      const input = this.getInputElement(inputRef);
      const span = this.getSpanElement(inputRef);
      if (!input || !span)
        return;
      this.setupClickListener(input);
      this.setupChangeListener(input, span);
    },
    getInputElement(inputRef) {
      const input = document.querySelector(
        `input[type="file"][data-phx-upload-ref="${inputRef}"]`
      );
      if (!input) {
        console.error(
          `FileInput: No input found with data-phx-upload-ref="${inputRef}"`
        );
      }
      return input;
    },
    getSpanElement(inputRef) {
      const span = document.querySelector(`span[data-input-ref="${inputRef}"]`);
      if (!span) {
        console.error(
          `FileInput: No span found with data-input-ref="${inputRef}"]`
        );
      }
      return span;
    },
    setupClickListener(input) {
      this.el.addEventListener("click", () => input.click());
    },
    setupChangeListener(input, span) {
      input.addEventListener("change", () => {
        const files = input.files;
        span.textContent = files.length === 1 ? files[0].name : `${files.length} Files`;
      });
    }
  };
  var file_input_default = FileInput;

  // ../../moon-live/assets/js/hooks/moon_switch.js
  var MoonSwitch = {
    mounted() {
      this.currentState = this.el.getAttribute("aria-checked") === "true";
      this.id = this.el.id;
      if (this.el.getAttribute("data-is-form") === "false")
        return;
      this.el.addEventListener("switch_change", (e) => {
        if (e.detail.disabled)
          return;
        this.toggle(!this.currentState);
        if (e.detail && e.detail.input_id) {
          document.getElementById(e.detail.input_id).dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    },
    updated() {
      this.currentState = this.el.getAttribute("aria-checked") === "true";
    },
    /**
     * Convert a boolean to a string
     * @param {boolean} bool
     * @returns {string}
     * */
    booleanToString(bool) {
      return bool ? "true" : "false";
    },
    /**
     * Toggle the switch
     * @param {boolean} bool
     * @returns {void}
     * */
    toggle(bool) {
      const parent = this.el.closest("[data-parent-switch]");
      const inputId = this.id + "_input";
      const spanId = this.id + "_span";
      const leftIcon = parent.querySelector("[data-icon-checked]");
      const rightIcon = parent.querySelector("[data-icon-unchecked]");
      parent.querySelector("#" + inputId).value = this.booleanToString(bool);
      parent.querySelector("#" + spanId).dataset.currentState = this.booleanToString(bool);
      this.el.setAttribute("aria-checked", this.booleanToString(bool));
      this.currentState = bool;
      const enabledClasses = this.el.dataset.customEnabledClass && this.el.dataset.customEnabledClass.split(" ") || [];
      const disabledClasses = this.el.dataset.customDisabledClass && this.el.dataset.customDisabledClass.split(" ") || [];
      if (bool) {
        this.el.classList.remove(...disabledClasses);
        this.el.classList.add(...enabledClasses);
        if (leftIcon) {
          leftIcon.classList.remove("opacity-0");
          leftIcon.classList.add("opacity-1");
        }
        if (rightIcon) {
          rightIcon.classList.add("opacity-0");
          rightIcon.classList.remove("opacity-1");
        }
      } else {
        this.el.classList.remove(...enabledClasses);
        this.el.classList.add(...disabledClasses);
        if (leftIcon) {
          leftIcon.classList.remove("opacity-1");
          leftIcon.classList.add("opacity-0");
        }
        if (rightIcon) {
          rightIcon.classList.add("opacity-1");
          rightIcon.classList.remove("opacity-0");
        }
      }
    }
  };
  var moon_switch_default = MoonSwitch;

  // ../../moon-live/assets/js/hooks/popover.js
  var POPOVER_ANIMATION_DURATION = 200;
  var TIMING_ANIMATION_EASE_STANDARD2 = "cubic-bezier(0.2, 0, 0.38, 0.9)";
  var POPOVER_SKIP_OPTS_NULL = {
    duration: 0,
    iterations: 1,
    easing: "linear"
  };
  var POPOVER_ENTRY_ANIMATION = {
    keyframes(origin = "top") {
      return [
        {
          opacity: 0,
          filter: "blur(1px)",
          top: origin === "top" ? "10px" : "-10px"
        },
        { opacity: 1, filter: "blur(0px)", top: "0px" }
      ];
    },
    opts: {
      duration: POPOVER_ANIMATION_DURATION,
      iterations: 1,
      easing: TIMING_ANIMATION_EASE_STANDARD2
    }
  };
  var POPOVER_EXIT_ANIMATION = {
    keyframes(origin = "top") {
      return [
        { filter: "blur(0px)", top: "0px", opacity: 1 },
        {
          filter: "blur(1px)",
          top: origin === "top" ? "3px" : "-3px",
          opacity: 0
        }
      ];
    },
    opts: {
      duration: POPOVER_ANIMATION_DURATION,
      iterations: 1,
      easing: TIMING_ANIMATION_EASE_STANDARD2
    }
  };
  var Popover = {
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
      if (!target) {
        throw Error("MDS Popover: Target not found");
        return;
      }
      if (this.closingTimeout) {
        clearTimeout(this.closingTimeout);
        this.closingTimeout = null;
      }
      const targetRect = target.getBoundingClientRect();
      this.applyCSSVars({
        anchorHeight: targetRect.height,
        anchorWidth: targetRect.width,
        top: targetRect.top,
        bottom: window.innerHeight - targetRect.bottom
      });
      this.el.style.transform = this.getTransform(targetRect);
      this.el.animate(
        POPOVER_ENTRY_ANIMATION.keyframes(currentSide),
        this.el.dataset.skipAnimation === "true" ? POPOVER_SKIP_OPTS_NULL : POPOVER_ENTRY_ANIMATION.opts
      );
      requestAnimationFrame(() => {
        this.el.classList.remove("hidden");
      });
      this.disposeFunc = this.dispose.bind(this);
      document.addEventListener("click", this.disposeFunc);
      this.chaseFunc = () => this.chase.bind(this)(target);
      window.addEventListener("scroll", this.chaseFunc);
      window.addEventListener("resize", this.chaseFunc);
      requestAnimationFrame(() => this.chaseFunc());
      setTimeout(() => requestAnimationFrame(() => this.chaseFunc()), 400);
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
      const currentSide = this.el.dataset.side || "bottom";
      const onCloseCallback = this.el.dataset.onClose;
      this.el.animate(
        POPOVER_EXIT_ANIMATION.keyframes(currentSide),
        this.el.dataset.skipAnimation == "true" ? POPOVER_SKIP_OPTS_NULL : POPOVER_EXIT_ANIMATION.opts
      );
      if (this.closingTimeout) {
        clearTimeout(this.closingTimeout);
        this.closingTimeout = null;
      }
      this.closingTimeout = setTimeout(() => {
        this.el.classList.add("hidden");
      }, POPOVER_ANIMATION_DURATION);
      if (this.disposeFunc) {
        document.removeEventListener("click", this.disposeFunc);
        this.disposeFunc = null;
      }
      if (this.chaseFunc) {
        window.removeEventListener("scroll", this.chaseFunc);
        window.removeEventListener("resize", this.chaseFunc);
      }
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
        top: currentSide === "top" ? targetRect.top - this.el.offsetHeight - 4 : targetRect.top + targetRect.height + 4,
        left: ((clientWidth) => {
          if (currentAlign === "right") {
            return targetRect.left + targetRect.width - clientWidth;
          }
          if (currentAlign === "middle") {
            return targetRect.left + (targetRect.width - clientWidth) / 2;
          }
          return targetRect.left;
        })(this.el.clientWidth) || 0
      };
      return `translate3d(${Math.ceil(finalTransform.left)}px, ${Math.ceil(finalTransform.top) + currentOffset}px, 0)`;
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
      const isRTL = this.isRTL();
      const currentAlign = this.el.dataset.align || "left";
      return isRTL ? currentAlign === "left" ? "right" : "left" : currentAlign;
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
      var _a, _b;
      const target = (_b = (_a = event.detail) == null ? void 0 : _a.dispatcher) != null ? _b : event.target;
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
      if (status.availableSpaceTop <= offsetHeight && currentSide === "top" || status.availableSpaceBottom <= offsetHeight && currentSide === "bottom") {
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
      if (this.el.dataset.state == "hidden") {
        return;
      }
      const target = this.getTarget(event);
      if (!target) {
        return;
      }
      if (!!target.closest("[data-ignore-mds-popover-dispose]")) {
        return;
      }
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
        right: Math.max(Math.round(window.innerWidth - targetRect.right), 0)
      };
      this.applyCSSVars(status);
      const transformHeight = currentSide === "top" ? this.el.offsetHeight + status.anchorHeight + 8 : (this.el.offsetHeight + status.anchorHeight + 8) * -1;
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
      this.showFunc = this.show.bind(this);
      this.hideFunc = this.hide.bind(this);
      this.toggleFunc = this.toggle.bind(this);
      this.el.addEventListener("mds:popover:show", this.showFunc);
      this.el.addEventListener("mds:popover:hide", this.hideFunc);
      this.el.addEventListener("mds:popover:toggle", this.toggleFunc);
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
      this.hovers = [];
      this.setup();
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
      document.querySelectorAll("[data-mds-popover-hover]").forEach((el) => {
        if (el.dataset.mdsPopoverHover === this.el.id) {
          el.addEventListener("mouseenter", this.showFunc);
          el.addEventListener("mouseleave", this.hideFunc);
          this.hovers.push(el);
        }
      });
      let currentZIndex = 50;
      const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT
      );
      let maxBoundCycle = 0;
      while (treeWalker.nextNode() && maxBoundCycle < 5e3) {
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
      const target = this.el.dataset.popoverTarget;
      if (this.el.dataset.initialState === "visible" && target) {
        this.show({ target });
      }
    }
  };
  var popover_default = Popover;

  // ../../moon-live/assets/js/hooks/responsive_screen.js
  var ResponsiveScreen = {
    mounted() {
      this.haveMin = !!this.el.dataset.min;
      this.haveMax = !!this.el.dataset.max;
      this.mediaQuery = this.genMediaQuery();
      if (this.mediaQuery.matches) {
        this.pushEventTo(this.el, "show");
      }
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
          `(min-width: ${this.el.dataset.min}px) and (max-width: ${this.el.dataset.max}px)`
        );
      }
      if (this.haveMin) {
        return window.matchMedia(`(min-width: ${this.el.dataset.min}px)`);
      }
      if (this.haveMax) {
        return window.matchMedia(`(max-width: ${this.el.dataset.max}px)`);
      }
      return window.matchMedia(`(min-width: 1px)`);
    }
  };
  var responsive_screen_default = ResponsiveScreen;

  // ../../moon-live/assets/js/utils/portal.js
  var Portal = {
    create: function(el, destinationTag, destination) {
      const portalId = this.genRandomId();
      const portal = el.cloneNode(true);
      portal.id = portalId;
      portal.setAttribute("data-is-portal", "true");
      const transformedPortal = this.changeTag(portal, destinationTag);
      transformedPortal.appendChild(el.content.cloneNode(true));
      destination.appendChild(transformedPortal);
      return portalId;
    },
    destroy: function(el) {
      const portal = document.getElementById(el);
      if (portal) {
        portal.remove();
      }
    },
    changeTag: function(node, tag) {
      const newElement = document.createElement(tag);
      for (const attr of node.attributes) {
        if (attr.name != "data-mds-dropdown-content") {
          newElement.setAttributeNS(null, attr.name, attr.value);
        }
      }
      return newElement;
    },
    genRandomId: function() {
      return `mds-portal-${Date.now()}`;
    }
  };
  var portal_default = Portal;

  // ../../moon-live/assets/js/core/snackbar_events_handler.js
  var OFFSET_Y = 16;
  var MoonSnackBarEventsHandler = {
    /**
     * Remove the snackbar from the screen
     * ---
     * @param {any} data
     * @returns {void}
     */
    remove(data) {
      const portal = document.getElementById(data.portalId);
      if (portal) {
        const snackbar = portal.querySelector("[data-mds-snackbar]");
        if (snackbar) {
          snackbar.style.top = snackbar.getBoundingClientRect().top - OFFSET_Y + "px";
          snackbar.style.opacity = 0;
          setTimeout(() => {
            portal_default.destroy(data.portalId);
          }, 200);
        }
      }
    },
    /**
     * Show the snackbar
     * @param {any} data
     * @returns
     */
    show(data) {
      const element = document.getElementById(data.originId.slice(1));
      if (!element)
        return;
      const destination = document.body;
      const portalEl = element.cloneNode(true);
      portalEl.id = data.id;
      return portal_default.create(portalEl, "div", destination);
    },
    /**
     * Calculate the offset of the header
     * ---
     * @returns int
     */
    offsetHeader() {
      const header = document.querySelector("header");
      if (header) {
        return header.offsetHeight + OFFSET_Y;
      }
      return OFFSET_Y;
    },
    /**
     * Calculate the offset of the snackbars
     * @returns int
     */
    offsetY() {
      return this.offsetHeader();
    },
    /**
     * Set the Y Axis
     */
    setYAxis(align, popup, y) {
      if (align == "bottom") {
        popup.style.bottom = y;
      } else {
        popup.style.top = y;
      }
    },
    /**
     * Animate the snackbar
     */
    animate(currentlyOnScreen = [], isExpanded = false) {
      const offsetY = this.offsetY();
      const base = currentlyOnScreen.filter((snackbar) => !snackbar.toRemove).toReversed();
      base.forEach((snackbar, index) => {
        const snackbarEl = document.getElementById(snackbar.portalId);
        if (!snackbarEl)
          return;
        const popup = snackbarEl.querySelector("[data-mds-snackbar]");
        if (!popup)
          return;
        const align = snackbarEl.dataset.align;
        if (isExpanded) {
          popup.style.visibility = "visible";
          this.setYAxis(align, popup, `${offsetY + index * 64}px`);
          popup.style.opacity = 1;
          popup.style.zIndex = 1e3 - index;
          popup.style.transform = `translateX(-50%)`;
          const duration = 0.1 + index * 0.05;
          popup.style.transitionDuration = `${duration}s`;
          if (index > 4) {
            popup.style.visibility = "hidden";
            popup.style.opacity = 0;
          }
        } else {
          if (index >= 3) {
            popup.style.visibility = "hidden";
            this.setYAxis(align, popup, "0px");
            popup.style.opacity = 0;
            const reduceFactor = 1 - index * 0.1;
            popup.style.transform = `translateX(-50%) scale(${reduceFactor})`;
          } else {
            this.setYAxis(align, popup, `${offsetY + index * 8}px`);
            const reduceFactor = 1 - index * 0.1;
            popup.style.opacity = reduceFactor;
            popup.style.zIndex = 1e3 - index;
            popup.style.visibility = "visible";
            popup.style.transitionDuration = `0.2s`;
            popup.style.transform = `translateX(-50%) scale(${reduceFactor})`;
          }
        }
      });
    },
    /**
     * Random ID generator
     * @returns string
     */
    genRandomId() {
      return "m" + Math.random().toString(36).substring(2, 15);
    }
  };
  var snackbar_events_handler_default = MoonSnackBarEventsHandler;

  // ../../moon-live/assets/js/core/snackbar_manager.js
  var SNACKBAR_DURATION = 3e3;
  var MoonSnackBarManager = class {
    /**
     * Setup the MoonSnackbarHandler
     * @returns {void}
     */
    constructor() {
      this.currentlyOnScreen = [];
      this.timeout = null;
      this.leaveTimeout = null;
      this.setupEventListeners();
    }
    /**
     * Setup the event listeners for the MoonSnackbarHandler
     * @returns {void}
     */
    setupEventListeners() {
      window.addEventListener("phx:mds:snackbar:remove", (event) => {
        this.handleRemove(event);
      });
      window.addEventListener("phx:mds:snackbar:show", (event) => {
        this.handleShow(event);
      });
    }
    /**
     * The heart of the snackbar handler, this is used to show the snackbar
     * on the screen.
     * ---
     */
    beat() {
      if (this.currentlyOnScreen.length > 0 && !this.isExpanded) {
        const snackbarToRemove = this.currentlyOnScreen.pop();
        snackbar_events_handler_default.remove(snackbarToRemove);
        snackbar_events_handler_default.animate(
          this.currentlyOnScreen,
          this.isExpanded
        );
        this.requestBeat();
      }
    }
    /**
     * Is the snackbar containing a action?
     * @param {string} id
     * @returns {boolean}
     */
    isActionSnackbar(id) {
      if (!id)
        return false;
      return document.getElementById(id.slice(1)).dataset.action == "true";
    }
    /**
     * Handle the show snackbar event
     * ---
     * @param {CustomEvent} event
     * @returns {void}
     */
    handleShow(event) {
      const { id } = event.detail;
      if (!id)
        return;
      const isActionSnackbar = this.isActionSnackbar(id);
      const randId = snackbar_events_handler_default.genRandomId();
      let snackbarToShow = {
        id: randId,
        originId: id,
        originDate: /* @__PURE__ */ new Date(),
        isActionSnackbar,
        portalId: null,
        toRemove: false
      };
      this.currentlyOnScreen.push(snackbarToShow);
      snackbarToShow.portalId = snackbar_events_handler_default.show(snackbarToShow);
      snackbar_events_handler_default.animate(this.currentlyOnScreen, this.isExpanded);
      const snackbarPortal = document.getElementById(snackbarToShow.portalId);
      snackbarPortal.removeAttribute("phx-hook");
      snackbarPortal.addEventListener("mouseenter", () => {
        this.handleHover();
      });
      snackbarPortal.addEventListener("mouseleave", () => {
        this.handleLeave();
      });
      this.requestBeat();
    }
    /**
     * Handle the remove snackbar, remove is used to notify the handler
     * that a snackbar has been removed from the DOM.
     * @param {CustomEvent} event
     */
    handleRemove(event) {
      const { id } = event.detail;
      this.currentlyOnScreen = this.currentlyOnScreen.map((item) => {
        if (item.originId == id) {
          snackbar_events_handler_default.remove(item);
          return __spreadProps(__spreadValues({}, item), {
            toRemove: true
          });
        }
        return item;
      });
      const t = this.currentlyOnScreen.filter((item) => item.originId == id);
      t.forEach((item) => {
        snackbar_events_handler_default.remove(item);
      });
      this.requestBeat();
      this.isExpanded = false;
      setTimeout(
        () => snackbar_events_handler_default.animate(
          this.currentlyOnScreen,
          this.isExpanded
        ),
        400
      );
    }
    /**
     * Request a beat for the snackbar
     * @returns void
     */
    requestBeat() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.beat();
      }, SNACKBAR_DURATION);
    }
    /**
     * Handle the hover event
     * @returns void
     */
    handleHover() {
      if (this.leaveTimeout) {
        clearTimeout(this.leaveTimeout);
      }
      this.isExpanded = true;
      snackbar_events_handler_default.animate(this.currentlyOnScreen, this.isExpanded);
    }
    /**
     * Handle the leave event
     * @returns void
     */
    handleLeave() {
      this.leaveTimeout = setTimeout(() => {
        this.isExpanded = false;
        snackbar_events_handler_default.animate(
          this.currentlyOnScreen,
          this.isExpanded
        );
      }, 400);
      this.requestBeat();
    }
  };
  var snackbar_manager_default = MoonSnackBarManager;

  // ../../moon-live/assets/js/hooks/snackbar.js
  var MoonSnackbar = {
    // Live Component not supported, due LiveView bug
    // https://github.com/patrick-steele-idem/morphdom/issues/251
    // So updated is not supported
    //
    // Remove notice the handler that a snackbar has been removed
    destroyed() {
      if (this.el && this.el.id) {
        this.eventGenerator("remove", `#${this.el.id}`);
      }
    },
    // Factory Event Generator
    eventGenerator(type, id, opts = {}) {
      const event = new CustomEvent(`phx:mds:snackbar:${type}`, {
        detail: { id, opts }
      });
      window.dispatchEvent(event);
    }
  };
  if (!window.MoonSnackBarHandler) {
    window.MoonSnackBarHandler = new snackbar_manager_default();
  }
  var snackbar_default = MoonSnackbar;

  // ../../moon-live/assets/js/hooks/carousel.js
  var CarouselHook = {
    mounted() {
      this.setup();
    },
    setup() {
      this.el.addEventListener("moon:carousel:scroll_left", () => {
        const currentIndex = parseInt(this.el.dataset.activeSlideIndex);
        const nextIndex = scrollLeft({ currentIndex, element: this.el });
        updateDataAttribute(this.el, currentIndex, nextIndex);
      });
      this.el.addEventListener("moon:carousel:scroll_right", () => {
        const currentIndex = parseInt(this.el.dataset.activeSlideIndex);
        const totalItems = this.el.querySelectorAll(".moon-carousel-item").length;
        const nextIndex = scrollRight({
          currentIndex,
          totalItems,
          element: this.el
        });
        updateDataAttribute(this.el, currentIndex, nextIndex);
      });
      this.el.addEventListener("moon:carousel:scroll_to_index", (event) => {
        const { detail } = event;
        const { index } = detail;
        scrollToIndex({ element: this.el, index });
      });
      if (this.el.dataset.activeSlideIndex !== "0") {
        scrollToIndex({
          element: this.el,
          index: this.el.dataset.activeSlideIndex
        });
      }
    }
  };
  var scrollToIndex = ({ element, index }) => {
    const totalItems = element.querySelectorAll(".moon-carousel-item").length;
    if (!isValidIndex(index, totalItems)) {
      return;
    }
    const activeSlideIndex = parseInt(element.dataset.activeSlideIndex);
    scroll({ index, element });
    updateDataAttribute(element, activeSlideIndex, index);
  };
  var scrollLeft = ({ currentIndex, element }) => {
    if (currentIndex <= 0) {
      return currentIndex;
    }
    const nextIndex = currentIndex - 1;
    scroll({ index: nextIndex, element });
    return nextIndex;
  };
  var scrollRight = ({ currentIndex, totalItems, element }) => {
    if (currentIndex >= totalItems - 1) {
      return currentIndex;
    }
    const nextIndex = currentIndex + 1;
    scroll({ index: nextIndex, element });
    return nextIndex;
  };
  var scroll = ({ index, element }) => {
    const activeSlide = element.querySelector(`#${element.id}-slide-${index}`);
    updateButtonArrows({ element, newIndex: index });
    activeSlide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  };
  var updateButtonArrows = ({ element, newIndex }) => {
    const prevArrowButton = element.querySelector(`#${element.id}-arrow-start`);
    const nextArrowButton = element.querySelector(`#${element.id}-arrow-end`);
    updateButtonArrow(prevArrowButton, newIndex <= 0);
    updateButtonArrow(nextArrowButton, newIndex >= getTotalItems(element) - 1);
  };
  var updateButtonArrow = (arrowButton, isDisabled) => {
    if (isDisabled) {
      arrowButton.setAttribute("disabled", "");
      return;
    }
    arrowButton.removeAttribute("disabled");
  };
  var getTotalItems = (element) => element.querySelectorAll(".moon-carousel-item").length;
  var updateDataAttribute = (element, activeIndex, newIndex) => {
    if (activeIndex === newIndex) {
      return;
    }
    element.removeAttribute("data-active-slide-index");
    element.setAttribute("data-active-slide-index", newIndex);
  };
  var isValidIndex = (index, totalItems) => {
    if (isNaN(index)) {
      return false;
    }
    if (index < 0 || index >= totalItems) {
      return false;
    }
    return true;
  };
  var carousel_default = CarouselHook;

  // ../../moon-live/assets/js/hooks/pagination.js
  var paginationStepIdPrefix = "#pagination-step-item-";
  var PaginationHook = {
    mounted() {
      this.setup();
    },
    setup() {
      const element = this.el;
      const mode = element.dataset.mode;
      const dataTotalSteps = parseInt(element.dataset.totalSteps, 10);
      const paginationItemsLength = element.querySelectorAll(
        ".moon-pagination-item"
      ).length;
      const totalSteps = dataTotalSteps || paginationItemsLength;
      if (mode !== "links") {
        element.addEventListener(
          "moon:pagination:step",
          ({ detail: { step } }) => {
            navigate({
              direction: step,
              element,
              currentStep: parseInt(element.dataset.activeStep),
              mode,
              totalSteps
            });
          }
        );
        return;
      }
      navigateLinksMode({ element, totalSteps });
    }
  };
  var navigateLinksMode = ({ element, totalSteps }) => {
    const { baseParam: prefix, maxDisplayedSteps, activeStep } = element.dataset;
    const currentPage = parseInt(getUrlParams().get(prefix) || activeStep);
    renderPaginationSteps({
      element,
      steps: calculateDisplaySteps(
        currentPage,
        totalSteps,
        parseInt(maxDisplayedSteps)
      ),
      prefix
    });
    navigate({
      direction: currentPage,
      element,
      currentStep: parseInt(activeStep),
      prefix,
      totalSteps
    });
  };
  var calculateDisplaySteps = (currentPage, totalSteps, maxDisplayedSteps) => {
    if (totalSteps <= maxDisplayedSteps)
      return Array.from({ length: totalSteps }, (_, i) => i + 1);
    const half = Math.floor(maxDisplayedSteps / 2);
    if (currentPage <= half + 1)
      return [...Array(maxDisplayedSteps - 2).keys()].map((i) => i + 1).concat(["...", totalSteps]);
    if (totalSteps - currentPage <= half)
      return [1, "..."].concat(
        Array.from(
          { length: maxDisplayedSteps - 2 },
          (_, i) => totalSteps - maxDisplayedSteps + 3 + i
        )
      );
    const firstStep = currentPage - 1;
    return [
      1,
      "...",
      ...Array.from({ length: maxDisplayedSteps - 4 }, (_, i) => firstStep + i),
      "...",
      totalSteps
    ];
  };
  var renderPaginationSteps = ({ element, steps, prefix }) => {
    const container = element.querySelector(`#${element.id}-inner-steps`);
    const urlSearchParams = getUrlParams();
    container.innerHTML = "";
    steps.forEach((step) => {
      const item = document.createElement(step === "..." ? "span" : "a");
      item.textContent = step;
      if (step === "...") {
        item.className = "moon-pagination-ellipsis";
      } else {
        item.className = "moon-pagination-item data-[active=true]:moon-pagination-item-active";
        urlSearchParams.set(prefix, step);
        item.href = `?${urlSearchParams.toString()}`;
        item.dataset.paginationStep = step;
      }
      container.appendChild(item);
    });
  };
  var navigate = ({
    direction,
    element,
    currentStep,
    mode = "links",
    prefix,
    totalSteps
  }) => {
    const step = /^\d+$/.test(direction) ? parseInt(direction) : null;
    step ? navigateToStep({ element, step, prefix, totalSteps, mode }) : navigateWithArrows({ direction, element, currentStep, totalSteps, mode });
  };
  var navigateWithArrows = ({
    direction,
    element,
    currentStep,
    totalSteps,
    mode
  }) => {
    const step = direction === "prev" ? currentStep - 1 : currentStep + 1;
    if (isValidStep(step, totalSteps)) {
      navigateToStep({ element, step, totalSteps, mode });
    }
  };
  var navigateToStep = ({ element, step, prefix, totalSteps, mode }) => {
    const newActiveStep = element.querySelector(
      `[data-pagination-step='${step}']`
    );
    if (!newActiveStep)
      return;
    updateActiveStep(element, newActiveStep, step);
    updateNavArrows({ element, newStep: step, prefix, totalSteps, mode });
  };
  var updateActiveStep = (element, newActiveStep, step) => {
    const currentSelectedItem = element.querySelector(`[data-active=true]`);
    currentSelectedItem == null ? void 0 : currentSelectedItem.setAttribute("data-active", "false");
    currentSelectedItem == null ? void 0 : currentSelectedItem.setAttribute("aria-selected", "false");
    element.setAttribute("data-active-step", step);
    newActiveStep.setAttribute("data-active", "true");
    newActiveStep.setAttribute("aria-selected", "true");
  };
  var updateNavArrows = ({ element, newStep, prefix, totalSteps, mode }) => {
    ["prev", "next"].forEach((direction) => {
      const arrow = element.querySelector(
        `${paginationStepIdPrefix}${element.id}-${direction}`
      );
      if (!arrow)
        return;
      const step = direction === "prev" ? newStep - 1 : newStep + 1;
      isValidStep(step, totalSteps) ? updateLinkNavArrow(arrow, step, prefix, mode) : disableLinkArrow(arrow, mode);
    });
  };
  var updateLinkNavArrow = (item, step, prefix, mode = "links") => {
    if (mode !== "links") {
      item.removeAttribute("disabled");
      return;
    }
    const urlSearchParams = getUrlParams();
    urlSearchParams.set(prefix, step);
    item.href = `?${urlSearchParams.toString()}`;
    item.removeAttribute("onclick");
    item.removeAttribute("aria-disabled");
  };
  var disableLinkArrow = (item, mode = "links") => {
    if (mode !== "links") {
      item.setAttribute("disabled", "");
      return;
    }
    item.removeAttribute("href");
    item.setAttribute("onclick", "return false;");
    item.setAttribute("aria-disabled", "true");
  };
  var isValidStep = (step, totalSteps) => step > 0 && step <= totalSteps;
  var getUrlParams = () => new URL(window.location.href).searchParams;
  var pagination_default = PaginationHook;

  // ../../moon-live/assets/js/hooks/tooltip.js
  var Tooltip = {
    mounted() {
      const tooltip = this.el;
      const content = tooltip.querySelector("[role='tooltip']");
      const getBasePosition = () => content == null ? void 0 : content.dataset.basePosition;
      let isPositioned = false;
      let observer = null;
      let resizeTimeout = null;
      const positionClasses = {
        top: "",
        bottom: "moon-tooltip-bottom",
        start: "moon-tooltip-start",
        end: "moon-tooltip-end"
      };
      const clearPositionClasses = () => {
        Object.values(positionClasses).forEach((cls) => {
          cls.split(" ").forEach((c) => {
            if (c)
              tooltip.classList.remove(c);
          });
        });
      };
      const applyPosition = (position) => {
        clearPositionClasses();
        positionClasses[position].split(" ").forEach((c) => {
          if (c)
            tooltip.classList.add(c);
        });
      };
      const calculateBestPosition = () => {
        const tooltipRect = content.getBoundingClientRect();
        const parentRect = tooltip.getBoundingClientRect();
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        const space = {
          top: parentRect.top,
          bottom: viewport.height - parentRect.bottom,
          start: parentRect.left,
          end: viewport.width - parentRect.right
        };
        const fits = {
          top: tooltipRect.height <= space.top,
          bottom: tooltipRect.height <= space.bottom,
          start: tooltipRect.width <= space.start,
          end: tooltipRect.width <= space.end
        };
        if (fits[getBasePosition()])
          return getBasePosition();
        const sorted = Object.entries(space).filter(([pos]) => fits[pos]).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : getBasePosition();
      };
      const setupObserver = () => {
        if (observer)
          observer.disconnect();
        observer = new IntersectionObserver((entries) => {
          for (let entry of entries) {
            if (!entry.isIntersecting) {
              const best = calculateBestPosition();
              applyPosition(best);
              isPositioned = true;
            } else if (!isPositioned) {
              applyPosition(getBasePosition());
            }
          }
        }, {
          root: null,
          threshold: 0.99
        });
        observer.observe(content);
      };
      const handleResize = () => {
        isPositioned = false;
        if (observer)
          observer.disconnect();
        if (resizeTimeout)
          clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          applyPosition(getBasePosition());
          setupObserver();
        }, 300);
      };
      window.addEventListener("resize", handleResize);
      tooltip._autoPositionCleanup = () => {
        if (observer)
          observer.disconnect();
        if (resizeTimeout)
          clearTimeout(resizeTimeout);
        window.removeEventListener("resize", handleResize);
      };
      applyPosition(getBasePosition());
      setupObserver();
    },
    destroyed() {
      var _a, _b;
      (_b = (_a = this.el)._autoPositionCleanup) == null ? void 0 : _b.call(_a);
    }
  };
  var tooltip_default = Tooltip;

  // ../../moon-live/assets/js/hooks/index.js
  var hooks_default = {
    Tooltip: tooltip_default,
    Authenticator: authenticator_default,
    Drawer: drawer_default,
    MoonSwitch: moon_switch_default,
    Popover: popover_default,
    ResponsiveScreen: responsive_screen_default,
    Accordion: accordion_default,
    MoonDropdown: dropdown_default,
    MoonSnackbar: snackbar_default,
    CarouselHook: carousel_default,
    FileInput: file_input_default,
    PaginationHook: pagination_default
  };

  // js/hooks/index.js
  var hooks_default2 = __spreadValues({
    CodePreviewHook: CodePreview_default
  }, hooks_default);

  // js/populateTokens.js
  function populateTokens() {
    const tokens = document.querySelectorAll("[data-token]");
    const computedStyle = window.getComputedStyle(document.body);
    tokens.forEach((token) => {
      const tokenName = token.getAttribute("data-token");
      if (!tokenName)
        return;
      const tokensList = tokenName.split(",").map((t) => t.trim());
      const getTokenValue = (t) => {
        const value = computedStyle.getPropertyValue(t);
        return value;
      };
      let finalValue = tokensList.map(getTokenValue).join(" ");
      if (tokenName.includes("--text-body-") || tokenName.includes("--text-heading-")) {
        const parts = finalValue.split(" ");
        finalValue = `${parts[0]} ${parts[1]}/${parts[2]}` + (parts.length > 3 ? ` ${parts.slice(3).join(" ")}` : "");
      }
      if (tokenName.includes("--effect-shadow-")) {
        const parts = finalValue.split(" ");
        finalValue = `${parts.slice(0, 4).join(" ")} ${parts.slice(4, 9).join(" ")},
${parts.slice(9, 13).join(" ")} ${parts.slice(13).join(" ")}`;
        token.style.whiteSpace = "pre-wrap";
      }
      token.textContent = finalValue;
    });
  }
  var populateTokens_default = populateTokens;

  // js/storybook.js
  (function() {
    window.storybook = { Hooks: hooks_default2 };
    document.documentElement.dir = "ltr";
    window.addEventListener("phx:page-loading-stop", (event) => {
      const {
        detail: { to }
      } = event;
      if (to.includes("/tokens")) {
        populateTokens_default();
      }
    });
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
      if (to.includes("/tokens")) {
        populateTokens_default();
      }
    });
  })();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL2pzL2hvb2tzL0NvZGVQcmV2aWV3LmpzIiwgIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvYWNjb3JkaW9uLmpzIiwgIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvYXV0aGVudGljYXRvci5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2NvbnN0YW50cy92YXJpYWJsZXMuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9kcmF3ZXIuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9kcm9wZG93bi5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL2ZpbGVfaW5wdXQuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9tb29uX3N3aXRjaC5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL3BvcG92ZXIuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9yZXNwb25zaXZlX3NjcmVlbi5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL3V0aWxzL3BvcnRhbC5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2NvcmUvc25hY2tiYXJfZXZlbnRzX2hhbmRsZXIuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9jb3JlL3NuYWNrYmFyX21hbmFnZXIuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9zbmFja2Jhci5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL2Nhcm91c2VsLmpzIiwgIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvcGFnaW5hdGlvbi5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL3Rvb2x0aXAuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9pbmRleC5qcyIsICIuLi8uLi8uLi9hc3NldHMvanMvaG9va3MvaW5kZXguanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL3BvcHVsYXRlVG9rZW5zLmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9zdG9yeWJvb2suanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IENvZGVQcmV2aWV3ID0ge1xuICBtb3VudGVkKCkge1xuICAgIC8vIENhY2hlIERPTSBlbGVtZW50c1xuICAgIHRoaXMuYnV0dG9uID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtY29kZS1wcmV2aWV3LWJ1dHRvbl1cIik7XG4gICAgdGhpcy53cmFwcGVyID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtY29kZS1wcmV2aWV3LXdyYXBwZXJdXCIpO1xuICAgIHRoaXMudG9nZ2xlU3BhbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIiN0b2dnbGVTcGFuXCIpO1xuICAgIHRoaXMuYnV0dG9uV3JhcHBlciA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiW2RhdGEtY29kZS1wcmV2aWV3LWJ1dHRvbi13cmFwcGVyXVwiXG4gICAgKTtcblxuICAgIGlmICghdGhpcy5oaWRlQnV0dG9uKCkpIHtcbiAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgdG9nZ2xpbmcgb3Blbi9jbG9zZVxuICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlKCkpO1xuICAgIH1cbiAgfSxcbiAgdG9nZ2xlKCkge1xuICAgIC8vIFRvZ2dsZSBiZXR3ZWVuIG9wZW4gYW5kIGNsb3NlIHN0YXRlc1xuICAgIGlmICh0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWF4LWgtOTZcIikpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9LFxuICBvcGVuKCkge1xuICAgIC8vIEJhdGNoIGNsYXNzIGNoYW5nZXMgZm9yIG9wZW4gc3RhdGVcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcIm1heC1oLTk2XCIsIFwib3ZlcmZsb3ctYXV0b1wiKTtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcIm1heC1oLXNwYWNlLTEyOFwiKTtcbiAgICB0aGlzLmJ1dHRvbldyYXBwZXIuY2xhc3NMaXN0LmFkZChcImgtc3BhY2UtNDBcIiwgXCJbJl9zdmddOnJvdGF0ZS0xODBcIik7XG4gICAgdGhpcy50b2dnbGVTcGFuLnRleHRDb250ZW50ID0gXCJDb2xsYXBzZVwiO1xuICB9LFxuICBjbG9zZSgpIHtcbiAgICAvLyBCYXRjaCBjbGFzcyBjaGFuZ2VzIGZvciBjbG9zZSBzdGF0ZVxuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwibWF4LWgtOTZcIiwgXCJvdmVyZmxvdy1hdXRvXCIpO1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwibWF4LWgtc3BhY2UtMTI4XCIpO1xuICAgIHRoaXMuYnV0dG9uV3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwiaC1zcGFjZS00MFwiLCBcIlsmX3N2Z106cm90YXRlLTE4MFwiKTtcbiAgICB0aGlzLnRvZ2dsZVNwYW4udGV4dENvbnRlbnQgPSBcIkV4cGFuZFwiO1xuICB9LFxuICBoaWRlQnV0dG9uKCkge1xuICAgIC8vIEhpZGUgYnV0dG9uIGlmIHdyYXBwZXIgaGVpZ2h0IGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byBNSU5fSEVJR0hUXG4gICAgY29uc3QgTUlOX0hFSUdIVCA9IDkwO1xuICAgIGlmICh0aGlzLndyYXBwZXIuY2xpZW50SGVpZ2h0IDw9IE1JTl9IRUlHSFQpIHtcbiAgICAgIHRoaXMuYnV0dG9uV3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29kZVByZXZpZXc7XG4iLCAiLyoqXG4gKiBBY2NvcmRpb24gQ29tcG9uZW50XG4gKlxuICogSG9va3MgZm9yIHRoZSBBY2NvcmRpb24gQ29tcG9uZW50XG4gKiAqL1xuXG4vLyBEZWZpbmUgdGhlIEFjY29yZGlvbiBBbmltYXRpb24gZHVyYXRpb24sIGRlc2NyaWJlZCBhcyB0aGUgdGltZSBpdCB0YWtlcyB0byBvcGVuIG9yIGNsb3NlIDFweFxuY29uc3QgVFJBTlNJVElPTl9EVVJBVElPTiA9IDMwMDtcblxuLy8gRGVmaW5lIHRoZSBBY2NvcmRpb24gQW5pbWF0aW9uIGVhc2luZywgZGVzY3JpYmVkIGFzIHRoZSBjdWJpYy1iZXppZXIgZm9yIHRoZSBhbmltYXRpb25cbmNvbnN0IFRJTUlOR19BTklNQVRJT05fRUFTRV9FTVBIQVNJWkVEID0gXCJjdWJpYy1iZXppZXIoMC40LCAwLjE0LCAwLjMsIDEpXCI7XG5cbi8vIERlZmluZSB0aGUgQWNjb3JkaW9uIEFuaW1hdGlvbiBPcGVuaW5nIGFuZCBDbG9zaW5nXG5jb25zdCBBQ0NPUkRJT05fT1BFTklORyA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAga2V5ZnJhbWVzKHB4KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IFtcIjBweFwiLCBgJHtweH1weGBdLFxuICAgICAgfTtcbiAgICB9LFxuICAgIG9wdHMocHgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGR1cmF0aW9uOiBUUkFOU0lUSU9OX0RVUkFUSU9OLFxuICAgICAgICBlYXNpbmc6IFRJTUlOR19BTklNQVRJT05fRUFTRV9FTVBIQVNJWkVELFxuICAgICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICBjb250ZW50OiB7XG4gICAga2V5ZnJhbWVzOiB7XG4gICAgICBvcGFjaXR5OiBbMCwgMV0sXG4gICAgICBmaWx0ZXI6IFtcImJsdXIoMXB4KVwiLCBcImJsdXIoMHB4KVwiXSxcbiAgICB9LFxuICAgIG9wdHMoX3B4KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkdXJhdGlvbjogVFJBTlNJVElPTl9EVVJBVElPTixcbiAgICAgICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfRU1QSEFTSVpFRCxcbiAgICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnN0IEFDQ09SRElPTl9DTE9TSU5HID0ge1xuICBjb250YWluZXI6IHtcbiAgICBrZXlmcmFtZXMocHgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlaWdodDogW2Ake3B4fXB4YCwgXCIwcHhcIl0sXG4gICAgICB9O1xuICAgIH0sXG4gICAgb3B0cyhweCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZHVyYXRpb246IFRSQU5TSVRJT05fRFVSQVRJT04sXG4gICAgICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX0VNUEhBU0laRUQsXG4gICAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIGNvbnRlbnQ6IHtcbiAgICBrZXlmcmFtZXM6IHtcbiAgICAgIG9wYWNpdHk6IFsxLCAwXSxcbiAgICAgIGZpbHRlcjogW1wiYmx1cigwcHgpXCIsIFwiYmx1cigxcHgpXCJdLFxuICAgIH0sXG4gICAgb3B0cyhweCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZHVyYXRpb246IFRSQU5TSVRJT05fRFVSQVRJT04sXG4gICAgICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX0VNUEhBU0laRUQsXG4gICAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG59O1xuXG4vLyBNYWluIEFjY29yZGlvbiBIb29rXG5jb25zdCBBY2NvcmRpb24gPSB7XG4gIC8qKlxuICAgKiBNb3VudGluZyBIb29rXG4gICAqL1xuICBtb3VudGVkKCkge1xuICAgIC8vIFRoaXMgdmFyIGtlZXAgdHJhY2sgb2YgdGhlIGN1cnJlbnRseSBvcGVuIGl0ZW1zXG4gICAgdGhpcy5jdXJyZW50bHlPcGVuID0gbmV3IFNldCgpO1xuXG4gICAgLy8gVGhpcyB2YXIga2VlcCB0cmFjayBvZiB0aGUgaXRlbXNcbiAgICB0aGlzLml0ZW1zID0gbmV3IFNldCgpO1xuXG4gICAgLy8gQ3VycmVudCBtb2RlIG9mIHRoZSBBY2NvcmRpb25cbiAgICB0aGlzLm1vZGUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKSB8fCBcInNpbmdsZVwiO1xuXG4gICAgLy8gU2NhbiBmb3IgQWNjb3JkaW9uIEl0ZW1zXG4gICAgdGhpcy5zY2FuRm9ySXRlbXMoKTtcbiAgfSxcbiAgLyoqXG4gICAqIFVwZGF0ZWQgSG9va1xuICAgKi9cbiAgdXBkYXRlZCgpIHtcbiAgICB0aGlzLnNjYW5Gb3JJdGVtcygpO1xuICB9LFxuICAvKipcbiAgICogRGVzdHJveWVkIEhvb2tcbiAgICovXG4gIGRlc3Ryb3llZCgpIHtcbiAgICBpZiAodGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLnNpemUgPiAwKSB7XG4gICAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKCFpdGVtIHx8ICFpdGVtLmlkIHx8ICFpdGVtLmZ1bmNUb2dnbGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBpZCwgZnVuY1RvZ2dsZSB9ID0gaXRlbTtcbiAgICAgICAgY29uc3QgaXRlbVRvUmVtb3ZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgICAgIGlmIChpdGVtVG9SZW1vdmUpIHtcbiAgICAgICAgICBpdGVtVG9SZW1vdmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmNUb2dnbGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaXRlbXMuY2xlYXIoKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBTY2FuIGZvciBBY2NvcmRpb24gSXRlbXMsIHRoaXMgaXMgY2FsbGVkIG9uIG1vdW50ZWQgYW5kIHVwZGF0ZWRcbiAgICpcbiAgICovXG4gIHNjYW5Gb3JJdGVtcygpIHtcbiAgICAvLyBSZW1vdmUgcHJldmlvdXMgaG9va3NcbiAgICBpZiAodGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLnNpemUgPiAwKSB7XG4gICAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKCFpdGVtIHx8ICFpdGVtLmlkIHx8ICFpdGVtLmZ1bmNUb2dnbGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBpZCwgZnVuY1RvZ2dsZSB9ID0gaXRlbTtcbiAgICAgICAgY29uc3QgaXRlbVBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgaWYgKGl0ZW1QYXJlbnQpIHtcbiAgICAgICAgICBjb25zdCBpdGVtVG9SZW1vdmUgPSBpdGVtUGFyZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICBcIlttZHMtYWNjb3JkaW9uLWhlYWRlcl1cIlxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpdGVtVG9SZW1vdmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmNUb2dnbGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaXRlbXMuY2xlYXIoKTtcbiAgICB9XG4gICAgY29uc3QgbmV3SXRlbXMgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKFwiW21kcy1hY2NvcmRpb24taXRlbV1cIikpIHtcbiAgICAgIGlmIChpID4gMTAwMDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpICs9IDE7XG4gICAgICBjb25zdCBpZCA9IGl0ZW0uZ2V0QXR0cmlidXRlKFwibWRzLWFjY29yZGlvbi1pdGVtXCIpO1xuXG4gICAgICAvLyBBZGQgdGhlIGl0ZW1zIGRlc2lnbmF0ZWQgdG8gYmUgb3BlbmVkIGF0IHN0YXJ0dXAgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQgaXRlbXMgbGlzdC5cbiAgICAgIGlmIChpdGVtLmdldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgIC8vIEluIG11bHRpLXNlbGVjdCBtb2RlLCBhcHBlbmQgbmV3IGVsZW1lbnRzIHRvIGN1cnJlbnRseU9wZW4gdGhhdCBhcmUgb3BlbmVkIGFzIGRlZmF1bHQuXG4gICAgICAgIC8vIEluIHNpbmdsZS1zZWxlY3QgbW9kZSwgb25seSB0aGUgZmlyc3QgZWxlbWVudCBpcyBhbGxvd2VkIHRvIGJlIG9wZW4gb24gc3RhcnR1cCAoc3Vic2VxdWVudCBvcGVucyBhcmUgYWRkZWQgYW5kIGNsb3NlZCB0byBhdm9pZCBpbmNvbnNpc3RlbmNlcykuXG4gICAgICAgIHRoaXMuY3VycmVudGx5T3Blbi5hZGQoaWQpO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT0gXCJzaW5nbGVcIiAmJiB0aGlzLmN1cnJlbnRseU9wZW4uc2l6ZSA+IDEpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlKGlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBvYmogPSB7IGlkLCBmdW5jVG9nZ2xlOiAoKSA9PiB0aGlzLnRvZ2dsZShpZCkgfTtcbiAgICAgIGlmICghbmV3SXRlbXMuaGFzKG9iaikpIHtcbiAgICAgICAgbmV3SXRlbXMuYWRkKG9iaik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pdGVtcyA9IG5ld0l0ZW1zO1xuICAgIHRoaXMuc2V0dXAoKTtcbiAgfSxcbiAgLyoqXG4gICAqIFNldHVwIHRoZSBBY2NvcmRpb24gSXRlbXMgY2xpY2sgZXZlbnRzXG4gICAqXG4gICAqL1xuICBzZXR1cCgpIHtcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKHsgaWQsIGZ1bmNUb2dnbGUgfSkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgIGlmICghaXRlbSkgcmV0dXJuO1xuICAgICAgY29uc3QgaGVhZGVyID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiW21kcy1hY2NvcmRpb24taGVhZGVyXVwiKTtcbiAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jVG9nZ2xlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEV4dGVuZCB0aGUgQWNjb3JkaW9uIEl0ZW0gd2l0aCB0aGUgb3BlbiBhbmQgY2xvc2UgZXZlbnRzXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibWRzOjphY2NvcmRpb246b3BlblwiLCAoZSkgPT4ge1xuICAgICAgY29uc3QgaW5kZXhUb09wZW4gPSBlLmRldGFpbC5pbmRleDtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnV0aWxzLnNldEF0KHRoaXMuaXRlbXMsIGluZGV4VG9PcGVuKTtcbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHRoaXMub3BlbihpdGVtLmlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZHM6OmFjY29yZGlvbjpjbG9zZVwiLCAoZSkgPT4ge1xuICAgICAgY29uc3QgaW5kZXhUb09wZW4gPSBlLmRldGFpbC5pbmRleDtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnV0aWxzLnNldEF0KHRoaXMuaXRlbXMsIGluZGV4VG9PcGVuKTtcbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoaXRlbS5pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibWRzOjphY2NvcmRpb246dG9nZ2xlXCIsIChlKSA9PiB7XG4gICAgICBjb25zdCBpbmRleFRvT3BlbiA9IGUuZGV0YWlsLmluZGV4O1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMudXRpbHMuc2V0QXQodGhpcy5pdGVtcywgaW5kZXhUb09wZW4pO1xuICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5mdW5jVG9nZ2xlKSB7XG4gICAgICAgIGl0ZW0uZnVuY1RvZ2dsZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB0b2dnbGUoaWQpIHtcbiAgICBjb25zdCBpdGVtRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgY29uc3QgaXNPcGVuID0gaXRlbUVsLmdldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIikgPT09IFwidHJ1ZVwiO1xuICAgIGlmIChpc09wZW4pIHtcbiAgICAgIHRoaXMuY2xvc2UoaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oaWQpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIE9wZW4gYW4gQWNjb3JkaW9uIEl0ZW1cbiAgICogKi9cbiAgb3BlbihpZCkge1xuICAgIGNvbnN0IGJ1dHRvbkVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGNvbnN0IGNvbnRlbnRFbCA9IGJ1dHRvbkVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWFjY29yZGlvbi1jb250ZW50XVwiKTtcbiAgICBjb25zdCBpbm5lckNvbnRlbnRFbCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCJbbWRzLWFjY29yZGlvbi1pbm5lci1jb250ZW50XVwiXG4gICAgKTtcbiAgICBjb25zdCBncmFkaWVudEVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWFjY29yZGlvbi1ncmFkaWVudF1cIik7XG5cbiAgICBpZiAoIWNvbnRlbnRFbCB8fCB0aGlzLmN1cnJlbnRseU9wZW4uaGFzKGlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgaGVpZ2h0IG9mIHRoZSBjb250ZW50XG4gICAgY29uc3QgcHggPSB0aGlzLmNsb25lQW5kQ2FsY3VsYXRlSGVpZ2h0KGNvbnRlbnRFbCk7XG4gICAgZ3JhZGllbnRFbC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG5cbiAgICBpZiAodGhpcy5tb2RlID09PSBcInNpbmdsZVwiKSB7XG4gICAgICB0aGlzLmN1cnJlbnRseU9wZW4uZm9yRWFjaCgob3BlbklkKSA9PiB7XG4gICAgICAgIHRoaXMuY2xvc2Uob3BlbklkKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnRlbnRFbC5hbmltYXRlKFxuICAgICAgQUNDT1JESU9OX09QRU5JTkcuY29udGFpbmVyLmtleWZyYW1lcyhweCksXG4gICAgICBBQ0NPUkRJT05fT1BFTklORy5jb250YWluZXIub3B0cyhweClcbiAgICApO1xuICAgIGlubmVyQ29udGVudEVsLmFuaW1hdGUoXG4gICAgICBBQ0NPUkRJT05fT1BFTklORy5jb250ZW50LmtleWZyYW1lcyxcbiAgICAgIEFDQ09SRElPTl9PUEVOSU5HLmNvbnRlbnQub3B0cyhweClcbiAgICApO1xuXG4gICAgYnV0dG9uRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XG4gICAgY29udGVudEVsLnNldEF0dHJpYnV0ZShcImRhdGEtb3BlblwiLCBcInRydWVcIik7XG5cbiAgICBjb25zdCBzdmdfbGlzdCA9IGJ1dHRvbkVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdmdcIik7XG4gICAgc3ZnX2xpc3QuZm9yRWFjaCgoc3ZnKSA9PiB7XG4gICAgICBpZiAoc3ZnKSB7XG4gICAgICAgIHN2Zy5kYXRhc2V0Lm9wZW4gPSBcInRydWVcIjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChUUkFOU0lUSU9OX0RVUkFUSU9OIC0gMzAwIDwgMCkge1xuICAgICAgZ3JhZGllbnRFbC5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBncmFkaWVudEVsLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICAgIH0sIFRSQU5TSVRJT05fRFVSQVRJT04gLSAzMDApO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudGx5T3Blbi5hZGQoaWQpO1xuICB9LFxuICAvKipcbiAgICogQ2xvc2UgYW4gQWNjb3JkaW9uIEl0ZW1cbiAgICogKi9cbiAgY2xvc2UoaWQpIHtcbiAgICBjb25zdCBidXR0b25FbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBjb25zdCBjb250ZW50RWwgPSBidXR0b25FbC5xdWVyeVNlbGVjdG9yKFwiW21kcy1hY2NvcmRpb24tY29udGVudF1cIik7XG5cbiAgICAvLyBJbiBjYXNlIGFzeW5jIGNvbnRlbnQgaXMgbm90IGxvYWRlZCwgd2UgbmVlZCB0byBjaGVjayBpZiB0aGUgY29udGVudCBleGlzdHNcbiAgICAvLyBhbmQgaWYgdGhlIGl0ZW0gaXMgb3BlblxuICAgIGlmICghY29udGVudEVsIHx8IHRoaXMuY3VycmVudGx5T3Blbi5oYXMoaWQpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlubmVyQ29udGVudEVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIlttZHMtYWNjb3JkaW9uLWlubmVyLWNvbnRlbnRdXCJcbiAgICApO1xuICAgIGNvbnN0IGdyYWRpZW50RWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcihcIlttZHMtYWNjb3JkaW9uLWdyYWRpZW50XVwiKTtcblxuICAgIGNvbnN0IHB4ID1cbiAgICAgIGNvbnRlbnRFbC5vZmZzZXRIZWlnaHQgKyB0aGlzLnV0aWxzLmdldFBhZGRpbmdTaXplQWNjb3JkaW9uKGNvbnRlbnRFbCk7XG5cbiAgICBncmFkaWVudEVsLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcblxuICAgIGNvbnRlbnRFbC5hbmltYXRlKFxuICAgICAgQUNDT1JESU9OX0NMT1NJTkcuY29udGFpbmVyLmtleWZyYW1lcyhweCksXG4gICAgICBBQ0NPUkRJT05fQ0xPU0lORy5jb250YWluZXIub3B0cyhweClcbiAgICApO1xuICAgIGlubmVyQ29udGVudEVsLmFuaW1hdGUoXG4gICAgICBBQ0NPUkRJT05fQ0xPU0lORy5jb250ZW50LmtleWZyYW1lcyxcbiAgICAgIEFDQ09SRElPTl9DTE9TSU5HLmNvbnRlbnQub3B0cyhweClcbiAgICApO1xuXG4gICAgY29uc3Qgc3ZnX2xpc3QgPSBidXR0b25FbC5xdWVyeVNlbGVjdG9yQWxsKFwic3ZnXCIpO1xuICAgIHN2Z19saXN0LmZvckVhY2goKHN2ZykgPT4ge1xuICAgICAgaWYgKHN2Zykge1xuICAgICAgICBzdmcuZGF0YXNldC5vcGVuID0gXCJmYWxzZVwiO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBidXR0b25FbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XG4gICAgICBjb250ZW50RWwuc2V0QXR0cmlidXRlKFwiZGF0YS1vcGVuXCIsIFwiZmFsc2VcIik7XG4gICAgICB0aGlzLmN1cnJlbnRseU9wZW4uZGVsZXRlKGlkKTtcbiAgICAgIGdyYWRpZW50RWwuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgIH0sIFRSQU5TSVRJT05fRFVSQVRJT04gLSAyMCk7XG4gIH0sXG4gIHV0aWxzOiB7XG4gICAgY29udmVydFJlbVRvUGl4ZWxzKHJlbSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgcmVtICogcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemUpXG4gICAgICApO1xuICAgIH0sXG4gICAgLy8gU21hbGwgVXRpbHMgdG8gZmV0Y2ggdGhlIGVsZW1lbnQgaW4gdGhlIGluZGV4IGZyb20gdGhlIHNldFxuICAgIHNldEF0KHNldCwgaW5kZXgpIHtcbiAgICAgIGlmIChNYXRoLmFicyhpbmRleCkgPiBzZXQuc2l6ZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgbGV0IGlkeCA9IGluZGV4O1xuICAgICAgaWYgKGlkeCA8IDApIHtcbiAgICAgICAgaWR4ID0gc2V0LnNpemUgKyBpbmRleDtcbiAgICAgIH1cbiAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgIGZvciAoY29uc3QgZWxlbSBvZiBzZXQpIHtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gaWR4KSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgICAgIH1cbiAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRQYWRkaW5nU2l6ZUFjY29yZGlvbihlbCkge1xuICAgICAgbGV0IHJlbSA9IHdpbmRvd1xuICAgICAgICAuZ2V0Q29tcHV0ZWRTdHlsZShlbClcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCItLW1kcy1hY2NvcmRpb24tcGFkZGluZ1wiKTtcblxuICAgICAgaWYgKCFyZW0gfHwgdHlwZW9mIHJlbSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgcmVtID0gcmVtLnRyaW0oKS5yZXBsYWNlKFwicmVtXCIsIFwiXCIpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jb252ZXJ0UmVtVG9QaXhlbHMocGFyc2VGbG9hdChyZW0pKTtcbiAgICB9LFxuICB9LFxuICBjbG9uZUFuZENhbGN1bGF0ZUhlaWdodChlbGVtZW50KSB7XG4gICAgLy8gQ2xvbmUgdGhlIGVsZW1lbnRcbiAgICBjb25zdCBjbG9uZSA9IGVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSBjbG9uZSB0byBiZSBhYnNvbHV0ZSBhbmQgaGlkZGVuXG4gICAgY2xvbmUuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgY2xvbmUuc3R5bGUudG9wID0gXCItOTk5OXB4XCI7XG4gICAgY2xvbmUuc3R5bGUubGVmdCA9IFwiLTk5OTlweFwiO1xuICAgIGNsb25lLnN0eWxlLm1heEhlaWdodCA9IFwiNDAwMHB4XCI7XG4gICAgY2xvbmUuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgY2xvbmUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBjbG9uZS5zdHlsZS53aWR0aCA9IGVsZW1lbnQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCArIFwicHhcIjtcbiAgICBjbG9uZS5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcblxuICAgIGNvbnN0IHBhcmVudFBhZGRpbmdWYXIgPSB3aW5kb3dcbiAgICAgIC5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQucGFyZW50RWxlbWVudClcbiAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1tZHMtYWNjb3JkaW9uLXBhZGRpbmdcIik7XG5cbiAgICBpZiAocGFyZW50UGFkZGluZ1Zhcikge1xuICAgICAgY2xvbmUuc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFwiLS1tZHMtYWNjb3JkaW9uLXBhZGRpbmdcIixcbiAgICAgICAgcGFyZW50UGFkZGluZ1Zhci50cmltKClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgdHcgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKGNsb25lLCBOb2RlRmlsdGVyLlNIT1dfQUxMKTtcbiAgICAvLyBSZW1vdmUgYWxsIHRoZSBpZHMgYW5kIG5hbWVzIGZyb20gdGhlIGNsb25lLCB0byBhdm9pZCBtZXNzIHdpdGggbGl2ZSB2aWV3XG4gICAgbGV0IGkgPSAwO1xuICAgIC8vIEdvIHRocm91Z2ggdGhlIHRyZWUgd2Fsa2VyIGJ1dCBsaW1pdCB0byAxMDAwbm9kZXNcbiAgICB3aGlsZSAodHcubmV4dE5vZGUoKSAmJiBpIDwgMTAwMCkge1xuICAgICAgaSsrO1xuICAgICAgY29uc3Qgbm9kZSA9IHR3LmN1cnJlbnROb2RlO1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBub2RlLnJlbW92ZUF0dHJpYnV0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKFwiaWRcIik7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBcHBlbmQgdGhlIGNsb25lIHRvIHRoZSBib2R5XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjbG9uZSk7XG5cbiAgICAvLyBHZXQgdGhlIGhlaWdodCBvZiB0aGUgY2xvbmVcbiAgICBjb25zdCBoZWlnaHQgPSBjbG9uZS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBSZW1vdmUgdGhlIGNsb25lXG4gICAgY2xvbmUucmVtb3ZlKCk7XG5cbiAgICAvLyBSZXR1cm4gdGhlIGhlaWdodFxuICAgIHJldHVybiBoZWlnaHQ7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY2NvcmRpb247XG4iLCAibGV0IEF1dGhlbnRpY2F0b3IgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy51cGRhdGVJbnB1dHMoKTtcbiAgfSxcblxuICB1cGRhdGVkKCkge1xuICAgIHRoaXMudXBkYXRlSW5wdXRzKCk7XG4gIH0sXG5cbiAgZGVzdHJveWVkKCkge1xuICAgIHRoaXMudGVhcmRvd24oKTtcbiAgfSxcblxuICB1cGRhdGVJbnB1dHMoKSB7XG4gICAgdGhpcy50ZWFyZG93bigpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUlucHV0cygpO1xuICAgIHRoaXMuc2V0Rm9jdXNPbkZpcnN0SW5wdXRJZk5lZWRlZCgpO1xuICB9LFxuXG4gIGluaXRpYWxpemVJbnB1dHMoKSB7XG4gICAgdGhpcy5pbnB1dHMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKTtcbiAgICB0aGlzLmNhbGxiYWNrID0gdGhpcy5lbC5kYXRhc2V0LmNhbGxiYWNrO1xuICAgIHRoaXMuY29kZUxlbmd0aCA9IHRoaXMuaW5wdXRzLmxlbmd0aDtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0gW107XG5cbiAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCwgaW5kZXgpID0+IHtcbiAgICAgIHRoaXMuYmluZExpc3RlbmVyKGlucHV0LCBcImlucHV0XCIsIChlKSA9PiB0aGlzLmhhbmRsZUlucHV0KGUsIGluZGV4KSk7XG4gICAgICB0aGlzLmJpbmRMaXN0ZW5lcihpbnB1dCwgXCJrZXlkb3duXCIsIChlKSA9PiB0aGlzLmhhbmRsZUtleURvd24oZSwgaW5kZXgpKTtcbiAgICAgIHRoaXMuYmluZExpc3RlbmVyKGlucHV0LCBcInBhc3RlXCIsIChlKSA9PiB0aGlzLmhhbmRsZVBhc3RlKGUpKTtcbiAgICB9KTtcbiAgfSxcblxuICBzZXRGb2N1c09uRmlyc3RJbnB1dElmTmVlZGVkKCkge1xuICAgIGNvbnN0IGFjdGl2ZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgc2hvdWxkRm9jdXMgPVxuICAgICAgdGhpcy5pbnB1dHMubGVuZ3RoID4gMCAmJlxuICAgICAgKGFjdGl2ZSA9PT0gZG9jdW1lbnQuYm9keSB8fCBBcnJheS5mcm9tKHRoaXMuaW5wdXRzKS5pbmNsdWRlcyhhY3RpdmUpKSAmJlxuICAgICAgQXJyYXkuZnJvbSh0aGlzLmlucHV0cykuZXZlcnkoaSA9PiAhaS52YWx1ZSk7XG5cbiAgICBpZiAoc2hvdWxkRm9jdXMpIHtcbiAgICAgIHRoaXMuaW5wdXRzWzBdLmZvY3VzKCk7XG4gICAgfVxuICB9LFxuXG4gIGJpbmRMaXN0ZW5lcihpbnB1dCwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnB1c2goeyBpbnB1dCwgZXZlbnQsIGhhbmRsZXIgfSk7XG4gIH0sXG5cbiAgdGVhcmRvd24oKSB7XG4gICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJzKSByZXR1cm47XG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5mb3JFYWNoKCh7IGlucHV0LCBldmVudCwgaGFuZGxlciB9KSA9PiB7XG4gICAgICBpbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcbiAgICB9KTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0gW107XG4gIH0sXG5cbiAgZ2V0Q29kZSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmlucHV0cykubWFwKGkgPT4gaS52YWx1ZSkuam9pbignJyk7XG4gIH0sXG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5pbnB1dHMuZm9yRWFjaChpID0+IGkudmFsdWUgPSBcIlwiKTtcbiAgICB0aGlzLmlucHV0c1swXS5mb2N1cygpO1xuICB9LFxuXG4gIGhhbmRsZUlucHV0KGUsIGluZGV4KSB7XG4gICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldDtcbiAgICBjb25zdCB2YWwgPSBpbnB1dC52YWx1ZS50b1VwcGVyQ2FzZSgpO1xuICAgIGlucHV0LnZhbHVlID0gdmFsO1xuXG4gICAgaWYgKHZhbCAmJiBpbmRleCA8IHRoaXMuaW5wdXRzLmxlbmd0aCAtIDEpIHtcbiAgICAgIHRoaXMuaW5wdXRzW2luZGV4ICsgMV0uZm9jdXMoKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb2RlID0gdGhpcy5nZXRDb2RlKCk7XG4gICAgaWYgKGNvZGUubGVuZ3RoID09PSB0aGlzLmNvZGVMZW5ndGggJiYgdGhpcy5jYWxsYmFjaykge1xuICAgICAgdGhpcy5wdXNoRXZlbnQodGhpcy5jYWxsYmFjaywgeyBjb2RlIH0pO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVLZXlEb3duKGUsIGluZGV4KSB7XG4gICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldDtcbiAgICBpZiAoKGUua2V5ID09PSBcIkJhY2tzcGFjZVwiIHx8IGUua2V5ID09PSBcIkRlbGV0ZVwiKSAmJiBpbnB1dC52YWx1ZSA9PT0gXCJcIiAmJiBpbmRleCA+IDApIHtcbiAgICAgIHRoaXMuaW5wdXRzW2luZGV4IC0gMV0uZm9jdXMoKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlUGFzdGUoZSkge1xuICAgIGNvbnN0IHBhc3RlZCA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKFwidGV4dFwiKS5zbGljZSgwLCB0aGlzLmNvZGVMZW5ndGgpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCwgaSkgPT4ge1xuICAgICAgaW5wdXQudmFsdWUgPSBwYXN0ZWRbaV0gfHwgXCJcIjtcbiAgICB9KTtcblxuICAgIGNvbnN0IGxhc3RJbmRleCA9IHBhc3RlZC5sZW5ndGggLSAxO1xuICAgIGlmIChsYXN0SW5kZXggPj0gMCAmJiBsYXN0SW5kZXggPCB0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaW5wdXRzW2xhc3RJbmRleF0uZm9jdXMoKTtcbiAgICB9XG5cbiAgICBpZiAocGFzdGVkLmxlbmd0aCA9PT0gdGhpcy5jb2RlTGVuZ3RoICYmIHRoaXMuY2FsbGJhY2spIHtcbiAgICAgIHRoaXMucHVzaEV2ZW50KHRoaXMuY2FsbGJhY2ssIHsgY29kZTogcGFzdGVkIH0pO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXV0aGVudGljYXRvcjtcbiIsICJleHBvcnQgY29uc3QgU0NST0xMX0xPQ0tfQ0xBU1MgPSBcIm1vb25kcy1zY3JvbGwtbG9ja1wiO1xuZXhwb3J0IGNvbnN0IERSQVdFUl9BTklNQVRJT05fRFVSQVRJT04gPSA0MDA7XG5leHBvcnQgY29uc3QgRFJBV0VSX0FOSU1BVElPTl9PUFRTX05VTEwgPSB7IGR1cmF0aW9uOiAwLCBpdGVyYXRpb25zOiAxIH07XG5cbmV4cG9ydCBjb25zdCBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQgPSBcImN1YmljLWJlemllcigwLjIsIDAsIDAuMzgsIDAuOSlcIjtcbmV4cG9ydCBjb25zdCBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfRU1QSEFTSVpFRCA9XG4gIFwiY3ViaWMtYmV6aWVyKDAuNCwgMC4xNCwgMC4zLCAxKVwiO1xuXG4vLyBEcmF3ZXIgQW5pbWF0aW9uc1xuZXhwb3J0IGNvbnN0IERSQVdFUl9FTlRSWV9BTklNQVRJT04gPSB7XG4gIHBhcmVudDoge1xuICAgIGtleWZyYW1lczogW1xuICAgICAgeyB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWChjYWxjKHZhcigtLW1vb25kcy10cmFuc2xhdGUtZGlyZWN0aW9uKSoxMDAlKSlcIiB9LFxuICAgICAgeyB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWCgwKVwiIH0sXG4gICAgXSxcbiAgICBvcHRzOiB7XG4gICAgICBkdXJhdGlvbjogRFJBV0VSX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICBlYXNpbmc6IFRJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCxcbiAgICB9LFxuICB9LFxuICBjaGlsZDoge1xuICAgIGtleWZyYW1lczogW1xuICAgICAgeyB0cmFuc2Zvcm06IFwidHJhbnNsYXRlM2QoMzBweCwgMCwgMClcIiwgb3BhY2l0eTogMCwgZmlsdGVyOiBcImJsdXIoMnB4KVwiIH0sXG4gICAgICB7IHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVYKDApXCIsIG9wYWNpdHk6IDEsIGZpbHRlcjogXCJibHVyKDApXCIgfSxcbiAgICBdLFxuICAgIG9wdHM6IHtcbiAgICAgIGR1cmF0aW9uOiBEUkFXRVJfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX0VNUEhBU0laRUQsXG4gICAgfSxcbiAgfSxcbn07XG5leHBvcnQgY29uc3QgRFJBV0VSX0VYSVRfQU5JTUFUSU9OID0ge1xuICBwYXJlbnQ6IHtcbiAgICBrZXlmcmFtZXM6IFtcbiAgICAgIHsgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVgoMClcIiB9LFxuICAgICAgeyB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWChjYWxjKHZhcigtLW1vb25kcy10cmFuc2xhdGUtZGlyZWN0aW9uKSoxMDAlKSlcIiB9LFxuICAgIF0sXG4gICAgb3B0czoge1xuICAgICAgZHVyYXRpb246IERSQVdFUl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQsXG4gICAgfSxcbiAgfSxcbiAgY2hpbGQ6IHtcbiAgICBrZXlmcmFtZXM6IFtcbiAgICAgIHsgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZTNkKDAsIDAsIDApXCIsIG9wYWNpdHk6IDEsIGZpbHRlcjogXCJibHVyKDApXCIgfSxcbiAgICAgIHsgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZTNkKDMwcHgsIDAsIDApXCIsIG9wYWNpdHk6IDAsIGZpbHRlcjogXCJibHVyKDJweClcIiB9LFxuICAgIF0sXG4gICAgb3B0czoge1xuICAgICAgZHVyYXRpb246IERSQVdFUl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfRU1QSEFTSVpFRCxcbiAgICB9LFxuICB9LFxufTtcblxuLy8gQm90dG9tU2hlZXQgQW5pbWF0aW9uc1xuZXhwb3J0IGNvbnN0IEJPVFRPTVNIRUVUX0VOVFJZX0FOSU1BVElPTiA9IHtcbiAgcGFyZW50OiB7XG4gICAga2V5ZnJhbWVzOiBbXG4gICAgICB7IHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKDEwMCUpXCIgfSxcbiAgICAgIHsgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoMClcIiB9LFxuICAgIF0sXG4gICAgb3B0czoge1xuICAgICAgZHVyYXRpb246IERSQVdFUl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQsXG4gICAgfSxcbiAgfSxcbiAgY2hpbGQ6IHtcbiAgICBrZXlmcmFtZXM6IFtcbiAgICAgIHsgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZTNkKDAsIDMwcHgsIDApXCIsIG9wYWNpdHk6IDAsIGZpbHRlcjogXCJibHVyKDJweClcIiB9LFxuICAgICAgeyB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgwKVwiLCBvcGFjaXR5OiAxLCBmaWx0ZXI6IFwiYmx1cigwKVwiIH0sXG4gICAgXSxcbiAgICBvcHRzOiB7XG4gICAgICBkdXJhdGlvbjogRFJBV0VSX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICBlYXNpbmc6IFRJTUlOR19BTklNQVRJT05fRUFTRV9FTVBIQVNJWkVELFxuICAgIH0sXG4gIH0sXG59O1xuZXhwb3J0IGNvbnN0IEJPVFRPTVNIRUVUX0VYSVRfQU5JTUFUSU9OID0ge1xuICBwYXJlbnQ6IHtcbiAgICBrZXlmcmFtZXMoeSA9IDApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHsgdHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke3l9cHgpYCB9LFxuICAgICAgICB7IHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKDEwMCUpXCIgfSxcbiAgICAgIF07XG4gICAgfSxcbiAgICBvcHRzOiB7XG4gICAgICBkdXJhdGlvbjogRFJBV0VSX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICBlYXNpbmc6IFRJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCxcbiAgICB9LFxuICB9LFxuICBjaGlsZDoge1xuICAgIGtleWZyYW1lczogW1xuICAgICAgeyB0cmFuc2Zvcm06IFwidHJhbnNsYXRlM2QoMCwgMCwgMClcIiwgb3BhY2l0eTogMSwgZmlsdGVyOiBcImJsdXIoMClcIiB9LFxuICAgICAgeyB0cmFuc2Zvcm06IFwidHJhbnNsYXRlM2QoMCwgMCwgMClcIiwgb3BhY2l0eTogMCwgZmlsdGVyOiBcImJsdXIoMnB4KVwiIH0sXG4gICAgXSxcbiAgICBvcHRzOiB7XG4gICAgICBkdXJhdGlvbjogRFJBV0VSX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICBlYXNpbmc6IFRJTUlOR19BTklNQVRJT05fRUFTRV9FTVBIQVNJWkVELFxuICAgIH0sXG4gIH0sXG59O1xuXG4vLyBNb2RhbCBBbmltYXRpb25zXG5leHBvcnQgY29uc3QgTU9EQUxfRU5UUllfQU5JTUFUSU9OID0ge1xuICBwYXJlbnQ6IHtcbiAgICBrZXlmcmFtZXM6IFt7IG9wYWNpdHk6IDAgfSwgeyBvcGFjaXR5OiAxIH1dLFxuICAgIG9wdHM6IHtcbiAgICAgIGR1cmF0aW9uOiBEUkFXRVJfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX1NUQU5EQVJELFxuICAgIH0sXG4gIH0sXG4gIGNoaWxkOiB7XG4gICAga2V5ZnJhbWVzOiBbXG4gICAgICB7IHRyYW5zZm9ybTogXCJ0cmFuc2xhdGUzZCgwLCAwLCAwKVwiLCBvcGFjaXR5OiAwLCBmaWx0ZXI6IFwiYmx1cigycHgpXCIgfSxcbiAgICAgIHsgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZTNkKDAsIDAsIDApXCIsIG9wYWNpdHk6IDEsIGZpbHRlcjogXCJibHVyKDApXCIgfSxcbiAgICBdLFxuICAgIG9wdHM6IHtcbiAgICAgIGR1cmF0aW9uOiBEUkFXRVJfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX0VNUEhBU0laRUQsXG4gICAgfSxcbiAgfSxcbn07XG5leHBvcnQgY29uc3QgTU9EQUxfRVhJVF9BTklNQVRJT04gPSB7XG4gIHBhcmVudDoge1xuICAgIGtleWZyYW1lczogW3sgb3BhY2l0eTogMSB9LCB7IG9wYWNpdHk6IDAgfV0sXG4gICAgb3B0czoge1xuICAgICAgZHVyYXRpb246IERSQVdFUl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQsXG4gICAgfSxcbiAgfSxcbiAgY2hpbGQ6IHtcbiAgICBrZXlmcmFtZXM6IFtcbiAgICAgIHsgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZTNkKDAsIDAsIDApXCIsIG9wYWNpdHk6IDEsIGZpbHRlcjogXCJibHVyKDApXCIgfSxcbiAgICAgIHsgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZTNkKDAsIDAsIDApXCIsIG9wYWNpdHk6IDAsIGZpbHRlcjogXCJibHVyKDJweClcIiB9LFxuICAgIF0sXG4gICAgb3B0czoge1xuICAgICAgZHVyYXRpb246IERSQVdFUl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfRU1QSEFTSVpFRCxcbiAgICB9LFxuICB9LFxufTtcbiIsICJpbXBvcnQge1xuICBTQ1JPTExfTE9DS19DTEFTUyxcbiAgRFJBV0VSX0FOSU1BVElPTl9EVVJBVElPTixcbiAgRFJBV0VSX0FOSU1BVElPTl9PUFRTX05VTEwsXG4gIERSQVdFUl9FTlRSWV9BTklNQVRJT04sXG4gIERSQVdFUl9FWElUX0FOSU1BVElPTixcbiAgTU9EQUxfRU5UUllfQU5JTUFUSU9OLFxuICBNT0RBTF9FWElUX0FOSU1BVElPTixcbiAgQk9UVE9NU0hFRVRfRVhJVF9BTklNQVRJT04sXG4gIEJPVFRPTVNIRUVUX0VOVFJZX0FOSU1BVElPTixcbiAgVElNSU5HX0FOSU1BVElPTl9FQVNFX1NUQU5EQVJELFxufSBmcm9tIFwiLi4vY29uc3RhbnRzL3ZhcmlhYmxlc1wiO1xuXG4vKipcbiAqIEB0eXBlIHtpbXBvcnQoXCJwaG9lbml4X2xpdmVfdmlld1wiKS5WaWV3SG9va31cbiAqL1xuY29uc3QgRHJhd2VyID0ge1xuICAvKipcbiAgICogTW91bnQgRnVuY3Rpb24gLSBDYWxsZWQgd2hlbiB0aGUgTGl2ZVZpZXcgaXMgbW91bnRlZFxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gU2V0dXAgTG9ja2Vyc1xuICAgIHRoaXMuc2V0dXBMb2NrZXJzKCk7XG5cbiAgICAvLyBHZW5lcmFsIFNldHVwXG4gICAgdGhpcy5zZXR1cCgpO1xuXG4gICAgLy8gR2V0IHRoZSBpbml0aWFsIHN0YXRlXG4gICAgdGhpcy5pbml0aWFsU3RhdGUgPVxuICAgICAgdGhpcy51dGlscy5nZXREYXRhKHRoaXMuZWwsIFwiaW5pdGlhbC1zdGF0ZVwiKSB8fCBcImNsb3NlZFwiO1xuICAgIHRoaXMuaXNEaXNhYmxlZERpYWxvZyA9IHRoaXMuZWwuZGF0YXNldC5kaXNhYmxlZE5hdGl2ZURpYWxvZyA9PT0gXCJ0cnVlXCI7XG5cbiAgICBpZiAodGhpcy5pbml0aWFsU3RhdGUgPT09IFwib3BlblwiKSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbG9zZSh0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbC5kYXRhc2V0Lm1vZGUgPT09IFwiYm90dG9tc2hlZXRcIikge1xuICAgICAgdGhpcy5fb25SZXNpemUgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYm90dG9tU2hlZXRFdmVudHNDb25kaXRpb25hbCgpO1xuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBUaGUgYHVwZGF0ZWRgIGhvb2sgaXMgY2FsbGVkIGFmdGVyIHRoZSBMaXZlVmlldyBoYXMgYmVlbiB1cGRhdGVkIGFuZFxuICAgKiB0aGUgRE9NIGhhcyBiZWVuIHBhdGNoZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgdXBkYXRlZCgpIHtcbiAgICBjb25zdCBjdXJyZW50SW5pdGlhbFN0YXRlID0gdGhpcy51dGlscy5nZXREYXRhKHRoaXMuZWwsIFwiaW5pdGlhbC1zdGF0ZVwiKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMuaW5pdGlhbFN0YXRlICE9PSBjdXJyZW50SW5pdGlhbFN0YXRlICYmXG4gICAgICBjdXJyZW50SW5pdGlhbFN0YXRlID09IFwib3BlblwiXG4gICAgKSB7XG4gICAgICAvLyBPcGVuaW5nIHNraXBwaW5nIHRoZSBldmVudHMgYW5kIHdpdGhvdXQgdHJhbnNpdGlvblxuICAgICAgdGhpcy5vcGVuKHRydWUsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5tZHNEcmF3ZXJMb2Nrcy5oYXModGhpcy5lbC5pZCkpIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgTGl2ZVZpZXcgUGF0Y2ggYW5kIHRoZSBkcmF3ZXIgaXMgb3Blbiwga2VlcCBvcGVuIHdpdGhvdXQgdHJhbnNpdGlvblxuICAgICAgdGhpcy5vcGVuKHRydWUsIGZhbHNlKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBEZXN0cm95ZWQgaG9va1xuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICpcbiAgICovXG4gIGRlc3Ryb3llZCgpIHtcbiAgICAvLyBUaGlzIGlmIGFscmVhZHkgY2hlY2sgaWYgYm90dG9tc2hlZXQsIGR1ZSB0aGUgZnVuY3Rpb24gZXhpc3RzIG9ubHkgaW4gYm90dG9tc2hlZXQgbW9kZVxuICAgIGlmICh0aGlzLl9vblJlc2l6ZSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5fb25SZXNpemUpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIE9wZW4gRnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBza2lwRXZlbnRzXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGF2ZVRyYW5zaXRpb25cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvcGVuKHNraXBFdmVudHMgPSBmYWxzZSwgaGF2ZVRyYW5zaXRpb24gPSB0cnVlKSB7XG4gICAgLy8gU3RvcCB0aGUgZHJhd2VyIGZyb20gb3BlbmluZyB3aGlsZSBpdCdzIHRyYW5zaXRpb25pbmdcbiAgICBpZiAodGhpcy5pc1RyYW5zaXRpb25pbmcpIHJldHVybjtcblxuICAgIC8vIFRoZSBwdXJwb3NlIG9mIHRoaXMgaXMgdG8gYXZvaWQgdGhlIGRyYXdlciB0byBvcGVuIHR3aWNlLCBhbmQgcmVtYWluIHN0dWNrIGluIG9wZW4gcG9zaXRpb24uXG4gICAgdGhpcy5ydW5TYWZldHlDaGVja3MoKTtcblxuICAgIC8vIFJlc2V0IHRoZSBjdXJyZW50IFlcbiAgICB0aGlzLmN1cnJlbnRZID0gMDtcblxuICAgIC8vIERlZmluZSB0aGUgdmFyc1xuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmVsLmRhdGFzZXQuY29udGVudElkKTtcbiAgICBjb25zdCBtb2RlID0gdGhpcy5lbC5kYXRhc2V0Lm1vZGU7XG5cbiAgICB0aGlzLmlzT3BlbmVkID0gdHJ1ZTtcblxuICAgIGlmICghd2luZG93Lm1kc0RyYXdlckxvY2tzLmhhcyh0aGlzLmVsLmlkKSkge1xuICAgICAgd2luZG93Lm1kc0RyYXdlckxvY2tzLmFkZCh0aGlzLmVsLmlkKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldHVwRHJhZ0V2ZW50cygpO1xuXG4gICAgLy8gRXhlYyB0aGUgb3BlbmluZyBIb29rXG4gICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKUyh0aGlzLmVsLCB0aGlzLmVsLmRhdGFzZXQubW9vbk9wZW4pO1xuXG4gICAgLy8gTG9jayB0aGUgc2Nyb2xsXG4gICAgdGhpcy5sb2NrQm9keVNjcm9sbGluZyh0aGlzLmVsKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMuZWwuZGF0YXNldC5tb2RlID09PSBcImJvdHRvbXNoZWV0XCIgJiZcbiAgICAgIHR5cGVvZiB0aGlzLl9vblJlc2l6ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgfVxuXG4gICAgaWYgKGhhdmVUcmFuc2l0aW9uKSB7XG4gICAgICB0aGlzLmVsLmRhdGFzZXQuaXNUcmFuc2l0aW9uaW5nID0gXCJvcGVuXCI7XG4gICAgICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQW5pbWF0ZSB0aGUgRHJhd2VyXG4gICAgdGhpcy5hbmltYXRlKGNvbnRlbnQsIG1vZGUsIFwib3BlblwiLCAhaGF2ZVRyYW5zaXRpb24pO1xuXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZERpYWxvZykge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuc2hvd01vZGFsKCk7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIWhhdmVUcmFuc2l0aW9uKSByZXR1cm47XG4gICAgICB0aGlzLmVsLmRhdGFzZXQuaXNUcmFuc2l0aW9uaW5nID0gXCJub25lXCI7XG4gICAgICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xuICAgICAgaWYgKCFza2lwRXZlbnRzKSB7XG4gICAgICAgIC8vIFRyaWdnZXIgdGhlIGV2ZW50IGZvciB0aGUgZHJhd2VyIG9wZW5lZFxuICAgICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcIm1vb25kczpkcmF3ZXI6b3BlbmVkXCIsIHtcbiAgICAgICAgICBkZXRhaWw6IHsgaWQ6IHRoaXMuZWwuaWQgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuICAgICAgICAvLyBDb3JyZWN0IHRoZSBmb2N1c1xuICAgICAgICBjb25zdCBmaXJzdEJ1dHRvbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcbiAgICAgICAgaWYgKGZpcnN0QnV0dG9uKSBmaXJzdEJ1dHRvbi5mb2N1cygpO1xuICAgICAgfVxuICAgIH0sIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgfSxcbiAgLyoqXG4gICAqIENsb3NlIEZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2tpcEV2ZW50c1xuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNsb3NlKHNraXBFdmVudHMgPSBmYWxzZSwgaGF2ZVRyYW5zaXRpb24gPSB0cnVlKSB7XG4gICAgLy8gRG9uJ3QgY2xvc2UgZHVyaW5nIHRoZSBhbmltYXRpb25cbiAgICBpZiAodGhpcy5pc1RyYW5zaXRpb25pbmcpIHJldHVybjtcblxuICAgIC8vIElmIHRoZSBkcmF3ZXIgaGF2ZSBkYXRhLWZvcmNlLW9wZW4sIGRvbid0IGNsb3NlXG4gICAgaWYgKHRoaXMuZWwuZGF0YXNldC5mb3JjZU9wZW4gPT09IFwidHJ1ZVwiKSByZXR1cm47XG5cbiAgICAvLyBSdW4gc2FmZXR5IGNoZWNrc1xuICAgIHRoaXMucnVuU2FmZXR5Q2hlY2tzKCk7XG5cbiAgICAvLyBEZWZpbmUgdGhlIHZhcnNcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbC5kYXRhc2V0LmNvbnRlbnRJZCk7XG4gICAgY29uc3QgbW9kZSA9IHRoaXMuZWwuZGF0YXNldC5tb2RlO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSBkcmFnIGV2ZW50c1xuICAgIHRoaXMucmVtb3ZlRHJhZ0V2ZW50cygpO1xuICAgIGlmICh0aGlzLmVsLmRhdGFzZXQubW9vbkNsb3NlICYmIHRoaXMuaXNEaXNhYmxlZERpYWxvZykge1xuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKUyh0aGlzLmVsLCB0aGlzLmVsLmRhdGFzZXQubW9vbkNsb3NlKTtcbiAgICB9XG5cbiAgICBpZiAoaGF2ZVRyYW5zaXRpb24pIHtcbiAgICAgIHRoaXMuZWwuZGF0YXNldC5pc1RyYW5zaXRpb25pbmcgPSBcImNsb3NlXCI7XG4gICAgICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGhpcy5lbC5kYXRhc2V0Lm1vZGUgPT09IFwiYm90dG9tc2hlZXRcIiAmJlxuICAgICAgdHlwZW9mIHRoaXMuX29uUmVzaXplID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuX29uUmVzaXplKTtcbiAgICB9XG4gICAgLy8gQW5pbWF0ZSB0aGUgRHJhd2VyXG4gICAgdGhpcy5hbmltYXRlKGNvbnRlbnQsIG1vZGUsIFwiY2xvc2VcIiwgIWhhdmVUcmFuc2l0aW9uKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pc1RyYW5zaXRpb25pbmcgPSBmYWxzZTtcblxuICAgICAgaWYgKHdpbmRvdy5tZHNEcmF3ZXJMb2Nrcy5oYXModGhpcy5lbC5pZCkpIHtcbiAgICAgICAgd2luZG93Lm1kc0RyYXdlckxvY2tzLmRlbGV0ZSh0aGlzLmVsLmlkKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZERpYWxvZykge1xuICAgICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsLmNsb3NlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnVubG9ja0JvZHlTY3JvbGxpbmcodGhpcy5lbCk7XG4gICAgICBpZiAoaGF2ZVRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhpcy5lbC5kYXRhc2V0LmlzVHJhbnNpdGlvbmluZyA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0sIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC0gMjApO1xuXG4gICAgaWYgKHNraXBFdmVudHMpIHJldHVybjtcblxuICAgIC8vIEV4ZWN1dGUgdGhlIG9uQ2xvc2UgdGFpbCBjYWxsYmFja1xuICAgIGlmICh0aGlzLmVsLmRhdGFzZXQub25DbG9zZSAmJiB0aGlzLmVsLmRhdGFzZXQub25DbG9zZSAhPT0gXCJcIikge1xuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKUyh0aGlzLmVsLCB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtb24tY2xvc2VcIikpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gVHJpZ2dlciB0aGUgZXZlbnQgZm9yIHRoZSBkcmF3ZXIgY2xvc2VkXG4gICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcIm1vb25kczpkcmF3ZXI6Y2xvc2VkXCIsIHtcbiAgICAgICAgZGV0YWlsOiB7IGlkOiB0aGlzLmVsLmlkIH0sXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9LCB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbik7XG4gIH0sXG4gIC8qKlxuICAgKiBTZXR1cCBMb2NrZXJzXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0dXBMb2NrZXJzKCkge1xuICAgIC8vIFNldHVwIHRoZSBTY3JvbGwgTG9ja2Vyc1xuICAgIGlmICh0eXBlb2Ygd2luZG93Lm1kc1Njcm9sbExvY2tzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB3aW5kb3cubWRzU2Nyb2xsTG9ja3MgPSBuZXcgU2V0KCk7XG4gICAgfVxuICAgIC8vIFNldHVwIHRoZSBDdXJyZW50IE9wZW5pbmdcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5tZHNEcmF3ZXJMb2NrcyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgd2luZG93Lm1kc0RyYXdlckxvY2tzID0gbmV3IFNldCgpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFNldHVwXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0dXAoKSB7XG4gICAgLy8gU2V0dXAgdGhlIGV2ZW50IGxpc3RlbmVyc1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vb25kczpkcmF3ZXI6b3BlblwiLCAoKSA9PiB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9KTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uZHM6ZHJhd2VyOmNsb3NlXCIsICgpID0+IHtcbiAgICAgIHRoaXMuY2xvc2UoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5oYW5kbGVFdmVudChcIm1vb25kczpkcmF3ZXI6b3BlblwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGlzTXlFdmVudCA9IFwiI1wiICsgdGhpcy5lbC5pZCA9PSBldmVudC5pZCB8fCB0aGlzLmVsLmlkID09IGV2ZW50LmlkO1xuICAgICAgaWYgKGlzTXlFdmVudCkge1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuaGFuZGxlRXZlbnQoXCJtb29uZHM6ZHJhd2VyOmNsb3NlXCIsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgaXNNeUV2ZW50ID0gXCIjXCIgKyB0aGlzLmVsLmlkID09IGV2ZW50LmlkIHx8IHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQ7XG4gICAgICBpZiAoaXNNeUV2ZW50KSB7XG4gICAgICAgIHRoaXMuY2xvc2UoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2xvc2Ugb24gdGhlIG92ZXJsYXkgY2xpY2tcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgaWYgKGUudGFyZ2V0LmlkID09PSB0aGlzLmVsLmlkKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEdldCB0aGUgdHJhbnNpdGlvbiBkdXJhdGlvblxuICAgIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uID0gRFJBV0VSX0FOSU1BVElPTl9EVVJBVElPTjtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGNsb3NlIGV2ZW50XG4gICAgaWYgKCF0aGlzLmlzRGlzYWJsZWREaWFsb2cpIHtcbiAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy51bmxvY2tCb2R5U2Nyb2xsaW5nKHRoaXMuZWwpO1xuICAgICAgICBpZiAodGhpcy5lbC5kYXRhc2V0Lm1vb25DbG9zZSkge1xuICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlModGhpcy5lbCwgdGhpcy5lbC5kYXRhc2V0Lm1vb25DbG9zZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFNldHVwIERyYWcgRXZlbnRzXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0dXBEcmFnRXZlbnRzKCkge1xuICAgIC8vIElmIGl0J3Mgbm90IGEgYm90dG9tc2hlZXQsIHJldHVyblxuICAgIGlmICh0aGlzLmVsLmRhdGFzZXQubW9kZSAhPT0gXCJib3R0b21zaGVldFwiKSByZXR1cm47XG4gICAgaWYgKHRoaXMuX2RyYWdFdmVudHNTZXR1cCA9PT0gdHJ1ZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgaXNNb2RhbCA9IHRoaXMuaXNCb3R0b21TaGVldEFNb2RhbCgpO1xuICAgIGlmIChpc01vZGFsKSB7XG4gICAgICB0aGlzLnJlbW92ZURyYWdFdmVudHMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9kcmFnRXZlbnRzU2V0dXAgPSB0cnVlO1xuXG4gICAgLy8gR2V0IHRoZSBjb250ZW50IGVsZW1lbnRcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbC5kYXRhc2V0LmNvbnRlbnRJZCk7XG5cbiAgICAvLyBEZWNsYXJpbmcgdGhlIGZ1bmN0aW9uc1xuICAgIHRoaXMuX29uUHJlc3MgPSB0aGlzLm9uUHJlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vblJlbGVhc2UgPSB0aGlzLm9uUmVsZWFzZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRHJhZyA9IHRoaXMub25EcmFnLmJpbmQodGhpcyk7XG5cbiAgICAvLyBEZWNsYXJpbmcgdGhlIGxpc3RlbmVyc1xuICAgIGNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5fb25QcmVzcyk7XG4gICAgY29udGVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy5fb25SZWxlYXNlKTtcbiAgICBjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5fb25EcmFnKTtcbiAgfSxcbiAgLyoqXG4gICAqIFNpbXBsZSBydW5uZXIgd2hpY2ggYXR0YWNoIG9yIGRldGFjaCBldmVudHMgZHJhZyBvbiByZXNpemVcbiAgICogKi9cbiAgYm90dG9tU2hlZXRFdmVudHNDb25kaXRpb25hbCgpIHtcbiAgICBpZiAodGhpcy5lbC5kYXRhc2V0Lm1vZGUgIT09IFwiYm90dG9tc2hlZXRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpc01vZGFsID0gdGhpcy5pc0JvdHRvbVNoZWV0QU1vZGFsKCk7XG4gICAgaWYgKGlzTW9kYWwpIHtcbiAgICAgIHRoaXMucmVtb3ZlRHJhZ0V2ZW50cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldHVwRHJhZ0V2ZW50cygpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFJlbW92ZSBEcmFnIEV2ZW50c1xuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlbW92ZURyYWdFdmVudHMoKSB7XG4gICAgLy8gSWYgaXQncyBub3QgYSBib3R0b21zaGVldCwgcmV0dXJuXG4gICAgaWYgKHRoaXMuZWwuZGF0YXNldC5tb2RlICE9PSBcImJvdHRvbXNoZWV0XCIgJiYgdGhpcy5fZHJhZ0V2ZW50c1NldHVwKSByZXR1cm47XG5cbiAgICAvLyBHZXQgdGhlIGNvbnRlbnQgZWxlbWVudFxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmVsLmRhdGFzZXQuY29udGVudElkKTtcblxuICAgIGlmICh0aGlzLl9vblByZXNzKSB7XG4gICAgICBjb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuX29uUHJlc3MpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb25SZWxlYXNlKSB7XG4gICAgICBjb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLl9vblJlbGVhc2UpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb25EcmFnKSB7XG4gICAgICBjb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5fb25EcmFnKTtcbiAgICB9XG4gICAgdGhpcy5fZHJhZ0V2ZW50c1NldHVwID0gZmFsc2U7XG4gIH0sXG4gIC8qKlxuICAgKiBTaG91bGQgYmUgYSBNb2RhbCBvciBhIEJvdHRvbVNoZWV0P1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzQm90dG9tU2hlZXRBTW9kYWwoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuZWwuZGF0YXNldC5tb2RlID09PSBcImJvdHRvbXNoZWV0XCIgJiZcbiAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwpLmdldFByb3BlcnR5VmFsdWUoXCItLWlzRGVza3RvcFwiKSA9PT0gXCIxXCJcbiAgICApO1xuICB9LFxuICAvKipcbiAgICogUnVuIHNhZmV0eSBjaGVja3NcbiAgICovXG4gIHJ1blNhZmV0eUNoZWNrcygpIHtcbiAgICBpZiAodGhpcy5ydW5TYWZldHlDaGVja1RpbWVvdXQpIGNsZWFyVGltZW91dCh0aGlzLnJ1blNhZmV0eUNoZWNrVGltZW91dCk7XG4gICAgdGhpcy5ydW5TYWZldHlDaGVja1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gICAgfSwgdGhpcy50cmFuc2l0aW9uRHVyYXRpb24gKyAxNTApO1xuICB9LFxuICAvKipcbiAgICogQW5pbWF0ZSAoRHJhd2VyKVxuICAgKi9cbiAgYW5pbWF0ZURyYXdlcihlbCwgaW5uZXJDb250ZW50LCBkaXJlY3Rpb24sIHNraXBBbmltYXRpb24pIHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcIm9wZW5cIikge1xuICAgICAgZWwuYW5pbWF0ZShcbiAgICAgICAgRFJBV0VSX0VOVFJZX0FOSU1BVElPTi5wYXJlbnQua2V5ZnJhbWVzLFxuICAgICAgICBza2lwQW5pbWF0aW9uXG4gICAgICAgICAgPyBEUkFXRVJfQU5JTUFUSU9OX09QVFNfTlVMTFxuICAgICAgICAgIDogRFJBV0VSX0VOVFJZX0FOSU1BVElPTi5wYXJlbnQub3B0c1xuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWREaWFsb2cpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0ZUJhY2tkcm9wID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtbW9vbi1iYWNrZHJvcF1cIik7XG4gICAgICAgIGlmIChhbmltYXRlQmFja2Ryb3ApXG4gICAgICAgICAgYW5pbWF0ZUJhY2tkcm9wLmFuaW1hdGUoXG4gICAgICAgICAgICBbeyBvcGFjaXR5OiAwIH0sIHsgb3BhY2l0eTogMSB9XSxcbiAgICAgICAgICAgIHNraXBBbmltYXRpb25cbiAgICAgICAgICAgICAgPyBEUkFXRVJfQU5JTUFUSU9OX09QVFNfTlVMTFxuICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBEUkFXRVJfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgICAgICAgICAgICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX1NUQU5EQVJELFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKGlubmVyQ29udGVudCkge1xuICAgICAgICBpbm5lckNvbnRlbnQuYW5pbWF0ZShcbiAgICAgICAgICBEUkFXRVJfRU5UUllfQU5JTUFUSU9OLmNoaWxkLmtleWZyYW1lcyxcbiAgICAgICAgICBza2lwQW5pbWF0aW9uXG4gICAgICAgICAgICA/IERSQVdFUl9BTklNQVRJT05fT1BUU19OVUxMXG4gICAgICAgICAgICA6IERSQVdFUl9FTlRSWV9BTklNQVRJT04uY2hpbGQub3B0c1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5hbmltYXRlKFxuICAgICAgICBEUkFXRVJfRVhJVF9BTklNQVRJT04ucGFyZW50LmtleWZyYW1lcyxcbiAgICAgICAgc2tpcEFuaW1hdGlvblxuICAgICAgICAgID8gRFJBV0VSX0FOSU1BVElPTl9PUFRTX05VTExcbiAgICAgICAgICA6IERSQVdFUl9FWElUX0FOSU1BVElPTi5wYXJlbnQub3B0c1xuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWREaWFsb2cpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0ZUJhY2tkcm9wID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtbW9vbi1iYWNrZHJvcF1cIik7XG4gICAgICAgIGlmIChhbmltYXRlQmFja2Ryb3ApXG4gICAgICAgICAgYW5pbWF0ZUJhY2tkcm9wLmFuaW1hdGUoXG4gICAgICAgICAgICBbeyBvcGFjaXR5OiAxIH0sIHsgb3BhY2l0eTogMCB9XSxcbiAgICAgICAgICAgIHNraXBBbmltYXRpb25cbiAgICAgICAgICAgICAgPyBEUkFXRVJfQU5JTUFUSU9OX09QVFNfTlVMTFxuICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBEUkFXRVJfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgICAgICAgICAgICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX1NUQU5EQVJELFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKGlubmVyQ29udGVudCkge1xuICAgICAgICBpbm5lckNvbnRlbnQuYW5pbWF0ZShcbiAgICAgICAgICBEUkFXRVJfRVhJVF9BTklNQVRJT04uY2hpbGQua2V5ZnJhbWVzLFxuICAgICAgICAgIHNraXBBbmltYXRpb25cbiAgICAgICAgICAgID8gRFJBV0VSX0FOSU1BVElPTl9PUFRTX05VTExcbiAgICAgICAgICAgIDogRFJBV0VSX0VYSVRfQU5JTUFUSU9OLmNoaWxkLm9wdHNcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBBbmltYXRlIChCb3R0b21zaGVldClcbiAgICovXG4gIGFuaW1hdGVCb3R0b21TaGVldChlbCwgaW5uZXJDb250ZW50LCBkaXJlY3Rpb24sIHNraXBBbmltYXRpb24pIHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcIm9wZW5cIikge1xuICAgICAgZWwuYW5pbWF0ZShcbiAgICAgICAgQk9UVE9NU0hFRVRfRU5UUllfQU5JTUFUSU9OLnBhcmVudC5rZXlmcmFtZXMsXG4gICAgICAgIHNraXBBbmltYXRpb25cbiAgICAgICAgICA/IERSQVdFUl9BTklNQVRJT05fT1BUU19OVUxMXG4gICAgICAgICAgOiBCT1RUT01TSEVFVF9FTlRSWV9BTklNQVRJT04ucGFyZW50Lm9wdHNcbiAgICAgICk7XG4gICAgICBpZiAoaW5uZXJDb250ZW50KSB7XG4gICAgICAgIGlubmVyQ29udGVudC5hbmltYXRlKFxuICAgICAgICAgIEJPVFRPTVNIRUVUX0VOVFJZX0FOSU1BVElPTi5jaGlsZC5rZXlmcmFtZXMsXG4gICAgICAgICAgc2tpcEFuaW1hdGlvblxuICAgICAgICAgICAgPyBEUkFXRVJfQU5JTUFUSU9OX09QVFNfTlVMTFxuICAgICAgICAgICAgOiBCT1RUT01TSEVFVF9FTlRSWV9BTklNQVRJT04uY2hpbGQub3B0c1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5hbmltYXRlKFxuICAgICAgICBCT1RUT01TSEVFVF9FWElUX0FOSU1BVElPTi5wYXJlbnQua2V5ZnJhbWVzKHRoaXMuY3VycmVudFkpLFxuICAgICAgICBza2lwQW5pbWF0aW9uXG4gICAgICAgICAgPyBEUkFXRVJfQU5JTUFUSU9OX09QVFNfTlVMTFxuICAgICAgICAgIDogQk9UVE9NU0hFRVRfRVhJVF9BTklNQVRJT04ucGFyZW50Lm9wdHNcbiAgICAgICk7XG5cbiAgICAgIC8vIFJlc2V0IFkgYWZ0ZXIgdGhlIGFuaW1hdGlvblxuICAgICAgaWYgKHRoaXMuY3VycmVudFkgPiAwKSB0aGlzLmN1cnJlbnRZID0gMDtcblxuICAgICAgaWYgKGlubmVyQ29udGVudCkge1xuICAgICAgICBpbm5lckNvbnRlbnQuYW5pbWF0ZShcbiAgICAgICAgICBCT1RUT01TSEVFVF9FWElUX0FOSU1BVElPTi5jaGlsZC5rZXlmcmFtZXMsXG4gICAgICAgICAgc2tpcEFuaW1hdGlvblxuICAgICAgICAgICAgPyBEUkFXRVJfQU5JTUFUSU9OX09QVFNfTlVMTFxuICAgICAgICAgICAgOiBCT1RUT01TSEVFVF9FWElUX0FOSU1BVElPTi5jaGlsZC5vcHRzXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQW5pbWF0ZSAoTW9kYWwpXG4gICAqL1xuICBhbmltYXRlTW9kYWwoZWwsIGlubmVyQ29udGVudCwgZGlyZWN0aW9uLCBza2lwQW5pbWF0aW9uKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJvcGVuXCIpIHtcbiAgICAgIHRoaXMuZWwuYW5pbWF0ZShcbiAgICAgICAgTU9EQUxfRU5UUllfQU5JTUFUSU9OLnBhcmVudC5rZXlmcmFtZXMsXG4gICAgICAgIHNraXBBbmltYXRpb25cbiAgICAgICAgICA/IERSQVdFUl9BTklNQVRJT05fT1BUU19OVUxMXG4gICAgICAgICAgOiBNT0RBTF9FTlRSWV9BTklNQVRJT04ucGFyZW50Lm9wdHNcbiAgICAgICk7XG4gICAgICBpZiAoaW5uZXJDb250ZW50KSB7XG4gICAgICAgIGlubmVyQ29udGVudC5hbmltYXRlKFxuICAgICAgICAgIE1PREFMX0VOVFJZX0FOSU1BVElPTi5jaGlsZC5rZXlmcmFtZXMsXG4gICAgICAgICAgc2tpcEFuaW1hdGlvblxuICAgICAgICAgICAgPyBEUkFXRVJfQU5JTUFUSU9OX09QVFNfTlVMTFxuICAgICAgICAgICAgOiBNT0RBTF9FTlRSWV9BTklNQVRJT04uY2hpbGQub3B0c1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsLmFuaW1hdGUoXG4gICAgICAgIE1PREFMX0VYSVRfQU5JTUFUSU9OLnBhcmVudC5rZXlmcmFtZXMsXG4gICAgICAgIHNraXBBbmltYXRpb25cbiAgICAgICAgICA/IERSQVdFUl9BTklNQVRJT05fT1BUU19OVUxMXG4gICAgICAgICAgOiBNT0RBTF9FWElUX0FOSU1BVElPTi5wYXJlbnQub3B0c1xuICAgICAgKTtcbiAgICAgIGlmIChpbm5lckNvbnRlbnQpIHtcbiAgICAgICAgaW5uZXJDb250ZW50LmFuaW1hdGUoXG4gICAgICAgICAgTU9EQUxfRVhJVF9BTklNQVRJT04uY2hpbGQua2V5ZnJhbWVzLFxuICAgICAgICAgIHNraXBBbmltYXRpb25cbiAgICAgICAgICAgID8gRFJBV0VSX0FOSU1BVElPTl9PUFRTX05VTExcbiAgICAgICAgICAgIDogTU9EQUxfRVhJVF9BTklNQVRJT04uY2hpbGQub3B0c1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIEFuaW1hdGUgZnVuY1xuICAgKi9cbiAgYW5pbWF0ZShlbCwgbW9kZSwgZGlyZWN0aW9uLCBza2lwQW5pbWF0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBpbm5lckNvbnRlbnQgPSBlbC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtbWRzLWlubmVyLWNvbnRlbnRdXCIpO1xuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSBcImRyYXdlclwiOlxuICAgICAgICB0aGlzLmFuaW1hdGVEcmF3ZXIoZWwsIGlubmVyQ29udGVudCwgZGlyZWN0aW9uLCBza2lwQW5pbWF0aW9uKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiYm90dG9tc2hlZXRcIjpcbiAgICAgICAgaWYgKCF0aGlzLmlzQm90dG9tU2hlZXRBTW9kYWwoKSkge1xuICAgICAgICAgIHRoaXMuYW5pbWF0ZUJvdHRvbVNoZWV0KGVsLCBpbm5lckNvbnRlbnQsIGRpcmVjdGlvbiwgc2tpcEFuaW1hdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hbmltYXRlTW9kYWwoZWwsIGlubmVyQ29udGVudCwgZGlyZWN0aW9uLCBza2lwQW5pbWF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJtb2RhbFwiOlxuICAgICAgICB0aGlzLmFuaW1hdGVNb2RhbChlbCwgaW5uZXJDb250ZW50LCBkaXJlY3Rpb24sIHNraXBBbmltYXRpb24pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogTG9jayB0aGUgYm9keSBzY3JvbGxpbmdcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGxvY2tCb2R5U2Nyb2xsaW5nKGVsZW1lbnQpIHtcbiAgICB3aW5kb3cubWRzU2Nyb2xsTG9ja3MuYWRkKGVsZW1lbnQpO1xuICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoU0NST0xMX0xPQ0tfQ0xBU1MpKSB7XG4gICAgICBjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHRoaXMuZ2V0U2Nyb2xsYmFyV2lkdGgoKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChTQ1JPTExfTE9DS19DTEFTUyk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tc2Nyb2xsLWxvY2stc2l6ZVwiLFxuICAgICAgICBgJHtzY3JvbGxiYXJXaWR0aH1weGBcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogVW5sb2NrIHRoZSBib2R5IHNjcm9sbGluZ1xuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBsb2NraW5nRWxcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICB1bmxvY2tCb2R5U2Nyb2xsaW5nKGxvY2tpbmdFbCkge1xuICAgIHdpbmRvdy5tZHNTY3JvbGxMb2Nrcy5kZWxldGUobG9ja2luZ0VsKTtcbiAgICBpZiAod2luZG93Lm1kc1Njcm9sbExvY2tzLnNpemUgPT09IDApIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShTQ1JPTExfTE9DS19DTEFTUyk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1zY3JvbGwtbG9jay1zaXplXCIpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIEdldCB0aGUgc2Nyb2xsYmFyIHdpZHRoXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRTY3JvbGxiYXJXaWR0aCgpIHtcbiAgICBjb25zdCBkb2N1bWVudFdpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIHJldHVybiBNYXRoLmFicyh3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50V2lkdGgpO1xuICB9LFxuICAvKipcbiAgICogT24gUHJlc3MgRnVuY3Rpb25cbiAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUHJlc3MoZXZlbnQpIHtcbiAgICAvLyBEaXNhYmxlIGRyYWdnaW5nIGlmIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQgZnJvbSB0aGUgaW5uZXIgY29udGVudFxuICAgIGNvbnN0IGlzSW5uZXJDb250ZW50ID1cbiAgICAgIGV2ZW50LnRhcmdldCAmJiBldmVudC50YXJnZXQuY2xvc2VzdChcIltkYXRhLW1kcy1pbm5lci1jb250ZW50XVwiKTtcbiAgICBpZiAoaXNJbm5lckNvbnRlbnQpIHJldHVybjtcblxuICAgIHRoaXMuZHJhZ1RpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgY29uc3QgdCA9IGV2ZW50LnRvdWNoZXNbMF0gfHwgZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgdGhpcy5zdGFydFkgPSB0LmNsaWVudFk7XG4gIH0sXG4gIC8qKlxuICAgKiBPbiBSZWxlYXNlIEZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25SZWxlYXNlKGV2ZW50KSB7XG4gICAgLy8gRGlzYWJsZSBkcmFnZ2luZyBpZiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGZyb20gdGhlIGlubmVyIGNvbnRlbnRcbiAgICBjb25zdCBpc0lubmVyQ29udGVudCA9XG4gICAgICBldmVudC50YXJnZXQgJiYgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1tZHMtaW5uZXItY29udGVudF1cIik7XG4gICAgaWYgKGlzSW5uZXJDb250ZW50KSByZXR1cm47XG5cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICBjb25zdCB0ID0gZXZlbnQudG91Y2hlc1swXSB8fCBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICBjb25zdCBkcmFnZ2VkRGlzdGFuY2UgPSB0aGlzLnN0YXJ0WSAtIHQuY2xpZW50WTtcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbC5kYXRhc2V0LmNvbnRlbnRJZCk7XG4gICAgaWYgKGRyYWdnZWREaXN0YW5jZSA8IC0xNTApIHtcbiAgICAgIHRoaXMuY2xvc2UoZmFsc2UsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50LnN0eWxlLnNldFByb3BlcnR5KFwiLS10dy10cmFuc2xhdGUteVwiLCBgMCVgKTtcbiAgICAgIGNvbnRlbnQuc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtIDAuM3MgZWFzZVwiO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnRlbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ0cmFuc2l0aW9uXCIpO1xuICAgICAgfSwgMzAwKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBPbiBEcmFnIEZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25EcmFnKGV2ZW50KSB7XG4gICAgLy8gRGlzYWJsZSBkcmFnZ2luZyBpZiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGZyb20gdGhlIGlubmVyIGNvbnRlbnRcbiAgICBjb25zdCBpc0lubmVyQ29udGVudCA9XG4gICAgICBldmVudC50YXJnZXQgJiYgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1tZHMtaW5uZXItY29udGVudF1cIik7XG4gICAgaWYgKGlzSW5uZXJDb250ZW50KSByZXR1cm47XG5cbiAgICBjb25zdCB0ID0gZXZlbnQudG91Y2hlc1swXSB8fCBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nICYmIHQuY2xpZW50WSA+IDApIHtcbiAgICAgIGNvbnN0IHkgPSBwYXJzZUludCh0aGlzLnN0YXJ0WSkgLSBwYXJzZUludCh0LmNsaWVudFkpO1xuICAgICAgaWYgKHkgPiAwKSByZXR1cm47XG4gICAgICB0aGlzLnNldFlEcmFnKHkgKiAtMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmVsLmRhdGFzZXQuY29udGVudElkKTtcbiAgICAgIGNvbnRlbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ0cmFuc2l0aW9uXCIpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFNldCBZIERyYWcgRnVuY3Rpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IG5cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXRZRHJhZyhuKSB7XG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuZGF0YXNldC5jb250ZW50SWQpO1xuICAgIGNvbnRlbnQuc3R5bGUuc2V0UHJvcGVydHkoXCItLXR3LXRyYW5zbGF0ZS15XCIsIGAke259cHhgKTtcbiAgICBjb250ZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwidHJhbnNpdGlvblwiKTtcbiAgICB0aGlzLmN1cnJlbnRZID0gbjtcbiAgfSxcbiAgdXRpbHM6IHtcbiAgICBnZXREYXRhOiAoZWwsIGtleSkgPT4ge1xuICAgICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZShgZGF0YS0ke2tleX1gKTtcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRHJhd2VyO1xuIiwgImNvbnN0IERST1BET1dOX0FOSU1BVElPTl9EVVJBVElPTiA9IDIwMDtcbmNvbnN0IERST1BET1dOX1RJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCA9XG4gIFwiY3ViaWMtYmV6aWVyKDAuMiwgMCwgMC4zOCwgMC45KVwiO1xuY29uc3QgTUlOX0RST1BET1dOX0NPTlRFTlQgPSAxNTA7XG5jb25zdCBEUk9QRE9XTl9TS0lQX09QVFNfTlVMTCA9IHtcbiAgZHVyYXRpb246IDAsXG4gIGl0ZXJhdGlvbnM6IDEsXG4gIGVhc2luZzogXCJsaW5lYXJcIixcbn07XG5jb25zdCBEUk9QRE9XTl9FTlRFUl9BTklNQVRJT04gPSB7XG4gIGtleWZyYW1lczogW1xuICAgIHsgb3BhY2l0eTogMCwgZmlsdGVyOiBcImJsdXIoMnB4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMTBweClcIiB9LFxuICAgIHsgb3BhY2l0eTogMSwgZmlsdGVyOiBcImJsdXIoMHB4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgwKVwiIH0sXG4gIF0sXG4gIG9wdHM6IHtcbiAgICBkdXJhdGlvbjogRFJPUERPV05fQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgIGVhc2luZzogRFJPUERPV05fVElNSU5HX0FOSU1BVElPTl9FQVNFX1NUQU5EQVJELFxuICB9LFxufTtcblxuY29uc3QgRFJPUERPV05fTEVBVkVfQU5JTUFUSU9OID0ge1xuICBrZXlmcmFtZXM6IFtcbiAgICB7IG9wYWNpdHk6IDEsIGZpbHRlcjogXCJibHVyKDBweClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoMClcIiB9LFxuICAgIHsgb3BhY2l0eTogMCwgZmlsdGVyOiBcImJsdXIoMnB4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMTBweClcIiB9LFxuICBdLFxuICBvcHRzOiB7XG4gICAgZHVyYXRpb246IERST1BET1dOX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICBlYXNpbmc6IERST1BET1dOX1RJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCxcbiAgfSxcbn07XG5cbmNvbnN0IE1vb25Ecm9wZG93biA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLnRvZ2dsZUZ1bmMgPSB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMua2V5RG93bkZ1bmMgPSB0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibWRzOmRyb3Bkb3duOnRvZ2dsZVwiLCB0aGlzLnRvZ2dsZUZ1bmMpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXlEb3duRnVuYyk7XG5cbiAgICB0aGlzLmhhbmRsZUV2ZW50KFwibWRzOmRyb3Bkb3duOnRvZ2dsZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGlzTXlFdmVudCA9IFwiI1wiICsgdGhpcy5lbC5pZCA9PSBldmVudC5pZCB8fCB0aGlzLmVsLmlkID09IGV2ZW50LmlkO1xuICAgICAgaWYgKGlzTXlFdmVudCkge1xuICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5kaXNwb3NlRnVuYyA9IHRoaXMuZGlzcG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hhc2VGdW5jID0gdGhpcy5jaGFzZS5iaW5kKHRoaXMpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5jaGFzZUZ1bmMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5kaXNwb3NlRnVuYyk7XG5cbiAgICAvLyBEZWNsYXJlIHRoZSBkcm9wZG93biBzdGF0ZVxuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG5cbiAgICAvLyBQYXJzZSBpbml0aWFsIHN0YXRlXG4gICAgY29uc3QgaXNJbml0aWFsT3BlbiA9IHRoaXMuZWwuZGF0YXNldC5pbml0aWFsU3RhdGUgPT09IFwidmlzaWJsZVwiO1xuICAgIGlmIChpc0luaXRpYWxPcGVuKSB7XG4gICAgICB0aGlzLnNob3codHJ1ZSk7XG4gICAgfVxuICB9LFxuICB1cGRhdGVkKCkge1xuICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgdGhpcy5zaG93KHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGUodHJ1ZSk7XG4gICAgfVxuICB9LFxuICBkZXN0cm95ZWQoKSB7XG4gICAgaWYgKHRoaXMudG9nZ2xlRnVuYykge1xuICAgICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibWRzOmRyb3Bkb3duOnRvZ2dsZVwiLCB0aGlzLnRvZ2dsZUZ1bmMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5kaXNwb3NlRnVuYykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZGlzcG9zZUZ1bmMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGFzZUZ1bmMpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICB9XG4gICAgaWYgKHRoaXMua2V5RG93bkZ1bmMpIHtcbiAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5rZXlEb3duRnVuYyk7XG4gICAgfVxuICB9LFxuICBkaXNwb3NlKGV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQoZXZlbnQpO1xuXG4gICAgY29uc3QgaXNDbG9zZXN0ID0gISF0YXJnZXQuY2xvc2VzdChcIiNcIiArIHRoaXMuZWwuaWQpO1xuICAgIGlmICghaXNDbG9zZXN0KSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRhcmdldCBvZiB0aGUgZXZlbnRcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcGFyYW0ge0V2ZW50fSBFdmVudFxuICAgKiAgQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKiAgQHByaXZhdGVcbiAgICovXG4gIGdldFRhcmdldChldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LmRldGFpbD8uZGlzcGF0Y2hlciA/PyBldmVudC50YXJnZXQ7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH0sXG4gIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBkcm9wZG93biA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIlttZHMtZHJvcGRvd24tY29udGVudF1cIik7XG4gICAgaWYgKGRyb3Bkb3duLmRhdGFzZXQuaGlkZGVuID09PSBcInRydWVcIikge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfSxcbiAgc2hvdyhza2lwQW5pbWF0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBkcm9wZG93biA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIlttZHMtZHJvcGRvd24tY29udGVudF1cIik7XG4gICAgY29uc3QgZHJvcGRvd25JY29uID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiLmRyb3Bkb3duLXNlbGVjdC1pY29uXCIpO1xuXG4gICAgLy8gSGFuZGxlIGRyb3Bkb3duIGljb24gaWYgaXQgZXhpc3RzXG4gICAgaWYgKGRyb3Bkb3duSWNvbikge1xuICAgICAgZHJvcGRvd25JY29uLmNsYXNzTGlzdC5hZGQoXCJyb3RhdGUtMTgwXCIpO1xuICAgICAgZHJvcGRvd25JY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJyb3RhdGUtMFwiKTtcbiAgICB9XG5cbiAgICBkcm9wZG93bi5kYXRhc2V0LmhpZGRlbiA9IFwiZmFsc2VcIjtcbiAgICB0aGlzLmNoYXNlRnVuYygpO1xuICAgIGlmICghc2tpcEFuaW1hdGlvbikge1xuICAgICAgZHJvcGRvd24uYW5pbWF0ZShcbiAgICAgICAgRFJPUERPV05fRU5URVJfQU5JTUFUSU9OLmtleWZyYW1lcyxcbiAgICAgICAgdGhpcy5lbC5kYXRhc2V0LnNraXBBbmltYXRpb24gPT09IFwidHJ1ZVwiXG4gICAgICAgICAgPyBEUk9QRE9XTl9TS0lQX09QVFNfTlVMTFxuICAgICAgICAgIDogRFJPUERPV05fRU5URVJfQU5JTUFUSU9OLm9wdHNcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgfSxcbiAgaGlkZShza2lwQW5pbWF0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBkcm9wZG93biA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIlttZHMtZHJvcGRvd24tY29udGVudF1cIik7XG4gICAgY29uc3QgZHJvcGRvd25JY29uID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiLmRyb3Bkb3duLXNlbGVjdC1pY29uXCIpO1xuXG4gICAgLy8gSGFuZGxlIGRyb3Bkb3duIGljb24gaWYgaXQgZXhpc3RzXG4gICAgaWYgKGRyb3Bkb3duSWNvbikge1xuICAgICAgZHJvcGRvd25JY29uLmNsYXNzTGlzdC5hZGQoXCJyb3RhdGUtMFwiKTtcbiAgICAgIGRyb3Bkb3duSWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwicm90YXRlLTE4MFwiKTtcbiAgICB9XG5cbiAgICBpZiAoZHJvcGRvd24uZGF0YXNldC5oaWRkZW4gPT09IFwidHJ1ZVwiIHx8ICF0aGlzLmlzT3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNraXBBbmltYXRpb24pIHtcbiAgICAgIGRyb3Bkb3duLmFuaW1hdGUoXG4gICAgICAgIERST1BET1dOX0xFQVZFX0FOSU1BVElPTi5rZXlmcmFtZXMsXG4gICAgICAgIHRoaXMuZWwuZGF0YXNldC5za2lwQW5pbWF0aW9uID09PSBcInRydWVcIlxuICAgICAgICAgID8gRFJPUERPV05fU0tJUF9PUFRTX05VTExcbiAgICAgICAgICA6IERST1BET1dOX0xFQVZFX0FOSU1BVElPTi5vcHRzXG4gICAgICApO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duLmRhdGFzZXQuaGlkZGVuID0gXCJ0cnVlXCI7XG4gICAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgICB9LFxuICAgICAgc2tpcEFuaW1hdGlvbiB8fCB0aGlzLmVsLmRhdGFzZXQuc2tpcEFuaW1hdGlvbiA9PT0gXCJ0cnVlXCJcbiAgICAgICAgPyAwXG4gICAgICAgIDogRFJPUERPV05fQU5JTUFUSU9OX0RVUkFUSU9OXG4gICAgKTtcbiAgfSxcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIHdpbmRvdyBpcyBzY3JvbGxlZCwgYW5kIGNoZWNrIHRoZSBjb3JyZWN0IHZlcnRpY2FsIHNpZGUgb2YgRHJvcGRvd25cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBjaGFzZSgpIHtcbiAgICBjb25zdCBkcm9wZG93biA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIlttZHMtZHJvcGRvd24tY29udGVudF1cIik7XG4gICAgY29uc3QgdHJpZ2dlciA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIlttZHMtZHJvcGRvd24tdHJpZ2dlcl1cIik7XG5cbiAgICBpZiAoZHJvcGRvd24uZGF0YXNldC5oaWRkZW4gPT09IFwidHJ1ZVwiIHx8ICFkcm9wZG93biB8fCAhdHJpZ2dlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFuY2hvclJlY3QgPSB0cmlnZ2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNlbGZSZWN0ID0gZHJvcGRvd24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBjb25zdCBzdGF0dXMgPSB7XG4gICAgICBhbmNob3JIZWlnaHQ6IE1hdGgucm91bmQoYW5jaG9yUmVjdC5oZWlnaHQpLFxuICAgICAgZHJvcGRvd25IZWlnaHQ6IE1hdGgucm91bmQoc2VsZlJlY3QuaGVpZ2h0KSxcbiAgICAgIGRyb3Bkb3duV2lkdGg6IE1hdGgucm91bmQoc2VsZlJlY3Qud2lkdGgpLFxuICAgICAgYXZhaWxhYmxlU3BhY2VUb3A6IE1hdGgubWF4KE1hdGgucm91bmQoYW5jaG9yUmVjdC50b3ApLCAwKSxcbiAgICAgIGF2YWlsYWJsZVNwYWNlQm90dG9tOiBNYXRoLm1heChcbiAgICAgICAgTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJIZWlnaHQgLSBhbmNob3JSZWN0LmJvdHRvbSksXG4gICAgICAgIDBcbiAgICAgICksXG4gICAgfTtcbiAgICBpZiAoc3RhdHVzLmRyb3Bkb3duSGVpZ2h0ID4gc3RhdHVzLmF2YWlsYWJsZVNwYWNlQm90dG9tKSB7XG4gICAgICBkcm9wZG93bi5zdHlsZS50b3AgPSBgLSR7c3RhdHVzLmRyb3Bkb3duSGVpZ2h0ICsgOH1weGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRyb3Bkb3duLnN0eWxlLnRvcCA9IGAke3N0YXR1cy5hbmNob3JIZWlnaHQgKyA4fXB4YDtcbiAgICB9XG4gIH0sXG4gIG9uS2V5RG93bihldmVudCkge1xuICAgIGNvbnN0IGRyb3Bkb3duID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbC5pZCk7XG4gICAgaWYgKCFkcm9wZG93bikgcmV0dXJuO1xuXG4gICAgY29uc3QgZHJvcGRvd25Db250ZW50ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiW21kcy1kcm9wZG93bi1jb250ZW50XVwiKTtcbiAgICBpZiAoIWRyb3Bkb3duQ29udGVudCkgcmV0dXJuO1xuXG4gICAgY29uc3QgaXRlbXMgPSBkcm9wZG93bkNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xuICAgIGlmICghaXRlbXMubGVuZ3RoKSByZXR1cm47XG5cbiAgICBsZXQgY3VycmVudEluZGV4ID0gQXJyYXkuZnJvbShpdGVtcykuZmluZEluZGV4KFxuICAgICAgKGl0ZW0pID0+IGl0ZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICApO1xuXG4gICAgY29uc3Qgc2hvd0Ryb3Bkb3duID0gKCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH07XG5cbiAgICBjb25zdCBoYW5kbGVOYXZpZ2F0aW9uID0gKGRpcmVjdGlvbikgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGN1cnJlbnRJbmRleCA9IChjdXJyZW50SW5kZXggKyBkaXJlY3Rpb24gKyBpdGVtcy5sZW5ndGgpICUgaXRlbXMubGVuZ3RoO1xuICAgICAgaXRlbXNbY3VycmVudEluZGV4XS5mb2N1cygpO1xuICAgIH07XG5cbiAgICBjb25zdCBoYW5kbGVTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGN1cnJlbnRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgaXRlbXNbY3VycmVudEluZGV4XS5jbGljaygpO1xuICAgICAgfVxuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICBkcm9wZG93bi5mb2N1cygpO1xuICAgIH07XG5cbiAgICBjb25zdCBoaWRlRHJvcGRvd24gPSAoKSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfTtcblxuICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICBjYXNlIFwiQXJyb3dEb3duXCI6XG4gICAgICAgIGhhbmRsZU5hdmlnYXRpb24oMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkFycm93VXBcIjpcbiAgICAgICAgaGFuZGxlTmF2aWdhdGlvbigtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkVudGVyXCI6XG4gICAgICBjYXNlIFwiIFwiOlxuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgc2hvd0Ryb3Bkb3duKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGFuZGxlU2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiRXNjYXBlXCI6XG4gICAgICAgIGhpZGVEcm9wZG93bigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgTW9vbkRyb3Bkb3duO1xuIiwgImNvbnN0IEZpbGVJbnB1dCA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zdCBpbnB1dFJlZiA9IHRoaXMuZWwuZGF0YXNldC5pbnB1dFJlZjtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0SW5wdXRFbGVtZW50KGlucHV0UmVmKTtcbiAgICBjb25zdCBzcGFuID0gdGhpcy5nZXRTcGFuRWxlbWVudChpbnB1dFJlZik7XG5cbiAgICBpZiAoIWlucHV0IHx8ICFzcGFuKSByZXR1cm47XG5cbiAgICB0aGlzLnNldHVwQ2xpY2tMaXN0ZW5lcihpbnB1dCk7XG4gICAgdGhpcy5zZXR1cENoYW5nZUxpc3RlbmVyKGlucHV0LCBzcGFuKTtcbiAgfSxcbiAgZ2V0SW5wdXRFbGVtZW50KGlucHV0UmVmKSB7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYGlucHV0W3R5cGU9XCJmaWxlXCJdW2RhdGEtcGh4LXVwbG9hZC1yZWY9XCIke2lucHV0UmVmfVwiXWBcbiAgICApO1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIGBGaWxlSW5wdXQ6IE5vIGlucHV0IGZvdW5kIHdpdGggZGF0YS1waHgtdXBsb2FkLXJlZj1cIiR7aW5wdXRSZWZ9XCJgXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXQ7XG4gIH0sXG4gIGdldFNwYW5FbGVtZW50KGlucHV0UmVmKSB7XG4gICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNwYW5bZGF0YS1pbnB1dC1yZWY9XCIke2lucHV0UmVmfVwiXWApO1xuICAgIGlmICghc3Bhbikge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgYEZpbGVJbnB1dDogTm8gc3BhbiBmb3VuZCB3aXRoIGRhdGEtaW5wdXQtcmVmPVwiJHtpbnB1dFJlZn1cIl1gXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc3BhbjtcbiAgfSxcbiAgc2V0dXBDbGlja0xpc3RlbmVyKGlucHV0KSB7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gaW5wdXQuY2xpY2soKSk7XG4gIH0sXG4gIHNldHVwQ2hhbmdlTGlzdGVuZXIoaW5wdXQsIHNwYW4pIHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVzID0gaW5wdXQuZmlsZXM7XG4gICAgICBzcGFuLnRleHRDb250ZW50ID1cbiAgICAgICAgZmlsZXMubGVuZ3RoID09PSAxID8gZmlsZXNbMF0ubmFtZSA6IGAke2ZpbGVzLmxlbmd0aH0gRmlsZXNgO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmlsZUlucHV0O1xuIiwgImxldCBNb29uU3dpdGNoID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuY3VycmVudFN0YXRlID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWNoZWNrZWRcIikgPT09IFwidHJ1ZVwiO1xuICAgIHRoaXMuaWQgPSB0aGlzLmVsLmlkO1xuXG4gICAgLy8gSWYgdGhlIHN3aXRjaCBpcyBub3QgYSBmb3JtIGVsZW1lbnQsIHdlIGRvbid0IG5lZWQgdG8gbGlzdGVuIHRvIHRoZSBldmVudFxuICAgIGlmICh0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtaXMtZm9ybVwiKSA9PT0gXCJmYWxzZVwiKSByZXR1cm47XG5cbiAgICAvLyBMaXN0ZW4gdG8gdGhlIGNoYW5nZSBldmVudFxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcInN3aXRjaF9jaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIGRpc2FibGVkIHdlIGNhbiBpZ25vcmUgdGhlIGNsaWNrXG4gICAgICBpZiAoZS5kZXRhaWwuZGlzYWJsZWQpIHJldHVybjtcblxuICAgICAgdGhpcy50b2dnbGUoIXRoaXMuY3VycmVudFN0YXRlKTtcbiAgICAgIGlmIChlLmRldGFpbCAmJiBlLmRldGFpbC5pbnB1dF9pZCkge1xuICAgICAgICBkb2N1bWVudFxuICAgICAgICAgIC5nZXRFbGVtZW50QnlJZChlLmRldGFpbC5pbnB1dF9pZClcbiAgICAgICAgICAuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVkKCkge1xuICAgIC8vIEZvcmNlIHRoZSBjdXJyZW50U3RhdGUgdG8gcmVsb2FkIGlmIHRoZSBzZXJ2ZXIgY2hhbmdlIHRoZSBET00gd2l0aG91dCB0aGUgc3dpdGNoIGludGVyYWN0aW9uLlxuICAgIHRoaXMuY3VycmVudFN0YXRlID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWNoZWNrZWRcIikgPT09IFwidHJ1ZVwiO1xuICB9LFxuICAvKipcbiAgICogQ29udmVydCBhIGJvb2xlYW4gdG8gYSBzdHJpbmdcbiAgICogQHBhcmFtIHtib29sZWFufSBib29sXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqICovXG4gIGJvb2xlYW5Ub1N0cmluZyhib29sKSB7XG4gICAgcmV0dXJuIGJvb2wgPyBcInRydWVcIiA6IFwiZmFsc2VcIjtcbiAgfSxcbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgc3dpdGNoXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICogKi9cbiAgdG9nZ2xlKGJvb2wpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmVsLmNsb3Nlc3QoXCJbZGF0YS1wYXJlbnQtc3dpdGNoXVwiKTtcbiAgICBjb25zdCBpbnB1dElkID0gdGhpcy5pZCArIFwiX2lucHV0XCI7XG4gICAgY29uc3Qgc3BhbklkID0gdGhpcy5pZCArIFwiX3NwYW5cIjtcblxuICAgIGNvbnN0IGxlZnRJY29uID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1pY29uLWNoZWNrZWRdXCIpO1xuICAgIGNvbnN0IHJpZ2h0SWNvbiA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaWNvbi11bmNoZWNrZWRdXCIpO1xuXG4gICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyBpbnB1dElkKS52YWx1ZSA9IHRoaXMuYm9vbGVhblRvU3RyaW5nKGJvb2wpO1xuICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKFwiI1wiICsgc3BhbklkKS5kYXRhc2V0LmN1cnJlbnRTdGF0ZSA9XG4gICAgICB0aGlzLmJvb2xlYW5Ub1N0cmluZyhib29sKTtcblxuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiYXJpYS1jaGVja2VkXCIsIHRoaXMuYm9vbGVhblRvU3RyaW5nKGJvb2wpKTtcblxuICAgIC8vIFNldHRpbmcgdGhlIGN1cnJlbnQgc3RhdGVcbiAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGJvb2w7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGNsYXNzZXNcbiAgICBjb25zdCBlbmFibGVkQ2xhc3NlcyA9XG4gICAgICAodGhpcy5lbC5kYXRhc2V0LmN1c3RvbUVuYWJsZWRDbGFzcyAmJlxuICAgICAgICB0aGlzLmVsLmRhdGFzZXQuY3VzdG9tRW5hYmxlZENsYXNzLnNwbGl0KFwiIFwiKSkgfHxcbiAgICAgIFtdO1xuXG4gICAgY29uc3QgZGlzYWJsZWRDbGFzc2VzID1cbiAgICAgICh0aGlzLmVsLmRhdGFzZXQuY3VzdG9tRGlzYWJsZWRDbGFzcyAmJlxuICAgICAgICB0aGlzLmVsLmRhdGFzZXQuY3VzdG9tRGlzYWJsZWRDbGFzcy5zcGxpdChcIiBcIikpIHx8XG4gICAgICBbXTtcblxuICAgIGlmIChib29sKSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uZGlzYWJsZWRDbGFzc2VzKTtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5lbmFibGVkQ2xhc3Nlcyk7XG4gICAgICAvLyBJY29uc1xuICAgICAgaWYgKGxlZnRJY29uKSB7XG4gICAgICAgIGxlZnRJY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJvcGFjaXR5LTBcIik7XG4gICAgICAgIGxlZnRJY29uLmNsYXNzTGlzdC5hZGQoXCJvcGFjaXR5LTFcIik7XG4gICAgICB9XG4gICAgICBpZiAocmlnaHRJY29uKSB7XG4gICAgICAgIHJpZ2h0SWNvbi5jbGFzc0xpc3QuYWRkKFwib3BhY2l0eS0wXCIpO1xuICAgICAgICByaWdodEljb24uY2xhc3NMaXN0LnJlbW92ZShcIm9wYWNpdHktMVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmVuYWJsZWRDbGFzc2VzKTtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5kaXNhYmxlZENsYXNzZXMpO1xuXG4gICAgICAvLyBJY29uc1xuICAgICAgaWYgKGxlZnRJY29uKSB7XG4gICAgICAgIGxlZnRJY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJvcGFjaXR5LTFcIik7XG4gICAgICAgIGxlZnRJY29uLmNsYXNzTGlzdC5hZGQoXCJvcGFjaXR5LTBcIik7XG4gICAgICB9XG4gICAgICBpZiAocmlnaHRJY29uKSB7XG4gICAgICAgIHJpZ2h0SWNvbi5jbGFzc0xpc3QuYWRkKFwib3BhY2l0eS0xXCIpO1xuICAgICAgICByaWdodEljb24uY2xhc3NMaXN0LnJlbW92ZShcIm9wYWNpdHktMFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNb29uU3dpdGNoO1xuIiwgIi8vIFRoZSBkdXJhdGlvbiBvZiB0aGUgcG9wb3ZlciBhbmltYXRpb24gaW4gbXNcbmNvbnN0IFBPUE9WRVJfQU5JTUFUSU9OX0RVUkFUSU9OID0gMjAwO1xuY29uc3QgVElNSU5HX0FOSU1BVElPTl9FQVNFX1NUQU5EQVJEID0gXCJjdWJpYy1iZXppZXIoMC4yLCAwLCAwLjM4LCAwLjkpXCI7XG4vKlxuICogU2tpcCBBbmltYXRpb24gY29uc3RhbnRcbiAqIC0tLS0tLS0tLS0tLS0tLVxuICogVGhlIGtleWZyYW1lcyBhbmQgb3B0aW9ucyBmb3IgdGhlIHNraXAgYW5pbWF0aW9uXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5jb25zdCBQT1BPVkVSX1NLSVBfT1BUU19OVUxMID0ge1xuICBkdXJhdGlvbjogMCxcbiAgaXRlcmF0aW9uczogMSxcbiAgZWFzaW5nOiBcImxpbmVhclwiLFxufTtcbi8qKlxuICogRW50cnkgYW5pbWF0aW9uIGNvbnN0YW50XG4gKiAtLS0tLS0tLS0tLS0tLS1cbiAqIFRoZSBrZXlmcmFtZXMgYW5kIG9wdGlvbnMgZm9yIHRoZSBlbnRyeSBhbmltYXRpb25cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmNvbnN0IFBPUE9WRVJfRU5UUllfQU5JTUFUSU9OID0ge1xuICBrZXlmcmFtZXMob3JpZ2luID0gXCJ0b3BcIikge1xuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIGZpbHRlcjogXCJibHVyKDFweClcIixcbiAgICAgICAgdG9wOiBvcmlnaW4gPT09IFwidG9wXCIgPyBcIjEwcHhcIiA6IFwiLTEwcHhcIixcbiAgICAgIH0sXG4gICAgICB7IG9wYWNpdHk6IDEsIGZpbHRlcjogXCJibHVyKDBweClcIiwgdG9wOiBcIjBweFwiIH0sXG4gICAgXTtcbiAgfSxcbiAgb3B0czoge1xuICAgIGR1cmF0aW9uOiBQT1BPVkVSX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICBpdGVyYXRpb25zOiAxLFxuICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX1NUQU5EQVJELFxuICB9LFxufTtcbi8qKlxuICogRXhpdCBhbmltYXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLVxuICogIFRoZSBrZXlmcmFtZXMgYW5kIG9wdGlvbnMgZm9yIHRoZSBleGl0IGFuaW1hdGlvblxuICogIEB0eXBlIHtPYmplY3R9XG4gKi9cbmNvbnN0IFBPUE9WRVJfRVhJVF9BTklNQVRJT04gPSB7XG4gIGtleWZyYW1lcyhvcmlnaW4gPSBcInRvcFwiKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgZmlsdGVyOiBcImJsdXIoMHB4KVwiLCB0b3A6IFwiMHB4XCIsIG9wYWNpdHk6IDEgfSxcbiAgICAgIHtcbiAgICAgICAgZmlsdGVyOiBcImJsdXIoMXB4KVwiLFxuICAgICAgICB0b3A6IG9yaWdpbiA9PT0gXCJ0b3BcIiA/IFwiM3B4XCIgOiBcIi0zcHhcIixcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgIH0sXG4gICAgXTtcbiAgfSxcbiAgb3B0czoge1xuICAgIGR1cmF0aW9uOiBQT1BPVkVSX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICBpdGVyYXRpb25zOiAxLFxuICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX1NUQU5EQVJELFxuICB9LFxufTtcblxuY29uc3QgUG9wb3ZlciA9IHtcbiAgLyoqXG4gICAqIFNob3cgdGhlIHBvcG92ZXJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSBgbWRzOnBvcG92ZXI6c2hvd2AgZXZlbnQgaXMgZmlyZWRcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gRXZlbnRcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBzaG93KGV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQoZXZlbnQpO1xuICAgIGNvbnN0IGN1cnJlbnRTaWRlID0gdGhpcy5lbC5kYXRhc2V0LnNpZGUgfHwgXCJib3R0b21cIjtcblxuICAgIC8vIEluIGNhc2UgdGhlIHRhcmdldCBub3QgZm91bmQsIHRocm93IGFuIGVycm9yXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKFwiTURTIFBvcG92ZXI6IFRhcmdldCBub3QgZm91bmRcIik7XG4gICAgICByZXR1cm47IC8vIENhbid0IGRvIGFueXRoaW5nIHdpdGhvdXQgYSB0YXJnZXRcbiAgICB9XG5cbiAgICAvLyBGaXggbXVsdGlwbGUgc3BhbSBjbGlja1xuICAgIGlmICh0aGlzLmNsb3NpbmdUaW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jbG9zaW5nVGltZW91dCk7XG4gICAgICB0aGlzLmNsb3NpbmdUaW1lb3V0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSB0YXJnZXRcbiAgICBjb25zdCB0YXJnZXRSZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgdGhpcy5hcHBseUNTU1ZhcnMoe1xuICAgICAgYW5jaG9ySGVpZ2h0OiB0YXJnZXRSZWN0LmhlaWdodCxcbiAgICAgIGFuY2hvcldpZHRoOiB0YXJnZXRSZWN0LndpZHRoLFxuICAgICAgdG9wOiB0YXJnZXRSZWN0LnRvcCxcbiAgICAgIGJvdHRvbTogd2luZG93LmlubmVySGVpZ2h0IC0gdGFyZ2V0UmVjdC5ib3R0b20sXG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb3BvdmVyXG4gICAgdGhpcy5lbC5zdHlsZS50cmFuc2Zvcm0gPSB0aGlzLmdldFRyYW5zZm9ybSh0YXJnZXRSZWN0KTtcblxuICAgIC8vIEFwcGx5IHRoZSBlbnRyeSBhbmltYXRpb25cbiAgICB0aGlzLmVsLmFuaW1hdGUoXG4gICAgICBQT1BPVkVSX0VOVFJZX0FOSU1BVElPTi5rZXlmcmFtZXMoY3VycmVudFNpZGUpLFxuICAgICAgdGhpcy5lbC5kYXRhc2V0LnNraXBBbmltYXRpb24gPT09IFwidHJ1ZVwiXG4gICAgICAgID8gUE9QT1ZFUl9TS0lQX09QVFNfTlVMTFxuICAgICAgICA6IFBPUE9WRVJfRU5UUllfQU5JTUFUSU9OLm9wdHNcbiAgICApO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgdGhlIGNsYXNzIGhpZGRlblxuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuXG4gICAgLy8gU2V0dXAgdGhlIGRpc3Bvc2UgZnVuY3Rpb24sIHdoaWNoIGhhdmUgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIGhpZGUgdGhlIHBvcG92ZXIgb24gY2xpY2sgb3V0c2lkZVxuICAgIHRoaXMuZGlzcG9zZUZ1bmMgPSB0aGlzLmRpc3Bvc2UuYmluZCh0aGlzKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5kaXNwb3NlRnVuYyk7XG5cbiAgICAvLyBTZXR1cCB0aGUgY2hhc2UgZnVuY3Rpb24sIHdoaWNoIGhhdmUgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIGNoYXNlIHRoZSB0YXJnZXQgb24gc2Nyb2xsXG4gICAgdGhpcy5jaGFzZUZ1bmMgPSAoKSA9PiB0aGlzLmNoYXNlLmJpbmQodGhpcykodGFyZ2V0KTtcblxuICAgIC8vIEFkZCB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gY2hhc2UgdGhlIHRhcmdldCBvbiBzY3JvbGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5jaGFzZUZ1bmMpO1xuXG4gICAgLy8gUnVuIHRoZSBmaXJzdCBjaGFzZVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmNoYXNlRnVuYygpKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmNoYXNlRnVuYygpKSwgNDAwKTtcblxuICAgIC8vIFNldCB0aGUgc3RhdGUgdG8gdmlzaWJsZVxuICAgIHRoaXMuZWwuZGF0YXNldC5zdGF0ZSA9IFwidmlzaWJsZVwiO1xuICB9LFxuICAvKipcbiAgICogSGlkZSB0aGUgcG9wb3ZlclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tXG4gICAqXG4gICAqICBAcGFyYW0ge0V2ZW50fSBFdmVudFxuICAgKiAgQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBoaWRlKGV2ZW50KSB7XG4gICAgLy8gQ3VycmVudCBTaWRlXG4gICAgY29uc3QgY3VycmVudFNpZGUgPSB0aGlzLmVsLmRhdGFzZXQuc2lkZSB8fCBcImJvdHRvbVwiO1xuICAgIC8vIE9uIENsb3NlIENhbGxiYWNrXG4gICAgY29uc3Qgb25DbG9zZUNhbGxiYWNrID0gdGhpcy5lbC5kYXRhc2V0Lm9uQ2xvc2U7XG5cbiAgICAvLyBBcHBseSB0aGUgZXhpdCBhbmltYXRpb25cbiAgICB0aGlzLmVsLmFuaW1hdGUoXG4gICAgICBQT1BPVkVSX0VYSVRfQU5JTUFUSU9OLmtleWZyYW1lcyhjdXJyZW50U2lkZSksXG4gICAgICB0aGlzLmVsLmRhdGFzZXQuc2tpcEFuaW1hdGlvbiA9PSBcInRydWVcIlxuICAgICAgICA/IFBPUE9WRVJfU0tJUF9PUFRTX05VTExcbiAgICAgICAgOiBQT1BPVkVSX0VYSVRfQU5JTUFUSU9OLm9wdHNcbiAgICApO1xuXG4gICAgaWYgKHRoaXMuY2xvc2luZ1RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNsb3NpbmdUaW1lb3V0KTtcbiAgICAgIHRoaXMuY2xvc2luZ1RpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IHRoZSBjbGFzcyBoaWRkZW4gYWZ0ZXIgdGhlIGFuaW1hdGlvblxuICAgIHRoaXMuY2xvc2luZ1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIEFkZCB0aGUgY2xhc3MgaGlkZGVuXG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfSwgUE9QT1ZFUl9BTklNQVRJT05fRFVSQVRJT04pO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSBkaXNwb3NlIGZ1bmN0aW9uIGluIGNhc2UgZXhpc3RzXG4gICAgaWYgKHRoaXMuZGlzcG9zZUZ1bmMpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmRpc3Bvc2VGdW5jKTtcbiAgICAgIHRoaXMuZGlzcG9zZUZ1bmMgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgY2hhc2UgZnVuY3Rpb24gaW4gY2FzZSBleGlzdHNcbiAgICBpZiAodGhpcy5jaGFzZUZ1bmMpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIHN0YXRlIHRvIGhpZGRlblxuICAgIHRoaXMuZWwuZGF0YXNldC5zdGF0ZSA9IFwiaGlkZGVuXCI7XG5cbiAgICBpZiAob25DbG9zZUNhbGxiYWNrICYmIG9uQ2xvc2VDYWxsYmFjayAhPT0gXCJcIikge1xuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKUyh0aGlzLmVsLCB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtb24tY2xvc2VcIikpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgcG9wb3ZlciB2aXNpYmlsaXR5XG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcGFyYW0ge0V2ZW50fSBFdmVudFxuICAgKiAgQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICB0b2dnbGUoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5lbC5kYXRhc2V0LnN0YXRlID09PSBcImhpZGRlblwiKSB7XG4gICAgICB0aGlzLnNob3coZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGUoZXZlbnQpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogR2V0IHRoZSB0cmFuc2Zvcm0gcHJvcGVydHkgZm9yIHRoZSBwb3BvdmVyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcGFyYW0ge0RPTVJlY3R9IHRhcmdldFxuICAgKiAgQHJldHVybnMge3N0cmluZ31cbiAgICogIEBwcml2YXRlXG4gICAqL1xuICBnZXRUcmFuc2Zvcm0odGFyZ2V0UmVjdCkge1xuICAgIGNvbnN0IGN1cnJlbnRTaWRlID0gdGhpcy5lbC5kYXRhc2V0LnNpZGUgfHwgXCJib3R0b21cIjtcbiAgICBjb25zdCBjdXJyZW50QWxpZ24gPSB0aGlzLmdldEFsaWduKCk7XG5cbiAgICBjb25zdCBjdXJyZW50T2Zmc2V0ID0gcGFyc2VJbnQoXG4gICAgICB0aGlzLmdldEVsU3R5bGUodGhpcy5lbCkuZ2V0UHJvcGVydHlWYWx1ZShcbiAgICAgICAgXCItLW1kcy1wb3BvdmVyLXRyYW5zZm9ybS1vcmlnaW5cIlxuICAgICAgKSB8fCBcIjBcIlxuICAgICk7XG4gICAgY29uc3QgZmluYWxUcmFuc2Zvcm0gPSB7XG4gICAgICB0b3A6XG4gICAgICAgIGN1cnJlbnRTaWRlID09PSBcInRvcFwiXG4gICAgICAgICAgPyB0YXJnZXRSZWN0LnRvcCAtIHRoaXMuZWwub2Zmc2V0SGVpZ2h0IC0gNFxuICAgICAgICAgIDogdGFyZ2V0UmVjdC50b3AgKyB0YXJnZXRSZWN0LmhlaWdodCArIDQsXG4gICAgICBsZWZ0OlxuICAgICAgICAoKGNsaWVudFdpZHRoKSA9PiB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRBbGlnbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0UmVjdC5sZWZ0ICsgdGFyZ2V0UmVjdC53aWR0aCAtIGNsaWVudFdpZHRoO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjdXJyZW50QWxpZ24gPT09IFwibWlkZGxlXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRSZWN0LmxlZnQgKyAodGFyZ2V0UmVjdC53aWR0aCAtIGNsaWVudFdpZHRoKSAvIDI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFJlY3QubGVmdDtcbiAgICAgICAgfSkodGhpcy5lbC5jbGllbnRXaWR0aCkgfHwgMCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGB0cmFuc2xhdGUzZCgke01hdGguY2VpbChmaW5hbFRyYW5zZm9ybS5sZWZ0KX1weCwgJHtcbiAgICAgIE1hdGguY2VpbChmaW5hbFRyYW5zZm9ybS50b3ApICsgY3VycmVudE9mZnNldFxuICAgIH1weCwgMClgO1xuICB9LFxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGRpcmVjdGlvbiBpcyBSVExcbiAgICpcbiAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAqL1xuICBpc1JUTCgpIHtcbiAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSkuZGlyZWN0aW9uID09PSBcInJ0bFwiO1xuICB9LFxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGFsaWduIGJhc2VkIGFsc28gb24gdGhlIFJUTCBkaVxuICAgKi9cbiAgZ2V0QWxpZ24oKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGRpcmVjdGlvbiBpcyBSVExcbiAgICBjb25zdCBpc1JUTCA9IHRoaXMuaXNSVEwoKTtcbiAgICAvLyBHZXQgdGhlIGN1cnJlbnQgYWxpZ25cbiAgICBjb25zdCBjdXJyZW50QWxpZ24gPSB0aGlzLmVsLmRhdGFzZXQuYWxpZ24gfHwgXCJsZWZ0XCI7XG4gICAgLy8gUmV0dXJuIHRoZSBjdXJyZW50IGFsaWduXG4gICAgcmV0dXJuIGlzUlRMID8gKGN1cnJlbnRBbGlnbiA9PT0gXCJsZWZ0XCIgPyBcInJpZ2h0XCIgOiBcImxlZnRcIikgOiBjdXJyZW50QWxpZ247XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBDb21wdXRlZCBTdHlsZVxuICAgKi9cbiAgZ2V0RWxTdHlsZShlbCkge1xuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIH0sXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRhcmdldCBvZiB0aGUgZXZlbnRcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcGFyYW0ge0V2ZW50fSBFdmVudFxuICAgKiAgQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKiAgQHByaXZhdGVcbiAgICovXG4gIGdldFRhcmdldChldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LmRldGFpbD8uZGlzcGF0Y2hlciA/PyBldmVudC50YXJnZXQ7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH0sXG4gIC8qKlxuICAgKiBTaG91bGQgYXBwbHkgb3JpZ2luP1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtPYmplY3R9IHN0YXR1c1xuICAgKiAgQHBhcmFtIHtTdHJpbmd9IGN1cnJlbnRTaWRlXG4gICAqICBAcGFyYW0ge051bWJlcn0gb2Zmc2V0SGVpZ2h0XG4gICAqICBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICogIEBwcml2YXRlXG4gICAqL1xuICBpc091dHNpZGVWaWV3cG9ydChzdGF0dXMsIGN1cnJlbnRTaWRlLCBvZmZzZXRIZWlnaHQpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgcG9wb3ZlciBpcyBvdXRzaWRlIHRoZSB2aWV3cG9ydFxuICAgIGlmIChcbiAgICAgIChzdGF0dXMuYXZhaWxhYmxlU3BhY2VUb3AgPD0gb2Zmc2V0SGVpZ2h0ICYmIGN1cnJlbnRTaWRlID09PSBcInRvcFwiKSB8fFxuICAgICAgKHN0YXR1cy5hdmFpbGFibGVTcGFjZUJvdHRvbSA8PSBvZmZzZXRIZWlnaHQgJiYgY3VycmVudFNpZGUgPT09IFwiYm90dG9tXCIpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvKipcbiAgICogRGlzcG9zZSB0aGUgcG9wb3ZlclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcGFyYW0ge0V2ZW50fSBFdmVudFxuICAgKiAgQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBkaXNwb3NlKGV2ZW50KSB7XG4gICAgLy8gSWdub3JlIGlmIHRoZSBwb3BvdmVyIGlzIGhpZGRlblxuICAgIGlmICh0aGlzLmVsLmRhdGFzZXQuc3RhdGUgPT0gXCJoaWRkZW5cIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2V0VGFyZ2V0KGV2ZW50KTtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgLy8gTm8gVGFyZ2V0XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCEhdGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1pZ25vcmUtbWRzLXBvcG92ZXItZGlzcG9zZV1cIikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgdGFyZ2V0IGlzIGEgY2hpbGQgb2YgdGhlIHBvcG92ZXIsIGlmIG5vdCwgaGlkZSB0aGUgcG9wb3ZlclxuICAgIGNvbnN0IGlzQ2xvc2VzdCA9ICEhdGFyZ2V0LmNsb3Nlc3QoXCIjXCIgKyB0aGlzLmVsLmlkKTtcbiAgICBpZiAoIWlzQ2xvc2VzdCkge1xuICAgICAgdGhpcy5oaWRlKGV2ZW50KTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSB3aW5kb3cgaXMgc2Nyb2xsZWQgYW5kIGNoYXNlIHRoZSB2aWV3cG9ydFxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XG4gICAqICBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGNoYXNlKHRhcmdldCkge1xuICAgIGNvbnN0IHRhcmdldFJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY3VycmVudFNpZGUgPSB0aGlzLmVsLmRhdGFzZXQuc2lkZSB8fCBcImJvdHRvbVwiO1xuICAgIGNvbnN0IHN0YXR1cyA9IHtcbiAgICAgIGFuY2hvckhlaWdodDogTWF0aC5yb3VuZCh0YXJnZXRSZWN0LmhlaWdodCksXG4gICAgICBhbmNob3JXaWR0aDogTWF0aC5yb3VuZCh0YXJnZXRSZWN0LndpZHRoKSxcbiAgICAgIHRvcDogTWF0aC5tYXgoTWF0aC5yb3VuZCh0YXJnZXRSZWN0LnRvcCksIDApLFxuICAgICAgYm90dG9tOiBNYXRoLm1heChNYXRoLnJvdW5kKHdpbmRvdy5pbm5lckhlaWdodCAtIHRhcmdldFJlY3QuYm90dG9tKSwgMCksXG4gICAgICBsZWZ0OiBNYXRoLm1heChNYXRoLnJvdW5kKHRhcmdldFJlY3QubGVmdCksIDApLFxuICAgICAgcmlnaHQ6IE1hdGgubWF4KE1hdGgucm91bmQod2luZG93LmlubmVyV2lkdGggLSB0YXJnZXRSZWN0LnJpZ2h0KSwgMCksXG4gICAgfTtcblxuICAgIC8vIEFwcGx5IHRoZSBzdGF0dXMgdG8gdGhlIHBvcG92ZXJcbiAgICB0aGlzLmFwcGx5Q1NTVmFycyhzdGF0dXMpO1xuXG4gICAgLy8gU3VwcG9ydCBmb3IgcmV2ZXJzZSBzaWRlXG4gICAgY29uc3QgdHJhbnNmb3JtSGVpZ2h0ID1cbiAgICAgIGN1cnJlbnRTaWRlID09PSBcInRvcFwiXG4gICAgICAgID8gdGhpcy5lbC5vZmZzZXRIZWlnaHQgKyBzdGF0dXMuYW5jaG9ySGVpZ2h0ICsgOFxuICAgICAgICA6ICh0aGlzLmVsLm9mZnNldEhlaWdodCArIHN0YXR1cy5hbmNob3JIZWlnaHQgKyA4KSAqIC0xO1xuXG4gICAgaWYgKHRoaXMuaXNPdXRzaWRlVmlld3BvcnQoc3RhdHVzLCBjdXJyZW50U2lkZSwgdGhpcy5lbC5vZmZzZXRIZWlnaHQpKSB7XG4gICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tbWRzLXBvcG92ZXItdHJhbnNmb3JtLW9yaWdpblwiLFxuICAgICAgICBgJHt0cmFuc2Zvcm1IZWlnaHR9YFxuICAgICAgKTtcbiAgICAgIGxldCBvZmZzZXRUb3AgPSBzdGF0dXMuYXZhaWxhYmxlU3BhY2VUb3AgLSB0aGlzLmVsLm9mZnNldEhlaWdodDtcbiAgICAgIGlmIChjdXJyZW50U2lkZSA9PT0gXCJ0b3BcIikge1xuICAgICAgICBvZmZzZXRUb3AgPSBzdGF0dXMuYXZhaWxhYmxlU3BhY2VUb3A7XG4gICAgICB9XG4gICAgICBpZiAob2Zmc2V0VG9wIDwgMCkge1xuICAgICAgICB0aGlzLmVsLnN0eWxlLnRvcCA9IGAke01hdGguYWJzKG9mZnNldFRvcCl9cHhgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS1tZHMtcG9wb3Zlci10cmFuc2Zvcm0tb3JpZ2luXCIsIFwiMFwiKTtcbiAgICAgIHRoaXMuZWwuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICB9XG5cbiAgICAvLyBBcHBseSB0aGUgdHJhbnNmb3JtXG4gICAgdGhpcy5lbC5zdHlsZS50cmFuc2Zvcm0gPSB0aGlzLmdldFRyYW5zZm9ybSh0YXJnZXRSZWN0KTtcbiAgfSxcbiAgLyoqXG4gICAqIEFwcGx5IENTUyBWYXJpYWJsZXNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtPYmplY3R9IHZhbHVlc1xuICAgKiAgQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBhcHBseUNTU1ZhcnModmFsdWVzKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLmVsLnN0eWxlO1xuICAgIGNvbnN0IG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZXMpO1xuXG4gICAgaWYgKG9iamVjdEtleXMuaW5jbHVkZXMoXCJhbmNob3JIZWlnaHRcIikpXG4gICAgICBzdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLW1kcy1wb3BvdmVyLWFuY2hvci1oZWlnaHRcIixcbiAgICAgICAgYCR7TWF0aC5yb3VuZCh2YWx1ZXMuYW5jaG9ySGVpZ2h0KX1weGBcbiAgICAgICk7XG5cbiAgICBpZiAob2JqZWN0S2V5cy5pbmNsdWRlcyhcImFuY2hvcldpZHRoXCIpKVxuICAgICAgc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFwiLS1tZHMtcG9wb3Zlci1hbmNob3Itd2lkdGhcIixcbiAgICAgICAgYCR7TWF0aC5yb3VuZCh2YWx1ZXMuYW5jaG9yV2lkdGgpfXB4YFxuICAgICAgKTtcblxuICAgIGlmIChvYmplY3RLZXlzLmluY2x1ZGVzKFwidG9wXCIpKVxuICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLW1kcy1wb3BvdmVyLWF2YWlsYWJsZS1zcGFjZS10b3BcIixcbiAgICAgICAgYCR7TWF0aC5yb3VuZCh2YWx1ZXMudG9wKX1weGBcbiAgICAgICk7XG5cbiAgICBpZiAob2JqZWN0S2V5cy5pbmNsdWRlcyhcImJvdHRvbVwiKSlcbiAgICAgIHN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tbWRzLXBvcG92ZXItYXZhaWxhYmxlLXNwYWNlLWJvdHRvbVwiLFxuICAgICAgICBgJHtNYXRoLnJvdW5kKHZhbHVlcy5ib3R0b20pfXB4YFxuICAgICAgKTtcblxuICAgIGlmIChvYmplY3RLZXlzLmluY2x1ZGVzKFwicmlnaHRcIikpXG4gICAgICBzdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLW1kcy1wb3BvdmVyLWF2YWlsYWJsZS1zcGFjZS1yaWdodFwiLFxuICAgICAgICBgJHtNYXRoLnJvdW5kKHZhbHVlcy5yaWdodCl9cHhgXG4gICAgICApO1xuXG4gICAgaWYgKG9iamVjdEtleXMuaW5jbHVkZXMoXCJsZWZ0XCIpKVxuICAgICAgc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFwiLS1tZHMtcG9wb3Zlci1hdmFpbGFibGUtc3BhY2UtbGVmdFwiLFxuICAgICAgICBgJHtNYXRoLnJvdW5kKHZhbHVlcy5sZWZ0KX1weGBcbiAgICAgICk7XG4gIH0sXG4gIC8qKlxuICAgKiBUaGUgbW91bnRlZCBob29rXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkXG4gICAqXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgbW91bnRlZCgpIHtcbiAgICAvLyBEZWZpbmUgdGhlIHNob3cgYW5kIGhpZGUgZnVuY3Rpb25zXG4gICAgdGhpcy5zaG93RnVuYyA9IHRoaXMuc2hvdy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGlkZUZ1bmMgPSB0aGlzLmhpZGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvZ2dsZUZ1bmMgPSB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gQWRkIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZHM6cG9wb3ZlcjpzaG93XCIsIHRoaXMuc2hvd0Z1bmMpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1kczpwb3BvdmVyOmhpZGVcIiwgdGhpcy5oaWRlRnVuYyk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibWRzOnBvcG92ZXI6dG9nZ2xlXCIsIHRoaXMudG9nZ2xlRnVuYyk7XG5cbiAgICAvLyBMaXN0ZW4gdG8gdGhlIGV2ZW50cyAoTGl2ZVZpZXcgZXZlbnRzKVxuICAgIHRoaXMuaGFuZGxlRXZlbnQoXCJtZHM6cG9wb3ZlcjpzaG93XCIsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgaXNNeUV2ZW50ID0gXCIjXCIgKyB0aGlzLmVsLmlkID09IGV2ZW50LmlkIHx8IHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQ7XG4gICAgICBpZiAoaXNNeUV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2hvdyhldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5oYW5kbGVFdmVudChcIm1kczpwb3BvdmVyOmhpZGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBpc015RXZlbnQgPSBcIiNcIiArIHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQgfHwgdGhpcy5lbC5pZCA9PSBldmVudC5pZDtcbiAgICAgIGlmIChpc015RXZlbnQpIHtcbiAgICAgICAgdGhpcy5oaWRlKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmhhbmRsZUV2ZW50KFwibWRzOnBvcG92ZXI6dG9nZ2xlXCIsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgaXNNeUV2ZW50ID0gXCIjXCIgKyB0aGlzLmVsLmlkID09IGV2ZW50LmlkIHx8IHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQ7XG4gICAgICBpZiAoaXNNeUV2ZW50KSB7XG4gICAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNldHVwIHRoZSBob3ZlciB0cmlnZ2Vyc1xuICAgIHRoaXMuaG92ZXJzID0gW107XG5cbiAgICAvLyBTZXR1cCB0aGUgcG9wb3ZlclxuICAgIHRoaXMuc2V0dXAoKTtcblxuICAgIC8vIENoZWNrIGZvciBpbml0aWFsIHN0YXR1c1xuICAgIHRoaXMuY2hlY2tGb3JJbml0aWFsU3RhdHVzKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBUaGUgZGVzdHJveWVkIGhvb2tcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZFxuICAgKiAgQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBkZXN0cm95ZWQoKSB7XG4gICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibWRzOnBvcG92ZXI6c2hvd1wiLCB0aGlzLnNob3dGdW5jKTtcbiAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZHM6cG9wb3ZlcjpoaWRlXCIsIHRoaXMuaGlkZUZ1bmMpO1xuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1kczpwb3BvdmVyOnRvZ2dsZVwiLCB0aGlzLnRvZ2dsZUZ1bmMpO1xuXG4gICAgLy8gRGVzdHJveSBlbGVtZW50cyBldmVudCBsaXN0ZW5lcnNcbiAgICB0aGlzLmhvdmVycy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgaWYgKGVsKSB7XG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIHRoaXMuc2hvd0Z1bmMpO1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCB0aGlzLmhpZGVGdW5jKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmRpc3Bvc2VGdW5jKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5kaXNwb3NlRnVuYyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoYXNlRnVuYykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5jaGFzZUZ1bmMpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5jaGFzZUZ1bmMpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFNldHVwIHRoZSBwb3BvdmVyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIHNldHVwKCkge1xuICAgIC8vIFNldHVwIHRoZSBob3ZlciB0cmlnZ2Vyc1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1tZHMtcG9wb3Zlci1ob3Zlcl1cIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIGlmIChlbC5kYXRhc2V0Lm1kc1BvcG92ZXJIb3ZlciA9PT0gdGhpcy5lbC5pZCkge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCB0aGlzLnNob3dGdW5jKTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgdGhpcy5oaWRlRnVuYyk7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBlbGVtZW50IHRvIHRoZSBob3ZlcnMgYXJyYXkgdG8gYmUgZGVzdHJveWVkIGxhdGVyXG4gICAgICAgIHRoaXMuaG92ZXJzLnB1c2goZWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBtYXhpbXVtIHotaW5kZXggb2YgdGhlIHBhZ2VcbiAgICBsZXQgY3VycmVudFpJbmRleCA9IDUwO1xuICAgIGNvbnN0IHRyZWVXYWxrZXIgPSBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKFxuICAgICAgZG9jdW1lbnQuYm9keSxcbiAgICAgIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UXG4gICAgKTtcblxuICAgIC8qXG4gICAgICogTGltaXQgdG8gNTAwMCB0aGUgbWF4IGl0ZXJhdGlvbnNcbiAgICAgKiB0byBhdm9pZCBpbmZpbml0ZSBsb29wc1xuICAgICAqL1xuICAgIGxldCBtYXhCb3VuZEN5Y2xlID0gMDtcbiAgICB3aGlsZSAodHJlZVdhbGtlci5uZXh0Tm9kZSgpICYmIG1heEJvdW5kQ3ljbGUgPCA1MDAwKSB7XG4gICAgICBjdXJyZW50WkluZGV4ID0gTWF0aC5tYXgoXG4gICAgICAgIGN1cnJlbnRaSW5kZXgsXG4gICAgICAgIHBhcnNlSW50KHRoaXMuZ2V0RWxTdHlsZSh0cmVlV2Fsa2VyLmN1cnJlbnROb2RlKS56SW5kZXgsIDEwKSB8fCAwXG4gICAgICApO1xuICAgICAgbWF4Qm91bmRDeWNsZSArPSAxO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50WkluZGV4ID49IDUwKSB7XG4gICAgICB0aGlzLmVsLnN0eWxlLnpJbmRleCA9IGN1cnJlbnRaSW5kZXggKyAxO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBjcmVhdGVkXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjaGVja0ZvckluaXRpYWxTdGF0dXMoKSB7XG4gICAgLy8gR2V0IHRoZSB0YXJnZXRcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmVsLmRhdGFzZXQucG9wb3ZlclRhcmdldDtcblxuICAgIC8vIENoZWNrIGlmIHRoZSBwb3BvdmVyIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgaWYgKHRoaXMuZWwuZGF0YXNldC5pbml0aWFsU3RhdGUgPT09IFwidmlzaWJsZVwiICYmIHRhcmdldCkge1xuICAgICAgdGhpcy5zaG93KHsgdGFyZ2V0IH0pO1xuICAgIH1cbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBvcG92ZXI7XG4iLCAiY29uc3QgUmVzcG9uc2l2ZVNjcmVlbiA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLmhhdmVNaW4gPSAhIXRoaXMuZWwuZGF0YXNldC5taW47XG4gICAgdGhpcy5oYXZlTWF4ID0gISF0aGlzLmVsLmRhdGFzZXQubWF4O1xuXG4gICAgdGhpcy5tZWRpYVF1ZXJ5ID0gdGhpcy5nZW5NZWRpYVF1ZXJ5KCk7XG5cbiAgICAvLyBTZW5kaW5nIHRoZSBmaXJzdCBldmVudFxuICAgIGlmICh0aGlzLm1lZGlhUXVlcnkubWF0Y2hlcykge1xuICAgICAgdGhpcy5wdXNoRXZlbnRUbyh0aGlzLmVsLCBcInNob3dcIik7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBsaXN0ZW5lclxuICAgIHRoaXMubWVkaWFRdWVyeS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICh7IG1hdGNoZXMgfSkgPT4ge1xuICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgdGhpcy5wdXNoRXZlbnRUbyh0aGlzLmVsLCBcInNob3dcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnB1c2hFdmVudFRvKHRoaXMuZWwsIFwiaGlkZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgdXBkYXRlZCgpIHtcbiAgICBpZiAodGhpcy5tZWRpYVF1ZXJ5Lm1hdGNoZXMpIHtcbiAgICAgIHRoaXMucHVzaEV2ZW50VG8odGhpcy5lbCwgXCJzaG93XCIpO1xuICAgIH1cbiAgfSxcbiAgZ2VuTWVkaWFRdWVyeSgpIHtcbiAgICBpZiAodGhpcy5oYXZlTWluICYmIHRoaXMuaGF2ZU1heCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKFxuICAgICAgICBgKG1pbi13aWR0aDogJHt0aGlzLmVsLmRhdGFzZXQubWlufXB4KSBhbmQgKG1heC13aWR0aDogJHt0aGlzLmVsLmRhdGFzZXQubWF4fXB4KWAsXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5oYXZlTWluKSB7XG4gICAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoYChtaW4td2lkdGg6ICR7dGhpcy5lbC5kYXRhc2V0Lm1pbn1weClgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGF2ZU1heCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke3RoaXMuZWwuZGF0YXNldC5tYXh9cHgpYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKGAobWluLXdpZHRoOiAxcHgpYCk7XG4gIH0sXG59O1xuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2l2ZVNjcmVlbjtcbiIsICJjb25zdCBQb3J0YWwgPSB7XG4gIGNyZWF0ZTogZnVuY3Rpb24gKGVsLCBkZXN0aW5hdGlvblRhZywgZGVzdGluYXRpb24pIHtcbiAgICBjb25zdCBwb3J0YWxJZCA9IHRoaXMuZ2VuUmFuZG9tSWQoKTtcbiAgICBjb25zdCBwb3J0YWwgPSBlbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgcG9ydGFsLmlkID0gcG9ydGFsSWQ7XG4gICAgcG9ydGFsLnNldEF0dHJpYnV0ZShcImRhdGEtaXMtcG9ydGFsXCIsIFwidHJ1ZVwiKTtcbiAgICBjb25zdCB0cmFuc2Zvcm1lZFBvcnRhbCA9IHRoaXMuY2hhbmdlVGFnKHBvcnRhbCwgZGVzdGluYXRpb25UYWcpO1xuICAgIHRyYW5zZm9ybWVkUG9ydGFsLmFwcGVuZENoaWxkKGVsLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICBkZXN0aW5hdGlvbi5hcHBlbmRDaGlsZCh0cmFuc2Zvcm1lZFBvcnRhbCk7XG4gICAgcmV0dXJuIHBvcnRhbElkO1xuICB9LFxuICBkZXN0cm95OiBmdW5jdGlvbiAoZWwpIHtcbiAgICBjb25zdCBwb3J0YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbCk7XG4gICAgaWYgKHBvcnRhbCkge1xuICAgICAgcG9ydGFsLnJlbW92ZSgpO1xuICAgIH1cbiAgfSxcbiAgY2hhbmdlVGFnOiBmdW5jdGlvbiAobm9kZSwgdGFnKSB7XG4gICAgY29uc3QgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICBmb3IgKGNvbnN0IGF0dHIgb2Ygbm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoYXR0ci5uYW1lICE9IFwiZGF0YS1tZHMtZHJvcGRvd24tY29udGVudFwiKSB7XG4gICAgICAgIG5ld0VsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0VsZW1lbnQ7XG4gIH0sXG4gIGdlblJhbmRvbUlkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGBtZHMtcG9ydGFsLSR7RGF0ZS5ub3coKX1gO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUG9ydGFsO1xuIiwgImltcG9ydCBQb3J0YWwgZnJvbSBcIi4uL3V0aWxzL3BvcnRhbFwiO1xuXG5jb25zdCBPRkZTRVRfWSA9IDE2OyAvLyBPZmZzZXQgb2YgdGhlIHNuYWNrYmFyIGZyb20gdGhlIHRvcCBvZiB0aGUgc2NyZWVuXG5cbmNvbnN0IE1vb25TbmFja0JhckV2ZW50c0hhbmRsZXIgPSB7XG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIHNuYWNrYmFyIGZyb20gdGhlIHNjcmVlblxuICAgKiAtLS1cbiAgICogQHBhcmFtIHthbnl9IGRhdGFcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICByZW1vdmUoZGF0YSkge1xuICAgIGNvbnN0IHBvcnRhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEucG9ydGFsSWQpO1xuICAgIGlmIChwb3J0YWwpIHtcbiAgICAgIGNvbnN0IHNuYWNrYmFyID0gcG9ydGFsLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1tZHMtc25hY2tiYXJdXCIpO1xuICAgICAgaWYgKHNuYWNrYmFyKSB7XG4gICAgICAgIHNuYWNrYmFyLnN0eWxlLnRvcCA9XG4gICAgICAgICAgc25hY2tiYXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gT0ZGU0VUX1kgKyBcInB4XCI7XG4gICAgICAgIHNuYWNrYmFyLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBQb3J0YWwuZGVzdHJveShkYXRhLnBvcnRhbElkKTtcbiAgICAgICAgfSwgMjAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBTaG93IHRoZSBzbmFja2JhclxuICAgKiBAcGFyYW0ge2FueX0gZGF0YVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgc2hvdyhkYXRhKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEub3JpZ2luSWQuc2xpY2UoMSkpO1xuICAgIGlmICghZWxlbWVudCkgcmV0dXJuOyAvLyBDYW5jZWwgaWYgbm8gZWxlbWVudCBpcyBmb3VuZFxuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCBwb3J0YWxFbCA9IGVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgIHBvcnRhbEVsLmlkID0gZGF0YS5pZDtcbiAgICByZXR1cm4gUG9ydGFsLmNyZWF0ZShwb3J0YWxFbCwgXCJkaXZcIiwgZGVzdGluYXRpb24pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIG9mZnNldCBvZiB0aGUgaGVhZGVyXG4gICAqIC0tLVxuICAgKiBAcmV0dXJucyBpbnRcbiAgICovXG4gIG9mZnNldEhlYWRlcigpIHtcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGVhZGVyXCIpO1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIHJldHVybiBoZWFkZXIub2Zmc2V0SGVpZ2h0ICsgT0ZGU0VUX1k7XG4gICAgfVxuICAgIHJldHVybiBPRkZTRVRfWTtcbiAgfSxcbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgb2Zmc2V0IG9mIHRoZSBzbmFja2JhcnNcbiAgICogQHJldHVybnMgaW50XG4gICAqL1xuICBvZmZzZXRZKCkge1xuICAgIHJldHVybiB0aGlzLm9mZnNldEhlYWRlcigpO1xuICB9LFxuICAvKipcbiAgICogU2V0IHRoZSBZIEF4aXNcbiAgICovXG4gIHNldFlBeGlzKGFsaWduLCBwb3B1cCwgeSkge1xuICAgIGlmIChhbGlnbiA9PSBcImJvdHRvbVwiKSB7XG4gICAgICBwb3B1cC5zdHlsZS5ib3R0b20gPSB5O1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3B1cC5zdHlsZS50b3AgPSB5O1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQW5pbWF0ZSB0aGUgc25hY2tiYXJcbiAgICovXG4gIGFuaW1hdGUoY3VycmVudGx5T25TY3JlZW4gPSBbXSwgaXNFeHBhbmRlZCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IHRoaXMub2Zmc2V0WSgpO1xuICAgIGNvbnN0IGJhc2UgPSBjdXJyZW50bHlPblNjcmVlblxuICAgICAgLmZpbHRlcigoc25hY2tiYXIpID0+ICFzbmFja2Jhci50b1JlbW92ZSlcbiAgICAgIC50b1JldmVyc2VkKCk7XG5cbiAgICBiYXNlLmZvckVhY2goKHNuYWNrYmFyLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgc25hY2tiYXJFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNuYWNrYmFyLnBvcnRhbElkKTtcbiAgICAgIGlmICghc25hY2tiYXJFbCkgcmV0dXJuO1xuICAgICAgY29uc3QgcG9wdXAgPSBzbmFja2JhckVsLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1tZHMtc25hY2tiYXJdXCIpO1xuICAgICAgaWYgKCFwb3B1cCkgcmV0dXJuO1xuICAgICAgY29uc3QgYWxpZ24gPSBzbmFja2JhckVsLmRhdGFzZXQuYWxpZ247XG4gICAgICBpZiAoaXNFeHBhbmRlZCkge1xuICAgICAgICBwb3B1cC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIHRoaXMuc2V0WUF4aXMoYWxpZ24sIHBvcHVwLCBgJHtvZmZzZXRZICsgaW5kZXggKiA2NH1weGApO1xuICAgICAgICBwb3B1cC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgcG9wdXAuc3R5bGUuekluZGV4ID0gMTAwMCAtIGluZGV4O1xuICAgICAgICBwb3B1cC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtNTAlKWA7XG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gMC4xICsgaW5kZXggKiAwLjA1O1xuICAgICAgICBwb3B1cC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1zYDtcbiAgICAgICAgaWYgKGluZGV4ID4gNCkge1xuICAgICAgICAgIHBvcHVwLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgIHBvcHVwLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaW5kZXggPj0gMykge1xuICAgICAgICAgIHBvcHVwLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgIHRoaXMuc2V0WUF4aXMoYWxpZ24sIHBvcHVwLCBcIjBweFwiKTtcbiAgICAgICAgICBwb3B1cC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICBjb25zdCByZWR1Y2VGYWN0b3IgPSAxIC0gaW5kZXggKiAwLjE7XG4gICAgICAgICAgcG9wdXAuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLTUwJSkgc2NhbGUoJHtyZWR1Y2VGYWN0b3J9KWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRZQXhpcyhhbGlnbiwgcG9wdXAsIGAke29mZnNldFkgKyBpbmRleCAqIDh9cHhgKTtcbiAgICAgICAgICBjb25zdCByZWR1Y2VGYWN0b3IgPSAxIC0gaW5kZXggKiAwLjE7XG4gICAgICAgICAgcG9wdXAuc3R5bGUub3BhY2l0eSA9IHJlZHVjZUZhY3RvcjtcbiAgICAgICAgICBwb3B1cC5zdHlsZS56SW5kZXggPSAxMDAwIC0gaW5kZXg7XG4gICAgICAgICAgcG9wdXAuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgIHBvcHVwLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGAwLjJzYDtcbiAgICAgICAgICBwb3B1cC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtNTAlKSBzY2FsZSgke3JlZHVjZUZhY3Rvcn0pYDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSYW5kb20gSUQgZ2VuZXJhdG9yXG4gICAqIEByZXR1cm5zIHN0cmluZ1xuICAgKi9cbiAgZ2VuUmFuZG9tSWQoKSB7XG4gICAgcmV0dXJuIFwibVwiICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1vb25TbmFja0JhckV2ZW50c0hhbmRsZXI7XG4iLCAiaW1wb3J0IE1vb25TbmFja0JhckV2ZW50c0hhbmRsZXIgZnJvbSBcIi4vc25hY2tiYXJfZXZlbnRzX2hhbmRsZXJcIjtcblxuY29uc3QgU05BQ0tCQVJfRFVSQVRJT04gPSAzMDAwOyAvLyBUaGUgZHVyYXRpb24gb2YgdGhlIHNuYWNrYmFyIG9uIHRoZSBzY3JlZW5cblxuY2xhc3MgTW9vblNuYWNrQmFyTWFuYWdlciB7XG4gIC8qKlxuICAgKiBTZXR1cCB0aGUgTW9vblNuYWNrYmFySGFuZGxlclxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIFRoZSBzbmFja2JhciBoYW5kbGVyXG4gICAgdGhpcy5jdXJyZW50bHlPblNjcmVlbiA9IFtdO1xuXG4gICAgLy8gVGltZW91dCBmb3IgdGhlIHNuYWNrYmFyXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLmxlYXZlVGltZW91dCA9IG51bGw7XG5cbiAgICAvLyBTZXR1cCB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cbiAgLyoqXG4gICAqIFNldHVwIHRoZSBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSBNb29uU25hY2tiYXJIYW5kbGVyXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgc2V0dXBFdmVudExpc3RlbmVycygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDptZHM6c25hY2tiYXI6cmVtb3ZlXCIsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVSZW1vdmUoZXZlbnQpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4Om1kczpzbmFja2JhcjpzaG93XCIsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVTaG93KGV2ZW50KTtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogVGhlIGhlYXJ0IG9mIHRoZSBzbmFja2JhciBoYW5kbGVyLCB0aGlzIGlzIHVzZWQgdG8gc2hvdyB0aGUgc25hY2tiYXJcbiAgICogb24gdGhlIHNjcmVlbi5cbiAgICogLS0tXG4gICAqL1xuICBiZWF0KCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRseU9uU2NyZWVuLmxlbmd0aCA+IDAgJiYgIXRoaXMuaXNFeHBhbmRlZCkge1xuICAgICAgY29uc3Qgc25hY2tiYXJUb1JlbW92ZSA9IHRoaXMuY3VycmVudGx5T25TY3JlZW4ucG9wKCk7XG4gICAgICBNb29uU25hY2tCYXJFdmVudHNIYW5kbGVyLnJlbW92ZShzbmFja2JhclRvUmVtb3ZlKTtcbiAgICAgIE1vb25TbmFja0JhckV2ZW50c0hhbmRsZXIuYW5pbWF0ZShcbiAgICAgICAgdGhpcy5jdXJyZW50bHlPblNjcmVlbixcbiAgICAgICAgdGhpcy5pc0V4cGFuZGVkXG4gICAgICApO1xuICAgICAgdGhpcy5yZXF1ZXN0QmVhdCgpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogSXMgdGhlIHNuYWNrYmFyIGNvbnRhaW5pbmcgYSBhY3Rpb24/XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzQWN0aW9uU25hY2tiYXIoaWQpIHtcbiAgICBpZiAoIWlkKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkLnNsaWNlKDEpKS5kYXRhc2V0LmFjdGlvbiA9PSBcInRydWVcIjtcbiAgfVxuICAvKipcbiAgICogSGFuZGxlIHRoZSBzaG93IHNuYWNrYmFyIGV2ZW50XG4gICAqIC0tLVxuICAgKiBAcGFyYW0ge0N1c3RvbUV2ZW50fSBldmVudFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGhhbmRsZVNob3coZXZlbnQpIHtcbiAgICBjb25zdCB7IGlkIH0gPSBldmVudC5kZXRhaWw7XG4gICAgaWYgKCFpZCkgcmV0dXJuOyAvLyBDYW5jZWwgaWYgbm8gaWQgaXMgcHJvdmlkZWRcbiAgICBjb25zdCBpc0FjdGlvblNuYWNrYmFyID0gdGhpcy5pc0FjdGlvblNuYWNrYmFyKGlkKTtcbiAgICBjb25zdCByYW5kSWQgPSBNb29uU25hY2tCYXJFdmVudHNIYW5kbGVyLmdlblJhbmRvbUlkKCk7XG4gICAgbGV0IHNuYWNrYmFyVG9TaG93ID0ge1xuICAgICAgaWQ6IHJhbmRJZCxcbiAgICAgIG9yaWdpbklkOiBpZCxcbiAgICAgIG9yaWdpbkRhdGU6IG5ldyBEYXRlKCksXG4gICAgICBpc0FjdGlvblNuYWNrYmFyLFxuICAgICAgcG9ydGFsSWQ6IG51bGwsXG4gICAgICB0b1JlbW92ZTogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMuY3VycmVudGx5T25TY3JlZW4ucHVzaChzbmFja2JhclRvU2hvdyk7XG4gICAgc25hY2tiYXJUb1Nob3cucG9ydGFsSWQgPSBNb29uU25hY2tCYXJFdmVudHNIYW5kbGVyLnNob3coc25hY2tiYXJUb1Nob3cpO1xuXG4gICAgTW9vblNuYWNrQmFyRXZlbnRzSGFuZGxlci5hbmltYXRlKHRoaXMuY3VycmVudGx5T25TY3JlZW4sIHRoaXMuaXNFeHBhbmRlZCk7XG4gICAgY29uc3Qgc25hY2tiYXJQb3J0YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzbmFja2JhclRvU2hvdy5wb3J0YWxJZCk7XG4gICAgc25hY2tiYXJQb3J0YWwucmVtb3ZlQXR0cmlidXRlKFwicGh4LWhvb2tcIik7XG4gICAgc25hY2tiYXJQb3J0YWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVIb3ZlcigpO1xuICAgIH0pO1xuICAgIHNuYWNrYmFyUG9ydGFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTGVhdmUoKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlcXVlc3RCZWF0KCk7XG4gIH1cbiAgLyoqXG4gICAqIEhhbmRsZSB0aGUgcmVtb3ZlIHNuYWNrYmFyLCByZW1vdmUgaXMgdXNlZCB0byBub3RpZnkgdGhlIGhhbmRsZXJcbiAgICogdGhhdCBhIHNuYWNrYmFyIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgRE9NLlxuICAgKiBAcGFyYW0ge0N1c3RvbUV2ZW50fSBldmVudFxuICAgKi9cbiAgaGFuZGxlUmVtb3ZlKGV2ZW50KSB7XG4gICAgY29uc3QgeyBpZCB9ID0gZXZlbnQuZGV0YWlsO1xuICAgIHRoaXMuY3VycmVudGx5T25TY3JlZW4gPSB0aGlzLmN1cnJlbnRseU9uU2NyZWVuLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0ub3JpZ2luSWQgPT0gaWQpIHtcbiAgICAgICAgTW9vblNuYWNrQmFyRXZlbnRzSGFuZGxlci5yZW1vdmUoaXRlbSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICB0b1JlbW92ZTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pO1xuICAgIGNvbnN0IHQgPSB0aGlzLmN1cnJlbnRseU9uU2NyZWVuLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5vcmlnaW5JZCA9PSBpZCk7XG4gICAgdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBNb29uU25hY2tCYXJFdmVudHNIYW5kbGVyLnJlbW92ZShpdGVtKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlcXVlc3RCZWF0KCk7XG5cbiAgICB0aGlzLmlzRXhwYW5kZWQgPSBmYWxzZTtcbiAgICBzZXRUaW1lb3V0KFxuICAgICAgKCkgPT5cbiAgICAgICAgTW9vblNuYWNrQmFyRXZlbnRzSGFuZGxlci5hbmltYXRlKFxuICAgICAgICAgIHRoaXMuY3VycmVudGx5T25TY3JlZW4sXG4gICAgICAgICAgdGhpcy5pc0V4cGFuZGVkXG4gICAgICAgICksXG4gICAgICA0MDBcbiAgICApO1xuICB9XG4gIC8qKlxuICAgKiBSZXF1ZXN0IGEgYmVhdCBmb3IgdGhlIHNuYWNrYmFyXG4gICAqIEByZXR1cm5zIHZvaWRcbiAgICovXG4gIHJlcXVlc3RCZWF0KCkge1xuICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgIH1cbiAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuYmVhdCgpO1xuICAgIH0sIFNOQUNLQkFSX0RVUkFUSU9OKTtcbiAgfVxuICAvKipcbiAgICogSGFuZGxlIHRoZSBob3ZlciBldmVudFxuICAgKiBAcmV0dXJucyB2b2lkXG4gICAqL1xuICBoYW5kbGVIb3ZlcigpIHtcbiAgICBpZiAodGhpcy5sZWF2ZVRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmxlYXZlVGltZW91dCk7XG4gICAgfVxuICAgIHRoaXMuaXNFeHBhbmRlZCA9IHRydWU7XG4gICAgTW9vblNuYWNrQmFyRXZlbnRzSGFuZGxlci5hbmltYXRlKHRoaXMuY3VycmVudGx5T25TY3JlZW4sIHRoaXMuaXNFeHBhbmRlZCk7XG4gIH1cbiAgLyoqXG4gICAqIEhhbmRsZSB0aGUgbGVhdmUgZXZlbnRcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgaGFuZGxlTGVhdmUoKSB7XG4gICAgdGhpcy5sZWF2ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXNFeHBhbmRlZCA9IGZhbHNlO1xuICAgICAgTW9vblNuYWNrQmFyRXZlbnRzSGFuZGxlci5hbmltYXRlKFxuICAgICAgICB0aGlzLmN1cnJlbnRseU9uU2NyZWVuLFxuICAgICAgICB0aGlzLmlzRXhwYW5kZWRcbiAgICAgICk7XG4gICAgfSwgNDAwKTtcbiAgICB0aGlzLnJlcXVlc3RCZWF0KCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9vblNuYWNrQmFyTWFuYWdlcjtcbiIsICJpbXBvcnQgTW9vblNuYWNrQmFyTWFuYWdlciBmcm9tIFwiLi4vY29yZS9zbmFja2Jhcl9tYW5hZ2VyXCI7XG4vKipcbiAqIEB0eXBlIHtpbXBvcnQoXCJwaG9lbml4X2xpdmVfdmlld1wiKS5WaWV3SG9va31cbiAqL1xuY29uc3QgTW9vblNuYWNrYmFyID0ge1xuICAvLyBMaXZlIENvbXBvbmVudCBub3Qgc3VwcG9ydGVkLCBkdWUgTGl2ZVZpZXcgYnVnXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXRyaWNrLXN0ZWVsZS1pZGVtL21vcnBoZG9tL2lzc3Vlcy8yNTFcbiAgLy8gU28gdXBkYXRlZCBpcyBub3Qgc3VwcG9ydGVkXG4gIC8vXG4gIC8vIFJlbW92ZSBub3RpY2UgdGhlIGhhbmRsZXIgdGhhdCBhIHNuYWNrYmFyIGhhcyBiZWVuIHJlbW92ZWRcbiAgZGVzdHJveWVkKCkge1xuICAgIGlmICh0aGlzLmVsICYmIHRoaXMuZWwuaWQpIHtcbiAgICAgIHRoaXMuZXZlbnRHZW5lcmF0b3IoXCJyZW1vdmVcIiwgYCMke3RoaXMuZWwuaWR9YCk7XG4gICAgfVxuICB9LFxuICAvLyBGYWN0b3J5IEV2ZW50IEdlbmVyYXRvclxuICBldmVudEdlbmVyYXRvcih0eXBlLCBpZCwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoYHBoeDptZHM6c25hY2tiYXI6JHt0eXBlfWAsIHtcbiAgICAgIGRldGFpbDogeyBpZCwgb3B0cyB9LFxuICAgIH0pO1xuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfSxcbn07XG5cbi8vIEluaXRpYWxpemUgdGhlIE1vb25TbmFja2JhckhhbmRsZXJcbmlmICghd2luZG93Lk1vb25TbmFja0JhckhhbmRsZXIpIHtcbiAgd2luZG93Lk1vb25TbmFja0JhckhhbmRsZXIgPSBuZXcgTW9vblNuYWNrQmFyTWFuYWdlcigpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNb29uU25hY2tiYXI7XG4iLCAiY29uc3QgQ2Fyb3VzZWxIb29rID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuc2V0dXAoKTtcbiAgfSxcbiAgc2V0dXAoKSB7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibW9vbjpjYXJvdXNlbDpzY3JvbGxfbGVmdFwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBwYXJzZUludCh0aGlzLmVsLmRhdGFzZXQuYWN0aXZlU2xpZGVJbmRleCk7XG4gICAgICBjb25zdCBuZXh0SW5kZXggPSBzY3JvbGxMZWZ0KHsgY3VycmVudEluZGV4LCBlbGVtZW50OiB0aGlzLmVsIH0pO1xuXG4gICAgICB1cGRhdGVEYXRhQXR0cmlidXRlKHRoaXMuZWwsIGN1cnJlbnRJbmRleCwgbmV4dEluZGV4KTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vb246Y2Fyb3VzZWw6c2Nyb2xsX3JpZ2h0XCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHBhcnNlSW50KHRoaXMuZWwuZGF0YXNldC5hY3RpdmVTbGlkZUluZGV4KTtcbiAgICAgIGNvbnN0IHRvdGFsSXRlbXMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubW9vbi1jYXJvdXNlbC1pdGVtXCIpLmxlbmd0aDtcblxuICAgICAgY29uc3QgbmV4dEluZGV4ID0gc2Nyb2xsUmlnaHQoe1xuICAgICAgICBjdXJyZW50SW5kZXgsXG4gICAgICAgIHRvdGFsSXRlbXMsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuZWwsXG4gICAgICB9KTtcblxuICAgICAgdXBkYXRlRGF0YUF0dHJpYnV0ZSh0aGlzLmVsLCBjdXJyZW50SW5kZXgsIG5leHRJbmRleCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmNhcm91c2VsOnNjcm9sbF90b19pbmRleFwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSBldmVudDtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IGRldGFpbDtcblxuICAgICAgc2Nyb2xsVG9JbmRleCh7IGVsZW1lbnQ6IHRoaXMuZWwsIGluZGV4IH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZWwuZGF0YXNldC5hY3RpdmVTbGlkZUluZGV4ICE9PSBcIjBcIikge1xuICAgICAgc2Nyb2xsVG9JbmRleCh7XG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuZWwsXG4gICAgICAgIGluZGV4OiB0aGlzLmVsLmRhdGFzZXQuYWN0aXZlU2xpZGVJbmRleCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbn07XG5cbmNvbnN0IHNjcm9sbFRvSW5kZXggPSAoeyBlbGVtZW50LCBpbmRleCB9KSA9PiB7XG4gIGNvbnN0IHRvdGFsSXRlbXMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubW9vbi1jYXJvdXNlbC1pdGVtXCIpLmxlbmd0aDtcblxuICBpZiAoIWlzVmFsaWRJbmRleChpbmRleCwgdG90YWxJdGVtcykpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBhY3RpdmVTbGlkZUluZGV4ID0gcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LmFjdGl2ZVNsaWRlSW5kZXgpO1xuXG4gIHNjcm9sbCh7IGluZGV4LCBlbGVtZW50IH0pO1xuXG4gIHVwZGF0ZURhdGFBdHRyaWJ1dGUoZWxlbWVudCwgYWN0aXZlU2xpZGVJbmRleCwgaW5kZXgpO1xufTtcblxuY29uc3Qgc2Nyb2xsTGVmdCA9ICh7IGN1cnJlbnRJbmRleCwgZWxlbWVudCB9KSA9PiB7XG4gIGlmIChjdXJyZW50SW5kZXggPD0gMCkge1xuICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gIH1cblxuICBjb25zdCBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICBzY3JvbGwoeyBpbmRleDogbmV4dEluZGV4LCBlbGVtZW50IH0pO1xuXG4gIHJldHVybiBuZXh0SW5kZXg7XG59O1xuXG5jb25zdCBzY3JvbGxSaWdodCA9ICh7IGN1cnJlbnRJbmRleCwgdG90YWxJdGVtcywgZWxlbWVudCB9KSA9PiB7XG4gIGlmIChjdXJyZW50SW5kZXggPj0gdG90YWxJdGVtcyAtIDEpIHtcbiAgICByZXR1cm4gY3VycmVudEluZGV4O1xuICB9XG5cbiAgY29uc3QgbmV4dEluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgc2Nyb2xsKHsgaW5kZXg6IG5leHRJbmRleCwgZWxlbWVudCB9KTtcblxuICByZXR1cm4gbmV4dEluZGV4O1xufTtcblxuY29uc3Qgc2Nyb2xsID0gKHsgaW5kZXgsIGVsZW1lbnQgfSkgPT4ge1xuICBjb25zdCBhY3RpdmVTbGlkZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudC5pZH0tc2xpZGUtJHtpbmRleH1gKTtcblxuICB1cGRhdGVCdXR0b25BcnJvd3MoeyBlbGVtZW50LCBuZXdJbmRleDogaW5kZXggfSk7XG5cbiAgYWN0aXZlU2xpZGUuc2Nyb2xsSW50b1ZpZXcoe1xuICAgIGJlaGF2aW9yOiBcInNtb290aFwiLFxuICAgIGJsb2NrOiBcIm5lYXJlc3RcIixcbiAgICBpbmxpbmU6IFwiY2VudGVyXCIsXG4gIH0pO1xufTtcblxuY29uc3QgdXBkYXRlQnV0dG9uQXJyb3dzID0gKHsgZWxlbWVudCwgbmV3SW5kZXggfSkgPT4ge1xuICBjb25zdCBwcmV2QXJyb3dCdXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2VsZW1lbnQuaWR9LWFycm93LXN0YXJ0YCk7XG4gIGNvbnN0IG5leHRBcnJvd0J1dHRvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudC5pZH0tYXJyb3ctZW5kYCk7XG5cbiAgdXBkYXRlQnV0dG9uQXJyb3cocHJldkFycm93QnV0dG9uLCBuZXdJbmRleCA8PSAwKTtcbiAgdXBkYXRlQnV0dG9uQXJyb3cobmV4dEFycm93QnV0dG9uLCBuZXdJbmRleCA+PSBnZXRUb3RhbEl0ZW1zKGVsZW1lbnQpIC0gMSk7XG59O1xuXG5jb25zdCB1cGRhdGVCdXR0b25BcnJvdyA9IChhcnJvd0J1dHRvbiwgaXNEaXNhYmxlZCkgPT4ge1xuICBpZiAoaXNEaXNhYmxlZCkge1xuICAgIGFycm93QnV0dG9uLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBhcnJvd0J1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbn07XG5cbmNvbnN0IGdldFRvdGFsSXRlbXMgPSAoZWxlbWVudCkgPT5cbiAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vb24tY2Fyb3VzZWwtaXRlbVwiKS5sZW5ndGg7XG5cbmNvbnN0IHVwZGF0ZURhdGFBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYWN0aXZlSW5kZXgsIG5ld0luZGV4KSA9PiB7XG4gIGlmIChhY3RpdmVJbmRleCA9PT0gbmV3SW5kZXgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtYWN0aXZlLXNsaWRlLWluZGV4XCIpO1xuICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtYWN0aXZlLXNsaWRlLWluZGV4XCIsIG5ld0luZGV4KTtcbn07XG5cbmNvbnN0IGlzVmFsaWRJbmRleCA9IChpbmRleCwgdG90YWxJdGVtcykgPT4ge1xuICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0b3RhbEl0ZW1zKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDYXJvdXNlbEhvb2s7XG4iLCAiY29uc3QgcGFnaW5hdGlvblN0ZXBJZFByZWZpeCA9IFwiI3BhZ2luYXRpb24tc3RlcC1pdGVtLVwiO1xuXG5jb25zdCBQYWdpbmF0aW9uSG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLnNldHVwKCk7XG4gIH0sXG4gIHNldHVwKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsO1xuICAgIGNvbnN0IG1vZGUgPSBlbGVtZW50LmRhdGFzZXQubW9kZTtcbiAgICBjb25zdCBkYXRhVG90YWxTdGVwcyA9IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC50b3RhbFN0ZXBzLCAxMCk7XG4gICAgY29uc3QgcGFnaW5hdGlvbkl0ZW1zTGVuZ3RoID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgXCIubW9vbi1wYWdpbmF0aW9uLWl0ZW1cIlxuICAgICkubGVuZ3RoO1xuICAgIGNvbnN0IHRvdGFsU3RlcHMgPSBkYXRhVG90YWxTdGVwcyB8fCBwYWdpbmF0aW9uSXRlbXNMZW5ndGg7XG5cbiAgICBpZiAobW9kZSAhPT0gXCJsaW5rc1wiKSB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwibW9vbjpwYWdpbmF0aW9uOnN0ZXBcIixcbiAgICAgICAgKHsgZGV0YWlsOiB7IHN0ZXAgfSB9KSA9PiB7XG4gICAgICAgICAgbmF2aWdhdGUoe1xuICAgICAgICAgICAgZGlyZWN0aW9uOiBzdGVwLFxuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIGN1cnJlbnRTdGVwOiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQuYWN0aXZlU3RlcCksXG4gICAgICAgICAgICBtb2RlLFxuICAgICAgICAgICAgdG90YWxTdGVwcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuYXZpZ2F0ZUxpbmtzTW9kZSh7IGVsZW1lbnQsIHRvdGFsU3RlcHMgfSk7XG4gIH0sXG59O1xuXG5jb25zdCBuYXZpZ2F0ZUxpbmtzTW9kZSA9ICh7IGVsZW1lbnQsIHRvdGFsU3RlcHMgfSkgPT4ge1xuICBjb25zdCB7IGJhc2VQYXJhbTogcHJlZml4LCBtYXhEaXNwbGF5ZWRTdGVwcywgYWN0aXZlU3RlcCB9ID0gZWxlbWVudC5kYXRhc2V0O1xuICBjb25zdCBjdXJyZW50UGFnZSA9IHBhcnNlSW50KGdldFVybFBhcmFtcygpLmdldChwcmVmaXgpIHx8IGFjdGl2ZVN0ZXApO1xuXG4gIHJlbmRlclBhZ2luYXRpb25TdGVwcyh7XG4gICAgZWxlbWVudCxcbiAgICBzdGVwczogY2FsY3VsYXRlRGlzcGxheVN0ZXBzKFxuICAgICAgY3VycmVudFBhZ2UsXG4gICAgICB0b3RhbFN0ZXBzLFxuICAgICAgcGFyc2VJbnQobWF4RGlzcGxheWVkU3RlcHMpXG4gICAgKSxcbiAgICBwcmVmaXgsXG4gIH0pO1xuXG4gIG5hdmlnYXRlKHtcbiAgICBkaXJlY3Rpb246IGN1cnJlbnRQYWdlLFxuICAgIGVsZW1lbnQsXG4gICAgY3VycmVudFN0ZXA6IHBhcnNlSW50KGFjdGl2ZVN0ZXApLFxuICAgIHByZWZpeCxcbiAgICB0b3RhbFN0ZXBzLFxuICB9KTtcbn07XG5cbmNvbnN0IGNhbGN1bGF0ZURpc3BsYXlTdGVwcyA9IChjdXJyZW50UGFnZSwgdG90YWxTdGVwcywgbWF4RGlzcGxheWVkU3RlcHMpID0+IHtcbiAgaWYgKHRvdGFsU3RlcHMgPD0gbWF4RGlzcGxheWVkU3RlcHMpXG4gICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IHRvdGFsU3RlcHMgfSwgKF8sIGkpID0+IGkgKyAxKTtcblxuICBjb25zdCBoYWxmID0gTWF0aC5mbG9vcihtYXhEaXNwbGF5ZWRTdGVwcyAvIDIpO1xuICBpZiAoY3VycmVudFBhZ2UgPD0gaGFsZiArIDEpXG4gICAgcmV0dXJuIFsuLi5BcnJheShtYXhEaXNwbGF5ZWRTdGVwcyAtIDIpLmtleXMoKV1cbiAgICAgIC5tYXAoKGkpID0+IGkgKyAxKVxuICAgICAgLmNvbmNhdChbXCIuLi5cIiwgdG90YWxTdGVwc10pO1xuICBpZiAodG90YWxTdGVwcyAtIGN1cnJlbnRQYWdlIDw9IGhhbGYpXG4gICAgcmV0dXJuIFsxLCBcIi4uLlwiXS5jb25jYXQoXG4gICAgICBBcnJheS5mcm9tKFxuICAgICAgICB7IGxlbmd0aDogbWF4RGlzcGxheWVkU3RlcHMgLSAyIH0sXG4gICAgICAgIChfLCBpKSA9PiB0b3RhbFN0ZXBzIC0gbWF4RGlzcGxheWVkU3RlcHMgKyAzICsgaVxuICAgICAgKVxuICAgICk7XG4gIGNvbnN0IGZpcnN0U3RlcCA9IGN1cnJlbnRQYWdlIC0gMTtcbiAgcmV0dXJuIFtcbiAgICAxLFxuICAgIFwiLi4uXCIsXG4gICAgLi4uQXJyYXkuZnJvbSh7IGxlbmd0aDogbWF4RGlzcGxheWVkU3RlcHMgLSA0IH0sIChfLCBpKSA9PiBmaXJzdFN0ZXAgKyBpKSxcbiAgICBcIi4uLlwiLFxuICAgIHRvdGFsU3RlcHMsXG4gIF07XG59O1xuXG5jb25zdCByZW5kZXJQYWdpbmF0aW9uU3RlcHMgPSAoeyBlbGVtZW50LCBzdGVwcywgcHJlZml4IH0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAjJHtlbGVtZW50LmlkfS1pbm5lci1zdGVwc2ApO1xuICBjb25zdCB1cmxTZWFyY2hQYXJhbXMgPSBnZXRVcmxQYXJhbXMoKTtcbiAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgc3RlcHMuZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHN0ZXAgPT09IFwiLi4uXCIgPyBcInNwYW5cIiA6IFwiYVwiKTtcbiAgICBpdGVtLnRleHRDb250ZW50ID0gc3RlcDtcbiAgICBpZiAoc3RlcCA9PT0gXCIuLi5cIikge1xuICAgICAgaXRlbS5jbGFzc05hbWUgPSBcIm1vb24tcGFnaW5hdGlvbi1lbGxpcHNpc1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVtLmNsYXNzTmFtZSA9XG4gICAgICAgIFwibW9vbi1wYWdpbmF0aW9uLWl0ZW0gZGF0YS1bYWN0aXZlPXRydWVdOm1vb24tcGFnaW5hdGlvbi1pdGVtLWFjdGl2ZVwiO1xuICAgICAgdXJsU2VhcmNoUGFyYW1zLnNldChwcmVmaXgsIHN0ZXApO1xuICAgICAgaXRlbS5ocmVmID0gYD8ke3VybFNlYXJjaFBhcmFtcy50b1N0cmluZygpfWA7XG4gICAgICBpdGVtLmRhdGFzZXQucGFnaW5hdGlvblN0ZXAgPSBzdGVwO1xuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gIH0pO1xufTtcblxuY29uc3QgbmF2aWdhdGUgPSAoe1xuICBkaXJlY3Rpb24sXG4gIGVsZW1lbnQsXG4gIGN1cnJlbnRTdGVwLFxuICBtb2RlID0gXCJsaW5rc1wiLFxuICBwcmVmaXgsXG4gIHRvdGFsU3RlcHMsXG59KSA9PiB7XG4gIGNvbnN0IHN0ZXAgPSAvXlxcZCskLy50ZXN0KGRpcmVjdGlvbikgPyBwYXJzZUludChkaXJlY3Rpb24pIDogbnVsbDtcbiAgc3RlcFxuICAgID8gbmF2aWdhdGVUb1N0ZXAoeyBlbGVtZW50LCBzdGVwLCBwcmVmaXgsIHRvdGFsU3RlcHMsIG1vZGUgfSlcbiAgICA6IG5hdmlnYXRlV2l0aEFycm93cyh7IGRpcmVjdGlvbiwgZWxlbWVudCwgY3VycmVudFN0ZXAsIHRvdGFsU3RlcHMsIG1vZGUgfSk7XG59O1xuXG5jb25zdCBuYXZpZ2F0ZVdpdGhBcnJvd3MgPSAoe1xuICBkaXJlY3Rpb24sXG4gIGVsZW1lbnQsXG4gIGN1cnJlbnRTdGVwLFxuICB0b3RhbFN0ZXBzLFxuICBtb2RlLFxufSkgPT4ge1xuICBjb25zdCBzdGVwID0gZGlyZWN0aW9uID09PSBcInByZXZcIiA/IGN1cnJlbnRTdGVwIC0gMSA6IGN1cnJlbnRTdGVwICsgMTtcblxuICBpZiAoaXNWYWxpZFN0ZXAoc3RlcCwgdG90YWxTdGVwcykpIHtcbiAgICBuYXZpZ2F0ZVRvU3RlcCh7IGVsZW1lbnQsIHN0ZXAsIHRvdGFsU3RlcHMsIG1vZGUgfSk7XG4gIH1cbn07XG5cbmNvbnN0IG5hdmlnYXRlVG9TdGVwID0gKHsgZWxlbWVudCwgc3RlcCwgcHJlZml4LCB0b3RhbFN0ZXBzLCBtb2RlIH0pID0+IHtcbiAgY29uc3QgbmV3QWN0aXZlU3RlcCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBgW2RhdGEtcGFnaW5hdGlvbi1zdGVwPScke3N0ZXB9J11gXG4gICk7XG5cbiAgaWYgKCFuZXdBY3RpdmVTdGVwKSByZXR1cm47XG5cbiAgdXBkYXRlQWN0aXZlU3RlcChlbGVtZW50LCBuZXdBY3RpdmVTdGVwLCBzdGVwKTtcbiAgdXBkYXRlTmF2QXJyb3dzKHsgZWxlbWVudCwgbmV3U3RlcDogc3RlcCwgcHJlZml4LCB0b3RhbFN0ZXBzLCBtb2RlIH0pO1xufTtcblxuY29uc3QgdXBkYXRlQWN0aXZlU3RlcCA9IChlbGVtZW50LCBuZXdBY3RpdmVTdGVwLCBzdGVwKSA9PiB7XG4gIGNvbnN0IGN1cnJlbnRTZWxlY3RlZEl0ZW0gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWFjdGl2ZT10cnVlXWApO1xuICBjdXJyZW50U2VsZWN0ZWRJdGVtPy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFjdGl2ZVwiLCBcImZhbHNlXCIpO1xuICBjdXJyZW50U2VsZWN0ZWRJdGVtPy5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIFwiZmFsc2VcIik7XG5cbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFjdGl2ZS1zdGVwXCIsIHN0ZXApO1xuICBuZXdBY3RpdmVTdGVwLnNldEF0dHJpYnV0ZShcImRhdGEtYWN0aXZlXCIsIFwidHJ1ZVwiKTtcbiAgbmV3QWN0aXZlU3RlcC5zZXRBdHRyaWJ1dGUoXCJhcmlhLXNlbGVjdGVkXCIsIFwidHJ1ZVwiKTtcbn07XG5cbmNvbnN0IHVwZGF0ZU5hdkFycm93cyA9ICh7IGVsZW1lbnQsIG5ld1N0ZXAsIHByZWZpeCwgdG90YWxTdGVwcywgbW9kZSB9KSA9PiB7XG4gIFtcInByZXZcIiwgXCJuZXh0XCJdLmZvckVhY2goKGRpcmVjdGlvbikgPT4ge1xuICAgIGNvbnN0IGFycm93ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYCR7cGFnaW5hdGlvblN0ZXBJZFByZWZpeH0ke2VsZW1lbnQuaWR9LSR7ZGlyZWN0aW9ufWBcbiAgICApO1xuICAgIGlmICghYXJyb3cpIHJldHVybjtcblxuICAgIGNvbnN0IHN0ZXAgPSBkaXJlY3Rpb24gPT09IFwicHJldlwiID8gbmV3U3RlcCAtIDEgOiBuZXdTdGVwICsgMTtcblxuICAgIGlzVmFsaWRTdGVwKHN0ZXAsIHRvdGFsU3RlcHMpXG4gICAgICA/IHVwZGF0ZUxpbmtOYXZBcnJvdyhhcnJvdywgc3RlcCwgcHJlZml4LCBtb2RlKVxuICAgICAgOiBkaXNhYmxlTGlua0Fycm93KGFycm93LCBtb2RlKTtcbiAgfSk7XG59O1xuXG5jb25zdCB1cGRhdGVMaW5rTmF2QXJyb3cgPSAoaXRlbSwgc3RlcCwgcHJlZml4LCBtb2RlID0gXCJsaW5rc1wiKSA9PiB7XG4gIGlmIChtb2RlICE9PSBcImxpbmtzXCIpIHtcbiAgICBpdGVtLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHVybFNlYXJjaFBhcmFtcyA9IGdldFVybFBhcmFtcygpO1xuICB1cmxTZWFyY2hQYXJhbXMuc2V0KHByZWZpeCwgc3RlcCk7XG4gIGl0ZW0uaHJlZiA9IGA/JHt1cmxTZWFyY2hQYXJhbXMudG9TdHJpbmcoKX1gO1xuICBpdGVtLnJlbW92ZUF0dHJpYnV0ZShcIm9uY2xpY2tcIik7XG4gIGl0ZW0ucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1kaXNhYmxlZFwiKTtcbn07XG5cbmNvbnN0IGRpc2FibGVMaW5rQXJyb3cgPSAoaXRlbSwgbW9kZSA9IFwibGlua3NcIikgPT4ge1xuICBpZiAobW9kZSAhPT0gXCJsaW5rc1wiKSB7XG4gICAgaXRlbS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpdGVtLnJlbW92ZUF0dHJpYnV0ZShcImhyZWZcIik7XG4gIGl0ZW0uc2V0QXR0cmlidXRlKFwib25jbGlja1wiLCBcInJldHVybiBmYWxzZTtcIik7XG4gIGl0ZW0uc2V0QXR0cmlidXRlKFwiYXJpYS1kaXNhYmxlZFwiLCBcInRydWVcIik7XG59O1xuXG5jb25zdCBpc1ZhbGlkU3RlcCA9IChzdGVwLCB0b3RhbFN0ZXBzKSA9PiBzdGVwID4gMCAmJiBzdGVwIDw9IHRvdGFsU3RlcHM7XG5cbmNvbnN0IGdldFVybFBhcmFtcyA9ICgpID0+IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcztcblxuZXhwb3J0IGRlZmF1bHQgUGFnaW5hdGlvbkhvb2s7XG4iLCAiY29uc3QgVG9vbHRpcCA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zdCB0b29sdGlwID0gdGhpcy5lbDtcbiAgICBjb25zdCBjb250ZW50ID0gdG9vbHRpcC5xdWVyeVNlbGVjdG9yKFwiW3JvbGU9J3Rvb2x0aXAnXVwiKTtcblxuICAgY29uc3QgZ2V0QmFzZVBvc2l0aW9uID0gKCkgPT4gY29udGVudD8uZGF0YXNldC5iYXNlUG9zaXRpb247XG4gICAgbGV0IGlzUG9zaXRpb25lZCA9IGZhbHNlO1xuICAgIGxldCBvYnNlcnZlciA9IG51bGw7XG4gICAgbGV0IHJlc2l6ZVRpbWVvdXQgPSBudWxsO1xuXG4gICAgY29uc3QgcG9zaXRpb25DbGFzc2VzID0ge1xuICAgICAgdG9wOiBcIlwiLFxuICAgICAgYm90dG9tOiBcIm1vb24tdG9vbHRpcC1ib3R0b21cIixcbiAgICAgIHN0YXJ0OiBcIm1vb24tdG9vbHRpcC1zdGFydFwiLFxuICAgICAgZW5kOiBcIm1vb24tdG9vbHRpcC1lbmRcIlxuICAgIH07XG5cbiAgICBjb25zdCBjbGVhclBvc2l0aW9uQ2xhc3NlcyA9ICgpID0+IHtcbiAgICAgIE9iamVjdC52YWx1ZXMocG9zaXRpb25DbGFzc2VzKS5mb3JFYWNoKGNscyA9PiB7XG4gICAgICAgIGNscy5zcGxpdChcIiBcIikuZm9yRWFjaChjID0+IHtpZiAoYykgdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKGMpfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgYXBwbHlQb3NpdGlvbiA9IChwb3NpdGlvbikgPT4ge1xuICAgICAgY2xlYXJQb3NpdGlvbkNsYXNzZXMoKTtcbiAgICAgIHBvc2l0aW9uQ2xhc3Nlc1twb3NpdGlvbl0uc3BsaXQoXCIgXCIpLmZvckVhY2goYyA9PiB7XG4gICAgICAgIGlmIChjKSB0b29sdGlwLmNsYXNzTGlzdC5hZGQoYyk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2FsY3VsYXRlQmVzdFBvc2l0aW9uID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9vbHRpcFJlY3QgPSBjb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgcGFyZW50UmVjdCA9IHRvb2x0aXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB2aWV3cG9ydCA9IHtcbiAgICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgfTtcblxuICAgICAgY29uc3Qgc3BhY2UgPSB7XG4gICAgICAgIHRvcDogcGFyZW50UmVjdC50b3AsXG4gICAgICAgIGJvdHRvbTogdmlld3BvcnQuaGVpZ2h0IC0gcGFyZW50UmVjdC5ib3R0b20sXG4gICAgICAgIHN0YXJ0OiBwYXJlbnRSZWN0LmxlZnQsXG4gICAgICAgIGVuZDogdmlld3BvcnQud2lkdGggLSBwYXJlbnRSZWN0LnJpZ2h0XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBmaXRzID0ge1xuICAgICAgICB0b3A6IHRvb2x0aXBSZWN0LmhlaWdodCA8PSBzcGFjZS50b3AsXG4gICAgICAgIGJvdHRvbTogdG9vbHRpcFJlY3QuaGVpZ2h0IDw9IHNwYWNlLmJvdHRvbSxcbiAgICAgICAgc3RhcnQ6IHRvb2x0aXBSZWN0LndpZHRoIDw9IHNwYWNlLnN0YXJ0LFxuICAgICAgICBlbmQ6IHRvb2x0aXBSZWN0LndpZHRoIDw9IHNwYWNlLmVuZFxuICAgICAgfTtcblxuICAgICAgaWYgKGZpdHNbZ2V0QmFzZVBvc2l0aW9uKCldKSByZXR1cm4gZ2V0QmFzZVBvc2l0aW9uKCk7XG5cblxuICAgICAgY29uc3Qgc29ydGVkID0gT2JqZWN0LmVudHJpZXMoc3BhY2UpXG4gICAgICAgIC5maWx0ZXIoKFtwb3NdKSA9PiBmaXRzW3Bvc10pXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBiWzFdIC0gYVsxXSk7XG5cbiAgICAgIHJldHVybiBzb3J0ZWQubGVuZ3RoID4gMCA/IHNvcnRlZFswXVswXSA6IGdldEJhc2VQb3NpdGlvbigpO1xuICAgIH07XG5cbiAgICBjb25zdCBzZXR1cE9ic2VydmVyID0gKCkgPT4ge1xuICAgICAgaWYgKG9ic2VydmVyKSBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgIG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGVudHJpZXMgPT4ge1xuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgaWYgKCFlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICAgICAgY29uc3QgYmVzdCA9IGNhbGN1bGF0ZUJlc3RQb3NpdGlvbigpO1xuICAgICAgICAgICAgYXBwbHlQb3NpdGlvbihiZXN0KTtcbiAgICAgICAgICAgIGlzUG9zaXRpb25lZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmICghaXNQb3NpdGlvbmVkKSB7XG4gICAgICAgICAgICBhcHBseVBvc2l0aW9uKGdldEJhc2VQb3NpdGlvbigpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgcm9vdDogbnVsbCxcbiAgICAgICAgdGhyZXNob2xkOiAwLjk5LFxuICAgICAgfSk7XG5cbiAgICAgIG9ic2VydmVyLm9ic2VydmUoY29udGVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZVJlc2l6ZSA9ICgpID0+IHtcbiAgICAgIGlzUG9zaXRpb25lZCA9IGZhbHNlO1xuICAgICAgaWYgKG9ic2VydmVyKSBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICBpZiAocmVzaXplVGltZW91dCkgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVvdXQpO1xuXG4gICAgICByZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFwcGx5UG9zaXRpb24oZ2V0QmFzZVBvc2l0aW9uKCkpO1xuICAgICAgICBzZXR1cE9ic2VydmVyKCk7XG4gICAgICB9LCAzMDApO1xuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBoYW5kbGVSZXNpemUpO1xuXG4gICAgdG9vbHRpcC5fYXV0b1Bvc2l0aW9uQ2xlYW51cCA9ICgpID0+IHtcbiAgICAgIGlmIChvYnNlcnZlcikgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgaWYgKHJlc2l6ZVRpbWVvdXQpIGNsZWFyVGltZW91dChyZXNpemVUaW1lb3V0KTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGhhbmRsZVJlc2l6ZSk7XG4gICAgfTtcblxuICAgIGFwcGx5UG9zaXRpb24oZ2V0QmFzZVBvc2l0aW9uKCkpO1xuICAgIHNldHVwT2JzZXJ2ZXIoKTtcbiAgfSxcblxuICBkZXN0cm95ZWQoKSB7XG4gICAgdGhpcy5lbC5fYXV0b1Bvc2l0aW9uQ2xlYW51cD8uKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRvb2x0aXA7XG4iLCAiaW1wb3J0IEFjY29yZGlvbiBmcm9tIFwiLi9hY2NvcmRpb25cIjtcbmltcG9ydCBBdXRoZW50aWNhdG9yIGZyb20gXCIuL2F1dGhlbnRpY2F0b3JcIjtcbmltcG9ydCBEcmF3ZXIgZnJvbSBcIi4vZHJhd2VyXCI7XG5pbXBvcnQgTW9vbkRyb3Bkb3duIGZyb20gXCIuL2Ryb3Bkb3duXCI7XG5pbXBvcnQgRmlsZUlucHV0IGZyb20gXCIuL2ZpbGVfaW5wdXRcIjtcbmltcG9ydCBNb29uU3dpdGNoIGZyb20gXCIuL21vb25fc3dpdGNoXCI7XG5pbXBvcnQgUG9wb3ZlciBmcm9tIFwiLi9wb3BvdmVyXCI7XG5pbXBvcnQgUmVzcG9uc2l2ZVNjcmVlbiBmcm9tIFwiLi9yZXNwb25zaXZlX3NjcmVlblwiO1xuaW1wb3J0IE1vb25TbmFja2JhciBmcm9tIFwiLi9zbmFja2JhclwiO1xuaW1wb3J0IENhcm91c2VsSG9vayBmcm9tIFwiLi9jYXJvdXNlbFwiO1xuaW1wb3J0IFBhZ2luYXRpb25Ib29rIGZyb20gXCIuL3BhZ2luYXRpb25cIjtcbmltcG9ydCBUb29sdGlwIGZyb20gXCIuL3Rvb2x0aXBcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBUb29sdGlwLFxuICBBdXRoZW50aWNhdG9yLFxuICBEcmF3ZXIsXG4gIE1vb25Td2l0Y2gsXG4gIFBvcG92ZXIsXG4gIFJlc3BvbnNpdmVTY3JlZW4sXG4gIEFjY29yZGlvbixcbiAgTW9vbkRyb3Bkb3duLFxuICBNb29uU25hY2tiYXIsXG4gIENhcm91c2VsSG9vayxcbiAgRmlsZUlucHV0LFxuICBQYWdpbmF0aW9uSG9vayxcbn07XG4iLCAiLy8gSG9va3MgZm9yIHRoZSBtb29uX2RvY3MgYXBwXG5cbmltcG9ydCBDb2RlUHJldmlldyBmcm9tIFwiLi9Db2RlUHJldmlld1wiO1xuaW1wb3J0IG1vb25Ib29rcyBmcm9tIFwiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIENvZGVQcmV2aWV3SG9vazogQ29kZVByZXZpZXcsXG4gIC4uLm1vb25Ib29rcyxcbn07XG4iLCAiZnVuY3Rpb24gcG9wdWxhdGVUb2tlbnMoKSB7XG4gIGNvbnN0IHRva2VucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS10b2tlbl1cIik7XG4gIGNvbnN0IGNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcblxuICB0b2tlbnMuZm9yRWFjaCgodG9rZW4pID0+IHtcbiAgICBjb25zdCB0b2tlbk5hbWUgPSB0b2tlbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRva2VuXCIpO1xuICAgIGlmICghdG9rZW5OYW1lKSByZXR1cm47XG4gICAgY29uc3QgdG9rZW5zTGlzdCA9IHRva2VuTmFtZS5zcGxpdChcIixcIikubWFwKCh0KSA9PiB0LnRyaW0oKSk7XG5cbiAgICBjb25zdCBnZXRUb2tlblZhbHVlID0gKHQpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHQpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBsZXQgZmluYWxWYWx1ZSA9IHRva2Vuc0xpc3QubWFwKGdldFRva2VuVmFsdWUpLmpvaW4oXCIgXCIpO1xuICAgIGlmIChcbiAgICAgIHRva2VuTmFtZS5pbmNsdWRlcyhcIi0tdGV4dC1ib2R5LVwiKSB8fFxuICAgICAgdG9rZW5OYW1lLmluY2x1ZGVzKFwiLS10ZXh0LWhlYWRpbmctXCIpXG4gICAgKSB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGZpbmFsVmFsdWUuc3BsaXQoXCIgXCIpO1xuICAgICAgZmluYWxWYWx1ZSA9XG4gICAgICAgIGAke3BhcnRzWzBdfSAke3BhcnRzWzFdfS8ke3BhcnRzWzJdfWAgK1xuICAgICAgICAocGFydHMubGVuZ3RoID4gMyA/IGAgJHtwYXJ0cy5zbGljZSgzKS5qb2luKFwiIFwiKX1gIDogXCJcIik7XG4gICAgfVxuICAgIGlmICh0b2tlbk5hbWUuaW5jbHVkZXMoXCItLWVmZmVjdC1zaGFkb3ctXCIpKSB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGZpbmFsVmFsdWUuc3BsaXQoXCIgXCIpO1xuICAgICAgZmluYWxWYWx1ZSA9IGAke3BhcnRzLnNsaWNlKDAsIDQpLmpvaW4oXCIgXCIpfSAke3BhcnRzXG4gICAgICAgIC5zbGljZSg0LCA5KVxuICAgICAgICAuam9pbihcIiBcIil9LFxcbiR7cGFydHMuc2xpY2UoOSwgMTMpLmpvaW4oXCIgXCIpfSAke3BhcnRzXG4gICAgICAgIC5zbGljZSgxMylcbiAgICAgICAgLmpvaW4oXCIgXCIpfWA7XG4gICAgICB0b2tlbi5zdHlsZS53aGl0ZVNwYWNlID0gXCJwcmUtd3JhcFwiO1xuICAgIH1cbiAgICB0b2tlbi50ZXh0Q29udGVudCA9IGZpbmFsVmFsdWU7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwb3B1bGF0ZVRva2VucztcbiIsICIvLyBJZiB5b3VyIGNvbXBvbmVudHMgcmVxdWlyZSBhbnkgaG9va3Mgb3IgY3VzdG9tIHVwbG9hZGVycywgb3IgaWYgeW91ciBwYWdlc1xuLy8gcmVxdWlyZSBjb25uZWN0IHBhcmFtZXRlcnMsIHVuY29tbWVudCB0aGUgZm9sbG93aW5nIGxpbmVzIGFuZCBkZWNsYXJlIHRoZW0gYXNcbi8vIHN1Y2g6XG4vL1xuaW1wb3J0IEhvb2tzIGZyb20gXCIuL2hvb2tzXCI7XG5pbXBvcnQgcG9wdWxhdGVUb2tlbnMgZnJvbSBcIi4vcG9wdWxhdGVUb2tlbnMuanNcIjtcbi8vIGltcG9ydCAqIGFzIFBhcmFtcyBmcm9tIFwiLi9wYXJhbXNcIjtcbi8vIGltcG9ydCAqIGFzIFVwbG9hZGVycyBmcm9tIFwiLi91cGxvYWRlcnNcIjtcblxuKGZ1bmN0aW9uICgpIHtcbiAgLy8gICB3aW5kb3cuc3Rvcnlib29rID0geyBIb29rcywgUGFyYW1zLCBVcGxvYWRlcnMgfTtcbiAgd2luZG93LnN0b3J5Ym9vayA9IHsgSG9va3MgfTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRpciA9IFwibHRyXCI7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZGV0YWlsOiB7IHRvIH0sXG4gICAgfSA9IGV2ZW50O1xuXG4gICAgaWYgKHRvLmluY2x1ZGVzKFwiL3Rva2Vuc1wiKSkge1xuICAgICAgcG9wdWxhdGVUb2tlbnMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnVwZGF0ZVwiLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgIGNvbnN0IHsgYmFzZVVSSTogdG8gfSA9IHRhcmdldDtcblxuICAgIGlmICh0by5pbmNsdWRlcyhcInRoZW1lPWRhcmtcIikpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibW9vbi10aGVtZVwiLCBcImRhcmtcIik7XG4gICAgICBkb2N1bWVudC5jb29raWUgPSBcIm1vb24tdGhlbWU9ZGFyazsgbWF4LWFnZT0zMTUzNjAwMDsgcGF0aD0vXCI7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJsaWdodC10aGVtZVwiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIltjb2xvci1zY2hlbWU6bGlnaHRdXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwiZGFyay10aGVtZVwiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcImRhcmtcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJbY29sb3Itc2NoZW1lOmRhcmtdXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm1vb24tdGhlbWVcIiwgXCJsaWdodFwiKTtcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwibW9vbi10aGVtZT1saWdodDsgbWF4LWFnZT0zMTUzNjAwMDsgcGF0aD0vXCI7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJkYXJrLXRoZW1lXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiW2NvbG9yLXNjaGVtZTpkYXJrXVwiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcImRhcmtcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJsaWdodC10aGVtZVwiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIltjb2xvci1zY2hlbWU6bGlnaHRdXCIpO1xuICAgIH1cblxuICAgIGlmICh0by5pbmNsdWRlcyhcIi90b2tlbnNcIikpIHtcbiAgICAgIHBvcHVsYXRlVG9rZW5zKCk7XG4gICAgfVxuICB9KTtcbn0pKCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxjQUFjO0FBQUEsSUFDbEIsVUFBVTtBQUVSLFdBQUssU0FBUyxLQUFLLEdBQUcsY0FBYyw0QkFBNEI7QUFDaEUsV0FBSyxVQUFVLEtBQUssR0FBRyxjQUFjLDZCQUE2QjtBQUNsRSxXQUFLLGFBQWEsS0FBSyxHQUFHLGNBQWMsYUFBYTtBQUNyRCxXQUFLLGdCQUFnQixLQUFLLEdBQUc7QUFBQSxRQUMzQjtBQUFBLE1BQ0Y7QUFFQSxVQUFJLENBQUMsS0FBSyxXQUFXLEdBQUc7QUFFdEIsYUFBSyxPQUFPLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxPQUFPLENBQUM7QUFBQSxNQUMzRDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFFUCxVQUFJLEtBQUssUUFBUSxVQUFVLFNBQVMsVUFBVSxHQUFHO0FBQy9DLGFBQUssTUFBTTtBQUFBLE1BQ2IsT0FBTztBQUNMLGFBQUssS0FBSztBQUFBLE1BQ1o7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBRUwsV0FBSyxRQUFRLFVBQVUsSUFBSSxZQUFZLGVBQWU7QUFDdEQsV0FBSyxRQUFRLFVBQVUsT0FBTyxpQkFBaUI7QUFDL0MsV0FBSyxjQUFjLFVBQVUsSUFBSSxjQUFjLG9CQUFvQjtBQUNuRSxXQUFLLFdBQVcsY0FBYztBQUFBLElBQ2hDO0FBQUEsSUFDQSxRQUFRO0FBRU4sV0FBSyxRQUFRLFVBQVUsT0FBTyxZQUFZLGVBQWU7QUFDekQsV0FBSyxRQUFRLFVBQVUsSUFBSSxpQkFBaUI7QUFDNUMsV0FBSyxjQUFjLFVBQVUsT0FBTyxjQUFjLG9CQUFvQjtBQUN0RSxXQUFLLFdBQVcsY0FBYztBQUFBLElBQ2hDO0FBQUEsSUFDQSxhQUFhO0FBRVgsWUFBTSxhQUFhO0FBQ25CLFVBQUksS0FBSyxRQUFRLGdCQUFnQixZQUFZO0FBQzNDLGFBQUssY0FBYyxNQUFNLFVBQVU7QUFDbkMsZUFBTztBQUFBLE1BQ1Q7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFFQSxNQUFPLHNCQUFROzs7QUN6Q2YsTUFBTSxzQkFBc0I7QUFHNUIsTUFBTSxtQ0FBbUM7QUFHekMsTUFBTSxvQkFBb0I7QUFBQSxJQUN4QixXQUFXO0FBQUEsTUFDVCxVQUFVLElBQUk7QUFDWixlQUFPO0FBQUEsVUFDTCxRQUFRLENBQUMsT0FBTyxHQUFHLE1BQU07QUFBQSxRQUMzQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUssSUFBSTtBQUNQLGVBQU87QUFBQSxVQUNMLFVBQVU7QUFBQSxVQUNWLFFBQVE7QUFBQSxVQUNSLFlBQVk7QUFBQSxRQUNkO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFdBQVc7QUFBQSxRQUNULFNBQVMsQ0FBQyxHQUFHLENBQUM7QUFBQSxRQUNkLFFBQVEsQ0FBQyxhQUFhLFdBQVc7QUFBQSxNQUNuQztBQUFBLE1BQ0EsS0FBSyxLQUFLO0FBQ1IsZUFBTztBQUFBLFVBQ0wsVUFBVTtBQUFBLFVBQ1YsUUFBUTtBQUFBLFVBQ1IsWUFBWTtBQUFBLFFBQ2Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxNQUFNLG9CQUFvQjtBQUFBLElBQ3hCLFdBQVc7QUFBQSxNQUNULFVBQVUsSUFBSTtBQUNaLGVBQU87QUFBQSxVQUNMLFFBQVEsQ0FBQyxHQUFHLFFBQVEsS0FBSztBQUFBLFFBQzNCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsS0FBSyxJQUFJO0FBQ1AsZUFBTztBQUFBLFVBQ0wsVUFBVTtBQUFBLFVBQ1YsUUFBUTtBQUFBLFVBQ1IsWUFBWTtBQUFBLFFBQ2Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsV0FBVztBQUFBLFFBQ1QsU0FBUyxDQUFDLEdBQUcsQ0FBQztBQUFBLFFBQ2QsUUFBUSxDQUFDLGFBQWEsV0FBVztBQUFBLE1BQ25DO0FBQUEsTUFDQSxLQUFLLElBQUk7QUFDUCxlQUFPO0FBQUEsVUFDTCxVQUFVO0FBQUEsVUFDVixRQUFRO0FBQUEsVUFDUixZQUFZO0FBQUEsUUFDZDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUdBLE1BQU0sWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSWhCLFVBQVU7QUFFUixXQUFLLGdCQUFnQixvQkFBSSxJQUFJO0FBRzdCLFdBQUssUUFBUSxvQkFBSSxJQUFJO0FBR3JCLFdBQUssT0FBTyxLQUFLLEdBQUcsYUFBYSxXQUFXLEtBQUs7QUFHakQsV0FBSyxhQUFhO0FBQUEsSUFDcEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLFVBQVU7QUFDUixXQUFLLGFBQWE7QUFBQSxJQUNwQjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSUEsWUFBWTtBQUNWLFVBQUksS0FBSyxTQUFTLEtBQUssTUFBTSxPQUFPLEdBQUc7QUFDckMsYUFBSyxNQUFNLFFBQVEsQ0FBQyxTQUFTO0FBQzNCLGNBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxNQUFNLENBQUMsS0FBSyxZQUFZO0FBQ3pDO0FBQUEsVUFDRjtBQUNBLGdCQUFNLEVBQUUsSUFBSSxXQUFXLElBQUk7QUFDM0IsZ0JBQU0sZUFBZSxTQUFTLGVBQWUsRUFBRTtBQUUvQyxjQUFJLGNBQWM7QUFDaEIseUJBQWEsb0JBQW9CLFNBQVMsVUFBVTtBQUFBLFVBQ3REO0FBQUEsUUFDRixDQUFDO0FBQ0QsYUFBSyxNQUFNLE1BQU07QUFBQSxNQUNuQjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsZUFBZTtBQUViLFVBQUksS0FBSyxTQUFTLEtBQUssTUFBTSxPQUFPLEdBQUc7QUFDckMsYUFBSyxNQUFNLFFBQVEsQ0FBQyxTQUFTO0FBQzNCLGNBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxNQUFNLENBQUMsS0FBSyxZQUFZO0FBQ3pDO0FBQUEsVUFDRjtBQUNBLGdCQUFNLEVBQUUsSUFBSSxXQUFXLElBQUk7QUFDM0IsZ0JBQU0sYUFBYSxTQUFTLGVBQWUsRUFBRTtBQUM3QyxjQUFJLFlBQVk7QUFDZCxrQkFBTSxlQUFlLFdBQVc7QUFBQSxjQUM5QjtBQUFBLFlBQ0Y7QUFFQSx5QkFBYSxvQkFBb0IsU0FBUyxVQUFVO0FBQUEsVUFDdEQ7QUFBQSxRQUNGLENBQUM7QUFDRCxhQUFLLE1BQU0sTUFBTTtBQUFBLE1BQ25CO0FBQ0EsWUFBTSxXQUFXLG9CQUFJLElBQUk7QUFDekIsVUFBSSxJQUFJO0FBQ1IsZUFBUyxRQUFRLEtBQUssR0FBRyxpQkFBaUIsc0JBQXNCLEdBQUc7QUFDakUsWUFBSSxJQUFJLEtBQU87QUFDYjtBQUFBLFFBQ0Y7QUFDQSxhQUFLO0FBQ0wsY0FBTSxLQUFLLEtBQUssYUFBYSxvQkFBb0I7QUFHakQsWUFBSSxLQUFLLGFBQWEsZUFBZSxNQUFNLFFBQVE7QUFHakQsZUFBSyxjQUFjLElBQUksRUFBRTtBQUV6QixjQUFJLEtBQUssUUFBUSxZQUFZLEtBQUssY0FBYyxPQUFPLEdBQUc7QUFDeEQsaUJBQUssTUFBTSxFQUFFO0FBQUEsVUFDZjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLE1BQU0sRUFBRSxJQUFJLFlBQVksTUFBTSxLQUFLLE9BQU8sRUFBRSxFQUFFO0FBQ3BELFlBQUksQ0FBQyxTQUFTLElBQUksR0FBRyxHQUFHO0FBQ3RCLG1CQUFTLElBQUksR0FBRztBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUVBLFdBQUssUUFBUTtBQUNiLFdBQUssTUFBTTtBQUFBLElBQ2I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsUUFBUTtBQUNOLFdBQUssTUFBTSxRQUFRLENBQUMsRUFBRSxJQUFJLFdBQVcsTUFBTTtBQUN6QyxjQUFNLE9BQU8sU0FBUyxlQUFlLEVBQUU7QUFDdkMsWUFBSSxDQUFDO0FBQU07QUFDWCxjQUFNLFNBQVMsS0FBSyxjQUFjLHdCQUF3QjtBQUMxRCxZQUFJLFFBQVE7QUFDVixpQkFBTyxpQkFBaUIsU0FBUyxVQUFVO0FBQUEsUUFDN0M7QUFBQSxNQUNGLENBQUM7QUFHRCxXQUFLLEdBQUcsaUJBQWlCLHVCQUF1QixDQUFDLE1BQU07QUFDckQsY0FBTSxjQUFjLEVBQUUsT0FBTztBQUM3QixjQUFNLE9BQU8sS0FBSyxNQUFNLE1BQU0sS0FBSyxPQUFPLFdBQVc7QUFDckQsWUFBSSxNQUFNO0FBQ1IsZUFBSyxLQUFLLEtBQUssRUFBRTtBQUFBLFFBQ25CO0FBQUEsTUFDRixDQUFDO0FBQ0QsV0FBSyxHQUFHLGlCQUFpQix3QkFBd0IsQ0FBQyxNQUFNO0FBQ3RELGNBQU0sY0FBYyxFQUFFLE9BQU87QUFDN0IsY0FBTSxPQUFPLEtBQUssTUFBTSxNQUFNLEtBQUssT0FBTyxXQUFXO0FBQ3JELFlBQUksTUFBTTtBQUNSLGVBQUssTUFBTSxLQUFLLEVBQUU7QUFBQSxRQUNwQjtBQUFBLE1BQ0YsQ0FBQztBQUNELFdBQUssR0FBRyxpQkFBaUIseUJBQXlCLENBQUMsTUFBTTtBQUN2RCxjQUFNLGNBQWMsRUFBRSxPQUFPO0FBQzdCLGNBQU0sT0FBTyxLQUFLLE1BQU0sTUFBTSxLQUFLLE9BQU8sV0FBVztBQUNyRCxZQUFJLFFBQVEsS0FBSyxZQUFZO0FBQzNCLGVBQUssV0FBVztBQUFBLFFBQ2xCO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsT0FBTyxJQUFJO0FBQ1QsWUFBTSxTQUFTLFNBQVMsZUFBZSxFQUFFO0FBQ3pDLFlBQU0sU0FBUyxPQUFPLGFBQWEsZUFBZSxNQUFNO0FBQ3hELFVBQUksUUFBUTtBQUNWLGFBQUssTUFBTSxFQUFFO0FBQUEsTUFDZixPQUFPO0FBQ0wsYUFBSyxLQUFLLEVBQUU7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSUEsS0FBSyxJQUFJO0FBQ1AsWUFBTSxXQUFXLFNBQVMsZUFBZSxFQUFFO0FBQzNDLFlBQU0sWUFBWSxTQUFTLGNBQWMseUJBQXlCO0FBQ2xFLFlBQU0saUJBQWlCLFVBQVU7QUFBQSxRQUMvQjtBQUFBLE1BQ0Y7QUFDQSxZQUFNLGFBQWEsVUFBVSxjQUFjLDBCQUEwQjtBQUVyRSxVQUFJLENBQUMsYUFBYSxLQUFLLGNBQWMsSUFBSSxFQUFFLEdBQUc7QUFDNUM7QUFBQSxNQUNGO0FBR0EsWUFBTSxLQUFLLEtBQUssd0JBQXdCLFNBQVM7QUFDakQsaUJBQVcsTUFBTSxVQUFVO0FBRTNCLFVBQUksS0FBSyxTQUFTLFVBQVU7QUFDMUIsYUFBSyxjQUFjLFFBQVEsQ0FBQyxXQUFXO0FBQ3JDLGVBQUssTUFBTSxNQUFNO0FBQUEsUUFDbkIsQ0FBQztBQUFBLE1BQ0g7QUFFQSxnQkFBVTtBQUFBLFFBQ1Isa0JBQWtCLFVBQVUsVUFBVSxFQUFFO0FBQUEsUUFDeEMsa0JBQWtCLFVBQVUsS0FBSyxFQUFFO0FBQUEsTUFDckM7QUFDQSxxQkFBZTtBQUFBLFFBQ2Isa0JBQWtCLFFBQVE7QUFBQSxRQUMxQixrQkFBa0IsUUFBUSxLQUFLLEVBQUU7QUFBQSxNQUNuQztBQUVBLGVBQVMsYUFBYSxpQkFBaUIsTUFBTTtBQUM3QyxnQkFBVSxhQUFhLGFBQWEsTUFBTTtBQUUxQyxZQUFNLFdBQVcsU0FBUyxpQkFBaUIsS0FBSztBQUNoRCxlQUFTLFFBQVEsQ0FBQyxRQUFRO0FBQ3hCLFlBQUksS0FBSztBQUNQLGNBQUksUUFBUSxPQUFPO0FBQUEsUUFDckI7QUFBQSxNQUNGLENBQUM7QUFFRCxVQUFJLHNCQUFzQixNQUFNLEdBQUc7QUFDakMsbUJBQVcsTUFBTSxVQUFVO0FBQUEsTUFDN0IsT0FBTztBQUNMLG1CQUFXLE1BQU07QUFDZixxQkFBVyxNQUFNLFVBQVU7QUFBQSxRQUM3QixHQUFHLHNCQUFzQixHQUFHO0FBQUEsTUFDOUI7QUFFQSxXQUFLLGNBQWMsSUFBSSxFQUFFO0FBQUEsSUFDM0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLE1BQU0sSUFBSTtBQUNSLFlBQU0sV0FBVyxTQUFTLGVBQWUsRUFBRTtBQUMzQyxZQUFNLFlBQVksU0FBUyxjQUFjLHlCQUF5QjtBQUlsRSxVQUFJLENBQUMsYUFBYSxLQUFLLGNBQWMsSUFBSSxFQUFFLE1BQU0sT0FBTztBQUN0RDtBQUFBLE1BQ0Y7QUFFQSxZQUFNLGlCQUFpQixVQUFVO0FBQUEsUUFDL0I7QUFBQSxNQUNGO0FBQ0EsWUFBTSxhQUFhLFVBQVUsY0FBYywwQkFBMEI7QUFFckUsWUFBTSxLQUNKLFVBQVUsZUFBZSxLQUFLLE1BQU0sd0JBQXdCLFNBQVM7QUFFdkUsaUJBQVcsTUFBTSxVQUFVO0FBRTNCLGdCQUFVO0FBQUEsUUFDUixrQkFBa0IsVUFBVSxVQUFVLEVBQUU7QUFBQSxRQUN4QyxrQkFBa0IsVUFBVSxLQUFLLEVBQUU7QUFBQSxNQUNyQztBQUNBLHFCQUFlO0FBQUEsUUFDYixrQkFBa0IsUUFBUTtBQUFBLFFBQzFCLGtCQUFrQixRQUFRLEtBQUssRUFBRTtBQUFBLE1BQ25DO0FBRUEsWUFBTSxXQUFXLFNBQVMsaUJBQWlCLEtBQUs7QUFDaEQsZUFBUyxRQUFRLENBQUMsUUFBUTtBQUN4QixZQUFJLEtBQUs7QUFDUCxjQUFJLFFBQVEsT0FBTztBQUFBLFFBQ3JCO0FBQUEsTUFDRixDQUFDO0FBRUQsaUJBQVcsTUFBTTtBQUNmLGlCQUFTLGFBQWEsaUJBQWlCLE9BQU87QUFDOUMsa0JBQVUsYUFBYSxhQUFhLE9BQU87QUFDM0MsYUFBSyxjQUFjLE9BQU8sRUFBRTtBQUM1QixtQkFBVyxNQUFNLFVBQVU7QUFBQSxNQUM3QixHQUFHLHNCQUFzQixFQUFFO0FBQUEsSUFDN0I7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLG1CQUFtQixLQUFLO0FBQ3RCLGVBQ0UsTUFBTSxXQUFXLGlCQUFpQixTQUFTLGVBQWUsRUFBRSxRQUFRO0FBQUEsTUFFeEU7QUFBQTtBQUFBLE1BRUEsTUFBTSxLQUFLLE9BQU87QUFDaEIsWUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksTUFBTTtBQUM5QixpQkFBTztBQUFBLFFBQ1Q7QUFFQSxZQUFJLE1BQU07QUFDVixZQUFJLE1BQU0sR0FBRztBQUNYLGdCQUFNLElBQUksT0FBTztBQUFBLFFBQ25CO0FBQ0EsWUFBSSxVQUFVO0FBQ2QsbUJBQVcsUUFBUSxLQUFLO0FBQ3RCLGNBQUksV0FBVyxLQUFLO0FBQ2xCLG1CQUFPO0FBQUEsVUFDVDtBQUNBLHFCQUFXO0FBQUEsUUFDYjtBQUNBLGVBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSx3QkFBd0IsSUFBSTtBQUMxQixZQUFJLE1BQU0sT0FDUCxpQkFBaUIsRUFBRSxFQUNuQixpQkFBaUIseUJBQXlCO0FBRTdDLFlBQUksQ0FBQyxPQUFPLE9BQU8sUUFBUSxVQUFVO0FBQ25DLGlCQUFPO0FBQUEsUUFDVDtBQUVBLGNBQU0sSUFBSSxLQUFLLEVBQUUsUUFBUSxPQUFPLEVBQUU7QUFFbEMsZUFBTyxLQUFLLG1CQUFtQixXQUFXLEdBQUcsQ0FBQztBQUFBLE1BQ2hEO0FBQUEsSUFDRjtBQUFBLElBQ0Esd0JBQXdCLFNBQVM7QUFFL0IsWUFBTSxRQUFRLFFBQVEsVUFBVSxJQUFJO0FBR3BDLFlBQU0sTUFBTSxXQUFXO0FBQ3ZCLFlBQU0sTUFBTSxNQUFNO0FBQ2xCLFlBQU0sTUFBTSxPQUFPO0FBQ25CLFlBQU0sTUFBTSxZQUFZO0FBQ3hCLFlBQU0sTUFBTSxhQUFhO0FBQ3pCLFlBQU0sTUFBTSxVQUFVO0FBQ3RCLFlBQU0sTUFBTSxRQUFRLFFBQVEsY0FBYyxjQUFjO0FBQ3hELFlBQU0sTUFBTSxTQUFTO0FBRXJCLFlBQU0sbUJBQW1CLE9BQ3RCLGlCQUFpQixRQUFRLGFBQWEsRUFDdEMsaUJBQWlCLHlCQUF5QjtBQUU3QyxVQUFJLGtCQUFrQjtBQUNwQixjQUFNLE1BQU07QUFBQSxVQUNWO0FBQUEsVUFDQSxpQkFBaUIsS0FBSztBQUFBLFFBQ3hCO0FBQUEsTUFDRjtBQUVBLFlBQU0sS0FBSyxTQUFTLGlCQUFpQixPQUFPLFdBQVcsUUFBUTtBQUUvRCxVQUFJLElBQUk7QUFFUixhQUFPLEdBQUcsU0FBUyxLQUFLLElBQUksS0FBTTtBQUNoQztBQUNBLGNBQU0sT0FBTyxHQUFHO0FBQ2hCLFlBQUksS0FBSyxhQUFhLEtBQUssY0FBYztBQUN2QztBQUFBLFFBQ0Y7QUFDQSxZQUFJLE9BQU8sS0FBSyxvQkFBb0IsWUFBWTtBQUM5QyxlQUFLLGdCQUFnQixJQUFJO0FBQ3pCLGVBQUssZ0JBQWdCLE1BQU07QUFBQSxRQUM3QjtBQUFBLE1BQ0Y7QUFHQSxlQUFTLEtBQUssWUFBWSxLQUFLO0FBRy9CLFlBQU0sU0FBUyxNQUFNO0FBR3JCLFlBQU0sT0FBTztBQUdiLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUVBLE1BQU8sb0JBQVE7OztBQ3haZixNQUFJLGdCQUFnQjtBQUFBLElBQ2xCLFVBQVU7QUFDUixXQUFLLGFBQWE7QUFBQSxJQUNwQjtBQUFBLElBRUEsVUFBVTtBQUNSLFdBQUssYUFBYTtBQUFBLElBQ3BCO0FBQUEsSUFFQSxZQUFZO0FBQ1YsV0FBSyxTQUFTO0FBQUEsSUFDaEI7QUFBQSxJQUVBLGVBQWU7QUFDYixXQUFLLFNBQVM7QUFDZCxXQUFLLGlCQUFpQjtBQUN0QixXQUFLLDZCQUE2QjtBQUFBLElBQ3BDO0FBQUEsSUFFQSxtQkFBbUI7QUFDakIsV0FBSyxTQUFTLEtBQUssR0FBRyxpQkFBaUIsT0FBTztBQUM5QyxXQUFLLFdBQVcsS0FBSyxHQUFHLFFBQVE7QUFDaEMsV0FBSyxhQUFhLEtBQUssT0FBTztBQUM5QixXQUFLLGlCQUFpQixDQUFDO0FBRXZCLFdBQUssT0FBTyxRQUFRLENBQUMsT0FBTyxVQUFVO0FBQ3BDLGFBQUssYUFBYSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssWUFBWSxHQUFHLEtBQUssQ0FBQztBQUNuRSxhQUFLLGFBQWEsT0FBTyxXQUFXLENBQUMsTUFBTSxLQUFLLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDdkUsYUFBSyxhQUFhLE9BQU8sU0FBUyxDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQztBQUFBLE1BQzlELENBQUM7QUFBQSxJQUNIO0FBQUEsSUFFQSwrQkFBK0I7QUFDN0IsWUFBTSxTQUFTLFNBQVM7QUFDeEIsWUFBTSxjQUNKLEtBQUssT0FBTyxTQUFTLE1BQ3BCLFdBQVcsU0FBUyxRQUFRLE1BQU0sS0FBSyxLQUFLLE1BQU0sRUFBRSxTQUFTLE1BQU0sTUFDcEUsTUFBTSxLQUFLLEtBQUssTUFBTSxFQUFFLE1BQU0sT0FBSyxDQUFDLEVBQUUsS0FBSztBQUU3QyxVQUFJLGFBQWE7QUFDZixhQUFLLE9BQU8sQ0FBQyxFQUFFLE1BQU07QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFBQSxJQUVBLGFBQWEsT0FBTyxPQUFPLFNBQVM7QUFDbEMsWUFBTSxpQkFBaUIsT0FBTyxPQUFPO0FBQ3JDLFdBQUssZUFBZSxLQUFLLEVBQUUsT0FBTyxPQUFPLFFBQVEsQ0FBQztBQUFBLElBQ3BEO0FBQUEsSUFFQSxXQUFXO0FBQ1QsVUFBSSxDQUFDLEtBQUs7QUFBZ0I7QUFDMUIsV0FBSyxlQUFlLFFBQVEsQ0FBQyxFQUFFLE9BQU8sT0FBTyxRQUFRLE1BQU07QUFDekQsY0FBTSxvQkFBb0IsT0FBTyxPQUFPO0FBQUEsTUFDMUMsQ0FBQztBQUNELFdBQUssaUJBQWlCLENBQUM7QUFBQSxJQUN6QjtBQUFBLElBRUEsVUFBVTtBQUNSLGFBQU8sTUFBTSxLQUFLLEtBQUssTUFBTSxFQUFFLElBQUksT0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFBQSxJQUMxRDtBQUFBLElBRUEsUUFBUTtBQUNOLFdBQUssT0FBTyxRQUFRLE9BQUssRUFBRSxRQUFRLEVBQUU7QUFDckMsV0FBSyxPQUFPLENBQUMsRUFBRSxNQUFNO0FBQUEsSUFDdkI7QUFBQSxJQUVBLFlBQVksR0FBRyxPQUFPO0FBQ3BCLFlBQU0sUUFBUSxFQUFFO0FBQ2hCLFlBQU0sTUFBTSxNQUFNLE1BQU0sWUFBWTtBQUNwQyxZQUFNLFFBQVE7QUFFZCxVQUFJLE9BQU8sUUFBUSxLQUFLLE9BQU8sU0FBUyxHQUFHO0FBQ3pDLGFBQUssT0FBTyxRQUFRLENBQUMsRUFBRSxNQUFNO0FBQUEsTUFDL0I7QUFFQSxZQUFNLE9BQU8sS0FBSyxRQUFRO0FBQzFCLFVBQUksS0FBSyxXQUFXLEtBQUssY0FBYyxLQUFLLFVBQVU7QUFDcEQsYUFBSyxVQUFVLEtBQUssVUFBVSxFQUFFLEtBQUssQ0FBQztBQUFBLE1BQ3hDO0FBQUEsSUFDRjtBQUFBLElBRUEsY0FBYyxHQUFHLE9BQU87QUFDdEIsWUFBTSxRQUFRLEVBQUU7QUFDaEIsV0FBSyxFQUFFLFFBQVEsZUFBZSxFQUFFLFFBQVEsYUFBYSxNQUFNLFVBQVUsTUFBTSxRQUFRLEdBQUc7QUFDcEYsYUFBSyxPQUFPLFFBQVEsQ0FBQyxFQUFFLE1BQU07QUFBQSxNQUMvQjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFlBQVksR0FBRztBQUNiLFlBQU0sU0FBUyxFQUFFLGNBQWMsUUFBUSxNQUFNLEVBQUUsTUFBTSxHQUFHLEtBQUssVUFBVSxFQUFFLFlBQVk7QUFFckYsV0FBSyxPQUFPLFFBQVEsQ0FBQyxPQUFPLE1BQU07QUFDaEMsY0FBTSxRQUFRLE9BQU8sQ0FBQyxLQUFLO0FBQUEsTUFDN0IsQ0FBQztBQUVELFlBQU0sWUFBWSxPQUFPLFNBQVM7QUFDbEMsVUFBSSxhQUFhLEtBQUssWUFBWSxLQUFLLE9BQU8sUUFBUTtBQUNwRCxhQUFLLE9BQU8sU0FBUyxFQUFFLE1BQU07QUFBQSxNQUMvQjtBQUVBLFVBQUksT0FBTyxXQUFXLEtBQUssY0FBYyxLQUFLLFVBQVU7QUFDdEQsYUFBSyxVQUFVLEtBQUssVUFBVSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLE1BQU8sd0JBQVE7OztBQzFHUixNQUFNLG9CQUFvQjtBQUMxQixNQUFNLDRCQUE0QjtBQUNsQyxNQUFNLDZCQUE2QixFQUFFLFVBQVUsR0FBRyxZQUFZLEVBQUU7QUFFaEUsTUFBTSxpQ0FBaUM7QUFDdkMsTUFBTUEsb0NBQ1g7QUFHSyxNQUFNLHlCQUF5QjtBQUFBLElBQ3BDLFFBQVE7QUFBQSxNQUNOLFdBQVc7QUFBQSxRQUNULEVBQUUsV0FBVywyREFBMkQ7QUFBQSxRQUN4RSxFQUFFLFdBQVcsZ0JBQWdCO0FBQUEsTUFDL0I7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxRQUNaLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsV0FBVztBQUFBLFFBQ1QsRUFBRSxXQUFXLDJCQUEyQixTQUFTLEdBQUcsUUFBUSxZQUFZO0FBQUEsUUFDeEUsRUFBRSxXQUFXLGlCQUFpQixTQUFTLEdBQUcsUUFBUSxVQUFVO0FBQUEsTUFDOUQ7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxRQUNaLFFBQVFBO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ08sTUFBTSx3QkFBd0I7QUFBQSxJQUNuQyxRQUFRO0FBQUEsTUFDTixXQUFXO0FBQUEsUUFDVCxFQUFFLFdBQVcsZ0JBQWdCO0FBQUEsUUFDN0IsRUFBRSxXQUFXLDJEQUEyRDtBQUFBLE1BQzFFO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDSixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsUUFDWixRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxRQUNULEVBQUUsV0FBVyx3QkFBd0IsU0FBUyxHQUFHLFFBQVEsVUFBVTtBQUFBLFFBQ25FLEVBQUUsV0FBVywyQkFBMkIsU0FBUyxHQUFHLFFBQVEsWUFBWTtBQUFBLE1BQzFFO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDSixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsUUFDWixRQUFRQTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUdPLE1BQU0sOEJBQThCO0FBQUEsSUFDekMsUUFBUTtBQUFBLE1BQ04sV0FBVztBQUFBLFFBQ1QsRUFBRSxXQUFXLG1CQUFtQjtBQUFBLFFBQ2hDLEVBQUUsV0FBVyxnQkFBZ0I7QUFBQSxNQUMvQjtBQUFBLE1BQ0EsTUFBTTtBQUFBLFFBQ0osVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLFFBQ1osUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsUUFDVCxFQUFFLFdBQVcsMkJBQTJCLFNBQVMsR0FBRyxRQUFRLFlBQVk7QUFBQSxRQUN4RSxFQUFFLFdBQVcsaUJBQWlCLFNBQVMsR0FBRyxRQUFRLFVBQVU7QUFBQSxNQUM5RDtBQUFBLE1BQ0EsTUFBTTtBQUFBLFFBQ0osVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLFFBQ1osUUFBUUE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDTyxNQUFNLDZCQUE2QjtBQUFBLElBQ3hDLFFBQVE7QUFBQSxNQUNOLFVBQVUsSUFBSSxHQUFHO0FBQ2YsZUFBTztBQUFBLFVBQ0wsRUFBRSxXQUFXLGNBQWMsT0FBTztBQUFBLFVBQ2xDLEVBQUUsV0FBVyxtQkFBbUI7QUFBQSxRQUNsQztBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxRQUNaLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsV0FBVztBQUFBLFFBQ1QsRUFBRSxXQUFXLHdCQUF3QixTQUFTLEdBQUcsUUFBUSxVQUFVO0FBQUEsUUFDbkUsRUFBRSxXQUFXLHdCQUF3QixTQUFTLEdBQUcsUUFBUSxZQUFZO0FBQUEsTUFDdkU7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxRQUNaLFFBQVFBO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBR08sTUFBTSx3QkFBd0I7QUFBQSxJQUNuQyxRQUFRO0FBQUEsTUFDTixXQUFXLENBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBQUEsTUFDMUMsTUFBTTtBQUFBLFFBQ0osVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLFFBQ1osUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsUUFDVCxFQUFFLFdBQVcsd0JBQXdCLFNBQVMsR0FBRyxRQUFRLFlBQVk7QUFBQSxRQUNyRSxFQUFFLFdBQVcsd0JBQXdCLFNBQVMsR0FBRyxRQUFRLFVBQVU7QUFBQSxNQUNyRTtBQUFBLE1BQ0EsTUFBTTtBQUFBLFFBQ0osVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLFFBQ1osUUFBUUE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDTyxNQUFNLHVCQUF1QjtBQUFBLElBQ2xDLFFBQVE7QUFBQSxNQUNOLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUM7QUFBQSxNQUMxQyxNQUFNO0FBQUEsUUFDSixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsUUFDWixRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxRQUNULEVBQUUsV0FBVyx3QkFBd0IsU0FBUyxHQUFHLFFBQVEsVUFBVTtBQUFBLFFBQ25FLEVBQUUsV0FBVyx3QkFBd0IsU0FBUyxHQUFHLFFBQVEsWUFBWTtBQUFBLE1BQ3ZFO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDSixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsUUFDWixRQUFRQTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjs7O0FDeElBLE1BQU0sU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1iLFVBQVU7QUFFUixXQUFLLGFBQWE7QUFHbEIsV0FBSyxNQUFNO0FBR1gsV0FBSyxlQUNILEtBQUssTUFBTSxRQUFRLEtBQUssSUFBSSxlQUFlLEtBQUs7QUFDbEQsV0FBSyxtQkFBbUIsS0FBSyxHQUFHLFFBQVEseUJBQXlCO0FBRWpFLFVBQUksS0FBSyxpQkFBaUIsUUFBUTtBQUNoQyxhQUFLLEtBQUs7QUFBQSxNQUNaLE9BQU87QUFDTCxhQUFLLE1BQU0sSUFBSTtBQUFBLE1BQ2pCO0FBRUEsVUFBSSxLQUFLLEdBQUcsUUFBUSxTQUFTLGVBQWU7QUFDMUMsYUFBSyxZQUFZLE1BQU07QUFDckIsZUFBSyw2QkFBNkI7QUFBQSxRQUNwQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPQSxVQUFVO0FBQ1IsWUFBTSxzQkFBc0IsS0FBSyxNQUFNLFFBQVEsS0FBSyxJQUFJLGVBQWU7QUFFdkUsVUFDRSxLQUFLLGlCQUFpQix1QkFDdEIsdUJBQXVCLFFBQ3ZCO0FBRUEsYUFBSyxLQUFLLE1BQU0sS0FBSztBQUFBLE1BQ3ZCLFdBQVcsT0FBTyxlQUFlLElBQUksS0FBSyxHQUFHLEVBQUUsR0FBRztBQUVoRCxhQUFLLEtBQUssTUFBTSxLQUFLO0FBQUEsTUFDdkI7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPQSxZQUFZO0FBRVYsVUFBSSxLQUFLLFdBQVc7QUFDbEIsZUFBTyxvQkFBb0IsVUFBVSxLQUFLLFNBQVM7QUFBQSxNQUNyRDtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVVBLEtBQUssYUFBYSxPQUFPLGlCQUFpQixNQUFNO0FBRTlDLFVBQUksS0FBSztBQUFpQjtBQUcxQixXQUFLLGdCQUFnQjtBQUdyQixXQUFLLFdBQVc7QUFHaEIsWUFBTSxVQUFVLFNBQVMsZUFBZSxLQUFLLEdBQUcsUUFBUSxTQUFTO0FBQ2pFLFlBQU0sT0FBTyxLQUFLLEdBQUcsUUFBUTtBQUU3QixXQUFLLFdBQVc7QUFFaEIsVUFBSSxDQUFDLE9BQU8sZUFBZSxJQUFJLEtBQUssR0FBRyxFQUFFLEdBQUc7QUFDMUMsZUFBTyxlQUFlLElBQUksS0FBSyxHQUFHLEVBQUU7QUFBQSxNQUN0QztBQUVBLFdBQUssZ0JBQWdCO0FBR3JCLFdBQUssV0FBVyxPQUFPLEtBQUssSUFBSSxLQUFLLEdBQUcsUUFBUSxRQUFRO0FBR3hELFdBQUssa0JBQWtCLEtBQUssRUFBRTtBQUU5QixVQUNFLEtBQUssR0FBRyxRQUFRLFNBQVMsaUJBQ3pCLE9BQU8sS0FBSyxjQUFjLFlBQzFCO0FBQ0EsZUFBTyxpQkFBaUIsVUFBVSxLQUFLLFNBQVM7QUFBQSxNQUNsRDtBQUVBLFVBQUksZ0JBQWdCO0FBQ2xCLGFBQUssR0FBRyxRQUFRLGtCQUFrQjtBQUNsQyxhQUFLLGtCQUFrQjtBQUFBLE1BQ3pCO0FBR0EsV0FBSyxRQUFRLFNBQVMsTUFBTSxRQUFRLENBQUMsY0FBYztBQUVuRCxVQUFJLEtBQUssa0JBQWtCO0FBQ3pCLDhCQUFzQixNQUFNLEtBQUssR0FBRyxVQUFVLE9BQU8sUUFBUSxDQUFDO0FBQUEsTUFDaEUsT0FBTztBQUNMLGFBQUssR0FBRyxVQUFVO0FBQUEsTUFDcEI7QUFFQSxpQkFBVyxNQUFNO0FBQ2YsWUFBSSxDQUFDO0FBQWdCO0FBQ3JCLGFBQUssR0FBRyxRQUFRLGtCQUFrQjtBQUNsQyxhQUFLLGtCQUFrQjtBQUN2QixZQUFJLENBQUMsWUFBWTtBQUVmLGdCQUFNLFFBQVEsSUFBSSxZQUFZLHdCQUF3QjtBQUFBLFlBQ3BELFFBQVEsRUFBRSxJQUFJLEtBQUssR0FBRyxHQUFHO0FBQUEsVUFDM0IsQ0FBQztBQUNELGlCQUFPLGNBQWMsS0FBSztBQUcxQixnQkFBTSxjQUFjLEtBQUssR0FBRyxjQUFjLFFBQVE7QUFDbEQsY0FBSTtBQUFhLHdCQUFZLE1BQU07QUFBQSxRQUNyQztBQUFBLE1BQ0YsR0FBRyxLQUFLLGtCQUFrQjtBQUFBLElBQzVCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPQSxNQUFNLGFBQWEsT0FBTyxpQkFBaUIsTUFBTTtBQUUvQyxVQUFJLEtBQUs7QUFBaUI7QUFHMUIsVUFBSSxLQUFLLEdBQUcsUUFBUSxjQUFjO0FBQVE7QUFHMUMsV0FBSyxnQkFBZ0I7QUFHckIsWUFBTSxVQUFVLFNBQVMsZUFBZSxLQUFLLEdBQUcsUUFBUSxTQUFTO0FBQ2pFLFlBQU0sT0FBTyxLQUFLLEdBQUcsUUFBUTtBQUc3QixXQUFLLGlCQUFpQjtBQUN0QixVQUFJLEtBQUssR0FBRyxRQUFRLGFBQWEsS0FBSyxrQkFBa0I7QUFDdEQsYUFBSyxXQUFXLE9BQU8sS0FBSyxJQUFJLEtBQUssR0FBRyxRQUFRLFNBQVM7QUFBQSxNQUMzRDtBQUVBLFVBQUksZ0JBQWdCO0FBQ2xCLGFBQUssR0FBRyxRQUFRLGtCQUFrQjtBQUNsQyxhQUFLLGtCQUFrQjtBQUFBLE1BQ3pCO0FBRUEsVUFDRSxLQUFLLEdBQUcsUUFBUSxTQUFTLGlCQUN6QixPQUFPLEtBQUssY0FBYyxZQUMxQjtBQUNBLGVBQU8sb0JBQW9CLFVBQVUsS0FBSyxTQUFTO0FBQUEsTUFDckQ7QUFFQSxXQUFLLFFBQVEsU0FBUyxNQUFNLFNBQVMsQ0FBQyxjQUFjO0FBRXBELGlCQUFXLE1BQU07QUFDZixhQUFLLGtCQUFrQjtBQUV2QixZQUFJLE9BQU8sZUFBZSxJQUFJLEtBQUssR0FBRyxFQUFFLEdBQUc7QUFDekMsaUJBQU8sZUFBZSxPQUFPLEtBQUssR0FBRyxFQUFFO0FBQUEsUUFDekM7QUFFQSxZQUFJLEtBQUssa0JBQWtCO0FBQ3pCLGVBQUssR0FBRyxVQUFVLElBQUksUUFBUTtBQUFBLFFBQ2hDLE9BQU87QUFDTCxlQUFLLEdBQUcsTUFBTTtBQUFBLFFBQ2hCO0FBQ0EsYUFBSyxvQkFBb0IsS0FBSyxFQUFFO0FBQ2hDLFlBQUksZ0JBQWdCO0FBQ2xCLGVBQUssR0FBRyxRQUFRLGtCQUFrQjtBQUNsQyxlQUFLLGtCQUFrQjtBQUFBLFFBQ3pCO0FBQUEsTUFDRixHQUFHLEtBQUsscUJBQXFCLEVBQUU7QUFFL0IsVUFBSTtBQUFZO0FBR2hCLFVBQUksS0FBSyxHQUFHLFFBQVEsV0FBVyxLQUFLLEdBQUcsUUFBUSxZQUFZLElBQUk7QUFDN0QsYUFBSyxXQUFXLE9BQU8sS0FBSyxJQUFJLEtBQUssR0FBRyxhQUFhLGVBQWUsQ0FBQztBQUFBLE1BQ3ZFO0FBRUEsaUJBQVcsTUFBTTtBQUVmLGNBQU0sUUFBUSxJQUFJLFlBQVksd0JBQXdCO0FBQUEsVUFDcEQsUUFBUSxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUc7QUFBQSxRQUMzQixDQUFDO0FBQ0QsZUFBTyxjQUFjLEtBQUs7QUFBQSxNQUM1QixHQUFHLEtBQUssa0JBQWtCO0FBQUEsSUFDNUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxlQUFlO0FBRWIsVUFBSSxPQUFPLE9BQU8sbUJBQW1CLGFBQWE7QUFDaEQsZUFBTyxpQkFBaUIsb0JBQUksSUFBSTtBQUFBLE1BQ2xDO0FBRUEsVUFBSSxPQUFPLE9BQU8sbUJBQW1CLGFBQWE7QUFDaEQsZUFBTyxpQkFBaUIsb0JBQUksSUFBSTtBQUFBLE1BQ2xDO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1BLFFBQVE7QUFFTixXQUFLLEdBQUcsaUJBQWlCLHNCQUFzQixNQUFNO0FBQ25ELGFBQUssS0FBSztBQUFBLE1BQ1osQ0FBQztBQUNELFdBQUssR0FBRyxpQkFBaUIsdUJBQXVCLE1BQU07QUFDcEQsYUFBSyxNQUFNLEtBQUs7QUFBQSxNQUNsQixDQUFDO0FBRUQsV0FBSyxZQUFZLHNCQUFzQixDQUFDLFVBQVU7QUFDaEQsY0FBTSxZQUFZLE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU07QUFDdEUsWUFBSSxXQUFXO0FBQ2IsZUFBSyxLQUFLO0FBQUEsUUFDWjtBQUFBLE1BQ0YsQ0FBQztBQUVELFdBQUssWUFBWSx1QkFBdUIsQ0FBQyxVQUFVO0FBQ2pELGNBQU0sWUFBWSxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNO0FBQ3RFLFlBQUksV0FBVztBQUNiLGVBQUssTUFBTSxLQUFLO0FBQUEsUUFDbEI7QUFBQSxNQUNGLENBQUM7QUFHRCxXQUFLLEdBQUcsaUJBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBQ3ZDLFlBQUksRUFBRSxPQUFPLE9BQU8sS0FBSyxHQUFHLElBQUk7QUFDOUIsZUFBSyxNQUFNO0FBQUEsUUFDYjtBQUFBLE1BQ0YsQ0FBQztBQUdELFdBQUsscUJBQXFCO0FBRzFCLFVBQUksQ0FBQyxLQUFLLGtCQUFrQjtBQUMxQixhQUFLLEdBQUcsaUJBQWlCLFNBQVMsTUFBTTtBQUN0QyxlQUFLLG9CQUFvQixLQUFLLEVBQUU7QUFDaEMsY0FBSSxLQUFLLEdBQUcsUUFBUSxXQUFXO0FBQzdCLGlCQUFLLFdBQVcsT0FBTyxLQUFLLElBQUksS0FBSyxHQUFHLFFBQVEsU0FBUztBQUFBLFVBQzNEO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxrQkFBa0I7QUFFaEIsVUFBSSxLQUFLLEdBQUcsUUFBUSxTQUFTO0FBQWU7QUFDNUMsVUFBSSxLQUFLLHFCQUFxQjtBQUFNO0FBRXBDLFlBQU0sVUFBVSxLQUFLLG9CQUFvQjtBQUN6QyxVQUFJLFNBQVM7QUFDWCxhQUFLLGlCQUFpQjtBQUN0QjtBQUFBLE1BQ0Y7QUFFQSxXQUFLLG1CQUFtQjtBQUd4QixZQUFNLFVBQVUsU0FBUyxlQUFlLEtBQUssR0FBRyxRQUFRLFNBQVM7QUFHakUsV0FBSyxXQUFXLEtBQUssUUFBUSxLQUFLLElBQUk7QUFDdEMsV0FBSyxhQUFhLEtBQUssVUFBVSxLQUFLLElBQUk7QUFDMUMsV0FBSyxVQUFVLEtBQUssT0FBTyxLQUFLLElBQUk7QUFHcEMsY0FBUSxpQkFBaUIsY0FBYyxLQUFLLFFBQVE7QUFDcEQsY0FBUSxpQkFBaUIsWUFBWSxLQUFLLFVBQVU7QUFDcEQsY0FBUSxpQkFBaUIsYUFBYSxLQUFLLE9BQU87QUFBQSxJQUNwRDtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSUEsK0JBQStCO0FBQzdCLFVBQUksS0FBSyxHQUFHLFFBQVEsU0FBUyxlQUFlO0FBQzFDO0FBQUEsTUFDRjtBQUNBLFlBQU0sVUFBVSxLQUFLLG9CQUFvQjtBQUN6QyxVQUFJLFNBQVM7QUFDWCxhQUFLLGlCQUFpQjtBQUFBLE1BQ3hCLE9BQU87QUFDTCxhQUFLLGdCQUFnQjtBQUFBLE1BQ3ZCO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1BLG1CQUFtQjtBQUVqQixVQUFJLEtBQUssR0FBRyxRQUFRLFNBQVMsaUJBQWlCLEtBQUs7QUFBa0I7QUFHckUsWUFBTSxVQUFVLFNBQVMsZUFBZSxLQUFLLEdBQUcsUUFBUSxTQUFTO0FBRWpFLFVBQUksS0FBSyxVQUFVO0FBQ2pCLGdCQUFRLG9CQUFvQixjQUFjLEtBQUssUUFBUTtBQUFBLE1BQ3pEO0FBQ0EsVUFBSSxLQUFLLFlBQVk7QUFDbkIsZ0JBQVEsb0JBQW9CLFlBQVksS0FBSyxVQUFVO0FBQUEsTUFDekQ7QUFDQSxVQUFJLEtBQUssU0FBUztBQUNoQixnQkFBUSxvQkFBb0IsYUFBYSxLQUFLLE9BQU87QUFBQSxNQUN2RDtBQUNBLFdBQUssbUJBQW1CO0FBQUEsSUFDMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxzQkFBc0I7QUFDcEIsYUFDRSxLQUFLLEdBQUcsUUFBUSxTQUFTLGlCQUN6QixPQUFPLGlCQUFpQixLQUFLLEVBQUUsRUFBRSxpQkFBaUIsYUFBYSxNQUFNO0FBQUEsSUFFekU7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLGtCQUFrQjtBQUNoQixVQUFJLEtBQUs7QUFBdUIscUJBQWEsS0FBSyxxQkFBcUI7QUFDdkUsV0FBSyx3QkFBd0IsV0FBVyxNQUFNO0FBQzVDLGFBQUssa0JBQWtCO0FBQUEsTUFDekIsR0FBRyxLQUFLLHFCQUFxQixHQUFHO0FBQUEsSUFDbEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLGNBQWMsSUFBSSxjQUFjLFdBQVcsZUFBZTtBQUN4RCxVQUFJLGNBQWMsUUFBUTtBQUN4QixXQUFHO0FBQUEsVUFDRCx1QkFBdUIsT0FBTztBQUFBLFVBQzlCLGdCQUNJLDZCQUNBLHVCQUF1QixPQUFPO0FBQUEsUUFDcEM7QUFDQSxZQUFJLEtBQUssa0JBQWtCO0FBQ3pCLGdCQUFNLGtCQUFrQixLQUFLLEdBQUcsY0FBYyxzQkFBc0I7QUFDcEUsY0FBSTtBQUNGLDRCQUFnQjtBQUFBLGNBQ2QsQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUM7QUFBQSxjQUMvQixnQkFDSSw2QkFDQTtBQUFBLGdCQUNFLFVBQVU7QUFBQSxnQkFDVixZQUFZO0FBQUEsZ0JBQ1osUUFBUTtBQUFBLGNBQ1Y7QUFBQSxZQUNOO0FBQUEsUUFDSjtBQUNBLFlBQUksY0FBYztBQUNoQix1QkFBYTtBQUFBLFlBQ1gsdUJBQXVCLE1BQU07QUFBQSxZQUM3QixnQkFDSSw2QkFDQSx1QkFBdUIsTUFBTTtBQUFBLFVBQ25DO0FBQUEsUUFDRjtBQUFBLE1BQ0YsT0FBTztBQUNMLFdBQUc7QUFBQSxVQUNELHNCQUFzQixPQUFPO0FBQUEsVUFDN0IsZ0JBQ0ksNkJBQ0Esc0JBQXNCLE9BQU87QUFBQSxRQUNuQztBQUNBLFlBQUksS0FBSyxrQkFBa0I7QUFDekIsZ0JBQU0sa0JBQWtCLEtBQUssR0FBRyxjQUFjLHNCQUFzQjtBQUNwRSxjQUFJO0FBQ0YsNEJBQWdCO0FBQUEsY0FDZCxDQUFDLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQztBQUFBLGNBQy9CLGdCQUNJLDZCQUNBO0FBQUEsZ0JBQ0UsVUFBVTtBQUFBLGdCQUNWLFlBQVk7QUFBQSxnQkFDWixRQUFRO0FBQUEsY0FDVjtBQUFBLFlBQ047QUFBQSxRQUNKO0FBQ0EsWUFBSSxjQUFjO0FBQ2hCLHVCQUFhO0FBQUEsWUFDWCxzQkFBc0IsTUFBTTtBQUFBLFlBQzVCLGdCQUNJLDZCQUNBLHNCQUFzQixNQUFNO0FBQUEsVUFDbEM7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLG1CQUFtQixJQUFJLGNBQWMsV0FBVyxlQUFlO0FBQzdELFVBQUksY0FBYyxRQUFRO0FBQ3hCLFdBQUc7QUFBQSxVQUNELDRCQUE0QixPQUFPO0FBQUEsVUFDbkMsZ0JBQ0ksNkJBQ0EsNEJBQTRCLE9BQU87QUFBQSxRQUN6QztBQUNBLFlBQUksY0FBYztBQUNoQix1QkFBYTtBQUFBLFlBQ1gsNEJBQTRCLE1BQU07QUFBQSxZQUNsQyxnQkFDSSw2QkFDQSw0QkFBNEIsTUFBTTtBQUFBLFVBQ3hDO0FBQUEsUUFDRjtBQUFBLE1BQ0YsT0FBTztBQUNMLFdBQUc7QUFBQSxVQUNELDJCQUEyQixPQUFPLFVBQVUsS0FBSyxRQUFRO0FBQUEsVUFDekQsZ0JBQ0ksNkJBQ0EsMkJBQTJCLE9BQU87QUFBQSxRQUN4QztBQUdBLFlBQUksS0FBSyxXQUFXO0FBQUcsZUFBSyxXQUFXO0FBRXZDLFlBQUksY0FBYztBQUNoQix1QkFBYTtBQUFBLFlBQ1gsMkJBQTJCLE1BQU07QUFBQSxZQUNqQyxnQkFDSSw2QkFDQSwyQkFBMkIsTUFBTTtBQUFBLFVBQ3ZDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJQSxhQUFhLElBQUksY0FBYyxXQUFXLGVBQWU7QUFDdkQsVUFBSSxjQUFjLFFBQVE7QUFDeEIsYUFBSyxHQUFHO0FBQUEsVUFDTixzQkFBc0IsT0FBTztBQUFBLFVBQzdCLGdCQUNJLDZCQUNBLHNCQUFzQixPQUFPO0FBQUEsUUFDbkM7QUFDQSxZQUFJLGNBQWM7QUFDaEIsdUJBQWE7QUFBQSxZQUNYLHNCQUFzQixNQUFNO0FBQUEsWUFDNUIsZ0JBQ0ksNkJBQ0Esc0JBQXNCLE1BQU07QUFBQSxVQUNsQztBQUFBLFFBQ0Y7QUFBQSxNQUNGLE9BQU87QUFDTCxhQUFLLEdBQUc7QUFBQSxVQUNOLHFCQUFxQixPQUFPO0FBQUEsVUFDNUIsZ0JBQ0ksNkJBQ0EscUJBQXFCLE9BQU87QUFBQSxRQUNsQztBQUNBLFlBQUksY0FBYztBQUNoQix1QkFBYTtBQUFBLFlBQ1gscUJBQXFCLE1BQU07QUFBQSxZQUMzQixnQkFDSSw2QkFDQSxxQkFBcUIsTUFBTTtBQUFBLFVBQ2pDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJQSxRQUFRLElBQUksTUFBTSxXQUFXLGdCQUFnQixPQUFPO0FBQ2xELFlBQU0sZUFBZSxHQUFHLGNBQWMsMEJBQTBCO0FBQ2hFLGNBQVEsTUFBTTtBQUFBLFFBQ1osS0FBSztBQUNILGVBQUssY0FBYyxJQUFJLGNBQWMsV0FBVyxhQUFhO0FBQzdEO0FBQUEsUUFDRixLQUFLO0FBQ0gsY0FBSSxDQUFDLEtBQUssb0JBQW9CLEdBQUc7QUFDL0IsaUJBQUssbUJBQW1CLElBQUksY0FBYyxXQUFXLGFBQWE7QUFBQSxVQUNwRSxPQUFPO0FBQ0wsaUJBQUssYUFBYSxJQUFJLGNBQWMsV0FBVyxhQUFhO0FBQUEsVUFDOUQ7QUFDQTtBQUFBLFFBQ0YsS0FBSztBQUNILGVBQUssYUFBYSxJQUFJLGNBQWMsV0FBVyxhQUFhO0FBQzVEO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTUEsa0JBQWtCLFNBQVM7QUFDekIsYUFBTyxlQUFlLElBQUksT0FBTztBQUNqQyxVQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsU0FBUyxpQkFBaUIsR0FBRztBQUN4RCxjQUFNLGlCQUFpQixLQUFLLGtCQUFrQjtBQUM5QyxpQkFBUyxLQUFLLFVBQVUsSUFBSSxpQkFBaUI7QUFDN0MsaUJBQVMsS0FBSyxNQUFNO0FBQUEsVUFDbEI7QUFBQSxVQUNBLEdBQUc7QUFBQSxRQUNMO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxvQkFBb0IsV0FBVztBQUM3QixhQUFPLGVBQWUsT0FBTyxTQUFTO0FBQ3RDLFVBQUksT0FBTyxlQUFlLFNBQVMsR0FBRztBQUNwQyxpQkFBUyxLQUFLLFVBQVUsT0FBTyxpQkFBaUI7QUFDaEQsaUJBQVMsS0FBSyxNQUFNLGVBQWUsb0JBQW9CO0FBQUEsTUFDekQ7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTUEsb0JBQW9CO0FBQ2xCLFlBQU0sZ0JBQWdCLFNBQVMsZ0JBQWdCO0FBQy9DLGFBQU8sS0FBSyxJQUFJLE9BQU8sYUFBYSxhQUFhO0FBQUEsSUFDbkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9BLFFBQVEsT0FBTztBQUViLFlBQU0saUJBQ0osTUFBTSxVQUFVLE1BQU0sT0FBTyxRQUFRLDBCQUEwQjtBQUNqRSxVQUFJO0FBQWdCO0FBRXBCLFdBQUssV0FBVyxvQkFBSSxLQUFLO0FBQ3pCLFdBQUssYUFBYTtBQUNsQixZQUFNLElBQUksTUFBTSxRQUFRLENBQUMsS0FBSyxNQUFNLGVBQWUsQ0FBQztBQUNwRCxXQUFLLFNBQVMsRUFBRTtBQUFBLElBQ2xCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVFBLFVBQVUsT0FBTztBQUVmLFlBQU0saUJBQ0osTUFBTSxVQUFVLE1BQU0sT0FBTyxRQUFRLDBCQUEwQjtBQUNqRSxVQUFJO0FBQWdCO0FBRXBCLFdBQUssYUFBYTtBQUNsQixZQUFNLElBQUksTUFBTSxRQUFRLENBQUMsS0FBSyxNQUFNLGVBQWUsQ0FBQztBQUNwRCxZQUFNLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtBQUN4QyxZQUFNLFVBQVUsU0FBUyxlQUFlLEtBQUssR0FBRyxRQUFRLFNBQVM7QUFDakUsVUFBSSxrQkFBa0IsTUFBTTtBQUMxQixhQUFLLE1BQU0sT0FBTyxJQUFJO0FBQUEsTUFDeEIsT0FBTztBQUNMLGdCQUFRLE1BQU0sWUFBWSxvQkFBb0IsSUFBSTtBQUNsRCxnQkFBUSxNQUFNLGFBQWE7QUFDM0IsbUJBQVcsTUFBTTtBQUNmLGtCQUFRLE1BQU0sZUFBZSxZQUFZO0FBQUEsUUFDM0MsR0FBRyxHQUFHO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9BLE9BQU8sT0FBTztBQUVaLFlBQU0saUJBQ0osTUFBTSxVQUFVLE1BQU0sT0FBTyxRQUFRLDBCQUEwQjtBQUNqRSxVQUFJO0FBQWdCO0FBRXBCLFlBQU0sSUFBSSxNQUFNLFFBQVEsQ0FBQyxLQUFLLE1BQU0sZUFBZSxDQUFDO0FBQ3BELFVBQUksS0FBSyxjQUFjLEVBQUUsVUFBVSxHQUFHO0FBQ3BDLGNBQU0sSUFBSSxTQUFTLEtBQUssTUFBTSxJQUFJLFNBQVMsRUFBRSxPQUFPO0FBQ3BELFlBQUksSUFBSTtBQUFHO0FBQ1gsYUFBSyxTQUFTLElBQUksRUFBRTtBQUFBLE1BQ3RCLE9BQU87QUFDTCxjQUFNLFVBQVUsU0FBUyxlQUFlLEtBQUssR0FBRyxRQUFRLFNBQVM7QUFDakUsZ0JBQVEsTUFBTSxlQUFlLFlBQVk7QUFBQSxNQUMzQztBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9BLFNBQVMsR0FBRztBQUNWLFlBQU0sVUFBVSxTQUFTLGVBQWUsS0FBSyxHQUFHLFFBQVEsU0FBUztBQUNqRSxjQUFRLE1BQU0sWUFBWSxvQkFBb0IsR0FBRyxLQUFLO0FBQ3RELGNBQVEsTUFBTSxlQUFlLFlBQVk7QUFDekMsV0FBSyxXQUFXO0FBQUEsSUFDbEI7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFNBQVMsQ0FBQyxJQUFJLFFBQVE7QUFDcEIsZUFBTyxHQUFHLGFBQWEsUUFBUSxLQUFLO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLE1BQU8saUJBQVE7OztBQ3RwQmYsTUFBTSw4QkFBOEI7QUFDcEMsTUFBTSwwQ0FDSjtBQUVGLE1BQU0sMEJBQTBCO0FBQUEsSUFDOUIsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLEVBQ1Y7QUFDQSxNQUFNLDJCQUEyQjtBQUFBLElBQy9CLFdBQVc7QUFBQSxNQUNULEVBQUUsU0FBUyxHQUFHLFFBQVEsYUFBYSxXQUFXLG9CQUFvQjtBQUFBLE1BQ2xFLEVBQUUsU0FBUyxHQUFHLFFBQVEsYUFBYSxXQUFXLGdCQUFnQjtBQUFBLElBQ2hFO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDSixVQUFVO0FBQUEsTUFDVixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFFQSxNQUFNLDJCQUEyQjtBQUFBLElBQy9CLFdBQVc7QUFBQSxNQUNULEVBQUUsU0FBUyxHQUFHLFFBQVEsYUFBYSxXQUFXLGdCQUFnQjtBQUFBLE1BQzlELEVBQUUsU0FBUyxHQUFHLFFBQVEsYUFBYSxXQUFXLG9CQUFvQjtBQUFBLElBQ3BFO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDSixVQUFVO0FBQUEsTUFDVixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFFQSxNQUFNLGVBQWU7QUFBQSxJQUNuQixVQUFVO0FBQ1IsV0FBSyxhQUFhLEtBQUssT0FBTyxLQUFLLElBQUk7QUFDdkMsV0FBSyxjQUFjLEtBQUssVUFBVSxLQUFLLElBQUk7QUFFM0MsV0FBSyxHQUFHLGlCQUFpQix1QkFBdUIsS0FBSyxVQUFVO0FBQy9ELFdBQUssR0FBRyxpQkFBaUIsV0FBVyxLQUFLLFdBQVc7QUFFcEQsV0FBSyxZQUFZLHVCQUF1QixDQUFDLFVBQVU7QUFDakQsY0FBTSxZQUFZLE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU07QUFDdEUsWUFBSSxXQUFXO0FBQ2IsZUFBSyxPQUFPO0FBQUEsUUFDZDtBQUFBLE1BQ0YsQ0FBQztBQUVELFdBQUssY0FBYyxLQUFLLFFBQVEsS0FBSyxJQUFJO0FBQ3pDLFdBQUssWUFBWSxLQUFLLE1BQU0sS0FBSyxJQUFJO0FBRXJDLGFBQU8saUJBQWlCLFVBQVUsS0FBSyxTQUFTO0FBQ2hELGFBQU8saUJBQWlCLFVBQVUsS0FBSyxTQUFTO0FBQ2hELGVBQVMsaUJBQWlCLFNBQVMsS0FBSyxXQUFXO0FBR25ELFdBQUssU0FBUztBQUdkLFlBQU0sZ0JBQWdCLEtBQUssR0FBRyxRQUFRLGlCQUFpQjtBQUN2RCxVQUFJLGVBQWU7QUFDakIsYUFBSyxLQUFLLElBQUk7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFVBQVU7QUFDUixVQUFJLEtBQUssUUFBUTtBQUNmLGFBQUssS0FBSyxJQUFJO0FBQUEsTUFDaEIsT0FBTztBQUNMLGFBQUssS0FBSyxJQUFJO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsSUFDQSxZQUFZO0FBQ1YsVUFBSSxLQUFLLFlBQVk7QUFDbkIsYUFBSyxHQUFHLG9CQUFvQix1QkFBdUIsS0FBSyxVQUFVO0FBQUEsTUFDcEU7QUFDQSxVQUFJLEtBQUssYUFBYTtBQUNwQixpQkFBUyxvQkFBb0IsU0FBUyxLQUFLLFdBQVc7QUFBQSxNQUN4RDtBQUNBLFVBQUksS0FBSyxXQUFXO0FBQ2xCLGVBQU8sb0JBQW9CLFVBQVUsS0FBSyxTQUFTO0FBQ25ELGVBQU8sb0JBQW9CLFVBQVUsS0FBSyxTQUFTO0FBQUEsTUFDckQ7QUFDQSxVQUFJLEtBQUssYUFBYTtBQUNwQixhQUFLLEdBQUcsb0JBQW9CLFdBQVcsS0FBSyxXQUFXO0FBQUEsTUFDekQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRLE9BQU87QUFDYixZQUFNLFNBQVMsS0FBSyxVQUFVLEtBQUs7QUFFbkMsWUFBTSxZQUFZLENBQUMsQ0FBQyxPQUFPLFFBQVEsTUFBTSxLQUFLLEdBQUcsRUFBRTtBQUNuRCxVQUFJLENBQUMsV0FBVztBQUNkLGFBQUssS0FBSztBQUFBLE1BQ1o7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVFBLFVBQVUsT0FBTztBQW5HbkI7QUFvR0ksWUFBTSxVQUFTLGlCQUFNLFdBQU4sbUJBQWMsZUFBZCxZQUE0QixNQUFNO0FBQ2pELFVBQUksT0FBTyxXQUFXLFVBQVU7QUFDOUIsZUFBTyxTQUFTLGNBQWMsTUFBTTtBQUFBLE1BQ3RDO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLFNBQVM7QUFDUCxZQUFNLFdBQVcsS0FBSyxHQUFHLGNBQWMsd0JBQXdCO0FBQy9ELFVBQUksU0FBUyxRQUFRLFdBQVcsUUFBUTtBQUN0QyxhQUFLLEtBQUs7QUFBQSxNQUNaLE9BQU87QUFDTCxhQUFLLEtBQUs7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSyxnQkFBZ0IsT0FBTztBQUMxQixZQUFNLFdBQVcsS0FBSyxHQUFHLGNBQWMsd0JBQXdCO0FBQy9ELFlBQU0sZUFBZSxLQUFLLEdBQUcsY0FBYyx1QkFBdUI7QUFHbEUsVUFBSSxjQUFjO0FBQ2hCLHFCQUFhLFVBQVUsSUFBSSxZQUFZO0FBQ3ZDLHFCQUFhLFVBQVUsT0FBTyxVQUFVO0FBQUEsTUFDMUM7QUFFQSxlQUFTLFFBQVEsU0FBUztBQUMxQixXQUFLLFVBQVU7QUFDZixVQUFJLENBQUMsZUFBZTtBQUNsQixpQkFBUztBQUFBLFVBQ1AseUJBQXlCO0FBQUEsVUFDekIsS0FBSyxHQUFHLFFBQVEsa0JBQWtCLFNBQzlCLDBCQUNBLHlCQUF5QjtBQUFBLFFBQy9CO0FBQUEsTUFDRjtBQUNBLFdBQUssU0FBUztBQUFBLElBQ2hCO0FBQUEsSUFDQSxLQUFLLGdCQUFnQixPQUFPO0FBQzFCLFlBQU0sV0FBVyxLQUFLLEdBQUcsY0FBYyx3QkFBd0I7QUFDL0QsWUFBTSxlQUFlLEtBQUssR0FBRyxjQUFjLHVCQUF1QjtBQUdsRSxVQUFJLGNBQWM7QUFDaEIscUJBQWEsVUFBVSxJQUFJLFVBQVU7QUFDckMscUJBQWEsVUFBVSxPQUFPLFlBQVk7QUFBQSxNQUM1QztBQUVBLFVBQUksU0FBUyxRQUFRLFdBQVcsVUFBVSxDQUFDLEtBQUssUUFBUTtBQUN0RDtBQUFBLE1BQ0Y7QUFDQSxVQUFJLENBQUMsZUFBZTtBQUNsQixpQkFBUztBQUFBLFVBQ1AseUJBQXlCO0FBQUEsVUFDekIsS0FBSyxHQUFHLFFBQVEsa0JBQWtCLFNBQzlCLDBCQUNBLHlCQUF5QjtBQUFBLFFBQy9CO0FBQUEsTUFDRjtBQUVBO0FBQUEsUUFDRSxNQUFNO0FBQ0osbUJBQVMsUUFBUSxTQUFTO0FBQzFCLGVBQUssU0FBUztBQUFBLFFBQ2hCO0FBQUEsUUFDQSxpQkFBaUIsS0FBSyxHQUFHLFFBQVEsa0JBQWtCLFNBQy9DLElBQ0E7QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxRQUFRO0FBQ04sWUFBTSxXQUFXLEtBQUssR0FBRyxjQUFjLHdCQUF3QjtBQUMvRCxZQUFNLFVBQVUsS0FBSyxHQUFHLGNBQWMsd0JBQXdCO0FBRTlELFVBQUksU0FBUyxRQUFRLFdBQVcsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTO0FBQy9EO0FBQUEsTUFDRjtBQUVBLFlBQU0sYUFBYSxRQUFRLHNCQUFzQjtBQUNqRCxZQUFNLFdBQVcsU0FBUyxzQkFBc0I7QUFFaEQsWUFBTSxTQUFTO0FBQUEsUUFDYixjQUFjLEtBQUssTUFBTSxXQUFXLE1BQU07QUFBQSxRQUMxQyxnQkFBZ0IsS0FBSyxNQUFNLFNBQVMsTUFBTTtBQUFBLFFBQzFDLGVBQWUsS0FBSyxNQUFNLFNBQVMsS0FBSztBQUFBLFFBQ3hDLG1CQUFtQixLQUFLLElBQUksS0FBSyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFBQSxRQUN6RCxzQkFBc0IsS0FBSztBQUFBLFVBQ3pCLEtBQUssTUFBTSxPQUFPLGNBQWMsV0FBVyxNQUFNO0FBQUEsVUFDakQ7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUNBLFVBQUksT0FBTyxpQkFBaUIsT0FBTyxzQkFBc0I7QUFDdkQsaUJBQVMsTUFBTSxNQUFNLElBQUksT0FBTyxpQkFBaUI7QUFBQSxNQUNuRCxPQUFPO0FBQ0wsaUJBQVMsTUFBTSxNQUFNLEdBQUcsT0FBTyxlQUFlO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxVQUFVLE9BQU87QUFDZixZQUFNLFdBQVcsU0FBUyxlQUFlLEtBQUssR0FBRyxFQUFFO0FBQ25ELFVBQUksQ0FBQztBQUFVO0FBRWYsWUFBTSxrQkFBa0IsS0FBSyxHQUFHLGNBQWMsd0JBQXdCO0FBQ3RFLFVBQUksQ0FBQztBQUFpQjtBQUV0QixZQUFNLFFBQVEsZ0JBQWdCLGlCQUFpQixJQUFJO0FBQ25ELFVBQUksQ0FBQyxNQUFNO0FBQVE7QUFFbkIsVUFBSSxlQUFlLE1BQU0sS0FBSyxLQUFLLEVBQUU7QUFBQSxRQUNuQyxDQUFDLFNBQVMsU0FBUyxTQUFTO0FBQUEsTUFDOUI7QUFFQSxZQUFNLGVBQWUsTUFBTTtBQUN6QixjQUFNLGVBQWU7QUFDckIsYUFBSyxLQUFLO0FBQUEsTUFDWjtBQUVBLFlBQU0sbUJBQW1CLENBQUMsY0FBYztBQUN0QyxjQUFNLGVBQWU7QUFDckIsd0JBQWdCLGVBQWUsWUFBWSxNQUFNLFVBQVUsTUFBTTtBQUNqRSxjQUFNLFlBQVksRUFBRSxNQUFNO0FBQUEsTUFDNUI7QUFFQSxZQUFNLGtCQUFrQixNQUFNO0FBQzVCLGNBQU0sZUFBZTtBQUNyQixZQUFJLGlCQUFpQixJQUFJO0FBQ3ZCLGdCQUFNLFlBQVksRUFBRSxNQUFNO0FBQUEsUUFDNUI7QUFDQSxhQUFLLEtBQUs7QUFDVixpQkFBUyxNQUFNO0FBQUEsTUFDakI7QUFFQSxZQUFNLGVBQWUsTUFBTTtBQUN6QixjQUFNLGVBQWU7QUFDckIsYUFBSyxLQUFLO0FBQUEsTUFDWjtBQUVBLGNBQVEsTUFBTSxLQUFLO0FBQUEsUUFDakIsS0FBSztBQUNILDJCQUFpQixDQUFDO0FBQ2xCO0FBQUEsUUFDRixLQUFLO0FBQ0gsMkJBQWlCLEVBQUU7QUFDbkI7QUFBQSxRQUNGLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFDSCxjQUFJLENBQUMsS0FBSyxRQUFRO0FBQ2hCLHlCQUFhO0FBQUEsVUFDZixPQUFPO0FBQ0wsNEJBQWdCO0FBQUEsVUFDbEI7QUFDQTtBQUFBLFFBQ0YsS0FBSztBQUNILHVCQUFhO0FBQ2I7QUFBQSxNQUNKO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDQSxNQUFPLG1CQUFROzs7QUNuUWYsTUFBTSxZQUFZO0FBQUEsSUFDaEIsVUFBVTtBQUNSLFlBQU0sV0FBVyxLQUFLLEdBQUcsUUFBUTtBQUNqQyxZQUFNLFFBQVEsS0FBSyxnQkFBZ0IsUUFBUTtBQUMzQyxZQUFNLE9BQU8sS0FBSyxlQUFlLFFBQVE7QUFFekMsVUFBSSxDQUFDLFNBQVMsQ0FBQztBQUFNO0FBRXJCLFdBQUssbUJBQW1CLEtBQUs7QUFDN0IsV0FBSyxvQkFBb0IsT0FBTyxJQUFJO0FBQUEsSUFDdEM7QUFBQSxJQUNBLGdCQUFnQixVQUFVO0FBQ3hCLFlBQU0sUUFBUSxTQUFTO0FBQUEsUUFDckIsMkNBQTJDO0FBQUEsTUFDN0M7QUFDQSxVQUFJLENBQUMsT0FBTztBQUNWLGdCQUFRO0FBQUEsVUFDTix1REFBdUQ7QUFBQSxRQUN6RDtBQUFBLE1BQ0Y7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0EsZUFBZSxVQUFVO0FBQ3ZCLFlBQU0sT0FBTyxTQUFTLGNBQWMsd0JBQXdCLFlBQVk7QUFDeEUsVUFBSSxDQUFDLE1BQU07QUFDVCxnQkFBUTtBQUFBLFVBQ04saURBQWlEO0FBQUEsUUFDbkQ7QUFBQSxNQUNGO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLG1CQUFtQixPQUFPO0FBQ3hCLFdBQUssR0FBRyxpQkFBaUIsU0FBUyxNQUFNLE1BQU0sTUFBTSxDQUFDO0FBQUEsSUFDdkQ7QUFBQSxJQUNBLG9CQUFvQixPQUFPLE1BQU07QUFDL0IsWUFBTSxpQkFBaUIsVUFBVSxNQUFNO0FBQ3JDLGNBQU0sUUFBUSxNQUFNO0FBQ3BCLGFBQUssY0FDSCxNQUFNLFdBQVcsSUFBSSxNQUFNLENBQUMsRUFBRSxPQUFPLEdBQUcsTUFBTTtBQUFBLE1BQ2xELENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUVBLE1BQU8scUJBQVE7OztBQzNDZixNQUFJLGFBQWE7QUFBQSxJQUNmLFVBQVU7QUFDUixXQUFLLGVBQWUsS0FBSyxHQUFHLGFBQWEsY0FBYyxNQUFNO0FBQzdELFdBQUssS0FBSyxLQUFLLEdBQUc7QUFHbEIsVUFBSSxLQUFLLEdBQUcsYUFBYSxjQUFjLE1BQU07QUFBUztBQUd0RCxXQUFLLEdBQUcsaUJBQWlCLGlCQUFpQixDQUFDLE1BQU07QUFFL0MsWUFBSSxFQUFFLE9BQU87QUFBVTtBQUV2QixhQUFLLE9BQU8sQ0FBQyxLQUFLLFlBQVk7QUFDOUIsWUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLFVBQVU7QUFDakMsbUJBQ0csZUFBZSxFQUFFLE9BQU8sUUFBUSxFQUNoQyxjQUFjLElBQUksTUFBTSxTQUFTLEVBQUUsU0FBUyxLQUFLLENBQUMsQ0FBQztBQUFBLFFBQ3hEO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsVUFBVTtBQUVSLFdBQUssZUFBZSxLQUFLLEdBQUcsYUFBYSxjQUFjLE1BQU07QUFBQSxJQUMvRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1BLGdCQUFnQixNQUFNO0FBQ3BCLGFBQU8sT0FBTyxTQUFTO0FBQUEsSUFDekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxPQUFPLE1BQU07QUFDWCxZQUFNLFNBQVMsS0FBSyxHQUFHLFFBQVEsc0JBQXNCO0FBQ3JELFlBQU0sVUFBVSxLQUFLLEtBQUs7QUFDMUIsWUFBTSxTQUFTLEtBQUssS0FBSztBQUV6QixZQUFNLFdBQVcsT0FBTyxjQUFjLHFCQUFxQjtBQUMzRCxZQUFNLFlBQVksT0FBTyxjQUFjLHVCQUF1QjtBQUU5RCxhQUFPLGNBQWMsTUFBTSxPQUFPLEVBQUUsUUFBUSxLQUFLLGdCQUFnQixJQUFJO0FBQ3JFLGFBQU8sY0FBYyxNQUFNLE1BQU0sRUFBRSxRQUFRLGVBQ3pDLEtBQUssZ0JBQWdCLElBQUk7QUFFM0IsV0FBSyxHQUFHLGFBQWEsZ0JBQWdCLEtBQUssZ0JBQWdCLElBQUksQ0FBQztBQUcvRCxXQUFLLGVBQWU7QUFHcEIsWUFBTSxpQkFDSCxLQUFLLEdBQUcsUUFBUSxzQkFDZixLQUFLLEdBQUcsUUFBUSxtQkFBbUIsTUFBTSxHQUFHLEtBQzlDLENBQUM7QUFFSCxZQUFNLGtCQUNILEtBQUssR0FBRyxRQUFRLHVCQUNmLEtBQUssR0FBRyxRQUFRLG9CQUFvQixNQUFNLEdBQUcsS0FDL0MsQ0FBQztBQUVILFVBQUksTUFBTTtBQUNSLGFBQUssR0FBRyxVQUFVLE9BQU8sR0FBRyxlQUFlO0FBQzNDLGFBQUssR0FBRyxVQUFVLElBQUksR0FBRyxjQUFjO0FBRXZDLFlBQUksVUFBVTtBQUNaLG1CQUFTLFVBQVUsT0FBTyxXQUFXO0FBQ3JDLG1CQUFTLFVBQVUsSUFBSSxXQUFXO0FBQUEsUUFDcEM7QUFDQSxZQUFJLFdBQVc7QUFDYixvQkFBVSxVQUFVLElBQUksV0FBVztBQUNuQyxvQkFBVSxVQUFVLE9BQU8sV0FBVztBQUFBLFFBQ3hDO0FBQUEsTUFDRixPQUFPO0FBQ0wsYUFBSyxHQUFHLFVBQVUsT0FBTyxHQUFHLGNBQWM7QUFDMUMsYUFBSyxHQUFHLFVBQVUsSUFBSSxHQUFHLGVBQWU7QUFHeEMsWUFBSSxVQUFVO0FBQ1osbUJBQVMsVUFBVSxPQUFPLFdBQVc7QUFDckMsbUJBQVMsVUFBVSxJQUFJLFdBQVc7QUFBQSxRQUNwQztBQUNBLFlBQUksV0FBVztBQUNiLG9CQUFVLFVBQVUsSUFBSSxXQUFXO0FBQ25DLG9CQUFVLFVBQVUsT0FBTyxXQUFXO0FBQUEsUUFDeEM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxNQUFPLHNCQUFROzs7QUM5RmYsTUFBTSw2QkFBNkI7QUFDbkMsTUFBTUMsa0NBQWlDO0FBT3ZDLE1BQU0seUJBQXlCO0FBQUEsSUFDN0IsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLEVBQ1Y7QUFPQSxNQUFNLDBCQUEwQjtBQUFBLElBQzlCLFVBQVUsU0FBUyxPQUFPO0FBQ3hCLGFBQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsVUFDUixLQUFLLFdBQVcsUUFBUSxTQUFTO0FBQUEsUUFDbkM7QUFBQSxRQUNBLEVBQUUsU0FBUyxHQUFHLFFBQVEsYUFBYSxLQUFLLE1BQU07QUFBQSxNQUNoRDtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLFVBQVU7QUFBQSxNQUNWLFlBQVk7QUFBQSxNQUNaLFFBQVFBO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFPQSxNQUFNLHlCQUF5QjtBQUFBLElBQzdCLFVBQVUsU0FBUyxPQUFPO0FBQ3hCLGFBQU87QUFBQSxRQUNMLEVBQUUsUUFBUSxhQUFhLEtBQUssT0FBTyxTQUFTLEVBQUU7QUFBQSxRQUM5QztBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsS0FBSyxXQUFXLFFBQVEsUUFBUTtBQUFBLFVBQ2hDLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLFVBQVU7QUFBQSxNQUNWLFlBQVk7QUFBQSxNQUNaLFFBQVFBO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFFQSxNQUFNLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFTZCxLQUFLLE9BQU87QUFDVixZQUFNLFNBQVMsS0FBSyxVQUFVLEtBQUs7QUFDbkMsWUFBTSxjQUFjLEtBQUssR0FBRyxRQUFRLFFBQVE7QUFHNUMsVUFBSSxDQUFDLFFBQVE7QUFDWCxjQUFNLE1BQU0sK0JBQStCO0FBQzNDO0FBQUEsTUFDRjtBQUdBLFVBQUksS0FBSyxnQkFBZ0I7QUFDdkIscUJBQWEsS0FBSyxjQUFjO0FBQ2hDLGFBQUssaUJBQWlCO0FBQUEsTUFDeEI7QUFHQSxZQUFNLGFBQWEsT0FBTyxzQkFBc0I7QUFFaEQsV0FBSyxhQUFhO0FBQUEsUUFDaEIsY0FBYyxXQUFXO0FBQUEsUUFDekIsYUFBYSxXQUFXO0FBQUEsUUFDeEIsS0FBSyxXQUFXO0FBQUEsUUFDaEIsUUFBUSxPQUFPLGNBQWMsV0FBVztBQUFBLE1BQzFDLENBQUM7QUFHRCxXQUFLLEdBQUcsTUFBTSxZQUFZLEtBQUssYUFBYSxVQUFVO0FBR3RELFdBQUssR0FBRztBQUFBLFFBQ04sd0JBQXdCLFVBQVUsV0FBVztBQUFBLFFBQzdDLEtBQUssR0FBRyxRQUFRLGtCQUFrQixTQUM5Qix5QkFDQSx3QkFBd0I7QUFBQSxNQUM5QjtBQUNBLDRCQUFzQixNQUFNO0FBRTFCLGFBQUssR0FBRyxVQUFVLE9BQU8sUUFBUTtBQUFBLE1BQ25DLENBQUM7QUFHRCxXQUFLLGNBQWMsS0FBSyxRQUFRLEtBQUssSUFBSTtBQUN6QyxlQUFTLGlCQUFpQixTQUFTLEtBQUssV0FBVztBQUduRCxXQUFLLFlBQVksTUFBTSxLQUFLLE1BQU0sS0FBSyxJQUFJLEVBQUUsTUFBTTtBQUduRCxhQUFPLGlCQUFpQixVQUFVLEtBQUssU0FBUztBQUNoRCxhQUFPLGlCQUFpQixVQUFVLEtBQUssU0FBUztBQUdoRCw0QkFBc0IsTUFBTSxLQUFLLFVBQVUsQ0FBQztBQUM1QyxpQkFBVyxNQUFNLHNCQUFzQixNQUFNLEtBQUssVUFBVSxDQUFDLEdBQUcsR0FBRztBQUduRSxXQUFLLEdBQUcsUUFBUSxRQUFRO0FBQUEsSUFDMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBUUEsS0FBSyxPQUFPO0FBRVYsWUFBTSxjQUFjLEtBQUssR0FBRyxRQUFRLFFBQVE7QUFFNUMsWUFBTSxrQkFBa0IsS0FBSyxHQUFHLFFBQVE7QUFHeEMsV0FBSyxHQUFHO0FBQUEsUUFDTix1QkFBdUIsVUFBVSxXQUFXO0FBQUEsUUFDNUMsS0FBSyxHQUFHLFFBQVEsaUJBQWlCLFNBQzdCLHlCQUNBLHVCQUF1QjtBQUFBLE1BQzdCO0FBRUEsVUFBSSxLQUFLLGdCQUFnQjtBQUN2QixxQkFBYSxLQUFLLGNBQWM7QUFDaEMsYUFBSyxpQkFBaUI7QUFBQSxNQUN4QjtBQUdBLFdBQUssaUJBQWlCLFdBQVcsTUFBTTtBQUVyQyxhQUFLLEdBQUcsVUFBVSxJQUFJLFFBQVE7QUFBQSxNQUNoQyxHQUFHLDBCQUEwQjtBQUc3QixVQUFJLEtBQUssYUFBYTtBQUNwQixpQkFBUyxvQkFBb0IsU0FBUyxLQUFLLFdBQVc7QUFDdEQsYUFBSyxjQUFjO0FBQUEsTUFDckI7QUFHQSxVQUFJLEtBQUssV0FBVztBQUNsQixlQUFPLG9CQUFvQixVQUFVLEtBQUssU0FBUztBQUNuRCxlQUFPLG9CQUFvQixVQUFVLEtBQUssU0FBUztBQUFBLE1BQ3JEO0FBR0EsV0FBSyxHQUFHLFFBQVEsUUFBUTtBQUV4QixVQUFJLG1CQUFtQixvQkFBb0IsSUFBSTtBQUM3QyxhQUFLLFdBQVcsT0FBTyxLQUFLLElBQUksS0FBSyxHQUFHLGFBQWEsZUFBZSxDQUFDO0FBQUEsTUFDdkU7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPQSxPQUFPLE9BQU87QUFDWixVQUFJLEtBQUssR0FBRyxRQUFRLFVBQVUsVUFBVTtBQUN0QyxhQUFLLEtBQUssS0FBSztBQUFBLE1BQ2pCLE9BQU87QUFDTCxhQUFLLEtBQUssS0FBSztBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFTQSxhQUFhLFlBQVk7QUFDdkIsWUFBTSxjQUFjLEtBQUssR0FBRyxRQUFRLFFBQVE7QUFDNUMsWUFBTSxlQUFlLEtBQUssU0FBUztBQUVuQyxZQUFNLGdCQUFnQjtBQUFBLFFBQ3BCLEtBQUssV0FBVyxLQUFLLEVBQUUsRUFBRTtBQUFBLFVBQ3ZCO0FBQUEsUUFDRixLQUFLO0FBQUEsTUFDUDtBQUNBLFlBQU0saUJBQWlCO0FBQUEsUUFDckIsS0FDRSxnQkFBZ0IsUUFDWixXQUFXLE1BQU0sS0FBSyxHQUFHLGVBQWUsSUFDeEMsV0FBVyxNQUFNLFdBQVcsU0FBUztBQUFBLFFBQzNDLE9BQ0csQ0FBQyxnQkFBZ0I7QUFDaEIsY0FBSSxpQkFBaUIsU0FBUztBQUM1QixtQkFBTyxXQUFXLE9BQU8sV0FBVyxRQUFRO0FBQUEsVUFDOUM7QUFFQSxjQUFJLGlCQUFpQixVQUFVO0FBQzdCLG1CQUFPLFdBQVcsUUFBUSxXQUFXLFFBQVEsZUFBZTtBQUFBLFVBQzlEO0FBRUEsaUJBQU8sV0FBVztBQUFBLFFBQ3BCLEdBQUcsS0FBSyxHQUFHLFdBQVcsS0FBSztBQUFBLE1BQy9CO0FBRUEsYUFBTyxlQUFlLEtBQUssS0FBSyxlQUFlLElBQUksUUFDakQsS0FBSyxLQUFLLGVBQWUsR0FBRyxJQUFJO0FBQUEsSUFFcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxRQUFRO0FBQ04sYUFBTyxPQUFPLGlCQUFpQixTQUFTLElBQUksRUFBRSxjQUFjO0FBQUEsSUFDOUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLFdBQVc7QUFFVCxZQUFNLFFBQVEsS0FBSyxNQUFNO0FBRXpCLFlBQU0sZUFBZSxLQUFLLEdBQUcsUUFBUSxTQUFTO0FBRTlDLGFBQU8sUUFBUyxpQkFBaUIsU0FBUyxVQUFVLFNBQVU7QUFBQSxJQUNoRTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsV0FBVyxJQUFJO0FBQ2IsYUFBTyxPQUFPLGlCQUFpQixFQUFFO0FBQUEsSUFDbkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBUUEsVUFBVSxPQUFPO0FBMVFuQjtBQTJRSSxZQUFNLFVBQVMsaUJBQU0sV0FBTixtQkFBYyxlQUFkLFlBQTRCLE1BQU07QUFDakQsVUFBSSxPQUFPLFdBQVcsVUFBVTtBQUM5QixlQUFPLFNBQVMsY0FBYyxNQUFNO0FBQUEsTUFDdEM7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBVUEsa0JBQWtCLFFBQVEsYUFBYSxjQUFjO0FBRW5ELFVBQ0csT0FBTyxxQkFBcUIsZ0JBQWdCLGdCQUFnQixTQUM1RCxPQUFPLHdCQUF3QixnQkFBZ0IsZ0JBQWdCLFVBQ2hFO0FBQ0EsZUFBTztBQUFBLE1BQ1Q7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT0EsUUFBUSxPQUFPO0FBRWIsVUFBSSxLQUFLLEdBQUcsUUFBUSxTQUFTLFVBQVU7QUFDckM7QUFBQSxNQUNGO0FBRUEsWUFBTSxTQUFTLEtBQUssVUFBVSxLQUFLO0FBQ25DLFVBQUksQ0FBQyxRQUFRO0FBRVg7QUFBQSxNQUNGO0FBRUEsVUFBSSxDQUFDLENBQUMsT0FBTyxRQUFRLG1DQUFtQyxHQUFHO0FBQ3pEO0FBQUEsTUFDRjtBQUdBLFlBQU0sWUFBWSxDQUFDLENBQUMsT0FBTyxRQUFRLE1BQU0sS0FBSyxHQUFHLEVBQUU7QUFDbkQsVUFBSSxDQUFDLFdBQVc7QUFDZCxhQUFLLEtBQUssS0FBSztBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT0EsTUFBTSxRQUFRO0FBQ1osWUFBTSxhQUFhLE9BQU8sc0JBQXNCO0FBQ2hELFlBQU0sY0FBYyxLQUFLLEdBQUcsUUFBUSxRQUFRO0FBQzVDLFlBQU0sU0FBUztBQUFBLFFBQ2IsY0FBYyxLQUFLLE1BQU0sV0FBVyxNQUFNO0FBQUEsUUFDMUMsYUFBYSxLQUFLLE1BQU0sV0FBVyxLQUFLO0FBQUEsUUFDeEMsS0FBSyxLQUFLLElBQUksS0FBSyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFBQSxRQUMzQyxRQUFRLEtBQUssSUFBSSxLQUFLLE1BQU0sT0FBTyxjQUFjLFdBQVcsTUFBTSxHQUFHLENBQUM7QUFBQSxRQUN0RSxNQUFNLEtBQUssSUFBSSxLQUFLLE1BQU0sV0FBVyxJQUFJLEdBQUcsQ0FBQztBQUFBLFFBQzdDLE9BQU8sS0FBSyxJQUFJLEtBQUssTUFBTSxPQUFPLGFBQWEsV0FBVyxLQUFLLEdBQUcsQ0FBQztBQUFBLE1BQ3JFO0FBR0EsV0FBSyxhQUFhLE1BQU07QUFHeEIsWUFBTSxrQkFDSixnQkFBZ0IsUUFDWixLQUFLLEdBQUcsZUFBZSxPQUFPLGVBQWUsS0FDNUMsS0FBSyxHQUFHLGVBQWUsT0FBTyxlQUFlLEtBQUs7QUFFekQsVUFBSSxLQUFLLGtCQUFrQixRQUFRLGFBQWEsS0FBSyxHQUFHLFlBQVksR0FBRztBQUNyRSxhQUFLLEdBQUcsTUFBTTtBQUFBLFVBQ1o7QUFBQSxVQUNBLEdBQUc7QUFBQSxRQUNMO0FBQ0EsWUFBSSxZQUFZLE9BQU8sb0JBQW9CLEtBQUssR0FBRztBQUNuRCxZQUFJLGdCQUFnQixPQUFPO0FBQ3pCLHNCQUFZLE9BQU87QUFBQSxRQUNyQjtBQUNBLFlBQUksWUFBWSxHQUFHO0FBQ2pCLGVBQUssR0FBRyxNQUFNLE1BQU0sR0FBRyxLQUFLLElBQUksU0FBUztBQUFBLFFBQzNDLE9BQU87QUFDTCxlQUFLLEdBQUcsTUFBTSxNQUFNO0FBQUEsUUFDdEI7QUFBQSxNQUNGLE9BQU87QUFDTCxhQUFLLEdBQUcsTUFBTSxZQUFZLGtDQUFrQyxHQUFHO0FBQy9ELGFBQUssR0FBRyxNQUFNLE1BQU07QUFBQSxNQUN0QjtBQUdBLFdBQUssR0FBRyxNQUFNLFlBQVksS0FBSyxhQUFhLFVBQVU7QUFBQSxJQUN4RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT0EsYUFBYSxRQUFRO0FBQ25CLFlBQU0sUUFBUSxLQUFLLEdBQUc7QUFDdEIsWUFBTSxhQUFhLE9BQU8sS0FBSyxNQUFNO0FBRXJDLFVBQUksV0FBVyxTQUFTLGNBQWM7QUFDcEMsY0FBTTtBQUFBLFVBQ0o7QUFBQSxVQUNBLEdBQUcsS0FBSyxNQUFNLE9BQU8sWUFBWTtBQUFBLFFBQ25DO0FBRUYsVUFBSSxXQUFXLFNBQVMsYUFBYTtBQUNuQyxjQUFNO0FBQUEsVUFDSjtBQUFBLFVBQ0EsR0FBRyxLQUFLLE1BQU0sT0FBTyxXQUFXO0FBQUEsUUFDbEM7QUFFRixVQUFJLFdBQVcsU0FBUyxLQUFLO0FBQzNCLGFBQUssR0FBRyxNQUFNO0FBQUEsVUFDWjtBQUFBLFVBQ0EsR0FBRyxLQUFLLE1BQU0sT0FBTyxHQUFHO0FBQUEsUUFDMUI7QUFFRixVQUFJLFdBQVcsU0FBUyxRQUFRO0FBQzlCLGNBQU07QUFBQSxVQUNKO0FBQUEsVUFDQSxHQUFHLEtBQUssTUFBTSxPQUFPLE1BQU07QUFBQSxRQUM3QjtBQUVGLFVBQUksV0FBVyxTQUFTLE9BQU87QUFDN0IsY0FBTTtBQUFBLFVBQ0o7QUFBQSxVQUNBLEdBQUcsS0FBSyxNQUFNLE9BQU8sS0FBSztBQUFBLFFBQzVCO0FBRUYsVUFBSSxXQUFXLFNBQVMsTUFBTTtBQUM1QixjQUFNO0FBQUEsVUFDSjtBQUFBLFVBQ0EsR0FBRyxLQUFLLE1BQU0sT0FBTyxJQUFJO0FBQUEsUUFDM0I7QUFBQSxJQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVFBLFVBQVU7QUFFUixXQUFLLFdBQVcsS0FBSyxLQUFLLEtBQUssSUFBSTtBQUNuQyxXQUFLLFdBQVcsS0FBSyxLQUFLLEtBQUssSUFBSTtBQUNuQyxXQUFLLGFBQWEsS0FBSyxPQUFPLEtBQUssSUFBSTtBQUd2QyxXQUFLLEdBQUcsaUJBQWlCLG9CQUFvQixLQUFLLFFBQVE7QUFDMUQsV0FBSyxHQUFHLGlCQUFpQixvQkFBb0IsS0FBSyxRQUFRO0FBQzFELFdBQUssR0FBRyxpQkFBaUIsc0JBQXNCLEtBQUssVUFBVTtBQUc5RCxXQUFLLFlBQVksb0JBQW9CLENBQUMsVUFBVTtBQUM5QyxjQUFNLFlBQVksTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTTtBQUN0RSxZQUFJLFdBQVc7QUFDYixlQUFLLEtBQUssS0FBSztBQUFBLFFBQ2pCO0FBQUEsTUFDRixDQUFDO0FBQ0QsV0FBSyxZQUFZLG9CQUFvQixDQUFDLFVBQVU7QUFDOUMsY0FBTSxZQUFZLE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU07QUFDdEUsWUFBSSxXQUFXO0FBQ2IsZUFBSyxLQUFLLEtBQUs7QUFBQSxRQUNqQjtBQUFBLE1BQ0YsQ0FBQztBQUNELFdBQUssWUFBWSxzQkFBc0IsQ0FBQyxVQUFVO0FBQ2hELGNBQU0sWUFBWSxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNO0FBQ3RFLFlBQUksV0FBVztBQUNiLGVBQUssT0FBTyxLQUFLO0FBQUEsUUFDbkI7QUFBQSxNQUNGLENBQUM7QUFHRCxXQUFLLFNBQVMsQ0FBQztBQUdmLFdBQUssTUFBTTtBQUdYLFdBQUssc0JBQXNCO0FBQUEsSUFDN0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9BLFlBQVk7QUFDVixXQUFLLEdBQUcsb0JBQW9CLG9CQUFvQixLQUFLLFFBQVE7QUFDN0QsV0FBSyxHQUFHLG9CQUFvQixvQkFBb0IsS0FBSyxRQUFRO0FBQzdELFdBQUssR0FBRyxvQkFBb0Isc0JBQXNCLEtBQUssVUFBVTtBQUdqRSxXQUFLLE9BQU8sUUFBUSxDQUFDLE9BQU87QUFDMUIsWUFBSSxJQUFJO0FBQ04sYUFBRyxvQkFBb0IsY0FBYyxLQUFLLFFBQVE7QUFDbEQsYUFBRyxvQkFBb0IsY0FBYyxLQUFLLFFBQVE7QUFBQSxRQUNwRDtBQUFBLE1BQ0YsQ0FBQztBQUVELFVBQUksS0FBSyxhQUFhO0FBQ3BCLGlCQUFTLG9CQUFvQixTQUFTLEtBQUssV0FBVztBQUFBLE1BQ3hEO0FBQ0EsVUFBSSxLQUFLLFdBQVc7QUFDbEIsZUFBTyxvQkFBb0IsVUFBVSxLQUFLLFNBQVM7QUFDbkQsZUFBTyxvQkFBb0IsVUFBVSxLQUFLLFNBQVM7QUFBQSxNQUNyRDtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxRQUFRO0FBRU4sZUFBUyxpQkFBaUIsMEJBQTBCLEVBQUUsUUFBUSxDQUFDLE9BQU87QUFDcEUsWUFBSSxHQUFHLFFBQVEsb0JBQW9CLEtBQUssR0FBRyxJQUFJO0FBQzdDLGFBQUcsaUJBQWlCLGNBQWMsS0FBSyxRQUFRO0FBQy9DLGFBQUcsaUJBQWlCLGNBQWMsS0FBSyxRQUFRO0FBRy9DLGVBQUssT0FBTyxLQUFLLEVBQUU7QUFBQSxRQUNyQjtBQUFBLE1BQ0YsQ0FBQztBQUdELFVBQUksZ0JBQWdCO0FBQ3BCLFlBQU0sYUFBYSxTQUFTO0FBQUEsUUFDMUIsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLE1BQ2I7QUFNQSxVQUFJLGdCQUFnQjtBQUNwQixhQUFPLFdBQVcsU0FBUyxLQUFLLGdCQUFnQixLQUFNO0FBQ3BELHdCQUFnQixLQUFLO0FBQUEsVUFDbkI7QUFBQSxVQUNBLFNBQVMsS0FBSyxXQUFXLFdBQVcsV0FBVyxFQUFFLFFBQVEsRUFBRSxLQUFLO0FBQUEsUUFDbEU7QUFDQSx5QkFBaUI7QUFBQSxNQUNuQjtBQUVBLFVBQUksaUJBQWlCLElBQUk7QUFDdkIsYUFBSyxHQUFHLE1BQU0sU0FBUyxnQkFBZ0I7QUFBQSxNQUN6QztBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0Esd0JBQXdCO0FBRXRCLFlBQU0sU0FBUyxLQUFLLEdBQUcsUUFBUTtBQUcvQixVQUFJLEtBQUssR0FBRyxRQUFRLGlCQUFpQixhQUFhLFFBQVE7QUFDeEQsYUFBSyxLQUFLLEVBQUUsT0FBTyxDQUFDO0FBQUEsTUFDdEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLE1BQU8sa0JBQVE7OztBQ2ppQmYsTUFBTSxtQkFBbUI7QUFBQSxJQUN2QixVQUFVO0FBQ1IsV0FBSyxVQUFVLENBQUMsQ0FBQyxLQUFLLEdBQUcsUUFBUTtBQUNqQyxXQUFLLFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxRQUFRO0FBRWpDLFdBQUssYUFBYSxLQUFLLGNBQWM7QUFHckMsVUFBSSxLQUFLLFdBQVcsU0FBUztBQUMzQixhQUFLLFlBQVksS0FBSyxJQUFJLE1BQU07QUFBQSxNQUNsQztBQUdBLFdBQUssV0FBVyxpQkFBaUIsVUFBVSxDQUFDLEVBQUUsUUFBUSxNQUFNO0FBQzFELFlBQUksU0FBUztBQUNYLGVBQUssWUFBWSxLQUFLLElBQUksTUFBTTtBQUFBLFFBQ2xDLE9BQU87QUFDTCxlQUFLLFlBQVksS0FBSyxJQUFJLE1BQU07QUFBQSxRQUNsQztBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFVBQVU7QUFDUixVQUFJLEtBQUssV0FBVyxTQUFTO0FBQzNCLGFBQUssWUFBWSxLQUFLLElBQUksTUFBTTtBQUFBLE1BQ2xDO0FBQUEsSUFDRjtBQUFBLElBQ0EsZ0JBQWdCO0FBQ2QsVUFBSSxLQUFLLFdBQVcsS0FBSyxTQUFTO0FBQ2hDLGVBQU8sT0FBTztBQUFBLFVBQ1osZUFBZSxLQUFLLEdBQUcsUUFBUSwwQkFBMEIsS0FBSyxHQUFHLFFBQVE7QUFBQSxRQUMzRTtBQUFBLE1BQ0Y7QUFDQSxVQUFJLEtBQUssU0FBUztBQUNoQixlQUFPLE9BQU8sV0FBVyxlQUFlLEtBQUssR0FBRyxRQUFRLFFBQVE7QUFBQSxNQUNsRTtBQUNBLFVBQUksS0FBSyxTQUFTO0FBQ2hCLGVBQU8sT0FBTyxXQUFXLGVBQWUsS0FBSyxHQUFHLFFBQVEsUUFBUTtBQUFBLE1BQ2xFO0FBRUEsYUFBTyxPQUFPLFdBQVcsa0JBQWtCO0FBQUEsSUFDN0M7QUFBQSxFQUNGO0FBQ0EsTUFBTyw0QkFBUTs7O0FDMUNmLE1BQU0sU0FBUztBQUFBLElBQ2IsUUFBUSxTQUFVLElBQUksZ0JBQWdCLGFBQWE7QUFDakQsWUFBTSxXQUFXLEtBQUssWUFBWTtBQUNsQyxZQUFNLFNBQVMsR0FBRyxVQUFVLElBQUk7QUFDaEMsYUFBTyxLQUFLO0FBQ1osYUFBTyxhQUFhLGtCQUFrQixNQUFNO0FBQzVDLFlBQU0sb0JBQW9CLEtBQUssVUFBVSxRQUFRLGNBQWM7QUFDL0Qsd0JBQWtCLFlBQVksR0FBRyxRQUFRLFVBQVUsSUFBSSxDQUFDO0FBQ3hELGtCQUFZLFlBQVksaUJBQWlCO0FBQ3pDLGFBQU87QUFBQSxJQUNUO0FBQUEsSUFDQSxTQUFTLFNBQVUsSUFBSTtBQUNyQixZQUFNLFNBQVMsU0FBUyxlQUFlLEVBQUU7QUFDekMsVUFBSSxRQUFRO0FBQ1YsZUFBTyxPQUFPO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsSUFDQSxXQUFXLFNBQVUsTUFBTSxLQUFLO0FBQzlCLFlBQU0sYUFBYSxTQUFTLGNBQWMsR0FBRztBQUM3QyxpQkFBVyxRQUFRLEtBQUssWUFBWTtBQUNsQyxZQUFJLEtBQUssUUFBUSw2QkFBNkI7QUFDNUMscUJBQVcsZUFBZSxNQUFNLEtBQUssTUFBTSxLQUFLLEtBQUs7QUFBQSxRQUN2RDtBQUFBLE1BQ0Y7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0EsYUFBYSxXQUFZO0FBQ3ZCLGFBQU8sY0FBYyxLQUFLLElBQUk7QUFBQSxJQUNoQztBQUFBLEVBQ0Y7QUFFQSxNQUFPLGlCQUFROzs7QUM3QmYsTUFBTSxXQUFXO0FBRWpCLE1BQU0sNEJBQTRCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPaEMsT0FBTyxNQUFNO0FBQ1gsWUFBTSxTQUFTLFNBQVMsZUFBZSxLQUFLLFFBQVE7QUFDcEQsVUFBSSxRQUFRO0FBQ1YsY0FBTSxXQUFXLE9BQU8sY0FBYyxxQkFBcUI7QUFDM0QsWUFBSSxVQUFVO0FBQ1osbUJBQVMsTUFBTSxNQUNiLFNBQVMsc0JBQXNCLEVBQUUsTUFBTSxXQUFXO0FBQ3BELG1CQUFTLE1BQU0sVUFBVTtBQUN6QixxQkFBVyxNQUFNO0FBQ2YsMkJBQU8sUUFBUSxLQUFLLFFBQVE7QUFBQSxVQUM5QixHQUFHLEdBQUc7QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxLQUFLLE1BQU07QUFDVCxZQUFNLFVBQVUsU0FBUyxlQUFlLEtBQUssU0FBUyxNQUFNLENBQUMsQ0FBQztBQUM5RCxVQUFJLENBQUM7QUFBUztBQUNkLFlBQU0sY0FBYyxTQUFTO0FBQzdCLFlBQU0sV0FBVyxRQUFRLFVBQVUsSUFBSTtBQUN2QyxlQUFTLEtBQUssS0FBSztBQUNuQixhQUFPLGVBQU8sT0FBTyxVQUFVLE9BQU8sV0FBVztBQUFBLElBQ25EO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT0EsZUFBZTtBQUNiLFlBQU0sU0FBUyxTQUFTLGNBQWMsUUFBUTtBQUM5QyxVQUFJLFFBQVE7QUFDVixlQUFPLE9BQU8sZUFBZTtBQUFBLE1BQy9CO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsVUFBVTtBQUNSLGFBQU8sS0FBSyxhQUFhO0FBQUEsSUFDM0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLFNBQVMsT0FBTyxPQUFPLEdBQUc7QUFDeEIsVUFBSSxTQUFTLFVBQVU7QUFDckIsY0FBTSxNQUFNLFNBQVM7QUFBQSxNQUN2QixPQUFPO0FBQ0wsY0FBTSxNQUFNLE1BQU07QUFBQSxNQUNwQjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLFFBQVEsb0JBQW9CLENBQUMsR0FBRyxhQUFhLE9BQU87QUFDbEQsWUFBTSxVQUFVLEtBQUssUUFBUTtBQUM3QixZQUFNLE9BQU8sa0JBQ1YsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLFFBQVEsRUFDdkMsV0FBVztBQUVkLFdBQUssUUFBUSxDQUFDLFVBQVUsVUFBVTtBQUNoQyxjQUFNLGFBQWEsU0FBUyxlQUFlLFNBQVMsUUFBUTtBQUM1RCxZQUFJLENBQUM7QUFBWTtBQUNqQixjQUFNLFFBQVEsV0FBVyxjQUFjLHFCQUFxQjtBQUM1RCxZQUFJLENBQUM7QUFBTztBQUNaLGNBQU0sUUFBUSxXQUFXLFFBQVE7QUFDakMsWUFBSSxZQUFZO0FBQ2QsZ0JBQU0sTUFBTSxhQUFhO0FBQ3pCLGVBQUssU0FBUyxPQUFPLE9BQU8sR0FBRyxVQUFVLFFBQVEsTUFBTTtBQUN2RCxnQkFBTSxNQUFNLFVBQVU7QUFDdEIsZ0JBQU0sTUFBTSxTQUFTLE1BQU87QUFDNUIsZ0JBQU0sTUFBTSxZQUFZO0FBQ3hCLGdCQUFNLFdBQVcsTUFBTSxRQUFRO0FBQy9CLGdCQUFNLE1BQU0scUJBQXFCLEdBQUc7QUFDcEMsY0FBSSxRQUFRLEdBQUc7QUFDYixrQkFBTSxNQUFNLGFBQWE7QUFDekIsa0JBQU0sTUFBTSxVQUFVO0FBQUEsVUFDeEI7QUFBQSxRQUNGLE9BQU87QUFDTCxjQUFJLFNBQVMsR0FBRztBQUNkLGtCQUFNLE1BQU0sYUFBYTtBQUN6QixpQkFBSyxTQUFTLE9BQU8sT0FBTyxLQUFLO0FBQ2pDLGtCQUFNLE1BQU0sVUFBVTtBQUN0QixrQkFBTSxlQUFlLElBQUksUUFBUTtBQUNqQyxrQkFBTSxNQUFNLFlBQVksMEJBQTBCO0FBQUEsVUFDcEQsT0FBTztBQUNMLGlCQUFLLFNBQVMsT0FBTyxPQUFPLEdBQUcsVUFBVSxRQUFRLEtBQUs7QUFDdEQsa0JBQU0sZUFBZSxJQUFJLFFBQVE7QUFDakMsa0JBQU0sTUFBTSxVQUFVO0FBQ3RCLGtCQUFNLE1BQU0sU0FBUyxNQUFPO0FBQzVCLGtCQUFNLE1BQU0sYUFBYTtBQUN6QixrQkFBTSxNQUFNLHFCQUFxQjtBQUNqQyxrQkFBTSxNQUFNLFlBQVksMEJBQTBCO0FBQUEsVUFDcEQ7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNQSxjQUFjO0FBQ1osYUFBTyxNQUFNLEtBQUssT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFO0FBQUEsSUFDekQ7QUFBQSxFQUNGO0FBRUEsTUFBTyxrQ0FBUTs7O0FDM0hmLE1BQU0sb0JBQW9CO0FBRTFCLE1BQU0sc0JBQU4sTUFBMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS3hCLGNBQWM7QUFFWixXQUFLLG9CQUFvQixDQUFDO0FBRzFCLFdBQUssVUFBVTtBQUNmLFdBQUssZUFBZTtBQUdwQixXQUFLLG9CQUFvQjtBQUFBLElBQzNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLHNCQUFzQjtBQUNwQixhQUFPLGlCQUFpQiwyQkFBMkIsQ0FBQyxVQUFVO0FBQzVELGFBQUssYUFBYSxLQUFLO0FBQUEsTUFDekIsQ0FBQztBQUNELGFBQU8saUJBQWlCLHlCQUF5QixDQUFDLFVBQVU7QUFDMUQsYUFBSyxXQUFXLEtBQUs7QUFBQSxNQUN2QixDQUFDO0FBQUEsSUFDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1BLE9BQU87QUFDTCxVQUFJLEtBQUssa0JBQWtCLFNBQVMsS0FBSyxDQUFDLEtBQUssWUFBWTtBQUN6RCxjQUFNLG1CQUFtQixLQUFLLGtCQUFrQixJQUFJO0FBQ3BELHdDQUEwQixPQUFPLGdCQUFnQjtBQUNqRCx3Q0FBMEI7QUFBQSxVQUN4QixLQUFLO0FBQUEsVUFDTCxLQUFLO0FBQUEsUUFDUDtBQUNBLGFBQUssWUFBWTtBQUFBLE1BQ25CO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1BLGlCQUFpQixJQUFJO0FBQ25CLFVBQUksQ0FBQztBQUFJLGVBQU87QUFDaEIsYUFBTyxTQUFTLGVBQWUsR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsVUFBVTtBQUFBLElBQ2hFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPQSxXQUFXLE9BQU87QUFDaEIsWUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNO0FBQ3JCLFVBQUksQ0FBQztBQUFJO0FBQ1QsWUFBTSxtQkFBbUIsS0FBSyxpQkFBaUIsRUFBRTtBQUNqRCxZQUFNLFNBQVMsZ0NBQTBCLFlBQVk7QUFDckQsVUFBSSxpQkFBaUI7QUFBQSxRQUNuQixJQUFJO0FBQUEsUUFDSixVQUFVO0FBQUEsUUFDVixZQUFZLG9CQUFJLEtBQUs7QUFBQSxRQUNyQjtBQUFBLFFBQ0EsVUFBVTtBQUFBLFFBQ1YsVUFBVTtBQUFBLE1BQ1o7QUFFQSxXQUFLLGtCQUFrQixLQUFLLGNBQWM7QUFDMUMscUJBQWUsV0FBVyxnQ0FBMEIsS0FBSyxjQUFjO0FBRXZFLHNDQUEwQixRQUFRLEtBQUssbUJBQW1CLEtBQUssVUFBVTtBQUN6RSxZQUFNLGlCQUFpQixTQUFTLGVBQWUsZUFBZSxRQUFRO0FBQ3RFLHFCQUFlLGdCQUFnQixVQUFVO0FBQ3pDLHFCQUFlLGlCQUFpQixjQUFjLE1BQU07QUFDbEQsYUFBSyxZQUFZO0FBQUEsTUFDbkIsQ0FBQztBQUNELHFCQUFlLGlCQUFpQixjQUFjLE1BQU07QUFDbEQsYUFBSyxZQUFZO0FBQUEsTUFDbkIsQ0FBQztBQUNELFdBQUssWUFBWTtBQUFBLElBQ25CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTUEsYUFBYSxPQUFPO0FBQ2xCLFlBQU0sRUFBRSxHQUFHLElBQUksTUFBTTtBQUNyQixXQUFLLG9CQUFvQixLQUFLLGtCQUFrQixJQUFJLENBQUMsU0FBUztBQUM1RCxZQUFJLEtBQUssWUFBWSxJQUFJO0FBQ3ZCLDBDQUEwQixPQUFPLElBQUk7QUFDckMsaUJBQU8saUNBQ0YsT0FERTtBQUFBLFlBRUwsVUFBVTtBQUFBLFVBQ1o7QUFBQSxRQUNGO0FBQ0EsZUFBTztBQUFBLE1BQ1QsQ0FBQztBQUNELFlBQU0sSUFBSSxLQUFLLGtCQUFrQixPQUFPLENBQUMsU0FBUyxLQUFLLFlBQVksRUFBRTtBQUNyRSxRQUFFLFFBQVEsQ0FBQyxTQUFTO0FBQ2xCLHdDQUEwQixPQUFPLElBQUk7QUFBQSxNQUN2QyxDQUFDO0FBQ0QsV0FBSyxZQUFZO0FBRWpCLFdBQUssYUFBYTtBQUNsQjtBQUFBLFFBQ0UsTUFDRSxnQ0FBMEI7QUFBQSxVQUN4QixLQUFLO0FBQUEsVUFDTCxLQUFLO0FBQUEsUUFDUDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxjQUFjO0FBQ1osVUFBSSxLQUFLLFNBQVM7QUFDaEIscUJBQWEsS0FBSyxPQUFPO0FBQUEsTUFDM0I7QUFDQSxXQUFLLFVBQVUsV0FBVyxNQUFNO0FBQzlCLGFBQUssS0FBSztBQUFBLE1BQ1osR0FBRyxpQkFBaUI7QUFBQSxJQUN0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxjQUFjO0FBQ1osVUFBSSxLQUFLLGNBQWM7QUFDckIscUJBQWEsS0FBSyxZQUFZO0FBQUEsTUFDaEM7QUFDQSxXQUFLLGFBQWE7QUFDbEIsc0NBQTBCLFFBQVEsS0FBSyxtQkFBbUIsS0FBSyxVQUFVO0FBQUEsSUFDM0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsY0FBYztBQUNaLFdBQUssZUFBZSxXQUFXLE1BQU07QUFDbkMsYUFBSyxhQUFhO0FBQ2xCLHdDQUEwQjtBQUFBLFVBQ3hCLEtBQUs7QUFBQSxVQUNMLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRixHQUFHLEdBQUc7QUFDTixXQUFLLFlBQVk7QUFBQSxJQUNuQjtBQUFBLEVBQ0Y7QUFFQSxNQUFPLDJCQUFROzs7QUMvSmYsTUFBTSxlQUFlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTW5CLFlBQVk7QUFDVixVQUFJLEtBQUssTUFBTSxLQUFLLEdBQUcsSUFBSTtBQUN6QixhQUFLLGVBQWUsVUFBVSxJQUFJLEtBQUssR0FBRyxJQUFJO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLGVBQWUsTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHO0FBQ2xDLFlBQU0sUUFBUSxJQUFJLFlBQVksb0JBQW9CLFFBQVE7QUFBQSxRQUN4RCxRQUFRLEVBQUUsSUFBSSxLQUFLO0FBQUEsTUFDckIsQ0FBQztBQUNELGFBQU8sY0FBYyxLQUFLO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBR0EsTUFBSSxDQUFDLE9BQU8scUJBQXFCO0FBQy9CLFdBQU8sc0JBQXNCLElBQUkseUJBQW9CO0FBQUEsRUFDdkQ7QUFFQSxNQUFPLG1CQUFROzs7QUM3QmYsTUFBTSxlQUFlO0FBQUEsSUFDbkIsVUFBVTtBQUNSLFdBQUssTUFBTTtBQUFBLElBQ2I7QUFBQSxJQUNBLFFBQVE7QUFDTixXQUFLLEdBQUcsaUJBQWlCLDZCQUE2QixNQUFNO0FBQzFELGNBQU0sZUFBZSxTQUFTLEtBQUssR0FBRyxRQUFRLGdCQUFnQjtBQUM5RCxjQUFNLFlBQVksV0FBVyxFQUFFLGNBQWMsU0FBUyxLQUFLLEdBQUcsQ0FBQztBQUUvRCw0QkFBb0IsS0FBSyxJQUFJLGNBQWMsU0FBUztBQUFBLE1BQ3RELENBQUM7QUFFRCxXQUFLLEdBQUcsaUJBQWlCLDhCQUE4QixNQUFNO0FBQzNELGNBQU0sZUFBZSxTQUFTLEtBQUssR0FBRyxRQUFRLGdCQUFnQjtBQUM5RCxjQUFNLGFBQWEsS0FBSyxHQUFHLGlCQUFpQixxQkFBcUIsRUFBRTtBQUVuRSxjQUFNLFlBQVksWUFBWTtBQUFBLFVBQzVCO0FBQUEsVUFDQTtBQUFBLFVBQ0EsU0FBUyxLQUFLO0FBQUEsUUFDaEIsQ0FBQztBQUVELDRCQUFvQixLQUFLLElBQUksY0FBYyxTQUFTO0FBQUEsTUFDdEQsQ0FBQztBQUVELFdBQUssR0FBRyxpQkFBaUIsaUNBQWlDLENBQUMsVUFBVTtBQUNuRSxjQUFNLEVBQUUsT0FBTyxJQUFJO0FBQ25CLGNBQU0sRUFBRSxNQUFNLElBQUk7QUFFbEIsc0JBQWMsRUFBRSxTQUFTLEtBQUssSUFBSSxNQUFNLENBQUM7QUFBQSxNQUMzQyxDQUFDO0FBRUQsVUFBSSxLQUFLLEdBQUcsUUFBUSxxQkFBcUIsS0FBSztBQUM1QyxzQkFBYztBQUFBLFVBQ1osU0FBUyxLQUFLO0FBQUEsVUFDZCxPQUFPLEtBQUssR0FBRyxRQUFRO0FBQUEsUUFDekIsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLE1BQU0sZ0JBQWdCLENBQUMsRUFBRSxTQUFTLE1BQU0sTUFBTTtBQUM1QyxVQUFNLGFBQWEsUUFBUSxpQkFBaUIscUJBQXFCLEVBQUU7QUFFbkUsUUFBSSxDQUFDLGFBQWEsT0FBTyxVQUFVLEdBQUc7QUFDcEM7QUFBQSxJQUNGO0FBRUEsVUFBTSxtQkFBbUIsU0FBUyxRQUFRLFFBQVEsZ0JBQWdCO0FBRWxFLFdBQU8sRUFBRSxPQUFPLFFBQVEsQ0FBQztBQUV6Qix3QkFBb0IsU0FBUyxrQkFBa0IsS0FBSztBQUFBLEVBQ3REO0FBRUEsTUFBTSxhQUFhLENBQUMsRUFBRSxjQUFjLFFBQVEsTUFBTTtBQUNoRCxRQUFJLGdCQUFnQixHQUFHO0FBQ3JCLGFBQU87QUFBQSxJQUNUO0FBRUEsVUFBTSxZQUFZLGVBQWU7QUFDakMsV0FBTyxFQUFFLE9BQU8sV0FBVyxRQUFRLENBQUM7QUFFcEMsV0FBTztBQUFBLEVBQ1Q7QUFFQSxNQUFNLGNBQWMsQ0FBQyxFQUFFLGNBQWMsWUFBWSxRQUFRLE1BQU07QUFDN0QsUUFBSSxnQkFBZ0IsYUFBYSxHQUFHO0FBQ2xDLGFBQU87QUFBQSxJQUNUO0FBRUEsVUFBTSxZQUFZLGVBQWU7QUFDakMsV0FBTyxFQUFFLE9BQU8sV0FBVyxRQUFRLENBQUM7QUFFcEMsV0FBTztBQUFBLEVBQ1Q7QUFFQSxNQUFNLFNBQVMsQ0FBQyxFQUFFLE9BQU8sUUFBUSxNQUFNO0FBQ3JDLFVBQU0sY0FBYyxRQUFRLGNBQWMsSUFBSSxRQUFRLFlBQVksT0FBTztBQUV6RSx1QkFBbUIsRUFBRSxTQUFTLFVBQVUsTUFBTSxDQUFDO0FBRS9DLGdCQUFZLGVBQWU7QUFBQSxNQUN6QixVQUFVO0FBQUEsTUFDVixPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsSUFDVixDQUFDO0FBQUEsRUFDSDtBQUVBLE1BQU0scUJBQXFCLENBQUMsRUFBRSxTQUFTLFNBQVMsTUFBTTtBQUNwRCxVQUFNLGtCQUFrQixRQUFRLGNBQWMsSUFBSSxRQUFRLGdCQUFnQjtBQUMxRSxVQUFNLGtCQUFrQixRQUFRLGNBQWMsSUFBSSxRQUFRLGNBQWM7QUFFeEUsc0JBQWtCLGlCQUFpQixZQUFZLENBQUM7QUFDaEQsc0JBQWtCLGlCQUFpQixZQUFZLGNBQWMsT0FBTyxJQUFJLENBQUM7QUFBQSxFQUMzRTtBQUVBLE1BQU0sb0JBQW9CLENBQUMsYUFBYSxlQUFlO0FBQ3JELFFBQUksWUFBWTtBQUNkLGtCQUFZLGFBQWEsWUFBWSxFQUFFO0FBQ3ZDO0FBQUEsSUFDRjtBQUNBLGdCQUFZLGdCQUFnQixVQUFVO0FBQUEsRUFDeEM7QUFFQSxNQUFNLGdCQUFnQixDQUFDLFlBQ3JCLFFBQVEsaUJBQWlCLHFCQUFxQixFQUFFO0FBRWxELE1BQU0sc0JBQXNCLENBQUMsU0FBUyxhQUFhLGFBQWE7QUFDOUQsUUFBSSxnQkFBZ0IsVUFBVTtBQUM1QjtBQUFBLElBQ0Y7QUFFQSxZQUFRLGdCQUFnQix5QkFBeUI7QUFDakQsWUFBUSxhQUFhLDJCQUEyQixRQUFRO0FBQUEsRUFDMUQ7QUFFQSxNQUFNLGVBQWUsQ0FBQyxPQUFPLGVBQWU7QUFDMUMsUUFBSSxNQUFNLEtBQUssR0FBRztBQUNoQixhQUFPO0FBQUEsSUFDVDtBQUVBLFFBQUksUUFBUSxLQUFLLFNBQVMsWUFBWTtBQUNwQyxhQUFPO0FBQUEsSUFDVDtBQUVBLFdBQU87QUFBQSxFQUNUO0FBRUEsTUFBTyxtQkFBUTs7O0FDaklmLE1BQU0seUJBQXlCO0FBRS9CLE1BQU0saUJBQWlCO0FBQUEsSUFDckIsVUFBVTtBQUNSLFdBQUssTUFBTTtBQUFBLElBQ2I7QUFBQSxJQUNBLFFBQVE7QUFDTixZQUFNLFVBQVUsS0FBSztBQUNyQixZQUFNLE9BQU8sUUFBUSxRQUFRO0FBQzdCLFlBQU0saUJBQWlCLFNBQVMsUUFBUSxRQUFRLFlBQVksRUFBRTtBQUM5RCxZQUFNLHdCQUF3QixRQUFRO0FBQUEsUUFDcEM7QUFBQSxNQUNGLEVBQUU7QUFDRixZQUFNLGFBQWEsa0JBQWtCO0FBRXJDLFVBQUksU0FBUyxTQUFTO0FBQ3BCLGdCQUFRO0FBQUEsVUFDTjtBQUFBLFVBQ0EsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTTtBQUN4QixxQkFBUztBQUFBLGNBQ1AsV0FBVztBQUFBLGNBQ1g7QUFBQSxjQUNBLGFBQWEsU0FBUyxRQUFRLFFBQVEsVUFBVTtBQUFBLGNBQ2hEO0FBQUEsY0FDQTtBQUFBLFlBQ0YsQ0FBQztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBQ0E7QUFBQSxNQUNGO0FBRUEsd0JBQWtCLEVBQUUsU0FBUyxXQUFXLENBQUM7QUFBQSxJQUMzQztBQUFBLEVBQ0Y7QUFFQSxNQUFNLG9CQUFvQixDQUFDLEVBQUUsU0FBUyxXQUFXLE1BQU07QUFDckQsVUFBTSxFQUFFLFdBQVcsUUFBUSxtQkFBbUIsV0FBVyxJQUFJLFFBQVE7QUFDckUsVUFBTSxjQUFjLFNBQVMsYUFBYSxFQUFFLElBQUksTUFBTSxLQUFLLFVBQVU7QUFFckUsMEJBQXNCO0FBQUEsTUFDcEI7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNMO0FBQUEsUUFDQTtBQUFBLFFBQ0EsU0FBUyxpQkFBaUI7QUFBQSxNQUM1QjtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFFRCxhQUFTO0FBQUEsTUFDUCxXQUFXO0FBQUEsTUFDWDtBQUFBLE1BQ0EsYUFBYSxTQUFTLFVBQVU7QUFBQSxNQUNoQztBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBRUEsTUFBTSx3QkFBd0IsQ0FBQyxhQUFhLFlBQVksc0JBQXNCO0FBQzVFLFFBQUksY0FBYztBQUNoQixhQUFPLE1BQU0sS0FBSyxFQUFFLFFBQVEsV0FBVyxHQUFHLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQztBQUUzRCxVQUFNLE9BQU8sS0FBSyxNQUFNLG9CQUFvQixDQUFDO0FBQzdDLFFBQUksZUFBZSxPQUFPO0FBQ3hCLGFBQU8sQ0FBQyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsRUFBRSxLQUFLLENBQUMsRUFDM0MsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQ2hCLE9BQU8sQ0FBQyxPQUFPLFVBQVUsQ0FBQztBQUMvQixRQUFJLGFBQWEsZUFBZTtBQUM5QixhQUFPLENBQUMsR0FBRyxLQUFLLEVBQUU7QUFBQSxRQUNoQixNQUFNO0FBQUEsVUFDSixFQUFFLFFBQVEsb0JBQW9CLEVBQUU7QUFBQSxVQUNoQyxDQUFDLEdBQUcsTUFBTSxhQUFhLG9CQUFvQixJQUFJO0FBQUEsUUFDakQ7QUFBQSxNQUNGO0FBQ0YsVUFBTSxZQUFZLGNBQWM7QUFDaEMsV0FBTztBQUFBLE1BQ0w7QUFBQSxNQUNBO0FBQUEsTUFDQSxHQUFHLE1BQU0sS0FBSyxFQUFFLFFBQVEsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxZQUFZLENBQUM7QUFBQSxNQUN4RTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLE1BQU0sd0JBQXdCLENBQUMsRUFBRSxTQUFTLE9BQU8sT0FBTyxNQUFNO0FBQzVELFVBQU0sWUFBWSxRQUFRLGNBQWMsSUFBSSxRQUFRLGdCQUFnQjtBQUNwRSxVQUFNLGtCQUFrQixhQUFhO0FBQ3JDLGNBQVUsWUFBWTtBQUV0QixVQUFNLFFBQVEsQ0FBQyxTQUFTO0FBQ3RCLFlBQU0sT0FBTyxTQUFTLGNBQWMsU0FBUyxRQUFRLFNBQVMsR0FBRztBQUNqRSxXQUFLLGNBQWM7QUFDbkIsVUFBSSxTQUFTLE9BQU87QUFDbEIsYUFBSyxZQUFZO0FBQUEsTUFDbkIsT0FBTztBQUNMLGFBQUssWUFDSDtBQUNGLHdCQUFnQixJQUFJLFFBQVEsSUFBSTtBQUNoQyxhQUFLLE9BQU8sSUFBSSxnQkFBZ0IsU0FBUztBQUN6QyxhQUFLLFFBQVEsaUJBQWlCO0FBQUEsTUFDaEM7QUFDQSxnQkFBVSxZQUFZLElBQUk7QUFBQSxJQUM1QixDQUFDO0FBQUEsRUFDSDtBQUVBLE1BQU0sV0FBVyxDQUFDO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0EsT0FBTztBQUFBLElBQ1A7QUFBQSxJQUNBO0FBQUEsRUFDRixNQUFNO0FBQ0osVUFBTSxPQUFPLFFBQVEsS0FBSyxTQUFTLElBQUksU0FBUyxTQUFTLElBQUk7QUFDN0QsV0FDSSxlQUFlLEVBQUUsU0FBUyxNQUFNLFFBQVEsWUFBWSxLQUFLLENBQUMsSUFDMUQsbUJBQW1CLEVBQUUsV0FBVyxTQUFTLGFBQWEsWUFBWSxLQUFLLENBQUM7QUFBQSxFQUM5RTtBQUVBLE1BQU0scUJBQXFCLENBQUM7QUFBQSxJQUMxQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGLE1BQU07QUFDSixVQUFNLE9BQU8sY0FBYyxTQUFTLGNBQWMsSUFBSSxjQUFjO0FBRXBFLFFBQUksWUFBWSxNQUFNLFVBQVUsR0FBRztBQUNqQyxxQkFBZSxFQUFFLFNBQVMsTUFBTSxZQUFZLEtBQUssQ0FBQztBQUFBLElBQ3BEO0FBQUEsRUFDRjtBQUVBLE1BQU0saUJBQWlCLENBQUMsRUFBRSxTQUFTLE1BQU0sUUFBUSxZQUFZLEtBQUssTUFBTTtBQUN0RSxVQUFNLGdCQUFnQixRQUFRO0FBQUEsTUFDNUIsMEJBQTBCO0FBQUEsSUFDNUI7QUFFQSxRQUFJLENBQUM7QUFBZTtBQUVwQixxQkFBaUIsU0FBUyxlQUFlLElBQUk7QUFDN0Msb0JBQWdCLEVBQUUsU0FBUyxTQUFTLE1BQU0sUUFBUSxZQUFZLEtBQUssQ0FBQztBQUFBLEVBQ3RFO0FBRUEsTUFBTSxtQkFBbUIsQ0FBQyxTQUFTLGVBQWUsU0FBUztBQUN6RCxVQUFNLHNCQUFzQixRQUFRLGNBQWMsb0JBQW9CO0FBQ3RFLCtEQUFxQixhQUFhLGVBQWU7QUFDakQsK0RBQXFCLGFBQWEsaUJBQWlCO0FBRW5ELFlBQVEsYUFBYSxvQkFBb0IsSUFBSTtBQUM3QyxrQkFBYyxhQUFhLGVBQWUsTUFBTTtBQUNoRCxrQkFBYyxhQUFhLGlCQUFpQixNQUFNO0FBQUEsRUFDcEQ7QUFFQSxNQUFNLGtCQUFrQixDQUFDLEVBQUUsU0FBUyxTQUFTLFFBQVEsWUFBWSxLQUFLLE1BQU07QUFDMUUsS0FBQyxRQUFRLE1BQU0sRUFBRSxRQUFRLENBQUMsY0FBYztBQUN0QyxZQUFNLFFBQVEsUUFBUTtBQUFBLFFBQ3BCLEdBQUcseUJBQXlCLFFBQVEsTUFBTTtBQUFBLE1BQzVDO0FBQ0EsVUFBSSxDQUFDO0FBQU87QUFFWixZQUFNLE9BQU8sY0FBYyxTQUFTLFVBQVUsSUFBSSxVQUFVO0FBRTVELGtCQUFZLE1BQU0sVUFBVSxJQUN4QixtQkFBbUIsT0FBTyxNQUFNLFFBQVEsSUFBSSxJQUM1QyxpQkFBaUIsT0FBTyxJQUFJO0FBQUEsSUFDbEMsQ0FBQztBQUFBLEVBQ0g7QUFFQSxNQUFNLHFCQUFxQixDQUFDLE1BQU0sTUFBTSxRQUFRLE9BQU8sWUFBWTtBQUNqRSxRQUFJLFNBQVMsU0FBUztBQUNwQixXQUFLLGdCQUFnQixVQUFVO0FBQy9CO0FBQUEsSUFDRjtBQUVBLFVBQU0sa0JBQWtCLGFBQWE7QUFDckMsb0JBQWdCLElBQUksUUFBUSxJQUFJO0FBQ2hDLFNBQUssT0FBTyxJQUFJLGdCQUFnQixTQUFTO0FBQ3pDLFNBQUssZ0JBQWdCLFNBQVM7QUFDOUIsU0FBSyxnQkFBZ0IsZUFBZTtBQUFBLEVBQ3RDO0FBRUEsTUFBTSxtQkFBbUIsQ0FBQyxNQUFNLE9BQU8sWUFBWTtBQUNqRCxRQUFJLFNBQVMsU0FBUztBQUNwQixXQUFLLGFBQWEsWUFBWSxFQUFFO0FBQ2hDO0FBQUEsSUFDRjtBQUVBLFNBQUssZ0JBQWdCLE1BQU07QUFDM0IsU0FBSyxhQUFhLFdBQVcsZUFBZTtBQUM1QyxTQUFLLGFBQWEsaUJBQWlCLE1BQU07QUFBQSxFQUMzQztBQUVBLE1BQU0sY0FBYyxDQUFDLE1BQU0sZUFBZSxPQUFPLEtBQUssUUFBUTtBQUU5RCxNQUFNLGVBQWUsTUFBTSxJQUFJLElBQUksT0FBTyxTQUFTLElBQUksRUFBRTtBQUV6RCxNQUFPLHFCQUFROzs7QUNyTWYsTUFBTSxVQUFVO0FBQUEsSUFDZCxVQUFVO0FBQ1IsWUFBTSxVQUFVLEtBQUs7QUFDckIsWUFBTSxVQUFVLFFBQVEsY0FBYyxrQkFBa0I7QUFFekQsWUFBTSxrQkFBa0IsTUFBTSxtQ0FBUyxRQUFRO0FBQzlDLFVBQUksZUFBZTtBQUNuQixVQUFJLFdBQVc7QUFDZixVQUFJLGdCQUFnQjtBQUVwQixZQUFNLGtCQUFrQjtBQUFBLFFBQ3RCLEtBQUs7QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLE9BQU87QUFBQSxRQUNQLEtBQUs7QUFBQSxNQUNQO0FBRUEsWUFBTSx1QkFBdUIsTUFBTTtBQUNqQyxlQUFPLE9BQU8sZUFBZSxFQUFFLFFBQVEsU0FBTztBQUM1QyxjQUFJLE1BQU0sR0FBRyxFQUFFLFFBQVEsT0FBSztBQUFDLGdCQUFJO0FBQUcsc0JBQVEsVUFBVSxPQUFPLENBQUM7QUFBQSxVQUFDLENBQUM7QUFBQSxRQUNsRSxDQUFDO0FBQUEsTUFDSDtBQUVBLFlBQU0sZ0JBQWdCLENBQUMsYUFBYTtBQUNsQyw2QkFBcUI7QUFDckIsd0JBQWdCLFFBQVEsRUFBRSxNQUFNLEdBQUcsRUFBRSxRQUFRLE9BQUs7QUFDaEQsY0FBSTtBQUFHLG9CQUFRLFVBQVUsSUFBSSxDQUFDO0FBQUEsUUFDaEMsQ0FBQztBQUFBLE1BQ0g7QUFFQSxZQUFNLHdCQUF3QixNQUFNO0FBQ2xDLGNBQU0sY0FBYyxRQUFRLHNCQUFzQjtBQUNsRCxjQUFNLGFBQWEsUUFBUSxzQkFBc0I7QUFDakQsY0FBTSxXQUFXO0FBQUEsVUFDZixPQUFPLE9BQU87QUFBQSxVQUNkLFFBQVEsT0FBTztBQUFBLFFBQ2pCO0FBRUEsY0FBTSxRQUFRO0FBQUEsVUFDWixLQUFLLFdBQVc7QUFBQSxVQUNoQixRQUFRLFNBQVMsU0FBUyxXQUFXO0FBQUEsVUFDckMsT0FBTyxXQUFXO0FBQUEsVUFDbEIsS0FBSyxTQUFTLFFBQVEsV0FBVztBQUFBLFFBQ25DO0FBRUEsY0FBTSxPQUFPO0FBQUEsVUFDWCxLQUFLLFlBQVksVUFBVSxNQUFNO0FBQUEsVUFDakMsUUFBUSxZQUFZLFVBQVUsTUFBTTtBQUFBLFVBQ3BDLE9BQU8sWUFBWSxTQUFTLE1BQU07QUFBQSxVQUNsQyxLQUFLLFlBQVksU0FBUyxNQUFNO0FBQUEsUUFDbEM7QUFFQSxZQUFJLEtBQUssZ0JBQWdCLENBQUM7QUFBRyxpQkFBTyxnQkFBZ0I7QUFHcEQsY0FBTSxTQUFTLE9BQU8sUUFBUSxLQUFLLEVBQ2hDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUMzQixLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRTdCLGVBQU8sT0FBTyxTQUFTLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGdCQUFnQjtBQUFBLE1BQzVEO0FBRUEsWUFBTSxnQkFBZ0IsTUFBTTtBQUMxQixZQUFJO0FBQVUsbUJBQVMsV0FBVztBQUVsQyxtQkFBVyxJQUFJLHFCQUFxQixhQUFXO0FBQzdDLG1CQUFTLFNBQVMsU0FBUztBQUN6QixnQkFBSSxDQUFDLE1BQU0sZ0JBQWdCO0FBQ3pCLG9CQUFNLE9BQU8sc0JBQXNCO0FBQ25DLDRCQUFjLElBQUk7QUFDbEIsNkJBQWU7QUFBQSxZQUNqQixXQUFXLENBQUMsY0FBYztBQUN4Qiw0QkFBYyxnQkFBZ0IsQ0FBQztBQUFBLFlBQ2pDO0FBQUEsVUFDRjtBQUFBLFFBQ0YsR0FBRztBQUFBLFVBQ0QsTUFBTTtBQUFBLFVBQ04sV0FBVztBQUFBLFFBQ2IsQ0FBQztBQUVELGlCQUFTLFFBQVEsT0FBTztBQUFBLE1BQzFCO0FBRUEsWUFBTSxlQUFlLE1BQU07QUFDekIsdUJBQWU7QUFDZixZQUFJO0FBQVUsbUJBQVMsV0FBVztBQUNsQyxZQUFJO0FBQWUsdUJBQWEsYUFBYTtBQUU3Qyx3QkFBZ0IsV0FBVyxNQUFNO0FBQy9CLHdCQUFjLGdCQUFnQixDQUFDO0FBQy9CLHdCQUFjO0FBQUEsUUFDaEIsR0FBRyxHQUFHO0FBQUEsTUFDUjtBQUVBLGFBQU8saUJBQWlCLFVBQVUsWUFBWTtBQUU5QyxjQUFRLHVCQUF1QixNQUFNO0FBQ25DLFlBQUk7QUFBVSxtQkFBUyxXQUFXO0FBQ2xDLFlBQUk7QUFBZSx1QkFBYSxhQUFhO0FBQzdDLGVBQU8sb0JBQW9CLFVBQVUsWUFBWTtBQUFBLE1BQ25EO0FBRUEsb0JBQWMsZ0JBQWdCLENBQUM7QUFDL0Isb0JBQWM7QUFBQSxJQUNoQjtBQUFBLElBRUEsWUFBWTtBQTFHZDtBQTJHSSx1QkFBSyxJQUFHLHlCQUFSO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxNQUFPLGtCQUFROzs7QUNsR2YsTUFBTyxnQkFBUTtBQUFBLElBQ2I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7OztBQ3JCQSxNQUFPQyxpQkFBUTtBQUFBLElBQ2IsaUJBQWlCO0FBQUEsS0FDZDs7O0FDUEwsV0FBUyxpQkFBaUI7QUFDeEIsVUFBTSxTQUFTLFNBQVMsaUJBQWlCLGNBQWM7QUFDdkQsVUFBTSxnQkFBZ0IsT0FBTyxpQkFBaUIsU0FBUyxJQUFJO0FBRTNELFdBQU8sUUFBUSxDQUFDLFVBQVU7QUFDeEIsWUFBTSxZQUFZLE1BQU0sYUFBYSxZQUFZO0FBQ2pELFVBQUksQ0FBQztBQUFXO0FBQ2hCLFlBQU0sYUFBYSxVQUFVLE1BQU0sR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO0FBRTNELFlBQU0sZ0JBQWdCLENBQUMsTUFBTTtBQUMzQixjQUFNLFFBQVEsY0FBYyxpQkFBaUIsQ0FBQztBQUM5QyxlQUFPO0FBQUEsTUFDVDtBQUVBLFVBQUksYUFBYSxXQUFXLElBQUksYUFBYSxFQUFFLEtBQUssR0FBRztBQUN2RCxVQUNFLFVBQVUsU0FBUyxjQUFjLEtBQ2pDLFVBQVUsU0FBUyxpQkFBaUIsR0FDcEM7QUFDQSxjQUFNLFFBQVEsV0FBVyxNQUFNLEdBQUc7QUFDbEMscUJBQ0UsR0FBRyxNQUFNLENBQUMsS0FBSyxNQUFNLENBQUMsS0FBSyxNQUFNLENBQUMsT0FDakMsTUFBTSxTQUFTLElBQUksSUFBSSxNQUFNLE1BQU0sQ0FBQyxFQUFFLEtBQUssR0FBRyxNQUFNO0FBQUEsTUFDekQ7QUFDQSxVQUFJLFVBQVUsU0FBUyxrQkFBa0IsR0FBRztBQUMxQyxjQUFNLFFBQVEsV0FBVyxNQUFNLEdBQUc7QUFDbEMscUJBQWEsR0FBRyxNQUFNLE1BQU0sR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssTUFDNUMsTUFBTSxHQUFHLENBQUMsRUFDVixLQUFLLEdBQUc7QUFBQSxFQUFPLE1BQU0sTUFBTSxHQUFHLEVBQUUsRUFBRSxLQUFLLEdBQUcsS0FBSyxNQUMvQyxNQUFNLEVBQUUsRUFDUixLQUFLLEdBQUc7QUFDWCxjQUFNLE1BQU0sYUFBYTtBQUFBLE1BQzNCO0FBQ0EsWUFBTSxjQUFjO0FBQUEsSUFDdEIsQ0FBQztBQUFBLEVBQ0g7QUFFQSxNQUFPLHlCQUFROzs7QUM1QmYsR0FBQyxXQUFZO0FBRVgsV0FBTyxZQUFZLEVBQUUsT0FBQUMsZUFBTTtBQUMzQixhQUFTLGdCQUFnQixNQUFNO0FBRS9CLFdBQU8saUJBQWlCLHlCQUF5QixDQUFDLFVBQVU7QUFDMUQsWUFBTTtBQUFBLFFBQ0osUUFBUSxFQUFFLEdBQUc7QUFBQSxNQUNmLElBQUk7QUFFSixVQUFJLEdBQUcsU0FBUyxTQUFTLEdBQUc7QUFDMUIsK0JBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0YsQ0FBQztBQUVELFdBQU8saUJBQWlCLGNBQWMsQ0FBQyxFQUFFLE9BQU8sTUFBTTtBQUNwRCxZQUFNLEVBQUUsU0FBUyxHQUFHLElBQUk7QUFFeEIsVUFBSSxHQUFHLFNBQVMsWUFBWSxHQUFHO0FBQzdCLHFCQUFhLFFBQVEsY0FBYyxNQUFNO0FBQ3pDLGlCQUFTLFNBQVM7QUFDbEIsaUJBQVMsS0FBSyxVQUFVLE9BQU8sYUFBYTtBQUM1QyxpQkFBUyxLQUFLLFVBQVUsT0FBTyxzQkFBc0I7QUFDckQsaUJBQVMsS0FBSyxVQUFVLElBQUksWUFBWTtBQUN4QyxpQkFBUyxLQUFLLFVBQVUsSUFBSSxNQUFNO0FBQ2xDLGlCQUFTLEtBQUssVUFBVSxJQUFJLHFCQUFxQjtBQUFBLE1BQ25ELE9BQU87QUFDTCxxQkFBYSxRQUFRLGNBQWMsT0FBTztBQUMxQyxpQkFBUyxTQUFTO0FBQ2xCLGlCQUFTLEtBQUssVUFBVSxPQUFPLFlBQVk7QUFDM0MsaUJBQVMsS0FBSyxVQUFVLE9BQU8scUJBQXFCO0FBQ3BELGlCQUFTLEtBQUssVUFBVSxPQUFPLE1BQU07QUFDckMsaUJBQVMsS0FBSyxVQUFVLElBQUksYUFBYTtBQUN6QyxpQkFBUyxLQUFLLFVBQVUsSUFBSSxzQkFBc0I7QUFBQSxNQUNwRDtBQUVBLFVBQUksR0FBRyxTQUFTLFNBQVMsR0FBRztBQUMxQiwrQkFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxHQUFHOyIsCiAgIm5hbWVzIjogWyJUSU1JTkdfQU5JTUFUSU9OX0VBU0VfRU1QSEFTSVpFRCIsICJUSU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQiLCAiaG9va3NfZGVmYXVsdCIsICJob29rc19kZWZhdWx0Il0KfQo=
