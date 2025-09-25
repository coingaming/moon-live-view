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
    MoonSnackbar: snackbar_default,
    PaginationHook: pagination_default,
    Popover: popover_default,
    ResponsiveScreen: responsive_screen_default,
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
