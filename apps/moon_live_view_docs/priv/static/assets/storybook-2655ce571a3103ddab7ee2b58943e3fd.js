(() => {
  var __defProp = Object.defineProperty;
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

  // ../../moon-live/assets/js/hooks/bottomsheet.js
  var BottomsheetHook = {
    mounted() {
      this.setup();
    },
    setup() {
      const dialog = this.el;
      const handle = dialog.querySelector(".moon-bottom-sheet-handle");
      const dialogBox = this.dialogBox();
      let startY = 0;
      let deltaY;
      let startHeight = 0;
      let currentY = 0;
      const threshold = 200;
      const minHeight = 200;
      const maxHeight = window.innerHeight * 0.8;
      let isDragging = false;
      dialogBox.style.scale = "1";
      dialogBox.style.maxHeight = "80vh";
      const onDragStart = (e) => {
        isDragging = true;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        startHeight = dialogBox.offsetHeight;
        dialogBox.style.transition = "none";
        deltaY = 0;
      };
      const onDragMove = (e) => {
        if (!isDragging)
          return;
        currentY = e.touches ? e.touches[0].clientY : e.clientY;
        deltaY = startY - currentY;
        const newHeight = Math.min(
          maxHeight,
          Math.max(minHeight, startHeight + deltaY)
        );
        dialogBox.style.height = `${newHeight}px`;
      };
      const onDragEnd = () => {
        if (!isDragging)
          return;
        isDragging = false;
        const currentHeight = dialogBox.offsetHeight;
        dialogBox.style.transition = "";
        if (deltaY < -threshold) {
          this.close();
          return;
        }
        if (deltaY > threshold) {
          dialogBox.style.height = `${maxHeight}px`;
          return;
        }
        const snapPoints = {
          min: minHeight,
          mid: window.innerHeight * 0.5,
          max: maxHeight
        };
        const closestSnap = Object.entries(snapPoints).reduce(
          (prev, curr) => Math.abs(curr[1] - currentHeight) < Math.abs(prev[1] - currentHeight) ? curr : prev
        );
        dialogBox.style.height = `${closestSnap[1]}px`;
      };
      if (handle) {
        handle.addEventListener("touchstart", onDragStart);
        handle.addEventListener("mousedown", onDragStart);
      }
      dialog.addEventListener("touchmove", onDragMove);
      dialog.addEventListener("mousemove", onDragMove);
      dialog.addEventListener("touchend", onDragEnd);
      dialog.addEventListener("mouseup", onDragEnd);
      dialog.addEventListener("moon:bottomsheet:open", () => {
        this.open();
      });
      dialog.addEventListener("moon:bottomsheet:close", () => {
        this.close();
      });
    },
    open() {
      const dialogBox = this.dialogBox();
      this.el.showModal();
      dialogBox.style.height = `${window.innerHeight * 0.5}px`;
    },
    close() {
      const dialogBox = this.dialogBox();
      dialogBox.style.height = "";
      this.el.close();
    },
    dialogBox() {
      return this.el.querySelector(".moon-bottom-sheet-box");
    }
  };
  var bottomsheet_default = BottomsheetHook;

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

  // ../../moon-live/assets/js/hooks/checkbox.js
  var setIndeterminateState = (el) => {
    el.indeterminate = el.dataset.indeterminate !== void 0;
  };
  var CheckboxHook = {
    mounted() {
      setIndeterminateState(this.el);
    },
    updated() {
      setIndeterminateState(this.el);
    }
  };
  var checkbox_default = CheckboxHook;

  // ../../moon-live/assets/js/hooks/dialog.js
  var DialogHook = {
    mounted() {
      this.setup();
    },
    setup() {
      const dialog = this.el;
      dialog.addEventListener("moon:dialog:open", () => {
        this.open();
      });
      dialog.addEventListener("moon:dialog:close", () => {
        this.close();
      });
    },
    open() {
      this.el.showModal();
    },
    close() {
      this.el.close();
    },
    dialogBox() {
      return this.el.querySelector(".modal-box");
    }
  };
  var dialog_default = DialogHook;

  // ../../moon-live/assets/js/hooks/drawer.js
  var DrawerHook = {
    mounted() {
      this.setup();
    },
    setup() {
      const dialog = this.el;
      dialog.addEventListener("moon:drawer:open", () => {
        this.open();
      });
      dialog.addEventListener("moon:drawer:close", () => {
        this.close();
      });
    },
    open() {
      this.el.showModal();
    },
    close() {
      this.el.close();
    },
    dialogBox() {
      return this.el.querySelector(".modal-box");
    }
  };
  var drawer_default = DrawerHook;

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

  // ../../moon-live/assets/js/hooks/popover.js
  var POPOVER_ANIMATION_DURATION = 200;
  var TIMING_ANIMATION_EASE_STANDARD = "cubic-bezier(0.2, 0, 0.38, 0.9)";
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
      easing: TIMING_ANIMATION_EASE_STANDARD
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
      easing: TIMING_ANIMATION_EASE_STANDARD
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

  // ../../moon-live/assets/js/hooks/snackbarV2.js
  var SnackbarHook = {
    mounted() {
    },
    setup() {
      setTimeout(() => {
        this.el.classList.add("fade-out");
        setTimeout(() => this.el.remove(), 300);
      }, 4e3);
    }
  };
  var snackbarV2_default = SnackbarHook;

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
    Accordion: accordion_default,
    Authenticator: authenticator_default,
    BottomsheetHook: bottomsheet_default,
    CarouselHook: carousel_default,
    CheckboxHook: checkbox_default,
    DialogHook: dialog_default,
    DrawerHook: drawer_default,
    FileInput: file_input_default,
    MoonDropdown: dropdown_default,
    PaginationHook: pagination_default,
    Popover: popover_default,
    ResponsiveScreen: responsive_screen_default,
    SnackbarHook: snackbarV2_default,
    Tooltip: tooltip_default
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL2pzL2hvb2tzL0NvZGVQcmV2aWV3LmpzIiwgIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvYWNjb3JkaW9uLmpzIiwgIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvYXV0aGVudGljYXRvci5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL2JvdHRvbXNoZWV0LmpzIiwgIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvY2Fyb3VzZWwuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9jaGVja2JveC5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL2RpYWxvZy5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL2RyYXdlci5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL2ZpbGVfaW5wdXQuanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9kcm9wZG93bi5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL3BhZ2luYXRpb24uanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9wb3BvdmVyLmpzIiwgIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvcmVzcG9uc2l2ZV9zY3JlZW4uanMiLCAiLi4vLi4vLi4vLi4vbW9vbi1saXZlL2Fzc2V0cy9qcy9ob29rcy9zbmFja2JhclYyLmpzIiwgIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvdG9vbHRpcC5qcyIsICIuLi8uLi8uLi8uLi9tb29uLWxpdmUvYXNzZXRzL2pzL2hvb2tzL2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9ob29rcy9pbmRleC5qcyIsICIuLi8uLi8uLi9hc3NldHMvanMvcG9wdWxhdGVUb2tlbnMuanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL3N0b3J5Ym9vay5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgQ29kZVByZXZpZXcgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gQ2FjaGUgRE9NIGVsZW1lbnRzXG4gICAgdGhpcy5idXR0b24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1jb2RlLXByZXZpZXctYnV0dG9uXVwiKTtcbiAgICB0aGlzLndyYXBwZXIgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1jb2RlLXByZXZpZXctd3JhcHBlcl1cIik7XG4gICAgdGhpcy50b2dnbGVTcGFuID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiI3RvZ2dsZVNwYW5cIik7XG4gICAgdGhpcy5idXR0b25XcmFwcGVyID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCJbZGF0YS1jb2RlLXByZXZpZXctYnV0dG9uLXdyYXBwZXJdXCJcbiAgICApO1xuXG4gICAgaWYgKCF0aGlzLmhpZGVCdXR0b24oKSkge1xuICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIGZvciB0b2dnbGluZyBvcGVuL2Nsb3NlXG4gICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGUoKSk7XG4gICAgfVxuICB9LFxuICB0b2dnbGUoKSB7XG4gICAgLy8gVG9nZ2xlIGJldHdlZW4gb3BlbiBhbmQgY2xvc2Ugc3RhdGVzXG4gICAgaWYgKHRoaXMud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoXCJtYXgtaC05NlwiKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH0sXG4gIG9wZW4oKSB7XG4gICAgLy8gQmF0Y2ggY2xhc3MgY2hhbmdlcyBmb3Igb3BlbiBzdGF0ZVxuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwibWF4LWgtOTZcIiwgXCJvdmVyZmxvdy1hdXRvXCIpO1xuICAgIHRoaXMud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKFwibWF4LWgtc3BhY2UtMTI4XCIpO1xuICAgIHRoaXMuYnV0dG9uV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiaC1zcGFjZS00MFwiLCBcIlsmX3N2Z106cm90YXRlLTE4MFwiKTtcbiAgICB0aGlzLnRvZ2dsZVNwYW4udGV4dENvbnRlbnQgPSBcIkNvbGxhcHNlXCI7XG4gIH0sXG4gIGNsb3NlKCkge1xuICAgIC8vIEJhdGNoIGNsYXNzIGNoYW5nZXMgZm9yIGNsb3NlIHN0YXRlXG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJtYXgtaC05NlwiLCBcIm92ZXJmbG93LWF1dG9cIik7XG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJtYXgtaC1zcGFjZS0xMjhcIik7XG4gICAgdGhpcy5idXR0b25XcmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJoLXNwYWNlLTQwXCIsIFwiWyZfc3ZnXTpyb3RhdGUtMTgwXCIpO1xuICAgIHRoaXMudG9nZ2xlU3Bhbi50ZXh0Q29udGVudCA9IFwiRXhwYW5kXCI7XG4gIH0sXG4gIGhpZGVCdXR0b24oKSB7XG4gICAgLy8gSGlkZSBidXR0b24gaWYgd3JhcHBlciBoZWlnaHQgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIE1JTl9IRUlHSFRcbiAgICBjb25zdCBNSU5fSEVJR0hUID0gOTA7XG4gICAgaWYgKHRoaXMud3JhcHBlci5jbGllbnRIZWlnaHQgPD0gTUlOX0hFSUdIVCkge1xuICAgICAgdGhpcy5idXR0b25XcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb2RlUHJldmlldztcbiIsICIvKipcbiAqIEFjY29yZGlvbiBDb21wb25lbnRcbiAqXG4gKiBIb29rcyBmb3IgdGhlIEFjY29yZGlvbiBDb21wb25lbnRcbiAqICovXG5cbi8vIERlZmluZSB0aGUgQWNjb3JkaW9uIEFuaW1hdGlvbiBkdXJhdGlvbiwgZGVzY3JpYmVkIGFzIHRoZSB0aW1lIGl0IHRha2VzIHRvIG9wZW4gb3IgY2xvc2UgMXB4XG5jb25zdCBUUkFOU0lUSU9OX0RVUkFUSU9OID0gMzAwO1xuXG4vLyBEZWZpbmUgdGhlIEFjY29yZGlvbiBBbmltYXRpb24gZWFzaW5nLCBkZXNjcmliZWQgYXMgdGhlIGN1YmljLWJlemllciBmb3IgdGhlIGFuaW1hdGlvblxuY29uc3QgVElNSU5HX0FOSU1BVElPTl9FQVNFX0VNUEhBU0laRUQgPSBcImN1YmljLWJlemllcigwLjQsIDAuMTQsIDAuMywgMSlcIjtcblxuLy8gRGVmaW5lIHRoZSBBY2NvcmRpb24gQW5pbWF0aW9uIE9wZW5pbmcgYW5kIENsb3NpbmdcbmNvbnN0IEFDQ09SRElPTl9PUEVOSU5HID0ge1xuICBjb250YWluZXI6IHtcbiAgICBrZXlmcmFtZXMocHgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlaWdodDogW1wiMHB4XCIsIGAke3B4fXB4YF0sXG4gICAgICB9O1xuICAgIH0sXG4gICAgb3B0cyhweCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZHVyYXRpb246IFRSQU5TSVRJT05fRFVSQVRJT04sXG4gICAgICAgIGVhc2luZzogVElNSU5HX0FOSU1BVElPTl9FQVNFX0VNUEhBU0laRUQsXG4gICAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIGNvbnRlbnQ6IHtcbiAgICBrZXlmcmFtZXM6IHtcbiAgICAgIG9wYWNpdHk6IFswLCAxXSxcbiAgICAgIGZpbHRlcjogW1wiYmx1cigxcHgpXCIsIFwiYmx1cigwcHgpXCJdLFxuICAgIH0sXG4gICAgb3B0cyhfcHgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGR1cmF0aW9uOiBUUkFOU0lUSU9OX0RVUkFUSU9OLFxuICAgICAgICBlYXNpbmc6IFRJTUlOR19BTklNQVRJT05fRUFTRV9FTVBIQVNJWkVELFxuICAgICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgQUNDT1JESU9OX0NMT1NJTkcgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIGtleWZyYW1lcyhweCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVpZ2h0OiBbYCR7cHh9cHhgLCBcIjBweFwiXSxcbiAgICAgIH07XG4gICAgfSxcbiAgICBvcHRzKHB4KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkdXJhdGlvbjogVFJBTlNJVElPTl9EVVJBVElPTixcbiAgICAgICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfRU1QSEFTSVpFRCxcbiAgICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgY29udGVudDoge1xuICAgIGtleWZyYW1lczoge1xuICAgICAgb3BhY2l0eTogWzEsIDBdLFxuICAgICAgZmlsdGVyOiBbXCJibHVyKDBweClcIiwgXCJibHVyKDFweClcIl0sXG4gICAgfSxcbiAgICBvcHRzKHB4KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkdXJhdGlvbjogVFJBTlNJVElPTl9EVVJBVElPTixcbiAgICAgICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfRU1QSEFTSVpFRCxcbiAgICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbn07XG5cbi8vIE1haW4gQWNjb3JkaW9uIEhvb2tcbmNvbnN0IEFjY29yZGlvbiA9IHtcbiAgLyoqXG4gICAqIE1vdW50aW5nIEhvb2tcbiAgICovXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gVGhpcyB2YXIga2VlcCB0cmFjayBvZiB0aGUgY3VycmVudGx5IG9wZW4gaXRlbXNcbiAgICB0aGlzLmN1cnJlbnRseU9wZW4gPSBuZXcgU2V0KCk7XG5cbiAgICAvLyBUaGlzIHZhciBrZWVwIHRyYWNrIG9mIHRoZSBpdGVtc1xuICAgIHRoaXMuaXRlbXMgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyBDdXJyZW50IG1vZGUgb2YgdGhlIEFjY29yZGlvblxuICAgIHRoaXMubW9kZSA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIpIHx8IFwic2luZ2xlXCI7XG5cbiAgICAvLyBTY2FuIGZvciBBY2NvcmRpb24gSXRlbXNcbiAgICB0aGlzLnNjYW5Gb3JJdGVtcygpO1xuICB9LFxuICAvKipcbiAgICogVXBkYXRlZCBIb29rXG4gICAqL1xuICB1cGRhdGVkKCkge1xuICAgIHRoaXMuc2NhbkZvckl0ZW1zKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBEZXN0cm95ZWQgSG9va1xuICAgKi9cbiAgZGVzdHJveWVkKCkge1xuICAgIGlmICh0aGlzLml0ZW1zICYmIHRoaXMuaXRlbXMuc2l6ZSA+IDApIHtcbiAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoIWl0ZW0gfHwgIWl0ZW0uaWQgfHwgIWl0ZW0uZnVuY1RvZ2dsZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGlkLCBmdW5jVG9nZ2xlIH0gPSBpdGVtO1xuICAgICAgICBjb25zdCBpdGVtVG9SZW1vdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cbiAgICAgICAgaWYgKGl0ZW1Ub1JlbW92ZSkge1xuICAgICAgICAgIGl0ZW1Ub1JlbW92ZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY1RvZ2dsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5pdGVtcy5jbGVhcigpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFNjYW4gZm9yIEFjY29yZGlvbiBJdGVtcywgdGhpcyBpcyBjYWxsZWQgb24gbW91bnRlZCBhbmQgdXBkYXRlZFxuICAgKlxuICAgKi9cbiAgc2NhbkZvckl0ZW1zKCkge1xuICAgIC8vIFJlbW92ZSBwcmV2aW91cyBob29rc1xuICAgIGlmICh0aGlzLml0ZW1zICYmIHRoaXMuaXRlbXMuc2l6ZSA+IDApIHtcbiAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoIWl0ZW0gfHwgIWl0ZW0uaWQgfHwgIWl0ZW0uZnVuY1RvZ2dsZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGlkLCBmdW5jVG9nZ2xlIH0gPSBpdGVtO1xuICAgICAgICBjb25zdCBpdGVtUGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICBpZiAoaXRlbVBhcmVudCkge1xuICAgICAgICAgIGNvbnN0IGl0ZW1Ub1JlbW92ZSA9IGl0ZW1QYXJlbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIFwiW21kcy1hY2NvcmRpb24taGVhZGVyXVwiXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGl0ZW1Ub1JlbW92ZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY1RvZ2dsZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5pdGVtcy5jbGVhcigpO1xuICAgIH1cbiAgICBjb25zdCBuZXdJdGVtcyA9IG5ldyBTZXQoKTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbWRzLWFjY29yZGlvbi1pdGVtXVwiKSkge1xuICAgICAgaWYgKGkgPiAxMDAwMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGkgKz0gMTtcbiAgICAgIGNvbnN0IGlkID0gaXRlbS5nZXRBdHRyaWJ1dGUoXCJtZHMtYWNjb3JkaW9uLWl0ZW1cIik7XG5cbiAgICAgIC8vIEFkZCB0aGUgaXRlbXMgZGVzaWduYXRlZCB0byBiZSBvcGVuZWQgYXQgc3RhcnR1cCB0byB0aGUgY3VycmVudGx5IG9wZW5lZCBpdGVtcyBsaXN0LlxuICAgICAgaWYgKGl0ZW0uZ2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgLy8gSW4gbXVsdGktc2VsZWN0IG1vZGUsIGFwcGVuZCBuZXcgZWxlbWVudHMgdG8gY3VycmVudGx5T3BlbiB0aGF0IGFyZSBvcGVuZWQgYXMgZGVmYXVsdC5cbiAgICAgICAgLy8gSW4gc2luZ2xlLXNlbGVjdCBtb2RlLCBvbmx5IHRoZSBmaXJzdCBlbGVtZW50IGlzIGFsbG93ZWQgdG8gYmUgb3BlbiBvbiBzdGFydHVwIChzdWJzZXF1ZW50IG9wZW5zIGFyZSBhZGRlZCBhbmQgY2xvc2VkIHRvIGF2b2lkIGluY29uc2lzdGVuY2VzKS5cbiAgICAgICAgdGhpcy5jdXJyZW50bHlPcGVuLmFkZChpZCk7XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PSBcInNpbmdsZVwiICYmIHRoaXMuY3VycmVudGx5T3Blbi5zaXplID4gMSkge1xuICAgICAgICAgIHRoaXMuY2xvc2UoaWQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9iaiA9IHsgaWQsIGZ1bmNUb2dnbGU6ICgpID0+IHRoaXMudG9nZ2xlKGlkKSB9O1xuICAgICAgaWYgKCFuZXdJdGVtcy5oYXMob2JqKSkge1xuICAgICAgICBuZXdJdGVtcy5hZGQob2JqKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLml0ZW1zID0gbmV3SXRlbXM7XG4gICAgdGhpcy5zZXR1cCgpO1xuICB9LFxuICAvKipcbiAgICogU2V0dXAgdGhlIEFjY29yZGlvbiBJdGVtcyBjbGljayBldmVudHNcbiAgICpcbiAgICovXG4gIHNldHVwKCkge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoeyBpZCwgZnVuY1RvZ2dsZSB9KSA9PiB7XG4gICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKCFpdGVtKSByZXR1cm47XG4gICAgICBjb25zdCBoZWFkZXIgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWFjY29yZGlvbi1oZWFkZXJdXCIpO1xuICAgICAgaWYgKGhlYWRlcikge1xuICAgICAgICBoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmNUb2dnbGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRXh0ZW5kIHRoZSBBY2NvcmRpb24gSXRlbSB3aXRoIHRoZSBvcGVuIGFuZCBjbG9zZSBldmVudHNcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZHM6OmFjY29yZGlvbjpvcGVuXCIsIChlKSA9PiB7XG4gICAgICBjb25zdCBpbmRleFRvT3BlbiA9IGUuZGV0YWlsLmluZGV4O1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMudXRpbHMuc2V0QXQodGhpcy5pdGVtcywgaW5kZXhUb09wZW4pO1xuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5vcGVuKGl0ZW0uaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1kczo6YWNjb3JkaW9uOmNsb3NlXCIsIChlKSA9PiB7XG4gICAgICBjb25zdCBpbmRleFRvT3BlbiA9IGUuZGV0YWlsLmluZGV4O1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMudXRpbHMuc2V0QXQodGhpcy5pdGVtcywgaW5kZXhUb09wZW4pO1xuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5jbG9zZShpdGVtLmlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZHM6OmFjY29yZGlvbjp0b2dnbGVcIiwgKGUpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4VG9PcGVuID0gZS5kZXRhaWwuaW5kZXg7XG4gICAgICBjb25zdCBpdGVtID0gdGhpcy51dGlscy5zZXRBdCh0aGlzLml0ZW1zLCBpbmRleFRvT3Blbik7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtLmZ1bmNUb2dnbGUpIHtcbiAgICAgICAgaXRlbS5mdW5jVG9nZ2xlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHRvZ2dsZShpZCkge1xuICAgIGNvbnN0IGl0ZW1FbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBjb25zdCBpc09wZW4gPSBpdGVtRWwuZ2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiKSA9PT0gXCJ0cnVlXCI7XG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5jbG9zZShpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbihpZCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogT3BlbiBhbiBBY2NvcmRpb24gSXRlbVxuICAgKiAqL1xuICBvcGVuKGlkKSB7XG4gICAgY29uc3QgYnV0dG9uRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgY29uc3QgY29udGVudEVsID0gYnV0dG9uRWwucXVlcnlTZWxlY3RvcihcIlttZHMtYWNjb3JkaW9uLWNvbnRlbnRdXCIpO1xuICAgIGNvbnN0IGlubmVyQ29udGVudEVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIlttZHMtYWNjb3JkaW9uLWlubmVyLWNvbnRlbnRdXCJcbiAgICApO1xuICAgIGNvbnN0IGdyYWRpZW50RWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcihcIlttZHMtYWNjb3JkaW9uLWdyYWRpZW50XVwiKTtcblxuICAgIGlmICghY29udGVudEVsIHx8IHRoaXMuY3VycmVudGx5T3Blbi5oYXMoaWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBoZWlnaHQgb2YgdGhlIGNvbnRlbnRcbiAgICBjb25zdCBweCA9IHRoaXMuY2xvbmVBbmRDYWxjdWxhdGVIZWlnaHQoY29udGVudEVsKTtcbiAgICBncmFkaWVudEVsLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcblxuICAgIGlmICh0aGlzLm1vZGUgPT09IFwic2luZ2xlXCIpIHtcbiAgICAgIHRoaXMuY3VycmVudGx5T3Blbi5mb3JFYWNoKChvcGVuSWQpID0+IHtcbiAgICAgICAgdGhpcy5jbG9zZShvcGVuSWQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29udGVudEVsLmFuaW1hdGUoXG4gICAgICBBQ0NPUkRJT05fT1BFTklORy5jb250YWluZXIua2V5ZnJhbWVzKHB4KSxcbiAgICAgIEFDQ09SRElPTl9PUEVOSU5HLmNvbnRhaW5lci5vcHRzKHB4KVxuICAgICk7XG4gICAgaW5uZXJDb250ZW50RWwuYW5pbWF0ZShcbiAgICAgIEFDQ09SRElPTl9PUEVOSU5HLmNvbnRlbnQua2V5ZnJhbWVzLFxuICAgICAgQUNDT1JESU9OX09QRU5JTkcuY29udGVudC5vcHRzKHB4KVxuICAgICk7XG5cbiAgICBidXR0b25FbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcbiAgICBjb250ZW50RWwuc2V0QXR0cmlidXRlKFwiZGF0YS1vcGVuXCIsIFwidHJ1ZVwiKTtcblxuICAgIGNvbnN0IHN2Z19saXN0ID0gYnV0dG9uRWwucXVlcnlTZWxlY3RvckFsbChcInN2Z1wiKTtcbiAgICBzdmdfbGlzdC5mb3JFYWNoKChzdmcpID0+IHtcbiAgICAgIGlmIChzdmcpIHtcbiAgICAgICAgc3ZnLmRhdGFzZXQub3BlbiA9IFwidHJ1ZVwiO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKFRSQU5TSVRJT05fRFVSQVRJT04gLSAzMDAgPCAwKSB7XG4gICAgICBncmFkaWVudEVsLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGdyYWRpZW50RWwuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgfSwgVFJBTlNJVElPTl9EVVJBVElPTiAtIDMwMCk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50bHlPcGVuLmFkZChpZCk7XG4gIH0sXG4gIC8qKlxuICAgKiBDbG9zZSBhbiBBY2NvcmRpb24gSXRlbVxuICAgKiAqL1xuICBjbG9zZShpZCkge1xuICAgIGNvbnN0IGJ1dHRvbkVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGNvbnN0IGNvbnRlbnRFbCA9IGJ1dHRvbkVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWFjY29yZGlvbi1jb250ZW50XVwiKTtcblxuICAgIC8vIEluIGNhc2UgYXN5bmMgY29udGVudCBpcyBub3QgbG9hZGVkLCB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSBjb250ZW50IGV4aXN0c1xuICAgIC8vIGFuZCBpZiB0aGUgaXRlbSBpcyBvcGVuXG4gICAgaWYgKCFjb250ZW50RWwgfHwgdGhpcy5jdXJyZW50bHlPcGVuLmhhcyhpZCkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJDb250ZW50RWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiW21kcy1hY2NvcmRpb24taW5uZXItY29udGVudF1cIlxuICAgICk7XG4gICAgY29uc3QgZ3JhZGllbnRFbCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiW21kcy1hY2NvcmRpb24tZ3JhZGllbnRdXCIpO1xuXG4gICAgY29uc3QgcHggPVxuICAgICAgY29udGVudEVsLm9mZnNldEhlaWdodCArIHRoaXMudXRpbHMuZ2V0UGFkZGluZ1NpemVBY2NvcmRpb24oY29udGVudEVsKTtcblxuICAgIGdyYWRpZW50RWwuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXG4gICAgY29udGVudEVsLmFuaW1hdGUoXG4gICAgICBBQ0NPUkRJT05fQ0xPU0lORy5jb250YWluZXIua2V5ZnJhbWVzKHB4KSxcbiAgICAgIEFDQ09SRElPTl9DTE9TSU5HLmNvbnRhaW5lci5vcHRzKHB4KVxuICAgICk7XG4gICAgaW5uZXJDb250ZW50RWwuYW5pbWF0ZShcbiAgICAgIEFDQ09SRElPTl9DTE9TSU5HLmNvbnRlbnQua2V5ZnJhbWVzLFxuICAgICAgQUNDT1JESU9OX0NMT1NJTkcuY29udGVudC5vcHRzKHB4KVxuICAgICk7XG5cbiAgICBjb25zdCBzdmdfbGlzdCA9IGJ1dHRvbkVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzdmdcIik7XG4gICAgc3ZnX2xpc3QuZm9yRWFjaCgoc3ZnKSA9PiB7XG4gICAgICBpZiAoc3ZnKSB7XG4gICAgICAgIHN2Zy5kYXRhc2V0Lm9wZW4gPSBcImZhbHNlXCI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGJ1dHRvbkVsLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgIGNvbnRlbnRFbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLW9wZW5cIiwgXCJmYWxzZVwiKTtcbiAgICAgIHRoaXMuY3VycmVudGx5T3Blbi5kZWxldGUoaWQpO1xuICAgICAgZ3JhZGllbnRFbC5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG4gICAgfSwgVFJBTlNJVElPTl9EVVJBVElPTiAtIDIwKTtcbiAgfSxcbiAgdXRpbHM6IHtcbiAgICBjb252ZXJ0UmVtVG9QaXhlbHMocmVtKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICByZW0gKiBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5mb250U2l6ZSlcbiAgICAgICk7XG4gICAgfSxcbiAgICAvLyBTbWFsbCBVdGlscyB0byBmZXRjaCB0aGUgZWxlbWVudCBpbiB0aGUgaW5kZXggZnJvbSB0aGUgc2V0XG4gICAgc2V0QXQoc2V0LCBpbmRleCkge1xuICAgICAgaWYgKE1hdGguYWJzKGluZGV4KSA+IHNldC5zaXplKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBsZXQgaWR4ID0gaW5kZXg7XG4gICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICBpZHggPSBzZXQuc2l6ZSArIGluZGV4O1xuICAgICAgfVxuICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgZm9yIChjb25zdCBlbGVtIG9mIHNldCkge1xuICAgICAgICBpZiAoY291bnRlciA9PSBpZHgpIHtcbiAgICAgICAgICByZXR1cm4gZWxlbTtcbiAgICAgICAgfVxuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldFBhZGRpbmdTaXplQWNjb3JkaW9uKGVsKSB7XG4gICAgICBsZXQgcmVtID0gd2luZG93XG4gICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShcIi0tbWRzLWFjY29yZGlvbi1wYWRkaW5nXCIpO1xuXG4gICAgICBpZiAoIXJlbSB8fCB0eXBlb2YgcmVtICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICByZW0gPSByZW0udHJpbSgpLnJlcGxhY2UoXCJyZW1cIiwgXCJcIik7XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRSZW1Ub1BpeGVscyhwYXJzZUZsb2F0KHJlbSkpO1xuICAgIH0sXG4gIH0sXG4gIGNsb25lQW5kQ2FsY3VsYXRlSGVpZ2h0KGVsZW1lbnQpIHtcbiAgICAvLyBDbG9uZSB0aGUgZWxlbWVudFxuICAgIGNvbnN0IGNsb25lID0gZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIGNsb25lIHRvIGJlIGFic29sdXRlIGFuZCBoaWRkZW5cbiAgICBjbG9uZS5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICBjbG9uZS5zdHlsZS50b3AgPSBcIi05OTk5cHhcIjtcbiAgICBjbG9uZS5zdHlsZS5sZWZ0ID0gXCItOTk5OXB4XCI7XG4gICAgY2xvbmUuc3R5bGUubWF4SGVpZ2h0ID0gXCI0MDAwcHhcIjtcbiAgICBjbG9uZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICBjbG9uZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGNsb25lLnN0eWxlLndpZHRoID0gZWxlbWVudC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICsgXCJweFwiO1xuICAgIGNsb25lLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuXG4gICAgY29uc3QgcGFyZW50UGFkZGluZ1ZhciA9IHdpbmRvd1xuICAgICAgLmdldENvbXB1dGVkU3R5bGUoZWxlbWVudC5wYXJlbnRFbGVtZW50KVxuICAgICAgLmdldFByb3BlcnR5VmFsdWUoXCItLW1kcy1hY2NvcmRpb24tcGFkZGluZ1wiKTtcblxuICAgIGlmIChwYXJlbnRQYWRkaW5nVmFyKSB7XG4gICAgICBjbG9uZS5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLW1kcy1hY2NvcmRpb24tcGFkZGluZ1wiLFxuICAgICAgICBwYXJlbnRQYWRkaW5nVmFyLnRyaW0oKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB0dyA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoY2xvbmUsIE5vZGVGaWx0ZXIuU0hPV19BTEwpO1xuICAgIC8vIFJlbW92ZSBhbGwgdGhlIGlkcyBhbmQgbmFtZXMgZnJvbSB0aGUgY2xvbmUsIHRvIGF2b2lkIG1lc3Mgd2l0aCBsaXZlIHZpZXdcbiAgICBsZXQgaSA9IDA7XG4gICAgLy8gR28gdGhyb3VnaCB0aGUgdHJlZSB3YWxrZXIgYnV0IGxpbWl0IHRvIDEwMDBub2Rlc1xuICAgIHdoaWxlICh0dy5uZXh0Tm9kZSgpICYmIGkgPCAxMDAwKSB7XG4gICAgICBpKys7XG4gICAgICBjb25zdCBub2RlID0gdHcuY3VycmVudE5vZGU7XG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG5vZGUucmVtb3ZlQXR0cmlidXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoXCJuYW1lXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFwcGVuZCB0aGUgY2xvbmUgdG8gdGhlIGJvZHlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsb25lKTtcblxuICAgIC8vIEdldCB0aGUgaGVpZ2h0IG9mIHRoZSBjbG9uZVxuICAgIGNvbnN0IGhlaWdodCA9IGNsb25lLm9mZnNldEhlaWdodDtcblxuICAgIC8vIFJlbW92ZSB0aGUgY2xvbmVcbiAgICBjbG9uZS5yZW1vdmUoKTtcblxuICAgIC8vIFJldHVybiB0aGUgaGVpZ2h0XG4gICAgcmV0dXJuIGhlaWdodDtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFjY29yZGlvbjtcbiIsICJsZXQgQXV0aGVudGljYXRvciA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLnVwZGF0ZUlucHV0cygpO1xuICB9LFxuXG4gIHVwZGF0ZWQoKSB7XG4gICAgdGhpcy51cGRhdGVJbnB1dHMoKTtcbiAgfSxcblxuICBkZXN0cm95ZWQoKSB7XG4gICAgdGhpcy50ZWFyZG93bigpO1xuICB9LFxuXG4gIHVwZGF0ZUlucHV0cygpIHtcbiAgICB0aGlzLnRlYXJkb3duKCk7XG4gICAgdGhpcy5pbml0aWFsaXplSW5wdXRzKCk7XG4gICAgdGhpcy5zZXRGb2N1c09uRmlyc3RJbnB1dElmTmVlZGVkKCk7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZUlucHV0cygpIHtcbiAgICB0aGlzLmlucHV0cyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpO1xuICAgIHRoaXMuY2FsbGJhY2sgPSB0aGlzLmVsLmRhdGFzZXQuY2FsbGJhY2s7XG4gICAgdGhpcy5jb2RlTGVuZ3RoID0gdGhpcy5pbnB1dHMubGVuZ3RoO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSBbXTtcblxuICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0LCBpbmRleCkgPT4ge1xuICAgICAgdGhpcy5iaW5kTGlzdGVuZXIoaW5wdXQsIFwiaW5wdXRcIiwgKGUpID0+IHRoaXMuaGFuZGxlSW5wdXQoZSwgaW5kZXgpKTtcbiAgICAgIHRoaXMuYmluZExpc3RlbmVyKGlucHV0LCBcImtleWRvd25cIiwgKGUpID0+IHRoaXMuaGFuZGxlS2V5RG93bihlLCBpbmRleCkpO1xuICAgICAgdGhpcy5iaW5kTGlzdGVuZXIoaW5wdXQsIFwicGFzdGVcIiwgKGUpID0+IHRoaXMuaGFuZGxlUGFzdGUoZSkpO1xuICAgIH0pO1xuICB9LFxuXG4gIHNldEZvY3VzT25GaXJzdElucHV0SWZOZWVkZWQoKSB7XG4gICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzaG91bGRGb2N1cyA9XG4gICAgICB0aGlzLmlucHV0cy5sZW5ndGggPiAwICYmXG4gICAgICAoYWN0aXZlID09PSBkb2N1bWVudC5ib2R5IHx8IEFycmF5LmZyb20odGhpcy5pbnB1dHMpLmluY2x1ZGVzKGFjdGl2ZSkpICYmXG4gICAgICBBcnJheS5mcm9tKHRoaXMuaW5wdXRzKS5ldmVyeShpID0+ICFpLnZhbHVlKTtcblxuICAgIGlmIChzaG91bGRGb2N1cykge1xuICAgICAgdGhpcy5pbnB1dHNbMF0uZm9jdXMoKTtcbiAgICB9XG4gIH0sXG5cbiAgYmluZExpc3RlbmVyKGlucHV0LCBldmVudCwgaGFuZGxlcikge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMucHVzaCh7IGlucHV0LCBldmVudCwgaGFuZGxlciB9KTtcbiAgfSxcblxuICB0ZWFyZG93bigpIHtcbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnMpIHJldHVybjtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLmZvckVhY2goKHsgaW5wdXQsIGV2ZW50LCBoYW5kbGVyIH0pID0+IHtcbiAgICAgIGlucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgIH0pO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSBbXTtcbiAgfSxcblxuICBnZXRDb2RlKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuaW5wdXRzKS5tYXAoaSA9PiBpLnZhbHVlKS5qb2luKCcnKTtcbiAgfSxcblxuICByZXNldCgpIHtcbiAgICB0aGlzLmlucHV0cy5mb3JFYWNoKGkgPT4gaS52YWx1ZSA9IFwiXCIpO1xuICAgIHRoaXMuaW5wdXRzWzBdLmZvY3VzKCk7XG4gIH0sXG5cbiAgaGFuZGxlSW5wdXQoZSwgaW5kZXgpIHtcbiAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IHZhbCA9IGlucHV0LnZhbHVlLnRvVXBwZXJDYXNlKCk7XG4gICAgaW5wdXQudmFsdWUgPSB2YWw7XG5cbiAgICBpZiAodmFsICYmIGluZGV4IDwgdGhpcy5pbnB1dHMubGVuZ3RoIC0gMSkge1xuICAgICAgdGhpcy5pbnB1dHNbaW5kZXggKyAxXS5mb2N1cygpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvZGUgPSB0aGlzLmdldENvZGUoKTtcbiAgICBpZiAoY29kZS5sZW5ndGggPT09IHRoaXMuY29kZUxlbmd0aCAmJiB0aGlzLmNhbGxiYWNrKSB7XG4gICAgICB0aGlzLnB1c2hFdmVudCh0aGlzLmNhbGxiYWNrLCB7IGNvZGUgfSk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZUtleURvd24oZSwgaW5kZXgpIHtcbiAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0O1xuICAgIGlmICgoZS5rZXkgPT09IFwiQmFja3NwYWNlXCIgfHwgZS5rZXkgPT09IFwiRGVsZXRlXCIpICYmIGlucHV0LnZhbHVlID09PSBcIlwiICYmIGluZGV4ID4gMCkge1xuICAgICAgdGhpcy5pbnB1dHNbaW5kZXggLSAxXS5mb2N1cygpO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVQYXN0ZShlKSB7XG4gICAgY29uc3QgcGFzdGVkID0gZS5jbGlwYm9hcmREYXRhLmdldERhdGEoXCJ0ZXh0XCIpLnNsaWNlKDAsIHRoaXMuY29kZUxlbmd0aCkudG9VcHBlckNhc2UoKTtcblxuICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0LCBpKSA9PiB7XG4gICAgICBpbnB1dC52YWx1ZSA9IHBhc3RlZFtpXSB8fCBcIlwiO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGFzdEluZGV4ID0gcGFzdGVkLmxlbmd0aCAtIDE7XG4gICAgaWYgKGxhc3RJbmRleCA+PSAwICYmIGxhc3RJbmRleCA8IHRoaXMuaW5wdXRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5pbnB1dHNbbGFzdEluZGV4XS5mb2N1cygpO1xuICAgIH1cblxuICAgIGlmIChwYXN0ZWQubGVuZ3RoID09PSB0aGlzLmNvZGVMZW5ndGggJiYgdGhpcy5jYWxsYmFjaykge1xuICAgICAgdGhpcy5wdXNoRXZlbnQodGhpcy5jYWxsYmFjaywgeyBjb2RlOiBwYXN0ZWQgfSk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBdXRoZW50aWNhdG9yO1xuIiwgImNvbnN0IEJvdHRvbXNoZWV0SG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLnNldHVwKCk7XG4gIH0sXG4gIHNldHVwKCkge1xuICAgIGNvbnN0IGRpYWxvZyA9IHRoaXMuZWw7XG4gICAgY29uc3QgaGFuZGxlID0gZGlhbG9nLnF1ZXJ5U2VsZWN0b3IoXCIubW9vbi1ib3R0b20tc2hlZXQtaGFuZGxlXCIpO1xuICAgIGNvbnN0IGRpYWxvZ0JveCA9IHRoaXMuZGlhbG9nQm94KCk7XG5cbiAgICBsZXQgc3RhcnRZID0gMDtcbiAgICBsZXQgZGVsdGFZO1xuICAgIGxldCBzdGFydEhlaWdodCA9IDA7XG4gICAgbGV0IGN1cnJlbnRZID0gMDtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSAyMDA7XG4gICAgY29uc3QgbWluSGVpZ2h0ID0gMjAwO1xuICAgIGNvbnN0IG1heEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuODtcbiAgICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgLy8gVEJEOiBUaGlzIGNvcnJlY3Rpb24gc2hvdWxkIGJlIHJlbW92ZWQgb25jZSBtb29uIHVpIGNvbXBvbmVudHMgaXMgdXBkYXRlZFxuICAgIGRpYWxvZ0JveC5zdHlsZS5zY2FsZSA9IFwiMVwiO1xuICAgIGRpYWxvZ0JveC5zdHlsZS5tYXhIZWlnaHQgPSBcIjgwdmhcIjtcblxuICAgIGNvbnN0IG9uRHJhZ1N0YXJ0ID0gKGUpID0+IHtcbiAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgc3RhcnRZID0gZS50b3VjaGVzID8gZS50b3VjaGVzWzBdLmNsaWVudFkgOiBlLmNsaWVudFk7XG4gICAgICBzdGFydEhlaWdodCA9IGRpYWxvZ0JveC5vZmZzZXRIZWlnaHQ7XG4gICAgICBkaWFsb2dCb3guc3R5bGUudHJhbnNpdGlvbiA9IFwibm9uZVwiO1xuICAgICAgZGVsdGFZID0gMDtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25EcmFnTW92ZSA9IChlKSA9PiB7XG4gICAgICBpZiAoIWlzRHJhZ2dpbmcpIHJldHVybjtcblxuICAgICAgY3VycmVudFkgPSBlLnRvdWNoZXMgPyBlLnRvdWNoZXNbMF0uY2xpZW50WSA6IGUuY2xpZW50WTtcbiAgICAgIGRlbHRhWSA9IHN0YXJ0WSAtIGN1cnJlbnRZO1xuICAgICAgY29uc3QgbmV3SGVpZ2h0ID0gTWF0aC5taW4oXG4gICAgICAgIG1heEhlaWdodCxcbiAgICAgICAgTWF0aC5tYXgobWluSGVpZ2h0LCBzdGFydEhlaWdodCArIGRlbHRhWSlcbiAgICAgICk7XG5cbiAgICAgIGRpYWxvZ0JveC5zdHlsZS5oZWlnaHQgPSBgJHtuZXdIZWlnaHR9cHhgO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkRyYWdFbmQgPSAoKSA9PiB7XG4gICAgICBpZiAoIWlzRHJhZ2dpbmcpIHJldHVybjtcbiAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgICAgY29uc3QgY3VycmVudEhlaWdodCA9IGRpYWxvZ0JveC5vZmZzZXRIZWlnaHQ7XG4gICAgICBkaWFsb2dCb3guc3R5bGUudHJhbnNpdGlvbiA9IFwiXCI7XG5cbiAgICAgIGlmIChkZWx0YVkgPCAtdGhyZXNob2xkKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGVsdGFZID4gdGhyZXNob2xkKSB7XG4gICAgICAgIGRpYWxvZ0JveC5zdHlsZS5oZWlnaHQgPSBgJHttYXhIZWlnaHR9cHhgO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNuYXBQb2ludHMgPSB7XG4gICAgICAgIG1pbjogbWluSGVpZ2h0LFxuICAgICAgICBtaWQ6IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNSxcbiAgICAgICAgbWF4OiBtYXhIZWlnaHQsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBjbG9zZXN0U25hcCA9IE9iamVjdC5lbnRyaWVzKHNuYXBQb2ludHMpLnJlZHVjZSgocHJldiwgY3VycikgPT5cbiAgICAgICAgTWF0aC5hYnMoY3VyclsxXSAtIGN1cnJlbnRIZWlnaHQpIDwgTWF0aC5hYnMocHJldlsxXSAtIGN1cnJlbnRIZWlnaHQpXG4gICAgICAgICAgPyBjdXJyXG4gICAgICAgICAgOiBwcmV2XG4gICAgICApO1xuXG4gICAgICBkaWFsb2dCb3guc3R5bGUuaGVpZ2h0ID0gYCR7Y2xvc2VzdFNuYXBbMV19cHhgO1xuICAgIH07XG5cbiAgICBpZiAoaGFuZGxlKSB7XG4gICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgb25EcmFnU3RhcnQpO1xuICAgICAgaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgb25EcmFnU3RhcnQpO1xuICAgIH1cblxuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIG9uRHJhZ01vdmUpO1xuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uRHJhZ01vdmUpO1xuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgb25EcmFnRW5kKTtcbiAgICBkaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25EcmFnRW5kKTtcblxuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwibW9vbjpib3R0b21zaGVldDpvcGVuXCIsICgpID0+IHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0pO1xuXG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmJvdHRvbXNoZWV0OmNsb3NlXCIsICgpID0+IHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcbiAgfSxcbiAgb3BlbigpIHtcbiAgICBjb25zdCBkaWFsb2dCb3ggPSB0aGlzLmRpYWxvZ0JveCgpO1xuICAgIHRoaXMuZWwuc2hvd01vZGFsKCk7XG4gICAgZGlhbG9nQm94LnN0eWxlLmhlaWdodCA9IGAke3dpbmRvdy5pbm5lckhlaWdodCAqIDAuNX1weGA7XG4gIH0sXG4gIGNsb3NlKCkge1xuICAgIGNvbnN0IGRpYWxvZ0JveCA9IHRoaXMuZGlhbG9nQm94KCk7XG4gICAgZGlhbG9nQm94LnN0eWxlLmhlaWdodCA9IFwiXCI7XG4gICAgdGhpcy5lbC5jbG9zZSgpO1xuICB9LFxuICBkaWFsb2dCb3goKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5tb29uLWJvdHRvbS1zaGVldC1ib3hcIik7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBCb3R0b21zaGVldEhvb2s7XG4iLCAiY29uc3QgQ2Fyb3VzZWxIb29rID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuc2V0dXAoKTtcbiAgfSxcbiAgc2V0dXAoKSB7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibW9vbjpjYXJvdXNlbDpzY3JvbGxfbGVmdFwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBwYXJzZUludCh0aGlzLmVsLmRhdGFzZXQuYWN0aXZlU2xpZGVJbmRleCk7XG4gICAgICBjb25zdCBuZXh0SW5kZXggPSBzY3JvbGxMZWZ0KHsgY3VycmVudEluZGV4LCBlbGVtZW50OiB0aGlzLmVsIH0pO1xuXG4gICAgICB1cGRhdGVEYXRhQXR0cmlidXRlKHRoaXMuZWwsIGN1cnJlbnRJbmRleCwgbmV4dEluZGV4KTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vb246Y2Fyb3VzZWw6c2Nyb2xsX3JpZ2h0XCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHBhcnNlSW50KHRoaXMuZWwuZGF0YXNldC5hY3RpdmVTbGlkZUluZGV4KTtcbiAgICAgIGNvbnN0IHRvdGFsSXRlbXMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubW9vbi1jYXJvdXNlbC1pdGVtXCIpLmxlbmd0aDtcblxuICAgICAgY29uc3QgbmV4dEluZGV4ID0gc2Nyb2xsUmlnaHQoe1xuICAgICAgICBjdXJyZW50SW5kZXgsXG4gICAgICAgIHRvdGFsSXRlbXMsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuZWwsXG4gICAgICB9KTtcblxuICAgICAgdXBkYXRlRGF0YUF0dHJpYnV0ZSh0aGlzLmVsLCBjdXJyZW50SW5kZXgsIG5leHRJbmRleCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmNhcm91c2VsOnNjcm9sbF90b19pbmRleFwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHsgZGV0YWlsIH0gPSBldmVudDtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IGRldGFpbDtcblxuICAgICAgc2Nyb2xsVG9JbmRleCh7IGVsZW1lbnQ6IHRoaXMuZWwsIGluZGV4IH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZWwuZGF0YXNldC5hY3RpdmVTbGlkZUluZGV4ICE9PSBcIjBcIikge1xuICAgICAgc2Nyb2xsVG9JbmRleCh7XG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuZWwsXG4gICAgICAgIGluZGV4OiB0aGlzLmVsLmRhdGFzZXQuYWN0aXZlU2xpZGVJbmRleCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbn07XG5cbmNvbnN0IHNjcm9sbFRvSW5kZXggPSAoeyBlbGVtZW50LCBpbmRleCB9KSA9PiB7XG4gIGNvbnN0IHRvdGFsSXRlbXMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubW9vbi1jYXJvdXNlbC1pdGVtXCIpLmxlbmd0aDtcblxuICBpZiAoIWlzVmFsaWRJbmRleChpbmRleCwgdG90YWxJdGVtcykpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBhY3RpdmVTbGlkZUluZGV4ID0gcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LmFjdGl2ZVNsaWRlSW5kZXgpO1xuXG4gIHNjcm9sbCh7IGluZGV4LCBlbGVtZW50IH0pO1xuXG4gIHVwZGF0ZURhdGFBdHRyaWJ1dGUoZWxlbWVudCwgYWN0aXZlU2xpZGVJbmRleCwgaW5kZXgpO1xufTtcblxuY29uc3Qgc2Nyb2xsTGVmdCA9ICh7IGN1cnJlbnRJbmRleCwgZWxlbWVudCB9KSA9PiB7XG4gIGlmIChjdXJyZW50SW5kZXggPD0gMCkge1xuICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gIH1cblxuICBjb25zdCBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICBzY3JvbGwoeyBpbmRleDogbmV4dEluZGV4LCBlbGVtZW50IH0pO1xuXG4gIHJldHVybiBuZXh0SW5kZXg7XG59O1xuXG5jb25zdCBzY3JvbGxSaWdodCA9ICh7IGN1cnJlbnRJbmRleCwgdG90YWxJdGVtcywgZWxlbWVudCB9KSA9PiB7XG4gIGlmIChjdXJyZW50SW5kZXggPj0gdG90YWxJdGVtcyAtIDEpIHtcbiAgICByZXR1cm4gY3VycmVudEluZGV4O1xuICB9XG5cbiAgY29uc3QgbmV4dEluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgc2Nyb2xsKHsgaW5kZXg6IG5leHRJbmRleCwgZWxlbWVudCB9KTtcblxuICByZXR1cm4gbmV4dEluZGV4O1xufTtcblxuY29uc3Qgc2Nyb2xsID0gKHsgaW5kZXgsIGVsZW1lbnQgfSkgPT4ge1xuICBjb25zdCBhY3RpdmVTbGlkZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudC5pZH0tc2xpZGUtJHtpbmRleH1gKTtcblxuICB1cGRhdGVCdXR0b25BcnJvd3MoeyBlbGVtZW50LCBuZXdJbmRleDogaW5kZXggfSk7XG5cbiAgYWN0aXZlU2xpZGUuc2Nyb2xsSW50b1ZpZXcoe1xuICAgIGJlaGF2aW9yOiBcInNtb290aFwiLFxuICAgIGJsb2NrOiBcIm5lYXJlc3RcIixcbiAgICBpbmxpbmU6IFwiY2VudGVyXCIsXG4gIH0pO1xufTtcblxuY29uc3QgdXBkYXRlQnV0dG9uQXJyb3dzID0gKHsgZWxlbWVudCwgbmV3SW5kZXggfSkgPT4ge1xuICBjb25zdCBwcmV2QXJyb3dCdXR0b24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2VsZW1lbnQuaWR9LWFycm93LXN0YXJ0YCk7XG4gIGNvbnN0IG5leHRBcnJvd0J1dHRvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudC5pZH0tYXJyb3ctZW5kYCk7XG5cbiAgdXBkYXRlQnV0dG9uQXJyb3cocHJldkFycm93QnV0dG9uLCBuZXdJbmRleCA8PSAwKTtcbiAgdXBkYXRlQnV0dG9uQXJyb3cobmV4dEFycm93QnV0dG9uLCBuZXdJbmRleCA+PSBnZXRUb3RhbEl0ZW1zKGVsZW1lbnQpIC0gMSk7XG59O1xuXG5jb25zdCB1cGRhdGVCdXR0b25BcnJvdyA9IChhcnJvd0J1dHRvbiwgaXNEaXNhYmxlZCkgPT4ge1xuICBpZiAoaXNEaXNhYmxlZCkge1xuICAgIGFycm93QnV0dG9uLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBhcnJvd0J1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbn07XG5cbmNvbnN0IGdldFRvdGFsSXRlbXMgPSAoZWxlbWVudCkgPT5cbiAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vb24tY2Fyb3VzZWwtaXRlbVwiKS5sZW5ndGg7XG5cbmNvbnN0IHVwZGF0ZURhdGFBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYWN0aXZlSW5kZXgsIG5ld0luZGV4KSA9PiB7XG4gIGlmIChhY3RpdmVJbmRleCA9PT0gbmV3SW5kZXgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtYWN0aXZlLXNsaWRlLWluZGV4XCIpO1xuICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtYWN0aXZlLXNsaWRlLWluZGV4XCIsIG5ld0luZGV4KTtcbn07XG5cbmNvbnN0IGlzVmFsaWRJbmRleCA9IChpbmRleCwgdG90YWxJdGVtcykgPT4ge1xuICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0b3RhbEl0ZW1zKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDYXJvdXNlbEhvb2s7XG4iLCAiY29uc3Qgc2V0SW5kZXRlcm1pbmF0ZVN0YXRlID0gKGVsKSA9PiB7XG4gIGVsLmluZGV0ZXJtaW5hdGUgPSBlbC5kYXRhc2V0LmluZGV0ZXJtaW5hdGUgIT09IHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IENoZWNrYm94SG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICBzZXRJbmRldGVybWluYXRlU3RhdGUodGhpcy5lbCk7XG4gIH0sXG4gIHVwZGF0ZWQoKSB7XG4gICAgc2V0SW5kZXRlcm1pbmF0ZVN0YXRlKHRoaXMuZWwpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hlY2tib3hIb29rO1xuIiwgImNvbnN0IERpYWxvZ0hvb2sgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zZXR1cCgpO1xuICB9LFxuICBzZXR1cCgpIHtcbiAgICBjb25zdCBkaWFsb2cgPSB0aGlzLmVsO1xuXG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmRpYWxvZzpvcGVuXCIsICgpID0+IHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0pO1xuXG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmRpYWxvZzpjbG9zZVwiLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG4gIH0sXG4gIG9wZW4oKSB7XG4gICAgdGhpcy5lbC5zaG93TW9kYWwoKTtcbiAgfSxcbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5lbC5jbG9zZSgpO1xuICB9LFxuICBkaWFsb2dCb3goKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1ib3hcIik7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEaWFsb2dIb29rO1xuIiwgImNvbnN0IERyYXdlckhvb2sgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zZXR1cCgpO1xuICB9LFxuICBzZXR1cCgpIHtcbiAgICBjb25zdCBkaWFsb2cgPSB0aGlzLmVsO1xuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwibW9vbjpkcmF3ZXI6b3BlblwiLCAoKSA9PiB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9KTtcblxuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwibW9vbjpkcmF3ZXI6Y2xvc2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5jZWxcIiwgKCkgPT4ge1xuICAgIC8vICAgdGhpcy5jbG9zZSgpO1xuICAgIC8vIH0pO1xuICB9LFxuICBvcGVuKCkge1xuICAgIHRoaXMuZWwuc2hvd01vZGFsKCk7XG4gIH0sXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuZWwuY2xvc2UoKTtcbiAgfSxcbiAgZGlhbG9nQm94KCkge1xuICAgIHJldHVybiB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtYm94XCIpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRHJhd2VySG9vaztcbiIsICJjb25zdCBGaWxlSW5wdXQgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc3QgaW5wdXRSZWYgPSB0aGlzLmVsLmRhdGFzZXQuaW5wdXRSZWY7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldElucHV0RWxlbWVudChpbnB1dFJlZik7XG4gICAgY29uc3Qgc3BhbiA9IHRoaXMuZ2V0U3BhbkVsZW1lbnQoaW5wdXRSZWYpO1xuXG4gICAgaWYgKCFpbnB1dCB8fCAhc3BhbikgcmV0dXJuO1xuXG4gICAgdGhpcy5zZXR1cENsaWNrTGlzdGVuZXIoaW5wdXQpO1xuICAgIHRoaXMuc2V0dXBDaGFuZ2VMaXN0ZW5lcihpbnB1dCwgc3Bhbik7XG4gIH0sXG4gIGdldElucHV0RWxlbWVudChpbnB1dFJlZikge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVtkYXRhLXBoeC11cGxvYWQtcmVmPVwiJHtpbnB1dFJlZn1cIl1gXG4gICAgKTtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBgRmlsZUlucHV0OiBObyBpbnB1dCBmb3VuZCB3aXRoIGRhdGEtcGh4LXVwbG9hZC1yZWY9XCIke2lucHV0UmVmfVwiYFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xuICB9LFxuICBnZXRTcGFuRWxlbWVudChpbnB1dFJlZikge1xuICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzcGFuW2RhdGEtaW5wdXQtcmVmPVwiJHtpbnB1dFJlZn1cIl1gKTtcbiAgICBpZiAoIXNwYW4pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIGBGaWxlSW5wdXQ6IE5vIHNwYW4gZm91bmQgd2l0aCBkYXRhLWlucHV0LXJlZj1cIiR7aW5wdXRSZWZ9XCJdYFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYW47XG4gIH0sXG4gIHNldHVwQ2xpY2tMaXN0ZW5lcihpbnB1dCkge1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGlucHV0LmNsaWNrKCkpO1xuICB9LFxuICBzZXR1cENoYW5nZUxpc3RlbmVyKGlucHV0LCBzcGFuKSB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlcyA9IGlucHV0LmZpbGVzO1xuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9XG4gICAgICAgIGZpbGVzLmxlbmd0aCA9PT0gMSA/IGZpbGVzWzBdLm5hbWUgOiBgJHtmaWxlcy5sZW5ndGh9IEZpbGVzYDtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVJbnB1dDtcbiIsICJjb25zdCBEUk9QRE9XTl9BTklNQVRJT05fRFVSQVRJT04gPSAyMDA7XG5jb25zdCBEUk9QRE9XTl9USU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQgPVxuICBcImN1YmljLWJlemllcigwLjIsIDAsIDAuMzgsIDAuOSlcIjtcbmNvbnN0IE1JTl9EUk9QRE9XTl9DT05URU5UID0gMTUwO1xuY29uc3QgRFJPUERPV05fU0tJUF9PUFRTX05VTEwgPSB7XG4gIGR1cmF0aW9uOiAwLFxuICBpdGVyYXRpb25zOiAxLFxuICBlYXNpbmc6IFwibGluZWFyXCIsXG59O1xuY29uc3QgRFJPUERPV05fRU5URVJfQU5JTUFUSU9OID0ge1xuICBrZXlmcmFtZXM6IFtcbiAgICB7IG9wYWNpdHk6IDAsIGZpbHRlcjogXCJibHVyKDJweClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTEwcHgpXCIgfSxcbiAgICB7IG9wYWNpdHk6IDEsIGZpbHRlcjogXCJibHVyKDBweClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoMClcIiB9LFxuICBdLFxuICBvcHRzOiB7XG4gICAgZHVyYXRpb246IERST1BET1dOX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICBlYXNpbmc6IERST1BET1dOX1RJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCxcbiAgfSxcbn07XG5cbmNvbnN0IERST1BET1dOX0xFQVZFX0FOSU1BVElPTiA9IHtcbiAga2V5ZnJhbWVzOiBbXG4gICAgeyBvcGFjaXR5OiAxLCBmaWx0ZXI6IFwiYmx1cigwcHgpXCIsIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKDApXCIgfSxcbiAgICB7IG9wYWNpdHk6IDAsIGZpbHRlcjogXCJibHVyKDJweClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTEwcHgpXCIgfSxcbiAgXSxcbiAgb3B0czoge1xuICAgIGR1cmF0aW9uOiBEUk9QRE9XTl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgZWFzaW5nOiBEUk9QRE9XTl9USU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQsXG4gIH0sXG59O1xuXG5jb25zdCBNb29uRHJvcGRvd24gPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy50b2dnbGVGdW5jID0gdGhpcy50b2dnbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmtleURvd25GdW5jID0gdGhpcy5vbktleURvd24uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1kczpkcm9wZG93bjp0b2dnbGVcIiwgdGhpcy50b2dnbGVGdW5jKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5RG93bkZ1bmMpO1xuXG4gICAgdGhpcy5oYW5kbGVFdmVudChcIm1kczpkcm9wZG93bjp0b2dnbGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBpc015RXZlbnQgPSBcIiNcIiArIHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQgfHwgdGhpcy5lbC5pZCA9PSBldmVudC5pZDtcbiAgICAgIGlmIChpc015RXZlbnQpIHtcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZGlzcG9zZUZ1bmMgPSB0aGlzLmRpc3Bvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNoYXNlRnVuYyA9IHRoaXMuY2hhc2UuYmluZCh0aGlzKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZGlzcG9zZUZ1bmMpO1xuXG4gICAgLy8gRGVjbGFyZSB0aGUgZHJvcGRvd24gc3RhdGVcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuXG4gICAgLy8gUGFyc2UgaW5pdGlhbCBzdGF0ZVxuICAgIGNvbnN0IGlzSW5pdGlhbE9wZW4gPSB0aGlzLmVsLmRhdGFzZXQuaW5pdGlhbFN0YXRlID09PSBcInZpc2libGVcIjtcbiAgICBpZiAoaXNJbml0aWFsT3Blbikge1xuICAgICAgdGhpcy5zaG93KHRydWUpO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlZCgpIHtcbiAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMuc2hvdyh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlKHRydWUpO1xuICAgIH1cbiAgfSxcbiAgZGVzdHJveWVkKCkge1xuICAgIGlmICh0aGlzLnRvZ2dsZUZ1bmMpIHtcbiAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1kczpkcm9wZG93bjp0b2dnbGVcIiwgdGhpcy50b2dnbGVGdW5jKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlzcG9zZUZ1bmMpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmRpc3Bvc2VGdW5jKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hhc2VGdW5jKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmtleURvd25GdW5jKSB7XG4gICAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5RG93bkZ1bmMpO1xuICAgIH1cbiAgfSxcbiAgZGlzcG9zZShldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2V0VGFyZ2V0KGV2ZW50KTtcblxuICAgIGNvbnN0IGlzQ2xvc2VzdCA9ICEhdGFyZ2V0LmNsb3Nlc3QoXCIjXCIgKyB0aGlzLmVsLmlkKTtcbiAgICBpZiAoIWlzQ2xvc2VzdCkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogR2V0IHRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50XG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtFdmVudH0gRXZlbnRcbiAgICogIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICogIEBwcml2YXRlXG4gICAqL1xuICBnZXRUYXJnZXQoZXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC5kZXRhaWw/LmRpc3BhdGNoZXIgPz8gZXZlbnQudGFyZ2V0O1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9LFxuICB0b2dnbGUoKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLWNvbnRlbnRdXCIpO1xuICAgIGlmIChkcm9wZG93bi5kYXRhc2V0LmhpZGRlbiA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIHNob3coc2tpcEFuaW1hdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLWNvbnRlbnRdXCIpO1xuICAgIGNvbnN0IGRyb3Bkb3duSWNvbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5kcm9wZG93bi1zZWxlY3QtaWNvblwiKTtcblxuICAgIC8vIEhhbmRsZSBkcm9wZG93biBpY29uIGlmIGl0IGV4aXN0c1xuICAgIGlmIChkcm9wZG93bkljb24pIHtcbiAgICAgIGRyb3Bkb3duSWNvbi5jbGFzc0xpc3QuYWRkKFwicm90YXRlLTE4MFwiKTtcbiAgICAgIGRyb3Bkb3duSWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwicm90YXRlLTBcIik7XG4gICAgfVxuXG4gICAgZHJvcGRvd24uZGF0YXNldC5oaWRkZW4gPSBcImZhbHNlXCI7XG4gICAgdGhpcy5jaGFzZUZ1bmMoKTtcbiAgICBpZiAoIXNraXBBbmltYXRpb24pIHtcbiAgICAgIGRyb3Bkb3duLmFuaW1hdGUoXG4gICAgICAgIERST1BET1dOX0VOVEVSX0FOSU1BVElPTi5rZXlmcmFtZXMsXG4gICAgICAgIHRoaXMuZWwuZGF0YXNldC5za2lwQW5pbWF0aW9uID09PSBcInRydWVcIlxuICAgICAgICAgID8gRFJPUERPV05fU0tJUF9PUFRTX05VTExcbiAgICAgICAgICA6IERST1BET1dOX0VOVEVSX0FOSU1BVElPTi5vcHRzXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gIH0sXG4gIGhpZGUoc2tpcEFuaW1hdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLWNvbnRlbnRdXCIpO1xuICAgIGNvbnN0IGRyb3Bkb3duSWNvbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5kcm9wZG93bi1zZWxlY3QtaWNvblwiKTtcblxuICAgIC8vIEhhbmRsZSBkcm9wZG93biBpY29uIGlmIGl0IGV4aXN0c1xuICAgIGlmIChkcm9wZG93bkljb24pIHtcbiAgICAgIGRyb3Bkb3duSWNvbi5jbGFzc0xpc3QuYWRkKFwicm90YXRlLTBcIik7XG4gICAgICBkcm9wZG93bkljb24uY2xhc3NMaXN0LnJlbW92ZShcInJvdGF0ZS0xODBcIik7XG4gICAgfVxuXG4gICAgaWYgKGRyb3Bkb3duLmRhdGFzZXQuaGlkZGVuID09PSBcInRydWVcIiB8fCAhdGhpcy5pc09wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFza2lwQW5pbWF0aW9uKSB7XG4gICAgICBkcm9wZG93bi5hbmltYXRlKFxuICAgICAgICBEUk9QRE9XTl9MRUFWRV9BTklNQVRJT04ua2V5ZnJhbWVzLFxuICAgICAgICB0aGlzLmVsLmRhdGFzZXQuc2tpcEFuaW1hdGlvbiA9PT0gXCJ0cnVlXCJcbiAgICAgICAgICA/IERST1BET1dOX1NLSVBfT1BUU19OVUxMXG4gICAgICAgICAgOiBEUk9QRE9XTl9MRUFWRV9BTklNQVRJT04ub3B0c1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KFxuICAgICAgKCkgPT4ge1xuICAgICAgICBkcm9wZG93bi5kYXRhc2V0LmhpZGRlbiA9IFwidHJ1ZVwiO1xuICAgICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHNraXBBbmltYXRpb24gfHwgdGhpcy5lbC5kYXRhc2V0LnNraXBBbmltYXRpb24gPT09IFwidHJ1ZVwiXG4gICAgICAgID8gMFxuICAgICAgICA6IERST1BET1dOX0FOSU1BVElPTl9EVVJBVElPTlxuICAgICk7XG4gIH0sXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSB3aW5kb3cgaXMgc2Nyb2xsZWQsIGFuZCBjaGVjayB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBzaWRlIG9mIERyb3Bkb3duXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgY2hhc2UoKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLWNvbnRlbnRdXCIpO1xuICAgIGNvbnN0IHRyaWdnZXIgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLXRyaWdnZXJdXCIpO1xuXG4gICAgaWYgKGRyb3Bkb3duLmRhdGFzZXQuaGlkZGVuID09PSBcInRydWVcIiB8fCAhZHJvcGRvd24gfHwgIXRyaWdnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhbmNob3JSZWN0ID0gdHJpZ2dlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzZWxmUmVjdCA9IGRyb3Bkb3duLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgY29uc3Qgc3RhdHVzID0ge1xuICAgICAgYW5jaG9ySGVpZ2h0OiBNYXRoLnJvdW5kKGFuY2hvclJlY3QuaGVpZ2h0KSxcbiAgICAgIGRyb3Bkb3duSGVpZ2h0OiBNYXRoLnJvdW5kKHNlbGZSZWN0LmhlaWdodCksXG4gICAgICBkcm9wZG93bldpZHRoOiBNYXRoLnJvdW5kKHNlbGZSZWN0LndpZHRoKSxcbiAgICAgIGF2YWlsYWJsZVNwYWNlVG9wOiBNYXRoLm1heChNYXRoLnJvdW5kKGFuY2hvclJlY3QudG9wKSwgMCksXG4gICAgICBhdmFpbGFibGVTcGFjZUJvdHRvbTogTWF0aC5tYXgoXG4gICAgICAgIE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0IC0gYW5jaG9yUmVjdC5ib3R0b20pLFxuICAgICAgICAwXG4gICAgICApLFxuICAgIH07XG4gICAgaWYgKHN0YXR1cy5kcm9wZG93bkhlaWdodCA+IHN0YXR1cy5hdmFpbGFibGVTcGFjZUJvdHRvbSkge1xuICAgICAgZHJvcGRvd24uc3R5bGUudG9wID0gYC0ke3N0YXR1cy5kcm9wZG93bkhlaWdodCArIDh9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcm9wZG93bi5zdHlsZS50b3AgPSBgJHtzdGF0dXMuYW5jaG9ySGVpZ2h0ICsgOH1weGA7XG4gICAgfVxuICB9LFxuICBvbktleURvd24oZXZlbnQpIHtcbiAgICBjb25zdCBkcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuaWQpO1xuICAgIGlmICghZHJvcGRvd24pIHJldHVybjtcblxuICAgIGNvbnN0IGRyb3Bkb3duQ29udGVudCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIlttZHMtZHJvcGRvd24tY29udGVudF1cIik7XG4gICAgaWYgKCFkcm9wZG93bkNvbnRlbnQpIHJldHVybjtcblxuICAgIGNvbnN0IGl0ZW1zID0gZHJvcGRvd25Db250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgbGV0IGN1cnJlbnRJbmRleCA9IEFycmF5LmZyb20oaXRlbXMpLmZpbmRJbmRleChcbiAgICAgIChpdGVtKSA9PiBpdGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgKTtcblxuICAgIGNvbnN0IHNob3dEcm9wZG93biA9ICgpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlTmF2aWdhdGlvbiA9IChkaXJlY3Rpb24pID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjdXJyZW50SW5kZXggPSAoY3VycmVudEluZGV4ICsgZGlyZWN0aW9uICsgaXRlbXMubGVuZ3RoKSAlIGl0ZW1zLmxlbmd0aDtcbiAgICAgIGl0ZW1zW2N1cnJlbnRJbmRleF0uZm9jdXMoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlU2VsZWN0aW9uID0gKCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChjdXJyZW50SW5kZXggIT09IC0xKSB7XG4gICAgICAgIGl0ZW1zW2N1cnJlbnRJbmRleF0uY2xpY2soKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgZHJvcGRvd24uZm9jdXMoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGlkZURyb3Bkb3duID0gKCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH07XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICBoYW5kbGVOYXZpZ2F0aW9uKDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJBcnJvd1VwXCI6XG4gICAgICAgIGhhbmRsZU5hdmlnYXRpb24oLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJFbnRlclwiOlxuICAgICAgY2FzZSBcIiBcIjpcbiAgICAgICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgICAgIHNob3dEcm9wZG93bigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhhbmRsZVNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkVzY2FwZVwiOlxuICAgICAgICBoaWRlRHJvcGRvd24oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IE1vb25Ecm9wZG93bjtcbiIsICJjb25zdCBwYWdpbmF0aW9uU3RlcElkUHJlZml4ID0gXCIjcGFnaW5hdGlvbi1zdGVwLWl0ZW0tXCI7XG5cbmNvbnN0IFBhZ2luYXRpb25Ib29rID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuc2V0dXAoKTtcbiAgfSxcbiAgc2V0dXAoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWw7XG4gICAgY29uc3QgbW9kZSA9IGVsZW1lbnQuZGF0YXNldC5tb2RlO1xuICAgIGNvbnN0IGRhdGFUb3RhbFN0ZXBzID0gcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LnRvdGFsU3RlcHMsIDEwKTtcbiAgICBjb25zdCBwYWdpbmF0aW9uSXRlbXNMZW5ndGggPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBcIi5tb29uLXBhZ2luYXRpb24taXRlbVwiXG4gICAgKS5sZW5ndGg7XG4gICAgY29uc3QgdG90YWxTdGVwcyA9IGRhdGFUb3RhbFN0ZXBzIHx8IHBhZ2luYXRpb25JdGVtc0xlbmd0aDtcblxuICAgIGlmIChtb2RlICE9PSBcImxpbmtzXCIpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJtb29uOnBhZ2luYXRpb246c3RlcFwiLFxuICAgICAgICAoeyBkZXRhaWw6IHsgc3RlcCB9IH0pID0+IHtcbiAgICAgICAgICBuYXZpZ2F0ZSh7XG4gICAgICAgICAgICBkaXJlY3Rpb246IHN0ZXAsXG4gICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgY3VycmVudFN0ZXA6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC5hY3RpdmVTdGVwKSxcbiAgICAgICAgICAgIG1vZGUsXG4gICAgICAgICAgICB0b3RhbFN0ZXBzLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5hdmlnYXRlTGlua3NNb2RlKHsgZWxlbWVudCwgdG90YWxTdGVwcyB9KTtcbiAgfSxcbn07XG5cbmNvbnN0IG5hdmlnYXRlTGlua3NNb2RlID0gKHsgZWxlbWVudCwgdG90YWxTdGVwcyB9KSA9PiB7XG4gIGNvbnN0IHsgYmFzZVBhcmFtOiBwcmVmaXgsIG1heERpc3BsYXllZFN0ZXBzLCBhY3RpdmVTdGVwIH0gPSBlbGVtZW50LmRhdGFzZXQ7XG4gIGNvbnN0IGN1cnJlbnRQYWdlID0gcGFyc2VJbnQoZ2V0VXJsUGFyYW1zKCkuZ2V0KHByZWZpeCkgfHwgYWN0aXZlU3RlcCk7XG5cbiAgcmVuZGVyUGFnaW5hdGlvblN0ZXBzKHtcbiAgICBlbGVtZW50LFxuICAgIHN0ZXBzOiBjYWxjdWxhdGVEaXNwbGF5U3RlcHMoXG4gICAgICBjdXJyZW50UGFnZSxcbiAgICAgIHRvdGFsU3RlcHMsXG4gICAgICBwYXJzZUludChtYXhEaXNwbGF5ZWRTdGVwcylcbiAgICApLFxuICAgIHByZWZpeCxcbiAgfSk7XG5cbiAgbmF2aWdhdGUoe1xuICAgIGRpcmVjdGlvbjogY3VycmVudFBhZ2UsXG4gICAgZWxlbWVudCxcbiAgICBjdXJyZW50U3RlcDogcGFyc2VJbnQoYWN0aXZlU3RlcCksXG4gICAgcHJlZml4LFxuICAgIHRvdGFsU3RlcHMsXG4gIH0pO1xufTtcblxuY29uc3QgY2FsY3VsYXRlRGlzcGxheVN0ZXBzID0gKGN1cnJlbnRQYWdlLCB0b3RhbFN0ZXBzLCBtYXhEaXNwbGF5ZWRTdGVwcykgPT4ge1xuICBpZiAodG90YWxTdGVwcyA8PSBtYXhEaXNwbGF5ZWRTdGVwcylcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogdG90YWxTdGVwcyB9LCAoXywgaSkgPT4gaSArIDEpO1xuXG4gIGNvbnN0IGhhbGYgPSBNYXRoLmZsb29yKG1heERpc3BsYXllZFN0ZXBzIC8gMik7XG4gIGlmIChjdXJyZW50UGFnZSA8PSBoYWxmICsgMSlcbiAgICByZXR1cm4gWy4uLkFycmF5KG1heERpc3BsYXllZFN0ZXBzIC0gMikua2V5cygpXVxuICAgICAgLm1hcCgoaSkgPT4gaSArIDEpXG4gICAgICAuY29uY2F0KFtcIi4uLlwiLCB0b3RhbFN0ZXBzXSk7XG4gIGlmICh0b3RhbFN0ZXBzIC0gY3VycmVudFBhZ2UgPD0gaGFsZilcbiAgICByZXR1cm4gWzEsIFwiLi4uXCJdLmNvbmNhdChcbiAgICAgIEFycmF5LmZyb20oXG4gICAgICAgIHsgbGVuZ3RoOiBtYXhEaXNwbGF5ZWRTdGVwcyAtIDIgfSxcbiAgICAgICAgKF8sIGkpID0+IHRvdGFsU3RlcHMgLSBtYXhEaXNwbGF5ZWRTdGVwcyArIDMgKyBpXG4gICAgICApXG4gICAgKTtcbiAgY29uc3QgZmlyc3RTdGVwID0gY3VycmVudFBhZ2UgLSAxO1xuICByZXR1cm4gW1xuICAgIDEsXG4gICAgXCIuLi5cIixcbiAgICAuLi5BcnJheS5mcm9tKHsgbGVuZ3RoOiBtYXhEaXNwbGF5ZWRTdGVwcyAtIDQgfSwgKF8sIGkpID0+IGZpcnN0U3RlcCArIGkpLFxuICAgIFwiLi4uXCIsXG4gICAgdG90YWxTdGVwcyxcbiAgXTtcbn07XG5cbmNvbnN0IHJlbmRlclBhZ2luYXRpb25TdGVwcyA9ICh7IGVsZW1lbnQsIHN0ZXBzLCBwcmVmaXggfSkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2VsZW1lbnQuaWR9LWlubmVyLXN0ZXBzYCk7XG4gIGNvbnN0IHVybFNlYXJjaFBhcmFtcyA9IGdldFVybFBhcmFtcygpO1xuICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICBzdGVwcy5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoc3RlcCA9PT0gXCIuLi5cIiA/IFwic3BhblwiIDogXCJhXCIpO1xuICAgIGl0ZW0udGV4dENvbnRlbnQgPSBzdGVwO1xuICAgIGlmIChzdGVwID09PSBcIi4uLlwiKSB7XG4gICAgICBpdGVtLmNsYXNzTmFtZSA9IFwibW9vbi1wYWdpbmF0aW9uLWVsbGlwc2lzXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZW0uY2xhc3NOYW1lID1cbiAgICAgICAgXCJtb29uLXBhZ2luYXRpb24taXRlbSBkYXRhLVthY3RpdmU9dHJ1ZV06bW9vbi1wYWdpbmF0aW9uLWl0ZW0tYWN0aXZlXCI7XG4gICAgICB1cmxTZWFyY2hQYXJhbXMuc2V0KHByZWZpeCwgc3RlcCk7XG4gICAgICBpdGVtLmhyZWYgPSBgPyR7dXJsU2VhcmNoUGFyYW1zLnRvU3RyaW5nKCl9YDtcbiAgICAgIGl0ZW0uZGF0YXNldC5wYWdpbmF0aW9uU3RlcCA9IHN0ZXA7XG4gICAgfVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtKTtcbiAgfSk7XG59O1xuXG5jb25zdCBuYXZpZ2F0ZSA9ICh7XG4gIGRpcmVjdGlvbixcbiAgZWxlbWVudCxcbiAgY3VycmVudFN0ZXAsXG4gIG1vZGUgPSBcImxpbmtzXCIsXG4gIHByZWZpeCxcbiAgdG90YWxTdGVwcyxcbn0pID0+IHtcbiAgY29uc3Qgc3RlcCA9IC9eXFxkKyQvLnRlc3QoZGlyZWN0aW9uKSA/IHBhcnNlSW50KGRpcmVjdGlvbikgOiBudWxsO1xuICBzdGVwXG4gICAgPyBuYXZpZ2F0ZVRvU3RlcCh7IGVsZW1lbnQsIHN0ZXAsIHByZWZpeCwgdG90YWxTdGVwcywgbW9kZSB9KVxuICAgIDogbmF2aWdhdGVXaXRoQXJyb3dzKHsgZGlyZWN0aW9uLCBlbGVtZW50LCBjdXJyZW50U3RlcCwgdG90YWxTdGVwcywgbW9kZSB9KTtcbn07XG5cbmNvbnN0IG5hdmlnYXRlV2l0aEFycm93cyA9ICh7XG4gIGRpcmVjdGlvbixcbiAgZWxlbWVudCxcbiAgY3VycmVudFN0ZXAsXG4gIHRvdGFsU3RlcHMsXG4gIG1vZGUsXG59KSA9PiB7XG4gIGNvbnN0IHN0ZXAgPSBkaXJlY3Rpb24gPT09IFwicHJldlwiID8gY3VycmVudFN0ZXAgLSAxIDogY3VycmVudFN0ZXAgKyAxO1xuXG4gIGlmIChpc1ZhbGlkU3RlcChzdGVwLCB0b3RhbFN0ZXBzKSkge1xuICAgIG5hdmlnYXRlVG9TdGVwKHsgZWxlbWVudCwgc3RlcCwgdG90YWxTdGVwcywgbW9kZSB9KTtcbiAgfVxufTtcblxuY29uc3QgbmF2aWdhdGVUb1N0ZXAgPSAoeyBlbGVtZW50LCBzdGVwLCBwcmVmaXgsIHRvdGFsU3RlcHMsIG1vZGUgfSkgPT4ge1xuICBjb25zdCBuZXdBY3RpdmVTdGVwID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIGBbZGF0YS1wYWdpbmF0aW9uLXN0ZXA9JyR7c3RlcH0nXWBcbiAgKTtcblxuICBpZiAoIW5ld0FjdGl2ZVN0ZXApIHJldHVybjtcblxuICB1cGRhdGVBY3RpdmVTdGVwKGVsZW1lbnQsIG5ld0FjdGl2ZVN0ZXAsIHN0ZXApO1xuICB1cGRhdGVOYXZBcnJvd3MoeyBlbGVtZW50LCBuZXdTdGVwOiBzdGVwLCBwcmVmaXgsIHRvdGFsU3RlcHMsIG1vZGUgfSk7XG59O1xuXG5jb25zdCB1cGRhdGVBY3RpdmVTdGVwID0gKGVsZW1lbnQsIG5ld0FjdGl2ZVN0ZXAsIHN0ZXApID0+IHtcbiAgY29uc3QgY3VycmVudFNlbGVjdGVkSXRlbSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtYWN0aXZlPXRydWVdYCk7XG4gIGN1cnJlbnRTZWxlY3RlZEl0ZW0/LnNldEF0dHJpYnV0ZShcImRhdGEtYWN0aXZlXCIsIFwiZmFsc2VcIik7XG4gIGN1cnJlbnRTZWxlY3RlZEl0ZW0/LnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgXCJmYWxzZVwiKTtcblxuICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtYWN0aXZlLXN0ZXBcIiwgc3RlcCk7XG4gIG5ld0FjdGl2ZVN0ZXAuc2V0QXR0cmlidXRlKFwiZGF0YS1hY3RpdmVcIiwgXCJ0cnVlXCIpO1xuICBuZXdBY3RpdmVTdGVwLnNldEF0dHJpYnV0ZShcImFyaWEtc2VsZWN0ZWRcIiwgXCJ0cnVlXCIpO1xufTtcblxuY29uc3QgdXBkYXRlTmF2QXJyb3dzID0gKHsgZWxlbWVudCwgbmV3U3RlcCwgcHJlZml4LCB0b3RhbFN0ZXBzLCBtb2RlIH0pID0+IHtcbiAgW1wicHJldlwiLCBcIm5leHRcIl0uZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiB7XG4gICAgY29uc3QgYXJyb3cgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgJHtwYWdpbmF0aW9uU3RlcElkUHJlZml4fSR7ZWxlbWVudC5pZH0tJHtkaXJlY3Rpb259YFxuICAgICk7XG4gICAgaWYgKCFhcnJvdykgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3RlcCA9IGRpcmVjdGlvbiA9PT0gXCJwcmV2XCIgPyBuZXdTdGVwIC0gMSA6IG5ld1N0ZXAgKyAxO1xuXG4gICAgaXNWYWxpZFN0ZXAoc3RlcCwgdG90YWxTdGVwcylcbiAgICAgID8gdXBkYXRlTGlua05hdkFycm93KGFycm93LCBzdGVwLCBwcmVmaXgsIG1vZGUpXG4gICAgICA6IGRpc2FibGVMaW5rQXJyb3coYXJyb3csIG1vZGUpO1xuICB9KTtcbn07XG5cbmNvbnN0IHVwZGF0ZUxpbmtOYXZBcnJvdyA9IChpdGVtLCBzdGVwLCBwcmVmaXgsIG1vZGUgPSBcImxpbmtzXCIpID0+IHtcbiAgaWYgKG1vZGUgIT09IFwibGlua3NcIikge1xuICAgIGl0ZW0ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdXJsU2VhcmNoUGFyYW1zID0gZ2V0VXJsUGFyYW1zKCk7XG4gIHVybFNlYXJjaFBhcmFtcy5zZXQocHJlZml4LCBzdGVwKTtcbiAgaXRlbS5ocmVmID0gYD8ke3VybFNlYXJjaFBhcmFtcy50b1N0cmluZygpfWA7XG4gIGl0ZW0ucmVtb3ZlQXR0cmlidXRlKFwib25jbGlja1wiKTtcbiAgaXRlbS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIpO1xufTtcblxuY29uc3QgZGlzYWJsZUxpbmtBcnJvdyA9IChpdGVtLCBtb2RlID0gXCJsaW5rc1wiKSA9PiB7XG4gIGlmIChtb2RlICE9PSBcImxpbmtzXCIpIHtcbiAgICBpdGVtLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGl0ZW0ucmVtb3ZlQXR0cmlidXRlKFwiaHJlZlwiKTtcbiAgaXRlbS5zZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIsIFwicmV0dXJuIGZhbHNlO1wiKTtcbiAgaXRlbS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbn07XG5cbmNvbnN0IGlzVmFsaWRTdGVwID0gKHN0ZXAsIHRvdGFsU3RlcHMpID0+IHN0ZXAgPiAwICYmIHN0ZXAgPD0gdG90YWxTdGVwcztcblxuY29uc3QgZ2V0VXJsUGFyYW1zID0gKCkgPT4gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZikuc2VhcmNoUGFyYW1zO1xuXG5leHBvcnQgZGVmYXVsdCBQYWdpbmF0aW9uSG9vaztcbiIsICIvLyBUaGUgZHVyYXRpb24gb2YgdGhlIHBvcG92ZXIgYW5pbWF0aW9uIGluIG1zXG5jb25zdCBQT1BPVkVSX0FOSU1BVElPTl9EVVJBVElPTiA9IDIwMDtcbmNvbnN0IFRJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCA9IFwiY3ViaWMtYmV6aWVyKDAuMiwgMCwgMC4zOCwgMC45KVwiO1xuLypcbiAqIFNraXAgQW5pbWF0aW9uIGNvbnN0YW50XG4gKiAtLS0tLS0tLS0tLS0tLS1cbiAqIFRoZSBrZXlmcmFtZXMgYW5kIG9wdGlvbnMgZm9yIHRoZSBza2lwIGFuaW1hdGlvblxuICogQHR5cGUge09iamVjdH1cbiAqL1xuY29uc3QgUE9QT1ZFUl9TS0lQX09QVFNfTlVMTCA9IHtcbiAgZHVyYXRpb246IDAsXG4gIGl0ZXJhdGlvbnM6IDEsXG4gIGVhc2luZzogXCJsaW5lYXJcIixcbn07XG4vKipcbiAqIEVudHJ5IGFuaW1hdGlvbiBjb25zdGFudFxuICogLS0tLS0tLS0tLS0tLS0tXG4gKiBUaGUga2V5ZnJhbWVzIGFuZCBvcHRpb25zIGZvciB0aGUgZW50cnkgYW5pbWF0aW9uXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5jb25zdCBQT1BPVkVSX0VOVFJZX0FOSU1BVElPTiA9IHtcbiAga2V5ZnJhbWVzKG9yaWdpbiA9IFwidG9wXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBmaWx0ZXI6IFwiYmx1cigxcHgpXCIsXG4gICAgICAgIHRvcDogb3JpZ2luID09PSBcInRvcFwiID8gXCIxMHB4XCIgOiBcIi0xMHB4XCIsXG4gICAgICB9LFxuICAgICAgeyBvcGFjaXR5OiAxLCBmaWx0ZXI6IFwiYmx1cigwcHgpXCIsIHRvcDogXCIwcHhcIiB9LFxuICAgIF07XG4gIH0sXG4gIG9wdHM6IHtcbiAgICBkdXJhdGlvbjogUE9QT1ZFUl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgaXRlcmF0aW9uczogMSxcbiAgICBlYXNpbmc6IFRJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCxcbiAgfSxcbn07XG4vKipcbiAqIEV4aXQgYW5pbWF0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS1cbiAqICBUaGUga2V5ZnJhbWVzIGFuZCBvcHRpb25zIGZvciB0aGUgZXhpdCBhbmltYXRpb25cbiAqICBAdHlwZSB7T2JqZWN0fVxuICovXG5jb25zdCBQT1BPVkVSX0VYSVRfQU5JTUFUSU9OID0ge1xuICBrZXlmcmFtZXMob3JpZ2luID0gXCJ0b3BcIikge1xuICAgIHJldHVybiBbXG4gICAgICB7IGZpbHRlcjogXCJibHVyKDBweClcIiwgdG9wOiBcIjBweFwiLCBvcGFjaXR5OiAxIH0sXG4gICAgICB7XG4gICAgICAgIGZpbHRlcjogXCJibHVyKDFweClcIixcbiAgICAgICAgdG9wOiBvcmlnaW4gPT09IFwidG9wXCIgPyBcIjNweFwiIDogXCItM3B4XCIsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICB9LFxuICAgIF07XG4gIH0sXG4gIG9wdHM6IHtcbiAgICBkdXJhdGlvbjogUE9QT1ZFUl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgaXRlcmF0aW9uczogMSxcbiAgICBlYXNpbmc6IFRJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCxcbiAgfSxcbn07XG5cbmNvbnN0IFBvcG92ZXIgPSB7XG4gIC8qKlxuICAgKiBTaG93IHRoZSBwb3BvdmVyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgYG1kczpwb3BvdmVyOnNob3dgIGV2ZW50IGlzIGZpcmVkXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IEV2ZW50XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgc2hvdyhldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2V0VGFyZ2V0KGV2ZW50KTtcbiAgICBjb25zdCBjdXJyZW50U2lkZSA9IHRoaXMuZWwuZGF0YXNldC5zaWRlIHx8IFwiYm90dG9tXCI7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSB0YXJnZXQgbm90IGZvdW5kLCB0aHJvdyBhbiBlcnJvclxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcihcIk1EUyBQb3BvdmVyOiBUYXJnZXQgbm90IGZvdW5kXCIpO1xuICAgICAgcmV0dXJuOyAvLyBDYW4ndCBkbyBhbnl0aGluZyB3aXRob3V0IGEgdGFyZ2V0XG4gICAgfVxuXG4gICAgLy8gRml4IG11bHRpcGxlIHNwYW0gY2xpY2tcbiAgICBpZiAodGhpcy5jbG9zaW5nVGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xvc2luZ1RpbWVvdXQpO1xuICAgICAgdGhpcy5jbG9zaW5nVGltZW91dCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgdGFyZ2V0XG4gICAgY29uc3QgdGFyZ2V0UmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIHRoaXMuYXBwbHlDU1NWYXJzKHtcbiAgICAgIGFuY2hvckhlaWdodDogdGFyZ2V0UmVjdC5oZWlnaHQsXG4gICAgICBhbmNob3JXaWR0aDogdGFyZ2V0UmVjdC53aWR0aCxcbiAgICAgIHRvcDogdGFyZ2V0UmVjdC50b3AsXG4gICAgICBib3R0b206IHdpbmRvdy5pbm5lckhlaWdodCAtIHRhcmdldFJlY3QuYm90dG9tLFxuICAgIH0pO1xuXG4gICAgLy8gU2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9wb3ZlclxuICAgIHRoaXMuZWwuc3R5bGUudHJhbnNmb3JtID0gdGhpcy5nZXRUcmFuc2Zvcm0odGFyZ2V0UmVjdCk7XG5cbiAgICAvLyBBcHBseSB0aGUgZW50cnkgYW5pbWF0aW9uXG4gICAgdGhpcy5lbC5hbmltYXRlKFxuICAgICAgUE9QT1ZFUl9FTlRSWV9BTklNQVRJT04ua2V5ZnJhbWVzKGN1cnJlbnRTaWRlKSxcbiAgICAgIHRoaXMuZWwuZGF0YXNldC5za2lwQW5pbWF0aW9uID09PSBcInRydWVcIlxuICAgICAgICA/IFBPUE9WRVJfU0tJUF9PUFRTX05VTExcbiAgICAgICAgOiBQT1BPVkVSX0VOVFJZX0FOSU1BVElPTi5vcHRzXG4gICAgKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBjbGFzcyBoaWRkZW5cbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICB9KTtcblxuICAgIC8vIFNldHVwIHRoZSBkaXNwb3NlIGZ1bmN0aW9uLCB3aGljaCBoYXZlIHRoZSBldmVudCBsaXN0ZW5lciB0byBoaWRlIHRoZSBwb3BvdmVyIG9uIGNsaWNrIG91dHNpZGVcbiAgICB0aGlzLmRpc3Bvc2VGdW5jID0gdGhpcy5kaXNwb3NlLmJpbmQodGhpcyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZGlzcG9zZUZ1bmMpO1xuXG4gICAgLy8gU2V0dXAgdGhlIGNoYXNlIGZ1bmN0aW9uLCB3aGljaCBoYXZlIHRoZSBldmVudCBsaXN0ZW5lciB0byBjaGFzZSB0aGUgdGFyZ2V0IG9uIHNjcm9sbFxuICAgIHRoaXMuY2hhc2VGdW5jID0gKCkgPT4gdGhpcy5jaGFzZS5iaW5kKHRoaXMpKHRhcmdldCk7XG5cbiAgICAvLyBBZGQgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIGNoYXNlIHRoZSB0YXJnZXQgb24gc2Nyb2xsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5jaGFzZUZ1bmMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuY2hhc2VGdW5jKTtcblxuICAgIC8vIFJ1biB0aGUgZmlyc3QgY2hhc2VcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5jaGFzZUZ1bmMoKSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5jaGFzZUZ1bmMoKSksIDQwMCk7XG5cbiAgICAvLyBTZXQgdGhlIHN0YXRlIHRvIHZpc2libGVcbiAgICB0aGlzLmVsLmRhdGFzZXQuc3RhdGUgPSBcInZpc2libGVcIjtcbiAgfSxcbiAgLyoqXG4gICAqIEhpZGUgdGhlIHBvcG92ZXJcbiAgICogLS0tLS0tLS0tLS0tLS0tLVxuICAgKlxuICAgKiAgQHBhcmFtIHtFdmVudH0gRXZlbnRcbiAgICogIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgaGlkZShldmVudCkge1xuICAgIC8vIEN1cnJlbnQgU2lkZVxuICAgIGNvbnN0IGN1cnJlbnRTaWRlID0gdGhpcy5lbC5kYXRhc2V0LnNpZGUgfHwgXCJib3R0b21cIjtcbiAgICAvLyBPbiBDbG9zZSBDYWxsYmFja1xuICAgIGNvbnN0IG9uQ2xvc2VDYWxsYmFjayA9IHRoaXMuZWwuZGF0YXNldC5vbkNsb3NlO1xuXG4gICAgLy8gQXBwbHkgdGhlIGV4aXQgYW5pbWF0aW9uXG4gICAgdGhpcy5lbC5hbmltYXRlKFxuICAgICAgUE9QT1ZFUl9FWElUX0FOSU1BVElPTi5rZXlmcmFtZXMoY3VycmVudFNpZGUpLFxuICAgICAgdGhpcy5lbC5kYXRhc2V0LnNraXBBbmltYXRpb24gPT0gXCJ0cnVlXCJcbiAgICAgICAgPyBQT1BPVkVSX1NLSVBfT1BUU19OVUxMXG4gICAgICAgIDogUE9QT1ZFUl9FWElUX0FOSU1BVElPTi5vcHRzXG4gICAgKTtcblxuICAgIGlmICh0aGlzLmNsb3NpbmdUaW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jbG9zaW5nVGltZW91dCk7XG4gICAgICB0aGlzLmNsb3NpbmdUaW1lb3V0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBBcHBseSB0aGUgY2xhc3MgaGlkZGVuIGFmdGVyIHRoZSBhbmltYXRpb25cbiAgICB0aGlzLmNsb3NpbmdUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBBZGQgdGhlIGNsYXNzIGhpZGRlblxuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH0sIFBPUE9WRVJfQU5JTUFUSU9OX0RVUkFUSU9OKTtcblxuICAgIC8vIFJlbW92ZSB0aGUgZGlzcG9zZSBmdW5jdGlvbiBpbiBjYXNlIGV4aXN0c1xuICAgIGlmICh0aGlzLmRpc3Bvc2VGdW5jKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5kaXNwb3NlRnVuYyk7XG4gICAgICB0aGlzLmRpc3Bvc2VGdW5jID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIGNoYXNlIGZ1bmN0aW9uIGluIGNhc2UgZXhpc3RzXG4gICAgaWYgKHRoaXMuY2hhc2VGdW5jKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBzdGF0ZSB0byBoaWRkZW5cbiAgICB0aGlzLmVsLmRhdGFzZXQuc3RhdGUgPSBcImhpZGRlblwiO1xuXG4gICAgaWYgKG9uQ2xvc2VDYWxsYmFjayAmJiBvbkNsb3NlQ2FsbGJhY2sgIT09IFwiXCIpIHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlModGhpcy5lbCwgdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9uLWNsb3NlXCIpKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhlIHBvcG92ZXIgdmlzaWJpbGl0eVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtFdmVudH0gRXZlbnRcbiAgICogIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgdG9nZ2xlKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZWwuZGF0YXNldC5zdGF0ZSA9PT0gXCJoaWRkZW5cIikge1xuICAgICAgdGhpcy5zaG93KGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlKGV2ZW50KTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdHJhbnNmb3JtIHByb3BlcnR5IGZvciB0aGUgcG9wb3ZlclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtET01SZWN0fSB0YXJnZXRcbiAgICogIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqICBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0VHJhbnNmb3JtKHRhcmdldFJlY3QpIHtcbiAgICBjb25zdCBjdXJyZW50U2lkZSA9IHRoaXMuZWwuZGF0YXNldC5zaWRlIHx8IFwiYm90dG9tXCI7XG4gICAgY29uc3QgY3VycmVudEFsaWduID0gdGhpcy5nZXRBbGlnbigpO1xuXG4gICAgY29uc3QgY3VycmVudE9mZnNldCA9IHBhcnNlSW50KFxuICAgICAgdGhpcy5nZXRFbFN0eWxlKHRoaXMuZWwpLmdldFByb3BlcnR5VmFsdWUoXG4gICAgICAgIFwiLS1tZHMtcG9wb3Zlci10cmFuc2Zvcm0tb3JpZ2luXCJcbiAgICAgICkgfHwgXCIwXCJcbiAgICApO1xuICAgIGNvbnN0IGZpbmFsVHJhbnNmb3JtID0ge1xuICAgICAgdG9wOlxuICAgICAgICBjdXJyZW50U2lkZSA9PT0gXCJ0b3BcIlxuICAgICAgICAgID8gdGFyZ2V0UmVjdC50b3AgLSB0aGlzLmVsLm9mZnNldEhlaWdodCAtIDRcbiAgICAgICAgICA6IHRhcmdldFJlY3QudG9wICsgdGFyZ2V0UmVjdC5oZWlnaHQgKyA0LFxuICAgICAgbGVmdDpcbiAgICAgICAgKChjbGllbnRXaWR0aCkgPT4ge1xuICAgICAgICAgIGlmIChjdXJyZW50QWxpZ24gPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFJlY3QubGVmdCArIHRhcmdldFJlY3Qud2lkdGggLSBjbGllbnRXaWR0aDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY3VycmVudEFsaWduID09PSBcIm1pZGRsZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0UmVjdC5sZWZ0ICsgKHRhcmdldFJlY3Qud2lkdGggLSBjbGllbnRXaWR0aCkgLyAyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0YXJnZXRSZWN0LmxlZnQ7XG4gICAgICAgIH0pKHRoaXMuZWwuY2xpZW50V2lkdGgpIHx8IDAsXG4gICAgfTtcblxuICAgIHJldHVybiBgdHJhbnNsYXRlM2QoJHtNYXRoLmNlaWwoZmluYWxUcmFuc2Zvcm0ubGVmdCl9cHgsICR7XG4gICAgICBNYXRoLmNlaWwoZmluYWxUcmFuc2Zvcm0udG9wKSArIGN1cnJlbnRPZmZzZXRcbiAgICB9cHgsIDApYDtcbiAgfSxcbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBkaXJlY3Rpb24gaXMgUlRMXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgaXNSVEwoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpLmRpcmVjdGlvbiA9PT0gXCJydGxcIjtcbiAgfSxcbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBhbGlnbiBiYXNlZCBhbHNvIG9uIHRoZSBSVEwgZGlcbiAgICovXG4gIGdldEFsaWduKCkge1xuICAgIC8vIENoZWNrIGlmIHRoZSBkaXJlY3Rpb24gaXMgUlRMXG4gICAgY29uc3QgaXNSVEwgPSB0aGlzLmlzUlRMKCk7XG4gICAgLy8gR2V0IHRoZSBjdXJyZW50IGFsaWduXG4gICAgY29uc3QgY3VycmVudEFsaWduID0gdGhpcy5lbC5kYXRhc2V0LmFsaWduIHx8IFwibGVmdFwiO1xuICAgIC8vIFJldHVybiB0aGUgY3VycmVudCBhbGlnblxuICAgIHJldHVybiBpc1JUTCA/IChjdXJyZW50QWxpZ24gPT09IFwibGVmdFwiID8gXCJyaWdodFwiIDogXCJsZWZ0XCIpIDogY3VycmVudEFsaWduO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgQ29tcHV0ZWQgU3R5bGVcbiAgICovXG4gIGdldEVsU3R5bGUoZWwpIHtcbiAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICB9LFxuICAvKipcbiAgICogR2V0IHRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50XG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtFdmVudH0gRXZlbnRcbiAgICogIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICogIEBwcml2YXRlXG4gICAqL1xuICBnZXRUYXJnZXQoZXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC5kZXRhaWw/LmRpc3BhdGNoZXIgPz8gZXZlbnQudGFyZ2V0O1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9LFxuICAvKipcbiAgICogU2hvdWxkIGFwcGx5IG9yaWdpbj9cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIEBwYXJhbSB7T2JqZWN0fSBzdGF0dXNcbiAgICogIEBwYXJhbSB7U3RyaW5nfSBjdXJyZW50U2lkZVxuICAgKiAgQHBhcmFtIHtOdW1iZXJ9IG9mZnNldEhlaWdodFxuICAgKiAgQHJldHVybnMge0Jvb2xlYW59XG4gICAqICBAcHJpdmF0ZVxuICAgKi9cbiAgaXNPdXRzaWRlVmlld3BvcnQoc3RhdHVzLCBjdXJyZW50U2lkZSwgb2Zmc2V0SGVpZ2h0KSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvcG92ZXIgaXMgb3V0c2lkZSB0aGUgdmlld3BvcnRcbiAgICBpZiAoXG4gICAgICAoc3RhdHVzLmF2YWlsYWJsZVNwYWNlVG9wIDw9IG9mZnNldEhlaWdodCAmJiBjdXJyZW50U2lkZSA9PT0gXCJ0b3BcIikgfHxcbiAgICAgIChzdGF0dXMuYXZhaWxhYmxlU3BhY2VCb3R0b20gPD0gb2Zmc2V0SGVpZ2h0ICYmIGN1cnJlbnRTaWRlID09PSBcImJvdHRvbVwiKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLyoqXG4gICAqIERpc3Bvc2UgdGhlIHBvcG92ZXJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtFdmVudH0gRXZlbnRcbiAgICogIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZGlzcG9zZShldmVudCkge1xuICAgIC8vIElnbm9yZSBpZiB0aGUgcG9wb3ZlciBpcyBoaWRkZW5cbiAgICBpZiAodGhpcy5lbC5kYXRhc2V0LnN0YXRlID09IFwiaGlkZGVuXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmdldFRhcmdldChldmVudCk7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIC8vIE5vIFRhcmdldFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghIXRhcmdldC5jbG9zZXN0KFwiW2RhdGEtaWdub3JlLW1kcy1wb3BvdmVyLWRpc3Bvc2VdXCIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIHRhcmdldCBpcyBhIGNoaWxkIG9mIHRoZSBwb3BvdmVyLCBpZiBub3QsIGhpZGUgdGhlIHBvcG92ZXJcbiAgICBjb25zdCBpc0Nsb3Nlc3QgPSAhIXRhcmdldC5jbG9zZXN0KFwiI1wiICsgdGhpcy5lbC5pZCk7XG4gICAgaWYgKCFpc0Nsb3Nlc3QpIHtcbiAgICAgIHRoaXMuaGlkZShldmVudCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgd2luZG93IGlzIHNjcm9sbGVkIGFuZCBjaGFzZSB0aGUgdmlld3BvcnRcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICAgKiAgQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBjaGFzZSh0YXJnZXQpIHtcbiAgICBjb25zdCB0YXJnZXRSZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGN1cnJlbnRTaWRlID0gdGhpcy5lbC5kYXRhc2V0LnNpZGUgfHwgXCJib3R0b21cIjtcbiAgICBjb25zdCBzdGF0dXMgPSB7XG4gICAgICBhbmNob3JIZWlnaHQ6IE1hdGgucm91bmQodGFyZ2V0UmVjdC5oZWlnaHQpLFxuICAgICAgYW5jaG9yV2lkdGg6IE1hdGgucm91bmQodGFyZ2V0UmVjdC53aWR0aCksXG4gICAgICB0b3A6IE1hdGgubWF4KE1hdGgucm91bmQodGFyZ2V0UmVjdC50b3ApLCAwKSxcbiAgICAgIGJvdHRvbTogTWF0aC5tYXgoTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJIZWlnaHQgLSB0YXJnZXRSZWN0LmJvdHRvbSksIDApLFxuICAgICAgbGVmdDogTWF0aC5tYXgoTWF0aC5yb3VuZCh0YXJnZXRSZWN0LmxlZnQpLCAwKSxcbiAgICAgIHJpZ2h0OiBNYXRoLm1heChNYXRoLnJvdW5kKHdpbmRvdy5pbm5lcldpZHRoIC0gdGFyZ2V0UmVjdC5yaWdodCksIDApLFxuICAgIH07XG5cbiAgICAvLyBBcHBseSB0aGUgc3RhdHVzIHRvIHRoZSBwb3BvdmVyXG4gICAgdGhpcy5hcHBseUNTU1ZhcnMoc3RhdHVzKTtcblxuICAgIC8vIFN1cHBvcnQgZm9yIHJldmVyc2Ugc2lkZVxuICAgIGNvbnN0IHRyYW5zZm9ybUhlaWdodCA9XG4gICAgICBjdXJyZW50U2lkZSA9PT0gXCJ0b3BcIlxuICAgICAgICA/IHRoaXMuZWwub2Zmc2V0SGVpZ2h0ICsgc3RhdHVzLmFuY2hvckhlaWdodCArIDhcbiAgICAgICAgOiAodGhpcy5lbC5vZmZzZXRIZWlnaHQgKyBzdGF0dXMuYW5jaG9ySGVpZ2h0ICsgOCkgKiAtMTtcblxuICAgIGlmICh0aGlzLmlzT3V0c2lkZVZpZXdwb3J0KHN0YXR1cywgY3VycmVudFNpZGUsIHRoaXMuZWwub2Zmc2V0SGVpZ2h0KSkge1xuICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLW1kcy1wb3BvdmVyLXRyYW5zZm9ybS1vcmlnaW5cIixcbiAgICAgICAgYCR7dHJhbnNmb3JtSGVpZ2h0fWBcbiAgICAgICk7XG4gICAgICBsZXQgb2Zmc2V0VG9wID0gc3RhdHVzLmF2YWlsYWJsZVNwYWNlVG9wIC0gdGhpcy5lbC5vZmZzZXRIZWlnaHQ7XG4gICAgICBpZiAoY3VycmVudFNpZGUgPT09IFwidG9wXCIpIHtcbiAgICAgICAgb2Zmc2V0VG9wID0gc3RhdHVzLmF2YWlsYWJsZVNwYWNlVG9wO1xuICAgICAgfVxuICAgICAgaWYgKG9mZnNldFRvcCA8IDApIHtcbiAgICAgICAgdGhpcy5lbC5zdHlsZS50b3AgPSBgJHtNYXRoLmFicyhvZmZzZXRUb3ApfXB4YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tbWRzLXBvcG92ZXItdHJhbnNmb3JtLW9yaWdpblwiLCBcIjBcIik7XG4gICAgICB0aGlzLmVsLnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgdGhlIHRyYW5zZm9ybVxuICAgIHRoaXMuZWwuc3R5bGUudHJhbnNmb3JtID0gdGhpcy5nZXRUcmFuc2Zvcm0odGFyZ2V0UmVjdCk7XG4gIH0sXG4gIC8qKlxuICAgKiBBcHBseSBDU1MgVmFyaWFibGVzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXNcbiAgICogIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgYXBwbHlDU1NWYXJzKHZhbHVlcykge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5lbC5zdHlsZTtcbiAgICBjb25zdCBvYmplY3RLZXlzID0gT2JqZWN0LmtleXModmFsdWVzKTtcblxuICAgIGlmIChvYmplY3RLZXlzLmluY2x1ZGVzKFwiYW5jaG9ySGVpZ2h0XCIpKVxuICAgICAgc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFwiLS1tZHMtcG9wb3Zlci1hbmNob3ItaGVpZ2h0XCIsXG4gICAgICAgIGAke01hdGgucm91bmQodmFsdWVzLmFuY2hvckhlaWdodCl9cHhgXG4gICAgICApO1xuXG4gICAgaWYgKG9iamVjdEtleXMuaW5jbHVkZXMoXCJhbmNob3JXaWR0aFwiKSlcbiAgICAgIHN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tbWRzLXBvcG92ZXItYW5jaG9yLXdpZHRoXCIsXG4gICAgICAgIGAke01hdGgucm91bmQodmFsdWVzLmFuY2hvcldpZHRoKX1weGBcbiAgICAgICk7XG5cbiAgICBpZiAob2JqZWN0S2V5cy5pbmNsdWRlcyhcInRvcFwiKSlcbiAgICAgIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFwiLS1tZHMtcG9wb3Zlci1hdmFpbGFibGUtc3BhY2UtdG9wXCIsXG4gICAgICAgIGAke01hdGgucm91bmQodmFsdWVzLnRvcCl9cHhgXG4gICAgICApO1xuXG4gICAgaWYgKG9iamVjdEtleXMuaW5jbHVkZXMoXCJib3R0b21cIikpXG4gICAgICBzdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLW1kcy1wb3BvdmVyLWF2YWlsYWJsZS1zcGFjZS1ib3R0b21cIixcbiAgICAgICAgYCR7TWF0aC5yb3VuZCh2YWx1ZXMuYm90dG9tKX1weGBcbiAgICAgICk7XG5cbiAgICBpZiAob2JqZWN0S2V5cy5pbmNsdWRlcyhcInJpZ2h0XCIpKVxuICAgICAgc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFwiLS1tZHMtcG9wb3Zlci1hdmFpbGFibGUtc3BhY2UtcmlnaHRcIixcbiAgICAgICAgYCR7TWF0aC5yb3VuZCh2YWx1ZXMucmlnaHQpfXB4YFxuICAgICAgKTtcblxuICAgIGlmIChvYmplY3RLZXlzLmluY2x1ZGVzKFwibGVmdFwiKSlcbiAgICAgIHN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tbWRzLXBvcG92ZXItYXZhaWxhYmxlLXNwYWNlLWxlZnRcIixcbiAgICAgICAgYCR7TWF0aC5yb3VuZCh2YWx1ZXMubGVmdCl9cHhgXG4gICAgICApO1xuICB9LFxuICAvKipcbiAgICogVGhlIG1vdW50ZWQgaG9va1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgbW91bnRlZFxuICAgKlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gRGVmaW5lIHRoZSBzaG93IGFuZCBoaWRlIGZ1bmN0aW9uc1xuICAgIHRoaXMuc2hvd0Z1bmMgPSB0aGlzLnNob3cuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhpZGVGdW5jID0gdGhpcy5oaWRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b2dnbGVGdW5jID0gdGhpcy50b2dnbGUuYmluZCh0aGlzKTtcblxuICAgIC8vIEFkZCB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibWRzOnBvcG92ZXI6c2hvd1wiLCB0aGlzLnNob3dGdW5jKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZHM6cG9wb3ZlcjpoaWRlXCIsIHRoaXMuaGlkZUZ1bmMpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1kczpwb3BvdmVyOnRvZ2dsZVwiLCB0aGlzLnRvZ2dsZUZ1bmMpO1xuXG4gICAgLy8gTGlzdGVuIHRvIHRoZSBldmVudHMgKExpdmVWaWV3IGV2ZW50cylcbiAgICB0aGlzLmhhbmRsZUV2ZW50KFwibWRzOnBvcG92ZXI6c2hvd1wiLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGlzTXlFdmVudCA9IFwiI1wiICsgdGhpcy5lbC5pZCA9PSBldmVudC5pZCB8fCB0aGlzLmVsLmlkID09IGV2ZW50LmlkO1xuICAgICAgaWYgKGlzTXlFdmVudCkge1xuICAgICAgICB0aGlzLnNob3coZXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuaGFuZGxlRXZlbnQoXCJtZHM6cG9wb3ZlcjpoaWRlXCIsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgaXNNeUV2ZW50ID0gXCIjXCIgKyB0aGlzLmVsLmlkID09IGV2ZW50LmlkIHx8IHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQ7XG4gICAgICBpZiAoaXNNeUV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGlkZShldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5oYW5kbGVFdmVudChcIm1kczpwb3BvdmVyOnRvZ2dsZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGlzTXlFdmVudCA9IFwiI1wiICsgdGhpcy5lbC5pZCA9PSBldmVudC5pZCB8fCB0aGlzLmVsLmlkID09IGV2ZW50LmlkO1xuICAgICAgaWYgKGlzTXlFdmVudCkge1xuICAgICAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTZXR1cCB0aGUgaG92ZXIgdHJpZ2dlcnNcbiAgICB0aGlzLmhvdmVycyA9IFtdO1xuXG4gICAgLy8gU2V0dXAgdGhlIHBvcG92ZXJcbiAgICB0aGlzLnNldHVwKCk7XG5cbiAgICAvLyBDaGVjayBmb3IgaW5pdGlhbCBzdGF0dXNcbiAgICB0aGlzLmNoZWNrRm9ySW5pdGlhbFN0YXR1cygpO1xuICB9LFxuICAvKipcbiAgICogVGhlIGRlc3Ryb3llZCBob29rXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWRcbiAgICogIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZGVzdHJveWVkKCkge1xuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1kczpwb3BvdmVyOnNob3dcIiwgdGhpcy5zaG93RnVuYyk7XG4gICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibWRzOnBvcG92ZXI6aGlkZVwiLCB0aGlzLmhpZGVGdW5jKTtcbiAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZHM6cG9wb3Zlcjp0b2dnbGVcIiwgdGhpcy50b2dnbGVGdW5jKTtcblxuICAgIC8vIERlc3Ryb3kgZWxlbWVudHMgZXZlbnQgbGlzdGVuZXJzXG4gICAgdGhpcy5ob3ZlcnMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIGlmIChlbCkge1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCB0aGlzLnNob3dGdW5jKTtcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgdGhpcy5oaWRlRnVuYyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5kaXNwb3NlRnVuYykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZGlzcG9zZUZ1bmMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGFzZUZ1bmMpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBTZXR1cCB0aGUgcG9wb3ZlclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBzZXR1cCgpIHtcbiAgICAvLyBTZXR1cCB0aGUgaG92ZXIgdHJpZ2dlcnNcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtbWRzLXBvcG92ZXItaG92ZXJdXCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICBpZiAoZWwuZGF0YXNldC5tZHNQb3BvdmVySG92ZXIgPT09IHRoaXMuZWwuaWQpIHtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgdGhpcy5zaG93RnVuYyk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIHRoaXMuaGlkZUZ1bmMpO1xuXG4gICAgICAgIC8vIEFkZCB0aGUgZWxlbWVudCB0byB0aGUgaG92ZXJzIGFycmF5IHRvIGJlIGRlc3Ryb3llZCBsYXRlclxuICAgICAgICB0aGlzLmhvdmVycy5wdXNoKGVsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgbWF4aW11bSB6LWluZGV4IG9mIHRoZSBwYWdlXG4gICAgbGV0IGN1cnJlbnRaSW5kZXggPSA1MDtcbiAgICBjb25zdCB0cmVlV2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihcbiAgICAgIGRvY3VtZW50LmJvZHksXG4gICAgICBOb2RlRmlsdGVyLlNIT1dfRUxFTUVOVFxuICAgICk7XG5cbiAgICAvKlxuICAgICAqIExpbWl0IHRvIDUwMDAgdGhlIG1heCBpdGVyYXRpb25zXG4gICAgICogdG8gYXZvaWQgaW5maW5pdGUgbG9vcHNcbiAgICAgKi9cbiAgICBsZXQgbWF4Qm91bmRDeWNsZSA9IDA7XG4gICAgd2hpbGUgKHRyZWVXYWxrZXIubmV4dE5vZGUoKSAmJiBtYXhCb3VuZEN5Y2xlIDwgNTAwMCkge1xuICAgICAgY3VycmVudFpJbmRleCA9IE1hdGgubWF4KFxuICAgICAgICBjdXJyZW50WkluZGV4LFxuICAgICAgICBwYXJzZUludCh0aGlzLmdldEVsU3R5bGUodHJlZVdhbGtlci5jdXJyZW50Tm9kZSkuekluZGV4LCAxMCkgfHwgMFxuICAgICAgKTtcbiAgICAgIG1heEJvdW5kQ3ljbGUgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFpJbmRleCA+PSA1MCkge1xuICAgICAgdGhpcy5lbC5zdHlsZS56SW5kZXggPSBjdXJyZW50WkluZGV4ICsgMTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgY3JlYXRlZFxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY2hlY2tGb3JJbml0aWFsU3RhdHVzKCkge1xuICAgIC8vIEdldCB0aGUgdGFyZ2V0XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5lbC5kYXRhc2V0LnBvcG92ZXJUYXJnZXQ7XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgcG9wb3ZlciBzaG91bGQgYmUgdmlzaWJsZVxuICAgIGlmICh0aGlzLmVsLmRhdGFzZXQuaW5pdGlhbFN0YXRlID09PSBcInZpc2libGVcIiAmJiB0YXJnZXQpIHtcbiAgICAgIHRoaXMuc2hvdyh7IHRhcmdldCB9KTtcbiAgICB9XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQb3BvdmVyO1xuIiwgImNvbnN0IFJlc3BvbnNpdmVTY3JlZW4gPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5oYXZlTWluID0gISF0aGlzLmVsLmRhdGFzZXQubWluO1xuICAgIHRoaXMuaGF2ZU1heCA9ICEhdGhpcy5lbC5kYXRhc2V0Lm1heDtcblxuICAgIHRoaXMubWVkaWFRdWVyeSA9IHRoaXMuZ2VuTWVkaWFRdWVyeSgpO1xuXG4gICAgLy8gU2VuZGluZyB0aGUgZmlyc3QgZXZlbnRcbiAgICBpZiAodGhpcy5tZWRpYVF1ZXJ5Lm1hdGNoZXMpIHtcbiAgICAgIHRoaXMucHVzaEV2ZW50VG8odGhpcy5lbCwgXCJzaG93XCIpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgbGlzdGVuZXJcbiAgICB0aGlzLm1lZGlhUXVlcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoeyBtYXRjaGVzIH0pID0+IHtcbiAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgIHRoaXMucHVzaEV2ZW50VG8odGhpcy5lbCwgXCJzaG93XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wdXNoRXZlbnRUbyh0aGlzLmVsLCBcImhpZGVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHVwZGF0ZWQoKSB7XG4gICAgaWYgKHRoaXMubWVkaWFRdWVyeS5tYXRjaGVzKSB7XG4gICAgICB0aGlzLnB1c2hFdmVudFRvKHRoaXMuZWwsIFwic2hvd1wiKTtcbiAgICB9XG4gIH0sXG4gIGdlbk1lZGlhUXVlcnkoKSB7XG4gICAgaWYgKHRoaXMuaGF2ZU1pbiAmJiB0aGlzLmhhdmVNYXgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShcbiAgICAgICAgYChtaW4td2lkdGg6ICR7dGhpcy5lbC5kYXRhc2V0Lm1pbn1weCkgYW5kIChtYXgtd2lkdGg6ICR7dGhpcy5lbC5kYXRhc2V0Lm1heH1weClgLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGF2ZU1pbikge1xuICAgICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKGAobWluLXdpZHRoOiAke3RoaXMuZWwuZGF0YXNldC5taW59cHgpYCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhhdmVNYXgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHt0aGlzLmVsLmRhdGFzZXQubWF4fXB4KWApO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShgKG1pbi13aWR0aDogMXB4KWApO1xuICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNpdmVTY3JlZW47XG4iLCAiY29uc3QgU25hY2tiYXJIb29rID0ge1xuICBtb3VudGVkKCkge1xuICAgIC8vIHRoaXMuc2V0dXAoKTtcbiAgfSxcbiAgc2V0dXAoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoXCJmYWRlLW91dFwiKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5lbC5yZW1vdmUoKSwgMzAwKTsgLy8gZGVsYXkgdG8gYWxsb3cgZmFkZS1vdXQgYW5pbWF0aW9uXG4gICAgfSwgNDAwMCk7IC8vIGF1dG8tZGlzbWlzcyBpbiA0c1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgU25hY2tiYXJIb29rO1xuIiwgImNvbnN0IFRvb2x0aXAgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc3QgdG9vbHRpcCA9IHRoaXMuZWw7XG4gICAgY29uc3QgY29udGVudCA9IHRvb2x0aXAucXVlcnlTZWxlY3RvcihcIltyb2xlPSd0b29sdGlwJ11cIik7XG5cbiAgIGNvbnN0IGdldEJhc2VQb3NpdGlvbiA9ICgpID0+IGNvbnRlbnQ/LmRhdGFzZXQuYmFzZVBvc2l0aW9uO1xuICAgIGxldCBpc1Bvc2l0aW9uZWQgPSBmYWxzZTtcbiAgICBsZXQgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIGxldCByZXNpemVUaW1lb3V0ID0gbnVsbDtcblxuICAgIGNvbnN0IHBvc2l0aW9uQ2xhc3NlcyA9IHtcbiAgICAgIHRvcDogXCJcIixcbiAgICAgIGJvdHRvbTogXCJtb29uLXRvb2x0aXAtYm90dG9tXCIsXG4gICAgICBzdGFydDogXCJtb29uLXRvb2x0aXAtc3RhcnRcIixcbiAgICAgIGVuZDogXCJtb29uLXRvb2x0aXAtZW5kXCJcbiAgICB9O1xuXG4gICAgY29uc3QgY2xlYXJQb3NpdGlvbkNsYXNzZXMgPSAoKSA9PiB7XG4gICAgICBPYmplY3QudmFsdWVzKHBvc2l0aW9uQ2xhc3NlcykuZm9yRWFjaChjbHMgPT4ge1xuICAgICAgICBjbHMuc3BsaXQoXCIgXCIpLmZvckVhY2goYyA9PiB7aWYgKGMpIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZShjKX0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFwcGx5UG9zaXRpb24gPSAocG9zaXRpb24pID0+IHtcbiAgICAgIGNsZWFyUG9zaXRpb25DbGFzc2VzKCk7XG4gICAgICBwb3NpdGlvbkNsYXNzZXNbcG9zaXRpb25dLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICBpZiAoYykgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKGMpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNhbGN1bGF0ZUJlc3RQb3NpdGlvbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHRvb2x0aXBSZWN0ID0gY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHBhcmVudFJlY3QgPSB0b29sdGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3Qgdmlld3BvcnQgPSB7XG4gICAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHNwYWNlID0ge1xuICAgICAgICB0b3A6IHBhcmVudFJlY3QudG9wLFxuICAgICAgICBib3R0b206IHZpZXdwb3J0LmhlaWdodCAtIHBhcmVudFJlY3QuYm90dG9tLFxuICAgICAgICBzdGFydDogcGFyZW50UmVjdC5sZWZ0LFxuICAgICAgICBlbmQ6IHZpZXdwb3J0LndpZHRoIC0gcGFyZW50UmVjdC5yaWdodFxuICAgICAgfTtcblxuICAgICAgY29uc3QgZml0cyA9IHtcbiAgICAgICAgdG9wOiB0b29sdGlwUmVjdC5oZWlnaHQgPD0gc3BhY2UudG9wLFxuICAgICAgICBib3R0b206IHRvb2x0aXBSZWN0LmhlaWdodCA8PSBzcGFjZS5ib3R0b20sXG4gICAgICAgIHN0YXJ0OiB0b29sdGlwUmVjdC53aWR0aCA8PSBzcGFjZS5zdGFydCxcbiAgICAgICAgZW5kOiB0b29sdGlwUmVjdC53aWR0aCA8PSBzcGFjZS5lbmRcbiAgICAgIH07XG5cbiAgICAgIGlmIChmaXRzW2dldEJhc2VQb3NpdGlvbigpXSkgcmV0dXJuIGdldEJhc2VQb3NpdGlvbigpO1xuXG5cbiAgICAgIGNvbnN0IHNvcnRlZCA9IE9iamVjdC5lbnRyaWVzKHNwYWNlKVxuICAgICAgICAuZmlsdGVyKChbcG9zXSkgPT4gZml0c1twb3NdKVxuICAgICAgICAuc29ydCgoYSwgYikgPT4gYlsxXSAtIGFbMV0pO1xuXG4gICAgICByZXR1cm4gc29ydGVkLmxlbmd0aCA+IDAgPyBzb3J0ZWRbMF1bMF0gOiBnZXRCYXNlUG9zaXRpb24oKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0dXBPYnNlcnZlciA9ICgpID0+IHtcbiAgICAgIGlmIChvYnNlcnZlcikgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gICAgICBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihlbnRyaWVzID0+IHtcbiAgICAgICAgZm9yIChsZXQgZW50cnkgb2YgZW50cmllcykge1xuICAgICAgICAgIGlmICghZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGJlc3QgPSBjYWxjdWxhdGVCZXN0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIGFwcGx5UG9zaXRpb24oYmVzdCk7XG4gICAgICAgICAgICBpc1Bvc2l0aW9uZWQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWlzUG9zaXRpb25lZCkge1xuICAgICAgICAgICAgYXBwbHlQb3NpdGlvbihnZXRCYXNlUG9zaXRpb24oKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHJvb3Q6IG51bGwsXG4gICAgICAgIHRocmVzaG9sZDogMC45OSxcbiAgICAgIH0pO1xuXG4gICAgICBvYnNlcnZlci5vYnNlcnZlKGNvbnRlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBoYW5kbGVSZXNpemUgPSAoKSA9PiB7XG4gICAgICBpc1Bvc2l0aW9uZWQgPSBmYWxzZTtcbiAgICAgIGlmIChvYnNlcnZlcikgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgaWYgKHJlc2l6ZVRpbWVvdXQpIGNsZWFyVGltZW91dChyZXNpemVUaW1lb3V0KTtcblxuICAgICAgcmVzaXplVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhcHBseVBvc2l0aW9uKGdldEJhc2VQb3NpdGlvbigpKTtcbiAgICAgICAgc2V0dXBPYnNlcnZlcigpO1xuICAgICAgfSwgMzAwKTtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgaGFuZGxlUmVzaXplKTtcblxuICAgIHRvb2x0aXAuX2F1dG9Qb3NpdGlvbkNsZWFudXAgPSAoKSA9PiB7XG4gICAgICBpZiAob2JzZXJ2ZXIpIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIGlmIChyZXNpemVUaW1lb3V0KSBjbGVhclRpbWVvdXQocmVzaXplVGltZW91dCk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBoYW5kbGVSZXNpemUpO1xuICAgIH07XG5cbiAgICBhcHBseVBvc2l0aW9uKGdldEJhc2VQb3NpdGlvbigpKTtcbiAgICBzZXR1cE9ic2VydmVyKCk7XG4gIH0sXG5cbiAgZGVzdHJveWVkKCkge1xuICAgIHRoaXMuZWwuX2F1dG9Qb3NpdGlvbkNsZWFudXA/LigpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBUb29sdGlwO1xuIiwgImltcG9ydCBBY2NvcmRpb24gZnJvbSBcIi4vYWNjb3JkaW9uXCI7XG5pbXBvcnQgQXV0aGVudGljYXRvciBmcm9tIFwiLi9hdXRoZW50aWNhdG9yXCI7XG5pbXBvcnQgQm90dG9tc2hlZXRIb29rIGZyb20gXCIuL2JvdHRvbXNoZWV0XCI7XG5pbXBvcnQgQ2Fyb3VzZWxIb29rIGZyb20gXCIuL2Nhcm91c2VsXCI7XG5pbXBvcnQgQ2hlY2tib3hIb29rIGZyb20gXCIuL2NoZWNrYm94XCI7XG5pbXBvcnQgRGlhbG9nSG9vayBmcm9tIFwiLi9kaWFsb2dcIjtcbmltcG9ydCBEcmF3ZXJIb29rIGZyb20gXCIuL2RyYXdlclwiO1xuaW1wb3J0IEZpbGVJbnB1dCBmcm9tIFwiLi9maWxlX2lucHV0XCI7XG5pbXBvcnQgTW9vbkRyb3Bkb3duIGZyb20gXCIuL2Ryb3Bkb3duXCI7XG5pbXBvcnQgUGFnaW5hdGlvbkhvb2sgZnJvbSBcIi4vcGFnaW5hdGlvblwiO1xuaW1wb3J0IFBvcG92ZXIgZnJvbSBcIi4vcG9wb3ZlclwiO1xuaW1wb3J0IFJlc3BvbnNpdmVTY3JlZW4gZnJvbSBcIi4vcmVzcG9uc2l2ZV9zY3JlZW5cIjtcbmltcG9ydCBTbmFja2Jhckhvb2sgZnJvbSBcIi4vc25hY2tiYXJWMlwiO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSBcIi4vdG9vbHRpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEFjY29yZGlvbixcbiAgQXV0aGVudGljYXRvcixcbiAgQm90dG9tc2hlZXRIb29rLFxuICBDYXJvdXNlbEhvb2ssXG4gIENoZWNrYm94SG9vayxcbiAgRGlhbG9nSG9vayxcbiAgRHJhd2VySG9vayxcbiAgRmlsZUlucHV0LFxuICBNb29uRHJvcGRvd24sXG4gIFBhZ2luYXRpb25Ib29rLFxuICBQb3BvdmVyLFxuICBSZXNwb25zaXZlU2NyZWVuLFxuICBTbmFja2Jhckhvb2ssXG4gIFRvb2x0aXAsXG59O1xuIiwgIi8vIEhvb2tzIGZvciB0aGUgbW9vbl9kb2NzIGFwcFxuXG5pbXBvcnQgQ29kZVByZXZpZXcgZnJvbSBcIi4vQ29kZVByZXZpZXdcIjtcbmltcG9ydCBtb29uSG9va3MgZnJvbSBcIi4uLy4uLy4uLy4uL21vb24tbGl2ZS9hc3NldHMvanMvaG9va3MvaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBDb2RlUHJldmlld0hvb2s6IENvZGVQcmV2aWV3LFxuICAuLi5tb29uSG9va3MsXG59O1xuIiwgImZ1bmN0aW9uIHBvcHVsYXRlVG9rZW5zKCkge1xuICBjb25zdCB0b2tlbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtdG9rZW5dXCIpO1xuICBjb25zdCBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XG5cbiAgdG9rZW5zLmZvckVhY2goKHRva2VuKSA9PiB7XG4gICAgY29uc3QgdG9rZW5OYW1lID0gdG9rZW4uZ2V0QXR0cmlidXRlKFwiZGF0YS10b2tlblwiKTtcbiAgICBpZiAoIXRva2VuTmFtZSkgcmV0dXJuO1xuICAgIGNvbnN0IHRva2Vuc0xpc3QgPSB0b2tlbk5hbWUuc3BsaXQoXCIsXCIpLm1hcCgodCkgPT4gdC50cmltKCkpO1xuXG4gICAgY29uc3QgZ2V0VG9rZW5WYWx1ZSA9ICh0KSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSh0KTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgbGV0IGZpbmFsVmFsdWUgPSB0b2tlbnNMaXN0Lm1hcChnZXRUb2tlblZhbHVlKS5qb2luKFwiIFwiKTtcbiAgICBpZiAoXG4gICAgICB0b2tlbk5hbWUuaW5jbHVkZXMoXCItLXRleHQtYm9keS1cIikgfHxcbiAgICAgIHRva2VuTmFtZS5pbmNsdWRlcyhcIi0tdGV4dC1oZWFkaW5nLVwiKVxuICAgICkge1xuICAgICAgY29uc3QgcGFydHMgPSBmaW5hbFZhbHVlLnNwbGl0KFwiIFwiKTtcbiAgICAgIGZpbmFsVmFsdWUgPVxuICAgICAgICBgJHtwYXJ0c1swXX0gJHtwYXJ0c1sxXX0vJHtwYXJ0c1syXX1gICtcbiAgICAgICAgKHBhcnRzLmxlbmd0aCA+IDMgPyBgICR7cGFydHMuc2xpY2UoMykuam9pbihcIiBcIil9YCA6IFwiXCIpO1xuICAgIH1cbiAgICBpZiAodG9rZW5OYW1lLmluY2x1ZGVzKFwiLS1lZmZlY3Qtc2hhZG93LVwiKSkge1xuICAgICAgY29uc3QgcGFydHMgPSBmaW5hbFZhbHVlLnNwbGl0KFwiIFwiKTtcbiAgICAgIGZpbmFsVmFsdWUgPSBgJHtwYXJ0cy5zbGljZSgwLCA0KS5qb2luKFwiIFwiKX0gJHtwYXJ0c1xuICAgICAgICAuc2xpY2UoNCwgOSlcbiAgICAgICAgLmpvaW4oXCIgXCIpfSxcXG4ke3BhcnRzLnNsaWNlKDksIDEzKS5qb2luKFwiIFwiKX0gJHtwYXJ0c1xuICAgICAgICAuc2xpY2UoMTMpXG4gICAgICAgIC5qb2luKFwiIFwiKX1gO1xuICAgICAgdG9rZW4uc3R5bGUud2hpdGVTcGFjZSA9IFwicHJlLXdyYXBcIjtcbiAgICB9XG4gICAgdG9rZW4udGV4dENvbnRlbnQgPSBmaW5hbFZhbHVlO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcG9wdWxhdGVUb2tlbnM7XG4iLCAiLy8gSWYgeW91ciBjb21wb25lbnRzIHJlcXVpcmUgYW55IGhvb2tzIG9yIGN1c3RvbSB1cGxvYWRlcnMsIG9yIGlmIHlvdXIgcGFnZXNcbi8vIHJlcXVpcmUgY29ubmVjdCBwYXJhbWV0ZXJzLCB1bmNvbW1lbnQgdGhlIGZvbGxvd2luZyBsaW5lcyBhbmQgZGVjbGFyZSB0aGVtIGFzXG4vLyBzdWNoOlxuLy9cbmltcG9ydCBIb29rcyBmcm9tIFwiLi9ob29rc1wiO1xuaW1wb3J0IHBvcHVsYXRlVG9rZW5zIGZyb20gXCIuL3BvcHVsYXRlVG9rZW5zLmpzXCI7XG4vLyBpbXBvcnQgKiBhcyBQYXJhbXMgZnJvbSBcIi4vcGFyYW1zXCI7XG4vLyBpbXBvcnQgKiBhcyBVcGxvYWRlcnMgZnJvbSBcIi4vdXBsb2FkZXJzXCI7XG5cbihmdW5jdGlvbiAoKSB7XG4gIC8vICAgd2luZG93LnN0b3J5Ym9vayA9IHsgSG9va3MsIFBhcmFtcywgVXBsb2FkZXJzIH07XG4gIHdpbmRvdy5zdG9yeWJvb2sgPSB7IEhvb2tzIH07XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kaXIgPSBcImx0clwiO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGRldGFpbDogeyB0byB9LFxuICAgIH0gPSBldmVudDtcblxuICAgIGlmICh0by5pbmNsdWRlcyhcIi90b2tlbnNcIikpIHtcbiAgICAgIHBvcHVsYXRlVG9rZW5zKCk7XG4gICAgfVxuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDp1cGRhdGVcIiwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICBjb25zdCB7IGJhc2VVUkk6IHRvIH0gPSB0YXJnZXQ7XG5cbiAgICBpZiAodG8uaW5jbHVkZXMoXCJ0aGVtZT1kYXJrXCIpKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm1vb24tdGhlbWVcIiwgXCJkYXJrXCIpO1xuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJtb29uLXRoZW1lPWRhcms7IG1heC1hZ2U9MzE1MzYwMDA7IHBhdGg9L1wiO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibGlnaHQtdGhlbWVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJbY29sb3Itc2NoZW1lOmxpZ2h0XVwiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcImRhcmstdGhlbWVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJkYXJrXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwiW2NvbG9yLXNjaGVtZTpkYXJrXVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtb29uLXRoZW1lXCIsIFwibGlnaHRcIik7XG4gICAgICBkb2N1bWVudC5jb29raWUgPSBcIm1vb24tdGhlbWU9bGlnaHQ7IG1heC1hZ2U9MzE1MzYwMDA7IHBhdGg9L1wiO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiZGFyay10aGVtZVwiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIltjb2xvci1zY2hlbWU6ZGFya11cIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJkYXJrXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwibGlnaHQtdGhlbWVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJbY29sb3Itc2NoZW1lOmxpZ2h0XVwiKTtcbiAgICB9XG5cbiAgICBpZiAodG8uaW5jbHVkZXMoXCIvdG9rZW5zXCIpKSB7XG4gICAgICBwb3B1bGF0ZVRva2VucygpO1xuICAgIH1cbiAgfSk7XG59KSgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sY0FBYztBQUFBLElBQ2xCLFVBQVU7QUFFUixXQUFLLFNBQVMsS0FBSyxHQUFHLGNBQWMsNEJBQTRCO0FBQ2hFLFdBQUssVUFBVSxLQUFLLEdBQUcsY0FBYyw2QkFBNkI7QUFDbEUsV0FBSyxhQUFhLEtBQUssR0FBRyxjQUFjLGFBQWE7QUFDckQsV0FBSyxnQkFBZ0IsS0FBSyxHQUFHO0FBQUEsUUFDM0I7QUFBQSxNQUNGO0FBRUEsVUFBSSxDQUFDLEtBQUssV0FBVyxHQUFHO0FBRXRCLGFBQUssT0FBTyxpQkFBaUIsU0FBUyxNQUFNLEtBQUssT0FBTyxDQUFDO0FB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O0FBQ0EsVUFBSSxVQUFVLFNBQVMsa0JBQWtCLEdBQUc7QUFDMUMsY0FBTSxRQUFRLFdBQVcsTUFBTSxHQUFHO0FBQ2xDLHFCQUFhLEdBQUcsTUFBTSxNQUFNLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxLQUFLLE1BQzVDLE1BQU0sR0FBRyxDQUFDLEVBQ1YsS0FBSyxHQUFHO0FBQUEsRUFBTyxNQUFNLE1BQU0sR0FBRyxFQUFFLEVBQUUsS0FBSyxHQUFHLEtBQUssTUFDL0MsTUFBTSxFQUFFLEVBQ1IsS0FBSyxHQUFHO0FBQ1gsY0FBTSxNQUFNLGFBQWE7QUFBQSxNQUMzQjtBQUNBLFlBQU0sY0FBYztBQUFBLElBQ3RCLENBQUM7QUFBQSxFQUNIO0FBRUEsTUFBTyx5QkFBUTs7O0FDNUJmLEdBQUMsV0FBWTtBQUVYLFdBQU8sWUFBWSxFQUFFLE9BQUFDLGVBQU07QUFDM0IsYUFBUyxnQkFBZ0IsTUFBTTtBQUUvQixXQUFPLGlCQUFpQix5QkFBeUIsQ0FBQyxVQUFVO0FBQzFELFlBQU07QUFBQSxRQUNKLFFBQVEsRUFBRSxHQUFHO0FBQUEsTUFDZixJQUFJO0FBRUosVUFBSSxHQUFHLFNBQVMsU0FBUyxHQUFHO0FBQzFCLCtCQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFFRCxXQUFPLGlCQUFpQixjQUFjLENBQUMsRUFBRSxPQUFPLE1BQU07QUFDcEQsWUFBTSxFQUFFLFNBQVMsR0FBRyxJQUFJO0FBRXhCLFVBQUksR0FBRyxTQUFTLFlBQVksR0FBRztBQUM3QixxQkFBYSxRQUFRLGNBQWMsTUFBTTtBQUN6QyxpQkFBUyxTQUFTO0FBQ2xCLGlCQUFTLEtBQUssVUFBVSxPQUFPLGFBQWE7QUFDNUMsaUJBQVMsS0FBSyxVQUFVLE9BQU8sc0JBQXNCO0FBQ3JELGlCQUFTLEtBQUssVUFBVSxJQUFJLFlBQVk7QUFDeEMsaUJBQVMsS0FBSyxVQUFVLElBQUksTUFBTTtBQUNsQyxpQkFBUyxLQUFLLFVBQVUsSUFBSSxxQkFBcUI7QUFBQSxNQUNuRCxPQUFPO0FBQ0wscUJBQWEsUUFBUSxjQUFjLE9BQU87QUFDMUMsaUJBQVMsU0FBUztBQUNsQixpQkFBUyxLQUFLLFVBQVUsT0FBTyxZQUFZO0FBQzNDLGlCQUFTLEtBQUssVUFBVSxPQUFPLHFCQUFxQjtBQUNwRCxpQkFBUyxLQUFLLFVBQVUsT0FBTyxNQUFNO0FBQ3JDLGlCQUFTLEtBQUssVUFBVSxJQUFJLGFBQWE7QUFDekMsaUJBQVMsS0FBSyxVQUFVLElBQUksc0JBQXNCO0FBQUEsTUFDcEQ7QUFFQSxVQUFJLEdBQUcsU0FBUyxTQUFTLEdBQUc7QUFDMUIsK0JBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsR0FBRzsiLAogICJuYW1lcyI6IFsiaG9va3NfZGVmYXVsdCIsICJob29rc19kZWZhdWx0Il0KfQo=
