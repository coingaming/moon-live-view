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

  // ../deps/moon_live/assets/js/hooks/authenticator.js
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

  // ../deps/moon_live/assets/js/hooks/bottom_sheet.js
  var BottomSheetHook = {
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
      dialog.addEventListener("moon:bottomSheet:open", () => {
        this.open();
      });
      dialog.addEventListener("moon:bottomSheet:close", () => {
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
  var bottom_sheet_default = BottomSheetHook;

  // ../deps/moon_live/assets/js/hooks/carousel.js
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
    if (!prevArrowButton || !nextArrowButton) {
      return;
    }
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

  // ../deps/moon_live/assets/js/hooks/checkbox.js
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

  // ../deps/moon_live/assets/js/hooks/dialog.js
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

  // ../deps/moon_live/assets/js/hooks/drawer.js
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

  // ../deps/moon_live/assets/js/hooks/file_input.js
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

  // ../deps/moon_live/assets/js/hooks/dropdown.js
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

  // ../deps/moon_live/assets/js/hooks/pagination.js
  var Pagination = {
    mounted() {
      this.setup();
    },
    setup() {
      const element = this.el;
      element.addEventListener(
        "moon:pagination:navigate",
        ({ detail: { direction, base_param: baseParam } }) => {
          this.handleNavigation({ direction, baseParam });
        }
      );
    },
    handleNavigation({ direction, baseParam }) {
      const activeItem = parseInt(this.el.dataset.activeItem, 10) || 1;
      const totalSteps = parseInt(this.el.dataset.totalSteps, 10) || 1;
      const newActiveItem = this.calculateNewActiveItem(
        direction,
        activeItem,
        totalSteps
      );
      if (!this.isValidNavigation(newActiveItem, activeItem, totalSteps)) {
        return;
      }
      this.updatePagination(newActiveItem);
      this.navigateToPage(newActiveItem, baseParam);
      this.disableArrowControls(newActiveItem, totalSteps);
    },
    calculateNewActiveItem(direction, activeItem, totalSteps) {
      if (direction === this.directions.prev) {
        return Math.max(1, activeItem - 1);
      }
      if (direction === this.directions.next) {
        return Math.min(totalSteps, activeItem + 1);
      }
      return activeItem;
    },
    isValidNavigation(newActiveItem, currentActiveItem, totalSteps) {
      if (newActiveItem === currentActiveItem) {
        return false;
      }
      return newActiveItem >= 1 && newActiveItem <= totalSteps;
    },
    disableArrowControls(newActiveItem, totalSteps) {
      this.disableArrowControl("prev", newActiveItem);
      this.disableArrowControl("next", newActiveItem, totalSteps);
    },
    disableArrowControl(direction, newActiveItem, totalSteps) {
      const arrowControl = this.el.querySelector(
        `[data-arrow-control='${direction}']`
      );
      if (this.isArrowDisabled(direction, newActiveItem, totalSteps)) {
        arrowControl.disabled = true;
        return;
      }
      if (!arrowControl.disabled) {
        return;
      }
      arrowControl.disabled = false;
    },
    isArrowDisabled(direction, newActiveItem, totalSteps) {
      if (direction === this.directions.prev) {
        return this.isArrowPrevDisabled(newActiveItem);
      }
      if (direction === this.directions.next) {
        return this.isArrowNextDisabled(newActiveItem, totalSteps);
      }
      return false;
    },
    isArrowPrevDisabled(newActiveItem) {
      return newActiveItem <= 1;
    },
    isArrowNextDisabled(newActiveItem, totalSteps) {
      return newActiveItem >= totalSteps;
    },
    updatePagination(newActiveItem) {
      this.el.dataset.activeItem = newActiveItem;
      this.addActiveClass(newActiveItem);
    },
    navigateToPage(newActiveItem, baseParam) {
      const url = new URL(window.location);
      url.searchParams.set(baseParam, newActiveItem);
      window.history.pushState({}, "", url);
      this.pushEvent("update", {
        page: newActiveItem,
        base_param: baseParam,
        url: url.toString()
      });
    },
    addActiveClass(activeItem) {
      const newActiveElement = this.el.querySelector(
        `.moon-pagination-item[data-item="${activeItem}"]`
      );
      if (!newActiveElement) {
        return;
      }
      this.removeActiveClass();
      newActiveElement.classList.add("moon-pagination-item-active");
    },
    removeActiveClass() {
      const currentActive = this.el.querySelector(".moon-pagination-item-active");
      if (!currentActive) {
        return;
      }
      currentActive.classList.remove("moon-pagination-item-active");
    },
    directions: { prev: "prev", next: "next" }
  };
  var pagination_default = Pagination;

  // ../deps/moon_live/assets/js/hooks/popover.js
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

  // ../deps/moon_live/assets/js/hooks/responsive_screen.js
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

  // ../deps/moon_live/assets/js/utils/generateSvgIcon.js
  var generateSvgIcon = (name) => {
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
  var generateSvgIcon_default = generateSvgIcon;

  // ../deps/moon_live/assets/js/hooks/snackbar.js
  var SnackbarHook = {
    mounted() {
      this.setup();
    },
    setup() {
      this.el.addEventListener("moon:snackbar:show", ({ detail }) => {
        const { variant, context, message, opts } = detail;
        this.appendSnackbar({ variant, context, message, opts });
      });
      this.handleEvent("moon:snackbar:show", ({ detail }) => {
        const { variant, context, message, opts } = detail;
        this.appendSnackbar({ variant, context, message, opts });
      });
    },
    appendSnackbar({ variant = "fill", context = "brand", message, opts = {} }) {
      const { icon, action_label, action } = opts;
      const currentSnackbars = this.el.querySelectorAll("[data-mounted='true']");
      const snackbarCount = parseInt(this.el.dataset.count || "0", 10) || 0;
      const maxSnackbars = parseInt(this.el.dataset.maxSnackbars || "5", 10) || 5;
      if (snackbarCount >= maxSnackbars) {
        const oldestSnackbar = currentSnackbars[0];
        oldestSnackbar.setAttribute("data-removed", "true");
        oldestSnackbar.remove();
      }
      const currentFront = this.el.querySelector("[data-front='true']");
      if (currentFront) {
        currentFront.setAttribute("data-front", "false");
      }
      const snackbar = this.createNewSnackbar({
        variant,
        context,
        snackbarCount,
        icon,
        message,
        action_label,
        action
      });
      this.el.appendChild(snackbar);
    },
    createNewSnackbar({
      variant,
      context,
      snackbarCount,
      icon,
      message,
      action_label,
      action
    }) {
      const snackbar = document.createElement("div");
      this.el.style.setProperty("--toasts-length", snackbarCount + 1);
      this.el.setAttribute("data-count", snackbarCount + 1);
      snackbar.style.setProperty("--toast-index", snackbarCount);
      snackbar.className = `moon-snackbar ${variant !== "fill" ? `moon-snackbar-${variant}` : ""} ${context !== "brand" ? `moon-snackbar-${context}` : ""}`;
      snackbar.setAttribute("data-mounted", "false");
      snackbar.setAttribute("data-front", "false");
      requestAnimationFrame(() => {
        snackbar.setAttribute("data-mounted", "true");
        snackbar.setAttribute("data-front", "true");
      });
      const iconElement = generateSvgIcon_default(icon);
      const snackbarMessage = this.createSnackbarMessage(message);
      const metaSection = this.createMetaSection(action_label, action, snackbar);
      snackbar.append(iconElement);
      snackbar.append(snackbarMessage);
      snackbar.append(metaSection);
      return snackbar;
    },
    updateSnackbars() {
      const currentSnackbars = this.el.querySelectorAll("[data-mounted='true']");
      const snackbarCount = currentSnackbars.length;
      currentSnackbars.forEach((snackbar, index) => {
        snackbar.style.setProperty("--toast-index", index);
      });
      this.el.style.setProperty("--toasts-length", snackbarCount);
      this.el.setAttribute("data-count", snackbarCount);
    },
    createSnackbarMessage(message) {
      const snackbarMessage = document.createTextNode(message);
      return snackbarMessage;
    },
    createMetaSection(label, action, snackbar) {
      const actionBtn = document.createElement("button");
      actionBtn.className = "moon-snackbar-action";
      actionBtn.textContent = label;
      actionBtn.setAttribute("phx-click", action);
      const metaSection = document.createElement("div");
      metaSection.className = "moon-snackbar-meta";
      if (label && action) {
        metaSection.append(actionBtn);
      }
      const closeBtn = this.createCloseButton(snackbar);
      metaSection.append(closeBtn);
      return metaSection;
    },
    createCloseButton(snackbar) {
      const closeBtn = document.createElement("button");
      const closeIcon = generateSvgIcon_default("close");
      closeBtn.className = "moon-snackbar-close";
      closeBtn.append(closeIcon);
      closeBtn.addEventListener("click", () => {
        snackbar.setAttribute("data-removed", "true");
        snackbar.remove();
        this.updateSnackbars();
      });
      return closeBtn;
    }
  };
  var snackbar_default = SnackbarHook;

  // ../deps/moon_live/assets/js/hooks/tooltip.js
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

  // ../deps/moon_live/assets/js/hooks/index.js
  var hooks_default = {
    Authenticator: authenticator_default,
    BottomSheetHook: bottom_sheet_default,
    CarouselHook: carousel_default,
    CheckboxHook: checkbox_default,
    DialogHook: dialog_default,
    DrawerHook: drawer_default,
    FileInput: file_input_default,
    MoonDropdown: dropdown_default,
    PaginationHook: pagination_default,
    Popover: popover_default,
    ResponsiveScreen: responsive_screen_default,
    SnackbarHook: snackbar_default,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL2pzL2hvb2tzL0NvZGVQcmV2aWV3LmpzIiwgIi4uLy4uLy4uL2RlcHMvbW9vbl9saXZlL2Fzc2V0cy9qcy9ob29rcy9hdXRoZW50aWNhdG9yLmpzIiwgIi4uLy4uLy4uL2RlcHMvbW9vbl9saXZlL2Fzc2V0cy9qcy9ob29rcy9ib3R0b21fc2hlZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9tb29uX2xpdmUvYXNzZXRzL2pzL2hvb2tzL2Nhcm91c2VsLmpzIiwgIi4uLy4uLy4uL2RlcHMvbW9vbl9saXZlL2Fzc2V0cy9qcy9ob29rcy9jaGVja2JveC5qcyIsICIuLi8uLi8uLi9kZXBzL21vb25fbGl2ZS9hc3NldHMvanMvaG9va3MvZGlhbG9nLmpzIiwgIi4uLy4uLy4uL2RlcHMvbW9vbl9saXZlL2Fzc2V0cy9qcy9ob29rcy9kcmF3ZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9tb29uX2xpdmUvYXNzZXRzL2pzL2hvb2tzL2ZpbGVfaW5wdXQuanMiLCAiLi4vLi4vLi4vZGVwcy9tb29uX2xpdmUvYXNzZXRzL2pzL2hvb2tzL2Ryb3Bkb3duLmpzIiwgIi4uLy4uLy4uL2RlcHMvbW9vbl9saXZlL2Fzc2V0cy9qcy9ob29rcy9wYWdpbmF0aW9uLmpzIiwgIi4uLy4uLy4uL2RlcHMvbW9vbl9saXZlL2Fzc2V0cy9qcy9ob29rcy9wb3BvdmVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvbW9vbl9saXZlL2Fzc2V0cy9qcy9ob29rcy9yZXNwb25zaXZlX3NjcmVlbi5qcyIsICIuLi8uLi8uLi9kZXBzL21vb25fbGl2ZS9hc3NldHMvanMvdXRpbHMvZ2VuZXJhdGVTdmdJY29uLmpzIiwgIi4uLy4uLy4uL2RlcHMvbW9vbl9saXZlL2Fzc2V0cy9qcy9ob29rcy9zbmFja2Jhci5qcyIsICIuLi8uLi8uLi9kZXBzL21vb25fbGl2ZS9hc3NldHMvanMvaG9va3MvdG9vbHRpcC5qcyIsICIuLi8uLi8uLi9kZXBzL21vb25fbGl2ZS9hc3NldHMvanMvaG9va3MvaW5kZXguanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2hvb2tzL2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9wb3B1bGF0ZVRva2Vucy5qcyIsICIuLi8uLi8uLi9hc3NldHMvanMvc3Rvcnlib29rLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBDb2RlUHJldmlldyA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICAvLyBDYWNoZSBET00gZWxlbWVudHNcbiAgICB0aGlzLmJ1dHRvbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIltkYXRhLWNvZGUtcHJldmlldy1idXR0b25dXCIpO1xuICAgIHRoaXMud3JhcHBlciA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIltkYXRhLWNvZGUtcHJldmlldy13cmFwcGVyXVwiKTtcbiAgICB0aGlzLnRvZ2dsZVNwYW4gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCIjdG9nZ2xlU3BhblwiKTtcbiAgICB0aGlzLmJ1dHRvbldyYXBwZXIgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIltkYXRhLWNvZGUtcHJldmlldy1idXR0b24td3JhcHBlcl1cIlxuICAgICk7XG5cbiAgICBpZiAoIXRoaXMuaGlkZUJ1dHRvbigpKSB7XG4gICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yIHRvZ2dsaW5nIG9wZW4vY2xvc2VcbiAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZSgpKTtcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZSgpIHtcbiAgICAvLyBUb2dnbGUgYmV0d2VlbiBvcGVuIGFuZCBjbG9zZSBzdGF0ZXNcbiAgICBpZiAodGhpcy53cmFwcGVyLmNsYXNzTGlzdC5jb250YWlucyhcIm1heC1oLTk2XCIpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfSxcbiAgb3BlbigpIHtcbiAgICAvLyBCYXRjaCBjbGFzcyBjaGFuZ2VzIGZvciBvcGVuIHN0YXRlXG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJtYXgtaC05NlwiLCBcIm92ZXJmbG93LWF1dG9cIik7XG4gICAgdGhpcy53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJtYXgtaC1zcGFjZS0xMjhcIik7XG4gICAgdGhpcy5idXR0b25XcmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJoLXNwYWNlLTQwXCIsIFwiWyZfc3ZnXTpyb3RhdGUtMTgwXCIpO1xuICAgIHRoaXMudG9nZ2xlU3Bhbi50ZXh0Q29udGVudCA9IFwiQ29sbGFwc2VcIjtcbiAgfSxcbiAgY2xvc2UoKSB7XG4gICAgLy8gQmF0Y2ggY2xhc3MgY2hhbmdlcyBmb3IgY2xvc2Ugc3RhdGVcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcIm1heC1oLTk2XCIsIFwib3ZlcmZsb3ctYXV0b1wiKTtcbiAgICB0aGlzLndyYXBwZXIuY2xhc3NMaXN0LmFkZChcIm1heC1oLXNwYWNlLTEyOFwiKTtcbiAgICB0aGlzLmJ1dHRvbldyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcImgtc3BhY2UtNDBcIiwgXCJbJl9zdmddOnJvdGF0ZS0xODBcIik7XG4gICAgdGhpcy50b2dnbGVTcGFuLnRleHRDb250ZW50ID0gXCJFeHBhbmRcIjtcbiAgfSxcbiAgaGlkZUJ1dHRvbigpIHtcbiAgICAvLyBIaWRlIGJ1dHRvbiBpZiB3cmFwcGVyIGhlaWdodCBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gTUlOX0hFSUdIVFxuICAgIGNvbnN0IE1JTl9IRUlHSFQgPSA5MDtcbiAgICBpZiAodGhpcy53cmFwcGVyLmNsaWVudEhlaWdodCA8PSBNSU5fSEVJR0hUKSB7XG4gICAgICB0aGlzLmJ1dHRvbldyYXBwZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvZGVQcmV2aWV3O1xuIiwgImxldCBBdXRoZW50aWNhdG9yID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMudXBkYXRlSW5wdXRzKCk7XG4gIH0sXG5cbiAgdXBkYXRlZCgpIHtcbiAgICB0aGlzLnVwZGF0ZUlucHV0cygpO1xuICB9LFxuXG4gIGRlc3Ryb3llZCgpIHtcbiAgICB0aGlzLnRlYXJkb3duKCk7XG4gIH0sXG5cbiAgdXBkYXRlSW5wdXRzKCkge1xuICAgIHRoaXMudGVhcmRvd24oKTtcbiAgICB0aGlzLmluaXRpYWxpemVJbnB1dHMoKTtcbiAgICB0aGlzLnNldEZvY3VzT25GaXJzdElucHV0SWZOZWVkZWQoKTtcbiAgfSxcblxuICBpbml0aWFsaXplSW5wdXRzKCkge1xuICAgIHRoaXMuaW5wdXRzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIik7XG4gICAgdGhpcy5jYWxsYmFjayA9IHRoaXMuZWwuZGF0YXNldC5jYWxsYmFjaztcbiAgICB0aGlzLmNvZGVMZW5ndGggPSB0aGlzLmlucHV0cy5sZW5ndGg7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycyA9IFtdO1xuXG4gICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLmJpbmRMaXN0ZW5lcihpbnB1dCwgXCJpbnB1dFwiLCAoZSkgPT4gdGhpcy5oYW5kbGVJbnB1dChlLCBpbmRleCkpO1xuICAgICAgdGhpcy5iaW5kTGlzdGVuZXIoaW5wdXQsIFwia2V5ZG93blwiLCAoZSkgPT4gdGhpcy5oYW5kbGVLZXlEb3duKGUsIGluZGV4KSk7XG4gICAgICB0aGlzLmJpbmRMaXN0ZW5lcihpbnB1dCwgXCJwYXN0ZVwiLCAoZSkgPT4gdGhpcy5oYW5kbGVQYXN0ZShlKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc2V0Rm9jdXNPbkZpcnN0SW5wdXRJZk5lZWRlZCgpIHtcbiAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGNvbnN0IHNob3VsZEZvY3VzID1cbiAgICAgIHRoaXMuaW5wdXRzLmxlbmd0aCA+IDAgJiZcbiAgICAgIChhY3RpdmUgPT09IGRvY3VtZW50LmJvZHkgfHwgQXJyYXkuZnJvbSh0aGlzLmlucHV0cykuaW5jbHVkZXMoYWN0aXZlKSkgJiZcbiAgICAgIEFycmF5LmZyb20odGhpcy5pbnB1dHMpLmV2ZXJ5KGkgPT4gIWkudmFsdWUpO1xuXG4gICAgaWYgKHNob3VsZEZvY3VzKSB7XG4gICAgICB0aGlzLmlucHV0c1swXS5mb2N1cygpO1xuICAgIH1cbiAgfSxcblxuICBiaW5kTGlzdGVuZXIoaW5wdXQsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5wdXNoKHsgaW5wdXQsIGV2ZW50LCBoYW5kbGVyIH0pO1xuICB9LFxuXG4gIHRlYXJkb3duKCkge1xuICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVycykgcmV0dXJuO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuZm9yRWFjaCgoeyBpbnB1dCwgZXZlbnQsIGhhbmRsZXIgfSkgPT4ge1xuICAgICAgaW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgfSk7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycyA9IFtdO1xuICB9LFxuXG4gIGdldENvZGUoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5pbnB1dHMpLm1hcChpID0+IGkudmFsdWUpLmpvaW4oJycpO1xuICB9LFxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuaW5wdXRzLmZvckVhY2goaSA9PiBpLnZhbHVlID0gXCJcIik7XG4gICAgdGhpcy5pbnB1dHNbMF0uZm9jdXMoKTtcbiAgfSxcblxuICBoYW5kbGVJbnB1dChlLCBpbmRleCkge1xuICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQ7XG4gICAgY29uc3QgdmFsID0gaW5wdXQudmFsdWUudG9VcHBlckNhc2UoKTtcbiAgICBpbnB1dC52YWx1ZSA9IHZhbDtcblxuICAgIGlmICh2YWwgJiYgaW5kZXggPCB0aGlzLmlucHV0cy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmlucHV0c1tpbmRleCArIDFdLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgY29uc3QgY29kZSA9IHRoaXMuZ2V0Q29kZSgpO1xuICAgIGlmIChjb2RlLmxlbmd0aCA9PT0gdGhpcy5jb2RlTGVuZ3RoICYmIHRoaXMuY2FsbGJhY2spIHtcbiAgICAgIHRoaXMucHVzaEV2ZW50KHRoaXMuY2FsbGJhY2ssIHsgY29kZSB9KTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlS2V5RG93bihlLCBpbmRleCkge1xuICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQ7XG4gICAgaWYgKChlLmtleSA9PT0gXCJCYWNrc3BhY2VcIiB8fCBlLmtleSA9PT0gXCJEZWxldGVcIikgJiYgaW5wdXQudmFsdWUgPT09IFwiXCIgJiYgaW5kZXggPiAwKSB7XG4gICAgICB0aGlzLmlucHV0c1tpbmRleCAtIDFdLmZvY3VzKCk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZVBhc3RlKGUpIHtcbiAgICBjb25zdCBwYXN0ZWQgPSBlLmNsaXBib2FyZERhdGEuZ2V0RGF0YShcInRleHRcIikuc2xpY2UoMCwgdGhpcy5jb2RlTGVuZ3RoKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGkpID0+IHtcbiAgICAgIGlucHV0LnZhbHVlID0gcGFzdGVkW2ldIHx8IFwiXCI7XG4gICAgfSk7XG5cbiAgICBjb25zdCBsYXN0SW5kZXggPSBwYXN0ZWQubGVuZ3RoIC0gMTtcbiAgICBpZiAobGFzdEluZGV4ID49IDAgJiYgbGFzdEluZGV4IDwgdGhpcy5pbnB1dHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmlucHV0c1tsYXN0SW5kZXhdLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgaWYgKHBhc3RlZC5sZW5ndGggPT09IHRoaXMuY29kZUxlbmd0aCAmJiB0aGlzLmNhbGxiYWNrKSB7XG4gICAgICB0aGlzLnB1c2hFdmVudCh0aGlzLmNhbGxiYWNrLCB7IGNvZGU6IHBhc3RlZCB9KTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEF1dGhlbnRpY2F0b3I7XG4iLCAiY29uc3QgQm90dG9tU2hlZXRIb29rID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuc2V0dXAoKTtcbiAgfSxcbiAgc2V0dXAoKSB7XG4gICAgY29uc3QgZGlhbG9nID0gdGhpcy5lbDtcbiAgICBjb25zdCBoYW5kbGUgPSBkaWFsb2cucXVlcnlTZWxlY3RvcihcIi5tb29uLWJvdHRvbS1zaGVldC1oYW5kbGVcIik7XG4gICAgY29uc3QgZGlhbG9nQm94ID0gdGhpcy5kaWFsb2dCb3goKTtcblxuICAgIGxldCBzdGFydFkgPSAwO1xuICAgIGxldCBkZWx0YVk7XG4gICAgbGV0IHN0YXJ0SGVpZ2h0ID0gMDtcbiAgICBsZXQgY3VycmVudFkgPSAwO1xuICAgIGNvbnN0IHRocmVzaG9sZCA9IDIwMDtcbiAgICBjb25zdCBtaW5IZWlnaHQgPSAyMDA7XG4gICAgY29uc3QgbWF4SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogMC44O1xuICAgIGxldCBpc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICAvLyBUQkQ6IFRoaXMgY29ycmVjdGlvbiBzaG91bGQgYmUgcmVtb3ZlZCBvbmNlIG1vb24gdWkgY29tcG9uZW50cyBpcyB1cGRhdGVkXG4gICAgZGlhbG9nQm94LnN0eWxlLnNjYWxlID0gXCIxXCI7XG4gICAgZGlhbG9nQm94LnN0eWxlLm1heEhlaWdodCA9IFwiODB2aFwiO1xuXG4gICAgY29uc3Qgb25EcmFnU3RhcnQgPSAoZSkgPT4ge1xuICAgICAgaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICBzdGFydFkgPSBlLnRvdWNoZXMgPyBlLnRvdWNoZXNbMF0uY2xpZW50WSA6IGUuY2xpZW50WTtcbiAgICAgIHN0YXJ0SGVpZ2h0ID0gZGlhbG9nQm94Lm9mZnNldEhlaWdodDtcbiAgICAgIGRpYWxvZ0JveC5zdHlsZS50cmFuc2l0aW9uID0gXCJub25lXCI7XG4gICAgICBkZWx0YVkgPSAwO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkRyYWdNb3ZlID0gKGUpID0+IHtcbiAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuXG4gICAgICBjdXJyZW50WSA9IGUudG91Y2hlcyA/IGUudG91Y2hlc1swXS5jbGllbnRZIDogZS5jbGllbnRZO1xuICAgICAgZGVsdGFZID0gc3RhcnRZIC0gY3VycmVudFk7XG4gICAgICBjb25zdCBuZXdIZWlnaHQgPSBNYXRoLm1pbihcbiAgICAgICAgbWF4SGVpZ2h0LFxuICAgICAgICBNYXRoLm1heChtaW5IZWlnaHQsIHN0YXJ0SGVpZ2h0ICsgZGVsdGFZKVxuICAgICAgKTtcblxuICAgICAgZGlhbG9nQm94LnN0eWxlLmhlaWdodCA9IGAke25ld0hlaWdodH1weGA7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uRHJhZ0VuZCA9ICgpID0+IHtcbiAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgICBjb25zdCBjdXJyZW50SGVpZ2h0ID0gZGlhbG9nQm94Lm9mZnNldEhlaWdodDtcbiAgICAgIGRpYWxvZ0JveC5zdHlsZS50cmFuc2l0aW9uID0gXCJcIjtcblxuICAgICAgaWYgKGRlbHRhWSA8IC10aHJlc2hvbGQpIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChkZWx0YVkgPiB0aHJlc2hvbGQpIHtcbiAgICAgICAgZGlhbG9nQm94LnN0eWxlLmhlaWdodCA9IGAke21heEhlaWdodH1weGA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc25hcFBvaW50cyA9IHtcbiAgICAgICAgbWluOiBtaW5IZWlnaHQsXG4gICAgICAgIG1pZDogd2luZG93LmlubmVySGVpZ2h0ICogMC41LFxuICAgICAgICBtYXg6IG1heEhlaWdodCxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGNsb3Nlc3RTbmFwID0gT2JqZWN0LmVudHJpZXMoc25hcFBvaW50cykucmVkdWNlKChwcmV2LCBjdXJyKSA9PlxuICAgICAgICBNYXRoLmFicyhjdXJyWzFdIC0gY3VycmVudEhlaWdodCkgPCBNYXRoLmFicyhwcmV2WzFdIC0gY3VycmVudEhlaWdodClcbiAgICAgICAgICA/IGN1cnJcbiAgICAgICAgICA6IHByZXZcbiAgICAgICk7XG5cbiAgICAgIGRpYWxvZ0JveC5zdHlsZS5oZWlnaHQgPSBgJHtjbG9zZXN0U25hcFsxXX1weGA7XG4gICAgfTtcblxuICAgIGlmIChoYW5kbGUpIHtcbiAgICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBvbkRyYWdTdGFydCk7XG4gICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBvbkRyYWdTdGFydCk7XG4gICAgfVxuXG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgb25EcmFnTW92ZSk7XG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25EcmFnTW92ZSk7XG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBvbkRyYWdFbmQpO1xuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvbkRyYWdFbmQpO1xuXG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmJvdHRvbVNoZWV0Om9wZW5cIiwgKCkgPT4ge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfSk7XG5cbiAgICBkaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vb246Ym90dG9tU2hlZXQ6Y2xvc2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuICB9LFxuICBvcGVuKCkge1xuICAgIGNvbnN0IGRpYWxvZ0JveCA9IHRoaXMuZGlhbG9nQm94KCk7XG4gICAgdGhpcy5lbC5zaG93TW9kYWwoKTtcbiAgICBkaWFsb2dCb3guc3R5bGUuaGVpZ2h0ID0gYCR7d2luZG93LmlubmVySGVpZ2h0ICogMC41fXB4YDtcbiAgfSxcbiAgY2xvc2UoKSB7XG4gICAgY29uc3QgZGlhbG9nQm94ID0gdGhpcy5kaWFsb2dCb3goKTtcbiAgICBkaWFsb2dCb3guc3R5bGUuaGVpZ2h0ID0gXCJcIjtcbiAgICB0aGlzLmVsLmNsb3NlKCk7XG4gIH0sXG4gIGRpYWxvZ0JveCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFwiLm1vb24tYm90dG9tLXNoZWV0LWJveFwiKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJvdHRvbVNoZWV0SG9vaztcbiIsICJjb25zdCBDYXJvdXNlbEhvb2sgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zZXR1cCgpO1xuICB9LFxuICBzZXR1cCgpIHtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmNhcm91c2VsOnNjcm9sbF9sZWZ0XCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHBhcnNlSW50KHRoaXMuZWwuZGF0YXNldC5hY3RpdmVTbGlkZUluZGV4KTtcbiAgICAgIGNvbnN0IG5leHRJbmRleCA9IHNjcm9sbExlZnQoeyBjdXJyZW50SW5kZXgsIGVsZW1lbnQ6IHRoaXMuZWwgfSk7XG5cbiAgICAgIHVwZGF0ZURhdGFBdHRyaWJ1dGUodGhpcy5lbCwgY3VycmVudEluZGV4LCBuZXh0SW5kZXgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibW9vbjpjYXJvdXNlbDpzY3JvbGxfcmlnaHRcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gcGFyc2VJbnQodGhpcy5lbC5kYXRhc2V0LmFjdGl2ZVNsaWRlSW5kZXgpO1xuICAgICAgY29uc3QgdG90YWxJdGVtcyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChcIi5tb29uLWNhcm91c2VsLWl0ZW1cIikubGVuZ3RoO1xuXG4gICAgICBjb25zdCBuZXh0SW5kZXggPSBzY3JvbGxSaWdodCh7XG4gICAgICAgIGN1cnJlbnRJbmRleCxcbiAgICAgICAgdG90YWxJdGVtcyxcbiAgICAgICAgZWxlbWVudDogdGhpcy5lbCxcbiAgICAgIH0pO1xuXG4gICAgICB1cGRhdGVEYXRhQXR0cmlidXRlKHRoaXMuZWwsIGN1cnJlbnRJbmRleCwgbmV4dEluZGV4KTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vb246Y2Fyb3VzZWw6c2Nyb2xsX3RvX2luZGV4XCIsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgeyBkZXRhaWwgfSA9IGV2ZW50O1xuICAgICAgY29uc3QgeyBpbmRleCB9ID0gZGV0YWlsO1xuXG4gICAgICBzY3JvbGxUb0luZGV4KHsgZWxlbWVudDogdGhpcy5lbCwgaW5kZXggfSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5lbC5kYXRhc2V0LmFjdGl2ZVNsaWRlSW5kZXggIT09IFwiMFwiKSB7XG4gICAgICBzY3JvbGxUb0luZGV4KHtcbiAgICAgICAgZWxlbWVudDogdGhpcy5lbCxcbiAgICAgICAgaW5kZXg6IHRoaXMuZWwuZGF0YXNldC5hY3RpdmVTbGlkZUluZGV4LFxuICAgICAgfSk7XG4gICAgfVxuICB9LFxufTtcblxuY29uc3Qgc2Nyb2xsVG9JbmRleCA9ICh7IGVsZW1lbnQsIGluZGV4IH0pID0+IHtcbiAgY29uc3QgdG90YWxJdGVtcyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tb29uLWNhcm91c2VsLWl0ZW1cIikubGVuZ3RoO1xuXG4gIGlmICghaXNWYWxpZEluZGV4KGluZGV4LCB0b3RhbEl0ZW1zKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFjdGl2ZVNsaWRlSW5kZXggPSBwYXJzZUludChlbGVtZW50LmRhdGFzZXQuYWN0aXZlU2xpZGVJbmRleCk7XG5cbiAgc2Nyb2xsKHsgaW5kZXgsIGVsZW1lbnQgfSk7XG5cbiAgdXBkYXRlRGF0YUF0dHJpYnV0ZShlbGVtZW50LCBhY3RpdmVTbGlkZUluZGV4LCBpbmRleCk7XG59O1xuXG5jb25zdCBzY3JvbGxMZWZ0ID0gKHsgY3VycmVudEluZGV4LCBlbGVtZW50IH0pID0+IHtcbiAgaWYgKGN1cnJlbnRJbmRleCA8PSAwKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRJbmRleDtcbiAgfVxuXG4gIGNvbnN0IG5leHRJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gIHNjcm9sbCh7IGluZGV4OiBuZXh0SW5kZXgsIGVsZW1lbnQgfSk7XG5cbiAgcmV0dXJuIG5leHRJbmRleDtcbn07XG5cbmNvbnN0IHNjcm9sbFJpZ2h0ID0gKHsgY3VycmVudEluZGV4LCB0b3RhbEl0ZW1zLCBlbGVtZW50IH0pID0+IHtcbiAgaWYgKGN1cnJlbnRJbmRleCA+PSB0b3RhbEl0ZW1zIC0gMSkge1xuICAgIHJldHVybiBjdXJyZW50SW5kZXg7XG4gIH1cblxuICBjb25zdCBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggKyAxO1xuICBzY3JvbGwoeyBpbmRleDogbmV4dEluZGV4LCBlbGVtZW50IH0pO1xuXG4gIHJldHVybiBuZXh0SW5kZXg7XG59O1xuXG5jb25zdCBzY3JvbGwgPSAoeyBpbmRleCwgZWxlbWVudCB9KSA9PiB7XG4gIGNvbnN0IGFjdGl2ZVNsaWRlID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAjJHtlbGVtZW50LmlkfS1zbGlkZS0ke2luZGV4fWApO1xuXG4gIHVwZGF0ZUJ1dHRvbkFycm93cyh7IGVsZW1lbnQsIG5ld0luZGV4OiBpbmRleCB9KTtcblxuICBhY3RpdmVTbGlkZS5zY3JvbGxJbnRvVmlldyh7XG4gICAgYmVoYXZpb3I6IFwic21vb3RoXCIsXG4gICAgYmxvY2s6IFwibmVhcmVzdFwiLFxuICAgIGlubGluZTogXCJjZW50ZXJcIixcbiAgfSk7XG59O1xuXG5jb25zdCB1cGRhdGVCdXR0b25BcnJvd3MgPSAoeyBlbGVtZW50LCBuZXdJbmRleCB9KSA9PiB7XG4gIGNvbnN0IHByZXZBcnJvd0J1dHRvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudC5pZH0tYXJyb3ctc3RhcnRgKTtcbiAgY29uc3QgbmV4dEFycm93QnV0dG9uID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAjJHtlbGVtZW50LmlkfS1hcnJvdy1lbmRgKTtcblxuICBpZiAoIXByZXZBcnJvd0J1dHRvbiB8fCAhbmV4dEFycm93QnV0dG9uKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdXBkYXRlQnV0dG9uQXJyb3cocHJldkFycm93QnV0dG9uLCBuZXdJbmRleCA8PSAwKTtcbiAgdXBkYXRlQnV0dG9uQXJyb3cobmV4dEFycm93QnV0dG9uLCBuZXdJbmRleCA+PSBnZXRUb3RhbEl0ZW1zKGVsZW1lbnQpIC0gMSk7XG59O1xuXG5jb25zdCB1cGRhdGVCdXR0b25BcnJvdyA9IChhcnJvd0J1dHRvbiwgaXNEaXNhYmxlZCkgPT4ge1xuICBpZiAoaXNEaXNhYmxlZCkge1xuICAgIGFycm93QnV0dG9uLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBhcnJvd0J1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbn07XG5cbmNvbnN0IGdldFRvdGFsSXRlbXMgPSAoZWxlbWVudCkgPT5cbiAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vb24tY2Fyb3VzZWwtaXRlbVwiKS5sZW5ndGg7XG5cbmNvbnN0IHVwZGF0ZURhdGFBdHRyaWJ1dGUgPSAoZWxlbWVudCwgYWN0aXZlSW5kZXgsIG5ld0luZGV4KSA9PiB7XG4gIGlmIChhY3RpdmVJbmRleCA9PT0gbmV3SW5kZXgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtYWN0aXZlLXNsaWRlLWluZGV4XCIpO1xuICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtYWN0aXZlLXNsaWRlLWluZGV4XCIsIG5ld0luZGV4KTtcbn07XG5cbmNvbnN0IGlzVmFsaWRJbmRleCA9IChpbmRleCwgdG90YWxJdGVtcykgPT4ge1xuICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0b3RhbEl0ZW1zKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDYXJvdXNlbEhvb2s7XG4iLCAiY29uc3Qgc2V0SW5kZXRlcm1pbmF0ZVN0YXRlID0gKGVsKSA9PiB7XG4gIGVsLmluZGV0ZXJtaW5hdGUgPSBlbC5kYXRhc2V0LmluZGV0ZXJtaW5hdGUgIT09IHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IENoZWNrYm94SG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICBzZXRJbmRldGVybWluYXRlU3RhdGUodGhpcy5lbCk7XG4gIH0sXG4gIHVwZGF0ZWQoKSB7XG4gICAgc2V0SW5kZXRlcm1pbmF0ZVN0YXRlKHRoaXMuZWwpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hlY2tib3hIb29rO1xuIiwgImNvbnN0IERpYWxvZ0hvb2sgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zZXR1cCgpO1xuICB9LFxuICBzZXR1cCgpIHtcbiAgICBjb25zdCBkaWFsb2cgPSB0aGlzLmVsO1xuXG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmRpYWxvZzpvcGVuXCIsICgpID0+IHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0pO1xuXG4gICAgZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJtb29uOmRpYWxvZzpjbG9zZVwiLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG4gIH0sXG4gIG9wZW4oKSB7XG4gICAgdGhpcy5lbC5zaG93TW9kYWwoKTtcbiAgfSxcbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5lbC5jbG9zZSgpO1xuICB9LFxuICBkaWFsb2dCb3goKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5tb2RhbC1ib3hcIik7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEaWFsb2dIb29rO1xuIiwgImNvbnN0IERyYXdlckhvb2sgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zZXR1cCgpO1xuICB9LFxuICBzZXR1cCgpIHtcbiAgICBjb25zdCBkaWFsb2cgPSB0aGlzLmVsO1xuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwibW9vbjpkcmF3ZXI6b3BlblwiLCAoKSA9PiB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9KTtcblxuICAgIGRpYWxvZy5hZGRFdmVudExpc3RlbmVyKFwibW9vbjpkcmF3ZXI6Y2xvc2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoXCJjYW5jZWxcIiwgKCkgPT4ge1xuICAgIC8vICAgdGhpcy5jbG9zZSgpO1xuICAgIC8vIH0pO1xuICB9LFxuICBvcGVuKCkge1xuICAgIHRoaXMuZWwuc2hvd01vZGFsKCk7XG4gIH0sXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuZWwuY2xvc2UoKTtcbiAgfSxcbiAgZGlhbG9nQm94KCkge1xuICAgIHJldHVybiB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtYm94XCIpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRHJhd2VySG9vaztcbiIsICJjb25zdCBGaWxlSW5wdXQgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgY29uc3QgaW5wdXRSZWYgPSB0aGlzLmVsLmRhdGFzZXQuaW5wdXRSZWY7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldElucHV0RWxlbWVudChpbnB1dFJlZik7XG4gICAgY29uc3Qgc3BhbiA9IHRoaXMuZ2V0U3BhbkVsZW1lbnQoaW5wdXRSZWYpO1xuXG4gICAgaWYgKCFpbnB1dCB8fCAhc3BhbikgcmV0dXJuO1xuXG4gICAgdGhpcy5zZXR1cENsaWNrTGlzdGVuZXIoaW5wdXQpO1xuICAgIHRoaXMuc2V0dXBDaGFuZ2VMaXN0ZW5lcihpbnB1dCwgc3Bhbik7XG4gIH0sXG4gIGdldElucHV0RWxlbWVudChpbnB1dFJlZikge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVtkYXRhLXBoeC11cGxvYWQtcmVmPVwiJHtpbnB1dFJlZn1cIl1gXG4gICAgKTtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBgRmlsZUlucHV0OiBObyBpbnB1dCBmb3VuZCB3aXRoIGRhdGEtcGh4LXVwbG9hZC1yZWY9XCIke2lucHV0UmVmfVwiYFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xuICB9LFxuICBnZXRTcGFuRWxlbWVudChpbnB1dFJlZikge1xuICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzcGFuW2RhdGEtaW5wdXQtcmVmPVwiJHtpbnB1dFJlZn1cIl1gKTtcbiAgICBpZiAoIXNwYW4pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIGBGaWxlSW5wdXQ6IE5vIHNwYW4gZm91bmQgd2l0aCBkYXRhLWlucHV0LXJlZj1cIiR7aW5wdXRSZWZ9XCJdYFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYW47XG4gIH0sXG4gIHNldHVwQ2xpY2tMaXN0ZW5lcihpbnB1dCkge1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGlucHV0LmNsaWNrKCkpO1xuICB9LFxuICBzZXR1cENoYW5nZUxpc3RlbmVyKGlucHV0LCBzcGFuKSB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlcyA9IGlucHV0LmZpbGVzO1xuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9XG4gICAgICAgIGZpbGVzLmxlbmd0aCA9PT0gMSA/IGZpbGVzWzBdLm5hbWUgOiBgJHtmaWxlcy5sZW5ndGh9IEZpbGVzYDtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVJbnB1dDtcbiIsICJjb25zdCBEUk9QRE9XTl9BTklNQVRJT05fRFVSQVRJT04gPSAyMDA7XG5jb25zdCBEUk9QRE9XTl9USU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQgPVxuICBcImN1YmljLWJlemllcigwLjIsIDAsIDAuMzgsIDAuOSlcIjtcbmNvbnN0IE1JTl9EUk9QRE9XTl9DT05URU5UID0gMTUwO1xuY29uc3QgRFJPUERPV05fU0tJUF9PUFRTX05VTEwgPSB7XG4gIGR1cmF0aW9uOiAwLFxuICBpdGVyYXRpb25zOiAxLFxuICBlYXNpbmc6IFwibGluZWFyXCIsXG59O1xuY29uc3QgRFJPUERPV05fRU5URVJfQU5JTUFUSU9OID0ge1xuICBrZXlmcmFtZXM6IFtcbiAgICB7IG9wYWNpdHk6IDAsIGZpbHRlcjogXCJibHVyKDJweClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTEwcHgpXCIgfSxcbiAgICB7IG9wYWNpdHk6IDEsIGZpbHRlcjogXCJibHVyKDBweClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoMClcIiB9LFxuICBdLFxuICBvcHRzOiB7XG4gICAgZHVyYXRpb246IERST1BET1dOX0FOSU1BVElPTl9EVVJBVElPTixcbiAgICBlYXNpbmc6IERST1BET1dOX1RJTUlOR19BTklNQVRJT05fRUFTRV9TVEFOREFSRCxcbiAgfSxcbn07XG5cbmNvbnN0IERST1BET1dOX0xFQVZFX0FOSU1BVElPTiA9IHtcbiAga2V5ZnJhbWVzOiBbXG4gICAgeyBvcGFjaXR5OiAxLCBmaWx0ZXI6IFwiYmx1cigwcHgpXCIsIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKDApXCIgfSxcbiAgICB7IG9wYWNpdHk6IDAsIGZpbHRlcjogXCJibHVyKDJweClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTEwcHgpXCIgfSxcbiAgXSxcbiAgb3B0czoge1xuICAgIGR1cmF0aW9uOiBEUk9QRE9XTl9BTklNQVRJT05fRFVSQVRJT04sXG4gICAgZWFzaW5nOiBEUk9QRE9XTl9USU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQsXG4gIH0sXG59O1xuXG5jb25zdCBNb29uRHJvcGRvd24gPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy50b2dnbGVGdW5jID0gdGhpcy50b2dnbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmtleURvd25GdW5jID0gdGhpcy5vbktleURvd24uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1kczpkcm9wZG93bjp0b2dnbGVcIiwgdGhpcy50b2dnbGVGdW5jKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5RG93bkZ1bmMpO1xuXG4gICAgdGhpcy5oYW5kbGVFdmVudChcIm1kczpkcm9wZG93bjp0b2dnbGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBpc015RXZlbnQgPSBcIiNcIiArIHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQgfHwgdGhpcy5lbC5pZCA9PSBldmVudC5pZDtcbiAgICAgIGlmIChpc015RXZlbnQpIHtcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZGlzcG9zZUZ1bmMgPSB0aGlzLmRpc3Bvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNoYXNlRnVuYyA9IHRoaXMuY2hhc2UuYmluZCh0aGlzKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZGlzcG9zZUZ1bmMpO1xuXG4gICAgLy8gRGVjbGFyZSB0aGUgZHJvcGRvd24gc3RhdGVcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuXG4gICAgLy8gUGFyc2UgaW5pdGlhbCBzdGF0ZVxuICAgIGNvbnN0IGlzSW5pdGlhbE9wZW4gPSB0aGlzLmVsLmRhdGFzZXQuaW5pdGlhbFN0YXRlID09PSBcInZpc2libGVcIjtcbiAgICBpZiAoaXNJbml0aWFsT3Blbikge1xuICAgICAgdGhpcy5zaG93KHRydWUpO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlZCgpIHtcbiAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMuc2hvdyh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlKHRydWUpO1xuICAgIH1cbiAgfSxcbiAgZGVzdHJveWVkKCkge1xuICAgIGlmICh0aGlzLnRvZ2dsZUZ1bmMpIHtcbiAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1kczpkcm9wZG93bjp0b2dnbGVcIiwgdGhpcy50b2dnbGVGdW5jKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlzcG9zZUZ1bmMpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmRpc3Bvc2VGdW5jKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hhc2VGdW5jKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmtleURvd25GdW5jKSB7XG4gICAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMua2V5RG93bkZ1bmMpO1xuICAgIH1cbiAgfSxcbiAgZGlzcG9zZShldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2V0VGFyZ2V0KGV2ZW50KTtcblxuICAgIGNvbnN0IGlzQ2xvc2VzdCA9ICEhdGFyZ2V0LmNsb3Nlc3QoXCIjXCIgKyB0aGlzLmVsLmlkKTtcbiAgICBpZiAoIWlzQ2xvc2VzdCkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogR2V0IHRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50XG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgQHBhcmFtIHtFdmVudH0gRXZlbnRcbiAgICogIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICogIEBwcml2YXRlXG4gICAqL1xuICBnZXRUYXJnZXQoZXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC5kZXRhaWw/LmRpc3BhdGNoZXIgPz8gZXZlbnQudGFyZ2V0O1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9LFxuICB0b2dnbGUoKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLWNvbnRlbnRdXCIpO1xuICAgIGlmIChkcm9wZG93bi5kYXRhc2V0LmhpZGRlbiA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIHNob3coc2tpcEFuaW1hdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLWNvbnRlbnRdXCIpO1xuICAgIGNvbnN0IGRyb3Bkb3duSWNvbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5kcm9wZG93bi1zZWxlY3QtaWNvblwiKTtcblxuICAgIC8vIEhhbmRsZSBkcm9wZG93biBpY29uIGlmIGl0IGV4aXN0c1xuICAgIGlmIChkcm9wZG93bkljb24pIHtcbiAgICAgIGRyb3Bkb3duSWNvbi5jbGFzc0xpc3QuYWRkKFwicm90YXRlLTE4MFwiKTtcbiAgICAgIGRyb3Bkb3duSWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwicm90YXRlLTBcIik7XG4gICAgfVxuXG4gICAgZHJvcGRvd24uZGF0YXNldC5oaWRkZW4gPSBcImZhbHNlXCI7XG4gICAgdGhpcy5jaGFzZUZ1bmMoKTtcbiAgICBpZiAoIXNraXBBbmltYXRpb24pIHtcbiAgICAgIGRyb3Bkb3duLmFuaW1hdGUoXG4gICAgICAgIERST1BET1dOX0VOVEVSX0FOSU1BVElPTi5rZXlmcmFtZXMsXG4gICAgICAgIHRoaXMuZWwuZGF0YXNldC5za2lwQW5pbWF0aW9uID09PSBcInRydWVcIlxuICAgICAgICAgID8gRFJPUERPV05fU0tJUF9PUFRTX05VTExcbiAgICAgICAgICA6IERST1BET1dOX0VOVEVSX0FOSU1BVElPTi5vcHRzXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gIH0sXG4gIGhpZGUoc2tpcEFuaW1hdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLWNvbnRlbnRdXCIpO1xuICAgIGNvbnN0IGRyb3Bkb3duSWNvbiA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIi5kcm9wZG93bi1zZWxlY3QtaWNvblwiKTtcblxuICAgIC8vIEhhbmRsZSBkcm9wZG93biBpY29uIGlmIGl0IGV4aXN0c1xuICAgIGlmIChkcm9wZG93bkljb24pIHtcbiAgICAgIGRyb3Bkb3duSWNvbi5jbGFzc0xpc3QuYWRkKFwicm90YXRlLTBcIik7XG4gICAgICBkcm9wZG93bkljb24uY2xhc3NMaXN0LnJlbW92ZShcInJvdGF0ZS0xODBcIik7XG4gICAgfVxuXG4gICAgaWYgKGRyb3Bkb3duLmRhdGFzZXQuaGlkZGVuID09PSBcInRydWVcIiB8fCAhdGhpcy5pc09wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFza2lwQW5pbWF0aW9uKSB7XG4gICAgICBkcm9wZG93bi5hbmltYXRlKFxuICAgICAgICBEUk9QRE9XTl9MRUFWRV9BTklNQVRJT04ua2V5ZnJhbWVzLFxuICAgICAgICB0aGlzLmVsLmRhdGFzZXQuc2tpcEFuaW1hdGlvbiA9PT0gXCJ0cnVlXCJcbiAgICAgICAgICA/IERST1BET1dOX1NLSVBfT1BUU19OVUxMXG4gICAgICAgICAgOiBEUk9QRE9XTl9MRUFWRV9BTklNQVRJT04ub3B0c1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KFxuICAgICAgKCkgPT4ge1xuICAgICAgICBkcm9wZG93bi5kYXRhc2V0LmhpZGRlbiA9IFwidHJ1ZVwiO1xuICAgICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHNraXBBbmltYXRpb24gfHwgdGhpcy5lbC5kYXRhc2V0LnNraXBBbmltYXRpb24gPT09IFwidHJ1ZVwiXG4gICAgICAgID8gMFxuICAgICAgICA6IERST1BET1dOX0FOSU1BVElPTl9EVVJBVElPTlxuICAgICk7XG4gIH0sXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSB3aW5kb3cgaXMgc2Nyb2xsZWQsIGFuZCBjaGVjayB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBzaWRlIG9mIERyb3Bkb3duXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgY2hhc2UoKSB7XG4gICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLWNvbnRlbnRdXCIpO1xuICAgIGNvbnN0IHRyaWdnZXIgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCJbbWRzLWRyb3Bkb3duLXRyaWdnZXJdXCIpO1xuXG4gICAgaWYgKGRyb3Bkb3duLmRhdGFzZXQuaGlkZGVuID09PSBcInRydWVcIiB8fCAhZHJvcGRvd24gfHwgIXRyaWdnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhbmNob3JSZWN0ID0gdHJpZ2dlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzZWxmUmVjdCA9IGRyb3Bkb3duLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgY29uc3Qgc3RhdHVzID0ge1xuICAgICAgYW5jaG9ySGVpZ2h0OiBNYXRoLnJvdW5kKGFuY2hvclJlY3QuaGVpZ2h0KSxcbiAgICAgIGRyb3Bkb3duSGVpZ2h0OiBNYXRoLnJvdW5kKHNlbGZSZWN0LmhlaWdodCksXG4gICAgICBkcm9wZG93bldpZHRoOiBNYXRoLnJvdW5kKHNlbGZSZWN0LndpZHRoKSxcbiAgICAgIGF2YWlsYWJsZVNwYWNlVG9wOiBNYXRoLm1heChNYXRoLnJvdW5kKGFuY2hvclJlY3QudG9wKSwgMCksXG4gICAgICBhdmFpbGFibGVTcGFjZUJvdHRvbTogTWF0aC5tYXgoXG4gICAgICAgIE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0IC0gYW5jaG9yUmVjdC5ib3R0b20pLFxuICAgICAgICAwXG4gICAgICApLFxuICAgIH07XG4gICAgaWYgKHN0YXR1cy5kcm9wZG93bkhlaWdodCA+IHN0YXR1cy5hdmFpbGFibGVTcGFjZUJvdHRvbSkge1xuICAgICAgZHJvcGRvd24uc3R5bGUudG9wID0gYC0ke3N0YXR1cy5kcm9wZG93bkhlaWdodCArIDh9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcm9wZG93bi5zdHlsZS50b3AgPSBgJHtzdGF0dXMuYW5jaG9ySGVpZ2h0ICsgOH1weGA7XG4gICAgfVxuICB9LFxuICBvbktleURvd24oZXZlbnQpIHtcbiAgICBjb25zdCBkcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuaWQpO1xuICAgIGlmICghZHJvcGRvd24pIHJldHVybjtcblxuICAgIGNvbnN0IGRyb3Bkb3duQ29udGVudCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIlttZHMtZHJvcGRvd24tY29udGVudF1cIik7XG4gICAgaWYgKCFkcm9wZG93bkNvbnRlbnQpIHJldHVybjtcblxuICAgIGNvbnN0IGl0ZW1zID0gZHJvcGRvd25Db250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgbGV0IGN1cnJlbnRJbmRleCA9IEFycmF5LmZyb20oaXRlbXMpLmZpbmRJbmRleChcbiAgICAgIChpdGVtKSA9PiBpdGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgKTtcblxuICAgIGNvbnN0IHNob3dEcm9wZG93biA9ICgpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlTmF2aWdhdGlvbiA9IChkaXJlY3Rpb24pID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjdXJyZW50SW5kZXggPSAoY3VycmVudEluZGV4ICsgZGlyZWN0aW9uICsgaXRlbXMubGVuZ3RoKSAlIGl0ZW1zLmxlbmd0aDtcbiAgICAgIGl0ZW1zW2N1cnJlbnRJbmRleF0uZm9jdXMoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlU2VsZWN0aW9uID0gKCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChjdXJyZW50SW5kZXggIT09IC0xKSB7XG4gICAgICAgIGl0ZW1zW2N1cnJlbnRJbmRleF0uY2xpY2soKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgZHJvcGRvd24uZm9jdXMoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGlkZURyb3Bkb3duID0gKCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH07XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgY2FzZSBcIkFycm93RG93blwiOlxuICAgICAgICBoYW5kbGVOYXZpZ2F0aW9uKDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJBcnJvd1VwXCI6XG4gICAgICAgIGhhbmRsZU5hdmlnYXRpb24oLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJFbnRlclwiOlxuICAgICAgY2FzZSBcIiBcIjpcbiAgICAgICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgICAgIHNob3dEcm9wZG93bigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhhbmRsZVNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkVzY2FwZVwiOlxuICAgICAgICBoaWRlRHJvcGRvd24oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9LFxufTtcbmV4cG9ydCBkZWZhdWx0IE1vb25Ecm9wZG93bjtcbiIsICJjb25zdCBQYWdpbmF0aW9uID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuc2V0dXAoKTtcbiAgfSxcbiAgc2V0dXAoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWw7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcIm1vb246cGFnaW5hdGlvbjpuYXZpZ2F0ZVwiLFxuICAgICAgKHsgZGV0YWlsOiB7IGRpcmVjdGlvbiwgYmFzZV9wYXJhbTogYmFzZVBhcmFtIH0gfSkgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZU5hdmlnYXRpb24oeyBkaXJlY3Rpb24sIGJhc2VQYXJhbSB9KTtcbiAgICAgIH1cbiAgICApO1xuICB9LFxuICBoYW5kbGVOYXZpZ2F0aW9uKHsgZGlyZWN0aW9uLCBiYXNlUGFyYW0gfSkge1xuICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSBwYXJzZUludCh0aGlzLmVsLmRhdGFzZXQuYWN0aXZlSXRlbSwgMTApIHx8IDE7XG4gICAgY29uc3QgdG90YWxTdGVwcyA9IHBhcnNlSW50KHRoaXMuZWwuZGF0YXNldC50b3RhbFN0ZXBzLCAxMCkgfHwgMTtcbiAgICBjb25zdCBuZXdBY3RpdmVJdGVtID0gdGhpcy5jYWxjdWxhdGVOZXdBY3RpdmVJdGVtKFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgYWN0aXZlSXRlbSxcbiAgICAgIHRvdGFsU3RlcHNcbiAgICApO1xuXG4gICAgaWYgKCF0aGlzLmlzVmFsaWROYXZpZ2F0aW9uKG5ld0FjdGl2ZUl0ZW0sIGFjdGl2ZUl0ZW0sIHRvdGFsU3RlcHMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKG5ld0FjdGl2ZUl0ZW0pO1xuICAgIHRoaXMubmF2aWdhdGVUb1BhZ2UobmV3QWN0aXZlSXRlbSwgYmFzZVBhcmFtKTtcbiAgICB0aGlzLmRpc2FibGVBcnJvd0NvbnRyb2xzKG5ld0FjdGl2ZUl0ZW0sIHRvdGFsU3RlcHMpO1xuICB9LFxuICBjYWxjdWxhdGVOZXdBY3RpdmVJdGVtKGRpcmVjdGlvbiwgYWN0aXZlSXRlbSwgdG90YWxTdGVwcykge1xuICAgIGlmIChkaXJlY3Rpb24gPT09IHRoaXMuZGlyZWN0aW9ucy5wcmV2KSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoMSwgYWN0aXZlSXRlbSAtIDEpO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09IHRoaXMuZGlyZWN0aW9ucy5uZXh0KSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4odG90YWxTdGVwcywgYWN0aXZlSXRlbSArIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhY3RpdmVJdGVtO1xuICB9LFxuICBpc1ZhbGlkTmF2aWdhdGlvbihuZXdBY3RpdmVJdGVtLCBjdXJyZW50QWN0aXZlSXRlbSwgdG90YWxTdGVwcykge1xuICAgIGlmIChuZXdBY3RpdmVJdGVtID09PSBjdXJyZW50QWN0aXZlSXRlbSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdBY3RpdmVJdGVtID49IDEgJiYgbmV3QWN0aXZlSXRlbSA8PSB0b3RhbFN0ZXBzO1xuICB9LFxuICBkaXNhYmxlQXJyb3dDb250cm9scyhuZXdBY3RpdmVJdGVtLCB0b3RhbFN0ZXBzKSB7XG4gICAgdGhpcy5kaXNhYmxlQXJyb3dDb250cm9sKFwicHJldlwiLCBuZXdBY3RpdmVJdGVtKTtcbiAgICB0aGlzLmRpc2FibGVBcnJvd0NvbnRyb2woXCJuZXh0XCIsIG5ld0FjdGl2ZUl0ZW0sIHRvdGFsU3RlcHMpO1xuICB9LFxuXG4gIGRpc2FibGVBcnJvd0NvbnRyb2woZGlyZWN0aW9uLCBuZXdBY3RpdmVJdGVtLCB0b3RhbFN0ZXBzKSB7XG4gICAgY29uc3QgYXJyb3dDb250cm9sID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYFtkYXRhLWFycm93LWNvbnRyb2w9JyR7ZGlyZWN0aW9ufSddYFxuICAgICk7XG5cbiAgICBpZiAodGhpcy5pc0Fycm93RGlzYWJsZWQoZGlyZWN0aW9uLCBuZXdBY3RpdmVJdGVtLCB0b3RhbFN0ZXBzKSkge1xuICAgICAgYXJyb3dDb250cm9sLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWFycm93Q29udHJvbC5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGFycm93Q29udHJvbC5kaXNhYmxlZCA9IGZhbHNlO1xuICB9LFxuICBpc0Fycm93RGlzYWJsZWQoZGlyZWN0aW9uLCBuZXdBY3RpdmVJdGVtLCB0b3RhbFN0ZXBzKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gdGhpcy5kaXJlY3Rpb25zLnByZXYpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzQXJyb3dQcmV2RGlzYWJsZWQobmV3QWN0aXZlSXRlbSk7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gdGhpcy5kaXJlY3Rpb25zLm5leHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzQXJyb3dOZXh0RGlzYWJsZWQobmV3QWN0aXZlSXRlbSwgdG90YWxTdGVwcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBpc0Fycm93UHJldkRpc2FibGVkKG5ld0FjdGl2ZUl0ZW0pIHtcbiAgICByZXR1cm4gbmV3QWN0aXZlSXRlbSA8PSAxO1xuICB9LFxuICBpc0Fycm93TmV4dERpc2FibGVkKG5ld0FjdGl2ZUl0ZW0sIHRvdGFsU3RlcHMpIHtcbiAgICByZXR1cm4gbmV3QWN0aXZlSXRlbSA+PSB0b3RhbFN0ZXBzO1xuICB9LFxuXG4gIHVwZGF0ZVBhZ2luYXRpb24obmV3QWN0aXZlSXRlbSkge1xuICAgIHRoaXMuZWwuZGF0YXNldC5hY3RpdmVJdGVtID0gbmV3QWN0aXZlSXRlbTtcblxuICAgIHRoaXMuYWRkQWN0aXZlQ2xhc3MobmV3QWN0aXZlSXRlbSk7XG4gIH0sXG4gIG5hdmlnYXRlVG9QYWdlKG5ld0FjdGl2ZUl0ZW0sIGJhc2VQYXJhbSkge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uKTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChiYXNlUGFyYW0sIG5ld0FjdGl2ZUl0ZW0pO1xuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgdXJsKTtcbiAgICB0aGlzLnB1c2hFdmVudChcInVwZGF0ZVwiLCB7XG4gICAgICBwYWdlOiBuZXdBY3RpdmVJdGVtLFxuICAgICAgYmFzZV9wYXJhbTogYmFzZVBhcmFtLFxuICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICB9KTtcbiAgfSxcbiAgYWRkQWN0aXZlQ2xhc3MoYWN0aXZlSXRlbSkge1xuICAgIGNvbnN0IG5ld0FjdGl2ZUVsZW1lbnQgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgLm1vb24tcGFnaW5hdGlvbi1pdGVtW2RhdGEtaXRlbT1cIiR7YWN0aXZlSXRlbX1cIl1gXG4gICAgKTtcblxuICAgIGlmICghbmV3QWN0aXZlRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2xhc3MoKTtcbiAgICBuZXdBY3RpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtb29uLXBhZ2luYXRpb24taXRlbS1hY3RpdmVcIik7XG4gIH0sXG4gIHJlbW92ZUFjdGl2ZUNsYXNzKCkge1xuICAgIGNvbnN0IGN1cnJlbnRBY3RpdmUgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoXCIubW9vbi1wYWdpbmF0aW9uLWl0ZW0tYWN0aXZlXCIpO1xuXG4gICAgaWYgKCFjdXJyZW50QWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGN1cnJlbnRBY3RpdmUuY2xhc3NMaXN0LnJlbW92ZShcIm1vb24tcGFnaW5hdGlvbi1pdGVtLWFjdGl2ZVwiKTtcbiAgfSxcbiAgZGlyZWN0aW9uczogeyBwcmV2OiBcInByZXZcIiwgbmV4dDogXCJuZXh0XCIgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2luYXRpb247XG4iLCAiLy8gVGhlIGR1cmF0aW9uIG9mIHRoZSBwb3BvdmVyIGFuaW1hdGlvbiBpbiBtc1xuY29uc3QgUE9QT1ZFUl9BTklNQVRJT05fRFVSQVRJT04gPSAyMDA7XG5jb25zdCBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQgPSBcImN1YmljLWJlemllcigwLjIsIDAsIDAuMzgsIDAuOSlcIjtcbi8qXG4gKiBTa2lwIEFuaW1hdGlvbiBjb25zdGFudFxuICogLS0tLS0tLS0tLS0tLS0tXG4gKiBUaGUga2V5ZnJhbWVzIGFuZCBvcHRpb25zIGZvciB0aGUgc2tpcCBhbmltYXRpb25cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmNvbnN0IFBPUE9WRVJfU0tJUF9PUFRTX05VTEwgPSB7XG4gIGR1cmF0aW9uOiAwLFxuICBpdGVyYXRpb25zOiAxLFxuICBlYXNpbmc6IFwibGluZWFyXCIsXG59O1xuLyoqXG4gKiBFbnRyeSBhbmltYXRpb24gY29uc3RhbnRcbiAqIC0tLS0tLS0tLS0tLS0tLVxuICogVGhlIGtleWZyYW1lcyBhbmQgb3B0aW9ucyBmb3IgdGhlIGVudHJ5IGFuaW1hdGlvblxuICogQHR5cGUge09iamVjdH1cbiAqL1xuY29uc3QgUE9QT1ZFUl9FTlRSWV9BTklNQVRJT04gPSB7XG4gIGtleWZyYW1lcyhvcmlnaW4gPSBcInRvcFwiKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgZmlsdGVyOiBcImJsdXIoMXB4KVwiLFxuICAgICAgICB0b3A6IG9yaWdpbiA9PT0gXCJ0b3BcIiA/IFwiMTBweFwiIDogXCItMTBweFwiLFxuICAgICAgfSxcbiAgICAgIHsgb3BhY2l0eTogMSwgZmlsdGVyOiBcImJsdXIoMHB4KVwiLCB0b3A6IFwiMHB4XCIgfSxcbiAgICBdO1xuICB9LFxuICBvcHRzOiB7XG4gICAgZHVyYXRpb246IFBPUE9WRVJfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQsXG4gIH0sXG59O1xuLyoqXG4gKiBFeGl0IGFuaW1hdGlvblxuICogLS0tLS0tLS0tLS0tLS0tXG4gKiAgVGhlIGtleWZyYW1lcyBhbmQgb3B0aW9ucyBmb3IgdGhlIGV4aXQgYW5pbWF0aW9uXG4gKiAgQHR5cGUge09iamVjdH1cbiAqL1xuY29uc3QgUE9QT1ZFUl9FWElUX0FOSU1BVElPTiA9IHtcbiAga2V5ZnJhbWVzKG9yaWdpbiA9IFwidG9wXCIpIHtcbiAgICByZXR1cm4gW1xuICAgICAgeyBmaWx0ZXI6IFwiYmx1cigwcHgpXCIsIHRvcDogXCIwcHhcIiwgb3BhY2l0eTogMSB9LFxuICAgICAge1xuICAgICAgICBmaWx0ZXI6IFwiYmx1cigxcHgpXCIsXG4gICAgICAgIHRvcDogb3JpZ2luID09PSBcInRvcFwiID8gXCIzcHhcIiA6IFwiLTNweFwiLFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgfSxcbiAgICBdO1xuICB9LFxuICBvcHRzOiB7XG4gICAgZHVyYXRpb246IFBPUE9WRVJfQU5JTUFUSU9OX0RVUkFUSU9OLFxuICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgZWFzaW5nOiBUSU1JTkdfQU5JTUFUSU9OX0VBU0VfU1RBTkRBUkQsXG4gIH0sXG59O1xuXG5jb25zdCBQb3BvdmVyID0ge1xuICAvKipcbiAgICogU2hvdyB0aGUgcG9wb3ZlclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIGBtZHM6cG9wb3ZlcjpzaG93YCBldmVudCBpcyBmaXJlZFxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBFdmVudFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIHNob3coZXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmdldFRhcmdldChldmVudCk7XG4gICAgY29uc3QgY3VycmVudFNpZGUgPSB0aGlzLmVsLmRhdGFzZXQuc2lkZSB8fCBcImJvdHRvbVwiO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgdGFyZ2V0IG5vdCBmb3VuZCwgdGhyb3cgYW4gZXJyb3JcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJNRFMgUG9wb3ZlcjogVGFyZ2V0IG5vdCBmb3VuZFwiKTtcbiAgICAgIHJldHVybjsgLy8gQ2FuJ3QgZG8gYW55dGhpbmcgd2l0aG91dCBhIHRhcmdldFxuICAgIH1cblxuICAgIC8vIEZpeCBtdWx0aXBsZSBzcGFtIGNsaWNrXG4gICAgaWYgKHRoaXMuY2xvc2luZ1RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNsb3NpbmdUaW1lb3V0KTtcbiAgICAgIHRoaXMuY2xvc2luZ1RpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIHRhcmdldFxuICAgIGNvbnN0IHRhcmdldFJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICB0aGlzLmFwcGx5Q1NTVmFycyh7XG4gICAgICBhbmNob3JIZWlnaHQ6IHRhcmdldFJlY3QuaGVpZ2h0LFxuICAgICAgYW5jaG9yV2lkdGg6IHRhcmdldFJlY3Qud2lkdGgsXG4gICAgICB0b3A6IHRhcmdldFJlY3QudG9wLFxuICAgICAgYm90dG9tOiB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0YXJnZXRSZWN0LmJvdHRvbSxcbiAgICB9KTtcblxuICAgIC8vIFNldCB0aGUgcG9zaXRpb24gb2YgdGhlIHBvcG92ZXJcbiAgICB0aGlzLmVsLnN0eWxlLnRyYW5zZm9ybSA9IHRoaXMuZ2V0VHJhbnNmb3JtKHRhcmdldFJlY3QpO1xuXG4gICAgLy8gQXBwbHkgdGhlIGVudHJ5IGFuaW1hdGlvblxuICAgIHRoaXMuZWwuYW5pbWF0ZShcbiAgICAgIFBPUE9WRVJfRU5UUllfQU5JTUFUSU9OLmtleWZyYW1lcyhjdXJyZW50U2lkZSksXG4gICAgICB0aGlzLmVsLmRhdGFzZXQuc2tpcEFuaW1hdGlvbiA9PT0gXCJ0cnVlXCJcbiAgICAgICAgPyBQT1BPVkVSX1NLSVBfT1BUU19OVUxMXG4gICAgICAgIDogUE9QT1ZFUl9FTlRSWV9BTklNQVRJT04ub3B0c1xuICAgICk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgY2xhc3MgaGlkZGVuXG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgfSk7XG5cbiAgICAvLyBTZXR1cCB0aGUgZGlzcG9zZSBmdW5jdGlvbiwgd2hpY2ggaGF2ZSB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gaGlkZSB0aGUgcG9wb3ZlciBvbiBjbGljayBvdXRzaWRlXG4gICAgdGhpcy5kaXNwb3NlRnVuYyA9IHRoaXMuZGlzcG9zZS5iaW5kKHRoaXMpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmRpc3Bvc2VGdW5jKTtcblxuICAgIC8vIFNldHVwIHRoZSBjaGFzZSBmdW5jdGlvbiwgd2hpY2ggaGF2ZSB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gY2hhc2UgdGhlIHRhcmdldCBvbiBzY3JvbGxcbiAgICB0aGlzLmNoYXNlRnVuYyA9ICgpID0+IHRoaXMuY2hhc2UuYmluZCh0aGlzKSh0YXJnZXQpO1xuXG4gICAgLy8gQWRkIHRoZSBldmVudCBsaXN0ZW5lciB0byBjaGFzZSB0aGUgdGFyZ2V0IG9uIHNjcm9sbFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuY2hhc2VGdW5jKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmNoYXNlRnVuYyk7XG5cbiAgICAvLyBSdW4gdGhlIGZpcnN0IGNoYXNlXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuY2hhc2VGdW5jKCkpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuY2hhc2VGdW5jKCkpLCA0MDApO1xuXG4gICAgLy8gU2V0IHRoZSBzdGF0ZSB0byB2aXNpYmxlXG4gICAgdGhpcy5lbC5kYXRhc2V0LnN0YXRlID0gXCJ2aXNpYmxlXCI7XG4gIH0sXG4gIC8qKlxuICAgKiBIaWRlIHRoZSBwb3BvdmVyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS1cbiAgICpcbiAgICogIEBwYXJhbSB7RXZlbnR9IEV2ZW50XG4gICAqICBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGhpZGUoZXZlbnQpIHtcbiAgICAvLyBDdXJyZW50IFNpZGVcbiAgICBjb25zdCBjdXJyZW50U2lkZSA9IHRoaXMuZWwuZGF0YXNldC5zaWRlIHx8IFwiYm90dG9tXCI7XG4gICAgLy8gT24gQ2xvc2UgQ2FsbGJhY2tcbiAgICBjb25zdCBvbkNsb3NlQ2FsbGJhY2sgPSB0aGlzLmVsLmRhdGFzZXQub25DbG9zZTtcblxuICAgIC8vIEFwcGx5IHRoZSBleGl0IGFuaW1hdGlvblxuICAgIHRoaXMuZWwuYW5pbWF0ZShcbiAgICAgIFBPUE9WRVJfRVhJVF9BTklNQVRJT04ua2V5ZnJhbWVzKGN1cnJlbnRTaWRlKSxcbiAgICAgIHRoaXMuZWwuZGF0YXNldC5za2lwQW5pbWF0aW9uID09IFwidHJ1ZVwiXG4gICAgICAgID8gUE9QT1ZFUl9TS0lQX09QVFNfTlVMTFxuICAgICAgICA6IFBPUE9WRVJfRVhJVF9BTklNQVRJT04ub3B0c1xuICAgICk7XG5cbiAgICBpZiAodGhpcy5jbG9zaW5nVGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xvc2luZ1RpbWVvdXQpO1xuICAgICAgdGhpcy5jbG9zaW5nVGltZW91dCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgdGhlIGNsYXNzIGhpZGRlbiBhZnRlciB0aGUgYW5pbWF0aW9uXG4gICAgdGhpcy5jbG9zaW5nVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gQWRkIHRoZSBjbGFzcyBoaWRkZW5cbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9LCBQT1BPVkVSX0FOSU1BVElPTl9EVVJBVElPTik7XG5cbiAgICAvLyBSZW1vdmUgdGhlIGRpc3Bvc2UgZnVuY3Rpb24gaW4gY2FzZSBleGlzdHNcbiAgICBpZiAodGhpcy5kaXNwb3NlRnVuYykge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZGlzcG9zZUZ1bmMpO1xuICAgICAgdGhpcy5kaXNwb3NlRnVuYyA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBjaGFzZSBmdW5jdGlvbiBpbiBjYXNlIGV4aXN0c1xuICAgIGlmICh0aGlzLmNoYXNlRnVuYykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5jaGFzZUZ1bmMpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5jaGFzZUZ1bmMpO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgc3RhdGUgdG8gaGlkZGVuXG4gICAgdGhpcy5lbC5kYXRhc2V0LnN0YXRlID0gXCJoaWRkZW5cIjtcblxuICAgIGlmIChvbkNsb3NlQ2FsbGJhY2sgJiYgb25DbG9zZUNhbGxiYWNrICE9PSBcIlwiKSB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTKHRoaXMuZWwsIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1vbi1jbG9zZVwiKSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogVG9nZ2xlIHRoZSBwb3BvdmVyIHZpc2liaWxpdHlcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIEBwYXJhbSB7RXZlbnR9IEV2ZW50XG4gICAqICBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIHRvZ2dsZShldmVudCkge1xuICAgIGlmICh0aGlzLmVsLmRhdGFzZXQuc3RhdGUgPT09IFwiaGlkZGVuXCIpIHtcbiAgICAgIHRoaXMuc2hvdyhldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGlkZShldmVudCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRyYW5zZm9ybSBwcm9wZXJ0eSBmb3IgdGhlIHBvcG92ZXJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIEBwYXJhbSB7RE9NUmVjdH0gdGFyZ2V0XG4gICAqICBAcmV0dXJucyB7c3RyaW5nfVxuICAgKiAgQHByaXZhdGVcbiAgICovXG4gIGdldFRyYW5zZm9ybSh0YXJnZXRSZWN0KSB7XG4gICAgY29uc3QgY3VycmVudFNpZGUgPSB0aGlzLmVsLmRhdGFzZXQuc2lkZSB8fCBcImJvdHRvbVwiO1xuICAgIGNvbnN0IGN1cnJlbnRBbGlnbiA9IHRoaXMuZ2V0QWxpZ24oKTtcblxuICAgIGNvbnN0IGN1cnJlbnRPZmZzZXQgPSBwYXJzZUludChcbiAgICAgIHRoaXMuZ2V0RWxTdHlsZSh0aGlzLmVsKS5nZXRQcm9wZXJ0eVZhbHVlKFxuICAgICAgICBcIi0tbWRzLXBvcG92ZXItdHJhbnNmb3JtLW9yaWdpblwiXG4gICAgICApIHx8IFwiMFwiXG4gICAgKTtcbiAgICBjb25zdCBmaW5hbFRyYW5zZm9ybSA9IHtcbiAgICAgIHRvcDpcbiAgICAgICAgY3VycmVudFNpZGUgPT09IFwidG9wXCJcbiAgICAgICAgICA/IHRhcmdldFJlY3QudG9wIC0gdGhpcy5lbC5vZmZzZXRIZWlnaHQgLSA0XG4gICAgICAgICAgOiB0YXJnZXRSZWN0LnRvcCArIHRhcmdldFJlY3QuaGVpZ2h0ICsgNCxcbiAgICAgIGxlZnQ6XG4gICAgICAgICgoY2xpZW50V2lkdGgpID0+IHtcbiAgICAgICAgICBpZiAoY3VycmVudEFsaWduID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRSZWN0LmxlZnQgKyB0YXJnZXRSZWN0LndpZHRoIC0gY2xpZW50V2lkdGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJlbnRBbGlnbiA9PT0gXCJtaWRkbGVcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFJlY3QubGVmdCArICh0YXJnZXRSZWN0LndpZHRoIC0gY2xpZW50V2lkdGgpIC8gMjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdGFyZ2V0UmVjdC5sZWZ0O1xuICAgICAgICB9KSh0aGlzLmVsLmNsaWVudFdpZHRoKSB8fCAwLFxuICAgIH07XG5cbiAgICByZXR1cm4gYHRyYW5zbGF0ZTNkKCR7TWF0aC5jZWlsKGZpbmFsVHJhbnNmb3JtLmxlZnQpfXB4LCAke1xuICAgICAgTWF0aC5jZWlsKGZpbmFsVHJhbnNmb3JtLnRvcCkgKyBjdXJyZW50T2Zmc2V0XG4gICAgfXB4LCAwKWA7XG4gIH0sXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZGlyZWN0aW9uIGlzIFJUTFxuICAgKlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGlzUlRMKCkge1xuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KS5kaXJlY3Rpb24gPT09IFwicnRsXCI7XG4gIH0sXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgYWxpZ24gYmFzZWQgYWxzbyBvbiB0aGUgUlRMIGRpXG4gICAqL1xuICBnZXRBbGlnbigpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgZGlyZWN0aW9uIGlzIFJUTFxuICAgIGNvbnN0IGlzUlRMID0gdGhpcy5pc1JUTCgpO1xuICAgIC8vIEdldCB0aGUgY3VycmVudCBhbGlnblxuICAgIGNvbnN0IGN1cnJlbnRBbGlnbiA9IHRoaXMuZWwuZGF0YXNldC5hbGlnbiB8fCBcImxlZnRcIjtcbiAgICAvLyBSZXR1cm4gdGhlIGN1cnJlbnQgYWxpZ25cbiAgICByZXR1cm4gaXNSVEwgPyAoY3VycmVudEFsaWduID09PSBcImxlZnRcIiA/IFwicmlnaHRcIiA6IFwibGVmdFwiKSA6IGN1cnJlbnRBbGlnbjtcbiAgfSxcblxuICAvKipcbiAgICogR2V0IENvbXB1dGVkIFN0eWxlXG4gICAqL1xuICBnZXRFbFN0eWxlKGVsKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgfSxcbiAgLyoqXG4gICAqIEdldCB0aGUgdGFyZ2V0IG9mIHRoZSBldmVudFxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIEBwYXJhbSB7RXZlbnR9IEV2ZW50XG4gICAqICBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAqICBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0VGFyZ2V0KGV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQuZGV0YWlsPy5kaXNwYXRjaGVyID8/IGV2ZW50LnRhcmdldDtcbiAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSxcbiAgLyoqXG4gICAqIFNob3VsZCBhcHBseSBvcmlnaW4/XG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcGFyYW0ge09iamVjdH0gc3RhdHVzXG4gICAqICBAcGFyYW0ge1N0cmluZ30gY3VycmVudFNpZGVcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXRIZWlnaHRcbiAgICogIEByZXR1cm5zIHtCb29sZWFufVxuICAgKiAgQHByaXZhdGVcbiAgICovXG4gIGlzT3V0c2lkZVZpZXdwb3J0KHN0YXR1cywgY3VycmVudFNpZGUsIG9mZnNldEhlaWdodCkge1xuICAgIC8vIENoZWNrIGlmIHRoZSBwb3BvdmVyIGlzIG91dHNpZGUgdGhlIHZpZXdwb3J0XG4gICAgaWYgKFxuICAgICAgKHN0YXR1cy5hdmFpbGFibGVTcGFjZVRvcCA8PSBvZmZzZXRIZWlnaHQgJiYgY3VycmVudFNpZGUgPT09IFwidG9wXCIpIHx8XG4gICAgICAoc3RhdHVzLmF2YWlsYWJsZVNwYWNlQm90dG9tIDw9IG9mZnNldEhlaWdodCAmJiBjdXJyZW50U2lkZSA9PT0gXCJib3R0b21cIilcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIC8qKlxuICAgKiBEaXNwb3NlIHRoZSBwb3BvdmVyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIEBwYXJhbSB7RXZlbnR9IEV2ZW50XG4gICAqICBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGRpc3Bvc2UoZXZlbnQpIHtcbiAgICAvLyBJZ25vcmUgaWYgdGhlIHBvcG92ZXIgaXMgaGlkZGVuXG4gICAgaWYgKHRoaXMuZWwuZGF0YXNldC5zdGF0ZSA9PSBcImhpZGRlblwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQoZXZlbnQpO1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAvLyBObyBUYXJnZXRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoISF0YXJnZXQuY2xvc2VzdChcIltkYXRhLWlnbm9yZS1tZHMtcG9wb3Zlci1kaXNwb3NlXVwiKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSB0YXJnZXQgaXMgYSBjaGlsZCBvZiB0aGUgcG9wb3ZlciwgaWYgbm90LCBoaWRlIHRoZSBwb3BvdmVyXG4gICAgY29uc3QgaXNDbG9zZXN0ID0gISF0YXJnZXQuY2xvc2VzdChcIiNcIiArIHRoaXMuZWwuaWQpO1xuICAgIGlmICghaXNDbG9zZXN0KSB7XG4gICAgICB0aGlzLmhpZGUoZXZlbnQpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIHdpbmRvdyBpcyBzY3JvbGxlZCBhbmQgY2hhc2UgdGhlIHZpZXdwb3J0XG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAgICogIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgY2hhc2UodGFyZ2V0KSB7XG4gICAgY29uc3QgdGFyZ2V0UmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjdXJyZW50U2lkZSA9IHRoaXMuZWwuZGF0YXNldC5zaWRlIHx8IFwiYm90dG9tXCI7XG4gICAgY29uc3Qgc3RhdHVzID0ge1xuICAgICAgYW5jaG9ySGVpZ2h0OiBNYXRoLnJvdW5kKHRhcmdldFJlY3QuaGVpZ2h0KSxcbiAgICAgIGFuY2hvcldpZHRoOiBNYXRoLnJvdW5kKHRhcmdldFJlY3Qud2lkdGgpLFxuICAgICAgdG9wOiBNYXRoLm1heChNYXRoLnJvdW5kKHRhcmdldFJlY3QudG9wKSwgMCksXG4gICAgICBib3R0b206IE1hdGgubWF4KE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0IC0gdGFyZ2V0UmVjdC5ib3R0b20pLCAwKSxcbiAgICAgIGxlZnQ6IE1hdGgubWF4KE1hdGgucm91bmQodGFyZ2V0UmVjdC5sZWZ0KSwgMCksXG4gICAgICByaWdodDogTWF0aC5tYXgoTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJXaWR0aCAtIHRhcmdldFJlY3QucmlnaHQpLCAwKSxcbiAgICB9O1xuXG4gICAgLy8gQXBwbHkgdGhlIHN0YXR1cyB0byB0aGUgcG9wb3ZlclxuICAgIHRoaXMuYXBwbHlDU1NWYXJzKHN0YXR1cyk7XG5cbiAgICAvLyBTdXBwb3J0IGZvciByZXZlcnNlIHNpZGVcbiAgICBjb25zdCB0cmFuc2Zvcm1IZWlnaHQgPVxuICAgICAgY3VycmVudFNpZGUgPT09IFwidG9wXCJcbiAgICAgICAgPyB0aGlzLmVsLm9mZnNldEhlaWdodCArIHN0YXR1cy5hbmNob3JIZWlnaHQgKyA4XG4gICAgICAgIDogKHRoaXMuZWwub2Zmc2V0SGVpZ2h0ICsgc3RhdHVzLmFuY2hvckhlaWdodCArIDgpICogLTE7XG5cbiAgICBpZiAodGhpcy5pc091dHNpZGVWaWV3cG9ydChzdGF0dXMsIGN1cnJlbnRTaWRlLCB0aGlzLmVsLm9mZnNldEhlaWdodCkpIHtcbiAgICAgIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFwiLS1tZHMtcG9wb3Zlci10cmFuc2Zvcm0tb3JpZ2luXCIsXG4gICAgICAgIGAke3RyYW5zZm9ybUhlaWdodH1gXG4gICAgICApO1xuICAgICAgbGV0IG9mZnNldFRvcCA9IHN0YXR1cy5hdmFpbGFibGVTcGFjZVRvcCAtIHRoaXMuZWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgaWYgKGN1cnJlbnRTaWRlID09PSBcInRvcFwiKSB7XG4gICAgICAgIG9mZnNldFRvcCA9IHN0YXR1cy5hdmFpbGFibGVTcGFjZVRvcDtcbiAgICAgIH1cbiAgICAgIGlmIChvZmZzZXRUb3AgPCAwKSB7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUudG9wID0gYCR7TWF0aC5hYnMob2Zmc2V0VG9wKX1weGA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsLnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLW1kcy1wb3BvdmVyLXRyYW5zZm9ybS1vcmlnaW5cIiwgXCIwXCIpO1xuICAgICAgdGhpcy5lbC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IHRoZSB0cmFuc2Zvcm1cbiAgICB0aGlzLmVsLnN0eWxlLnRyYW5zZm9ybSA9IHRoaXMuZ2V0VHJhbnNmb3JtKHRhcmdldFJlY3QpO1xuICB9LFxuICAvKipcbiAgICogQXBwbHkgQ1NTIFZhcmlhYmxlc1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBAcGFyYW0ge09iamVjdH0gdmFsdWVzXG4gICAqICBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGFwcGx5Q1NTVmFycyh2YWx1ZXMpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuZWwuc3R5bGU7XG4gICAgY29uc3Qgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlcyk7XG5cbiAgICBpZiAob2JqZWN0S2V5cy5pbmNsdWRlcyhcImFuY2hvckhlaWdodFwiKSlcbiAgICAgIHN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tbWRzLXBvcG92ZXItYW5jaG9yLWhlaWdodFwiLFxuICAgICAgICBgJHtNYXRoLnJvdW5kKHZhbHVlcy5hbmNob3JIZWlnaHQpfXB4YFxuICAgICAgKTtcblxuICAgIGlmIChvYmplY3RLZXlzLmluY2x1ZGVzKFwiYW5jaG9yV2lkdGhcIikpXG4gICAgICBzdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLW1kcy1wb3BvdmVyLWFuY2hvci13aWR0aFwiLFxuICAgICAgICBgJHtNYXRoLnJvdW5kKHZhbHVlcy5hbmNob3JXaWR0aCl9cHhgXG4gICAgICApO1xuXG4gICAgaWYgKG9iamVjdEtleXMuaW5jbHVkZXMoXCJ0b3BcIikpXG4gICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tbWRzLXBvcG92ZXItYXZhaWxhYmxlLXNwYWNlLXRvcFwiLFxuICAgICAgICBgJHtNYXRoLnJvdW5kKHZhbHVlcy50b3ApfXB4YFxuICAgICAgKTtcblxuICAgIGlmIChvYmplY3RLZXlzLmluY2x1ZGVzKFwiYm90dG9tXCIpKVxuICAgICAgc3R5bGUuc2V0UHJvcGVydHkoXG4gICAgICAgIFwiLS1tZHMtcG9wb3Zlci1hdmFpbGFibGUtc3BhY2UtYm90dG9tXCIsXG4gICAgICAgIGAke01hdGgucm91bmQodmFsdWVzLmJvdHRvbSl9cHhgXG4gICAgICApO1xuXG4gICAgaWYgKG9iamVjdEtleXMuaW5jbHVkZXMoXCJyaWdodFwiKSlcbiAgICAgIHN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICBcIi0tbWRzLXBvcG92ZXItYXZhaWxhYmxlLXNwYWNlLXJpZ2h0XCIsXG4gICAgICAgIGAke01hdGgucm91bmQodmFsdWVzLnJpZ2h0KX1weGBcbiAgICAgICk7XG5cbiAgICBpZiAob2JqZWN0S2V5cy5pbmNsdWRlcyhcImxlZnRcIikpXG4gICAgICBzdHlsZS5zZXRQcm9wZXJ0eShcbiAgICAgICAgXCItLW1kcy1wb3BvdmVyLWF2YWlsYWJsZS1zcGFjZS1sZWZ0XCIsXG4gICAgICAgIGAke01hdGgucm91bmQodmFsdWVzLmxlZnQpfXB4YFxuICAgICAgKTtcbiAgfSxcbiAgLyoqXG4gICAqIFRoZSBtb3VudGVkIGhvb2tcbiAgICogLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIG1vdW50ZWRcbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBtb3VudGVkKCkge1xuICAgIC8vIERlZmluZSB0aGUgc2hvdyBhbmQgaGlkZSBmdW5jdGlvbnNcbiAgICB0aGlzLnNob3dGdW5jID0gdGhpcy5zaG93LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oaWRlRnVuYyA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlRnVuYyA9IHRoaXMudG9nZ2xlLmJpbmQodGhpcyk7XG5cbiAgICAvLyBBZGQgdGhlIGV2ZW50IGxpc3RlbmVyc1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1kczpwb3BvdmVyOnNob3dcIiwgdGhpcy5zaG93RnVuYyk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKFwibWRzOnBvcG92ZXI6aGlkZVwiLCB0aGlzLmhpZGVGdW5jKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZHM6cG9wb3Zlcjp0b2dnbGVcIiwgdGhpcy50b2dnbGVGdW5jKTtcblxuICAgIC8vIExpc3RlbiB0byB0aGUgZXZlbnRzIChMaXZlVmlldyBldmVudHMpXG4gICAgdGhpcy5oYW5kbGVFdmVudChcIm1kczpwb3BvdmVyOnNob3dcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBpc015RXZlbnQgPSBcIiNcIiArIHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQgfHwgdGhpcy5lbC5pZCA9PSBldmVudC5pZDtcbiAgICAgIGlmIChpc015RXZlbnQpIHtcbiAgICAgICAgdGhpcy5zaG93KGV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmhhbmRsZUV2ZW50KFwibWRzOnBvcG92ZXI6aGlkZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGlzTXlFdmVudCA9IFwiI1wiICsgdGhpcy5lbC5pZCA9PSBldmVudC5pZCB8fCB0aGlzLmVsLmlkID09IGV2ZW50LmlkO1xuICAgICAgaWYgKGlzTXlFdmVudCkge1xuICAgICAgICB0aGlzLmhpZGUoZXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuaGFuZGxlRXZlbnQoXCJtZHM6cG9wb3Zlcjp0b2dnbGVcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBpc015RXZlbnQgPSBcIiNcIiArIHRoaXMuZWwuaWQgPT0gZXZlbnQuaWQgfHwgdGhpcy5lbC5pZCA9PSBldmVudC5pZDtcbiAgICAgIGlmIChpc015RXZlbnQpIHtcbiAgICAgICAgdGhpcy50b2dnbGUoZXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0dXAgdGhlIGhvdmVyIHRyaWdnZXJzXG4gICAgdGhpcy5ob3ZlcnMgPSBbXTtcblxuICAgIC8vIFNldHVwIHRoZSBwb3BvdmVyXG4gICAgdGhpcy5zZXR1cCgpO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGluaXRpYWwgc3RhdHVzXG4gICAgdGhpcy5jaGVja0ZvckluaXRpYWxTdGF0dXMoKTtcbiAgfSxcbiAgLyoqXG4gICAqIFRoZSBkZXN0cm95ZWQgaG9va1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkXG4gICAqICBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGRlc3Ryb3llZCgpIHtcbiAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZHM6cG9wb3ZlcjpzaG93XCIsIHRoaXMuc2hvd0Z1bmMpO1xuICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1kczpwb3BvdmVyOmhpZGVcIiwgdGhpcy5oaWRlRnVuYyk7XG4gICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibWRzOnBvcG92ZXI6dG9nZ2xlXCIsIHRoaXMudG9nZ2xlRnVuYyk7XG5cbiAgICAvLyBEZXN0cm95IGVsZW1lbnRzIGV2ZW50IGxpc3RlbmVyc1xuICAgIHRoaXMuaG92ZXJzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICBpZiAoZWwpIHtcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgdGhpcy5zaG93RnVuYyk7XG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIHRoaXMuaGlkZUZ1bmMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZGlzcG9zZUZ1bmMpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmRpc3Bvc2VGdW5jKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hhc2VGdW5jKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmNoYXNlRnVuYyk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogU2V0dXAgdGhlIHBvcG92ZXJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgc2V0dXAoKSB7XG4gICAgLy8gU2V0dXAgdGhlIGhvdmVyIHRyaWdnZXJzXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLW1kcy1wb3BvdmVyLWhvdmVyXVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgaWYgKGVsLmRhdGFzZXQubWRzUG9wb3ZlckhvdmVyID09PSB0aGlzLmVsLmlkKSB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIHRoaXMuc2hvd0Z1bmMpO1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCB0aGlzLmhpZGVGdW5jKTtcblxuICAgICAgICAvLyBBZGQgdGhlIGVsZW1lbnQgdG8gdGhlIGhvdmVycyBhcnJheSB0byBiZSBkZXN0cm95ZWQgbGF0ZXJcbiAgICAgICAgdGhpcy5ob3ZlcnMucHVzaChlbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIG1heGltdW0gei1pbmRleCBvZiB0aGUgcGFnZVxuICAgIGxldCBjdXJyZW50WkluZGV4ID0gNTA7XG4gICAgY29uc3QgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgICBkb2N1bWVudC5ib2R5LFxuICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlRcbiAgICApO1xuXG4gICAgLypcbiAgICAgKiBMaW1pdCB0byA1MDAwIHRoZSBtYXggaXRlcmF0aW9uc1xuICAgICAqIHRvIGF2b2lkIGluZmluaXRlIGxvb3BzXG4gICAgICovXG4gICAgbGV0IG1heEJvdW5kQ3ljbGUgPSAwO1xuICAgIHdoaWxlICh0cmVlV2Fsa2VyLm5leHROb2RlKCkgJiYgbWF4Qm91bmRDeWNsZSA8IDUwMDApIHtcbiAgICAgIGN1cnJlbnRaSW5kZXggPSBNYXRoLm1heChcbiAgICAgICAgY3VycmVudFpJbmRleCxcbiAgICAgICAgcGFyc2VJbnQodGhpcy5nZXRFbFN0eWxlKHRyZWVXYWxrZXIuY3VycmVudE5vZGUpLnpJbmRleCwgMTApIHx8IDBcbiAgICAgICk7XG4gICAgICBtYXhCb3VuZEN5Y2xlICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRaSW5kZXggPj0gNTApIHtcbiAgICAgIHRoaXMuZWwuc3R5bGUuekluZGV4ID0gY3VycmVudFpJbmRleCArIDE7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGNyZWF0ZWRcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNoZWNrRm9ySW5pdGlhbFN0YXR1cygpIHtcbiAgICAvLyBHZXQgdGhlIHRhcmdldFxuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZWwuZGF0YXNldC5wb3BvdmVyVGFyZ2V0O1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBvcG92ZXIgc2hvdWxkIGJlIHZpc2libGVcbiAgICBpZiAodGhpcy5lbC5kYXRhc2V0LmluaXRpYWxTdGF0ZSA9PT0gXCJ2aXNpYmxlXCIgJiYgdGFyZ2V0KSB7XG4gICAgICB0aGlzLnNob3coeyB0YXJnZXQgfSk7XG4gICAgfVxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUG9wb3ZlcjtcbiIsICJjb25zdCBSZXNwb25zaXZlU2NyZWVuID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuaGF2ZU1pbiA9ICEhdGhpcy5lbC5kYXRhc2V0Lm1pbjtcbiAgICB0aGlzLmhhdmVNYXggPSAhIXRoaXMuZWwuZGF0YXNldC5tYXg7XG5cbiAgICB0aGlzLm1lZGlhUXVlcnkgPSB0aGlzLmdlbk1lZGlhUXVlcnkoKTtcblxuICAgIC8vIFNlbmRpbmcgdGhlIGZpcnN0IGV2ZW50XG4gICAgaWYgKHRoaXMubWVkaWFRdWVyeS5tYXRjaGVzKSB7XG4gICAgICB0aGlzLnB1c2hFdmVudFRvKHRoaXMuZWwsIFwic2hvd1wiKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGxpc3RlbmVyXG4gICAgdGhpcy5tZWRpYVF1ZXJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKHsgbWF0Y2hlcyB9KSA9PiB7XG4gICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICB0aGlzLnB1c2hFdmVudFRvKHRoaXMuZWwsIFwic2hvd1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHVzaEV2ZW50VG8odGhpcy5lbCwgXCJoaWRlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICB1cGRhdGVkKCkge1xuICAgIGlmICh0aGlzLm1lZGlhUXVlcnkubWF0Y2hlcykge1xuICAgICAgdGhpcy5wdXNoRXZlbnRUbyh0aGlzLmVsLCBcInNob3dcIik7XG4gICAgfVxuICB9LFxuICBnZW5NZWRpYVF1ZXJ5KCkge1xuICAgIGlmICh0aGlzLmhhdmVNaW4gJiYgdGhpcy5oYXZlTWF4KSB7XG4gICAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoXG4gICAgICAgIGAobWluLXdpZHRoOiAke3RoaXMuZWwuZGF0YXNldC5taW59cHgpIGFuZCAobWF4LXdpZHRoOiAke3RoaXMuZWwuZGF0YXNldC5tYXh9cHgpYCxcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhhdmVNaW4pIHtcbiAgICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShgKG1pbi13aWR0aDogJHt0aGlzLmVsLmRhdGFzZXQubWlufXB4KWApO1xuICAgIH1cbiAgICBpZiAodGhpcy5oYXZlTWF4KSB7XG4gICAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoYChtYXgtd2lkdGg6ICR7dGhpcy5lbC5kYXRhc2V0Lm1heH1weClgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoYChtaW4td2lkdGg6IDFweClgKTtcbiAgfSxcbn07XG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlU2NyZWVuO1xuIiwgImNvbnN0IGdlbmVyYXRlU3ZnSWNvbiA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gIGlmICghbmFtZSkge1xuICAgIHJldHVybiBmcmFnbWVudDtcbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDIwIDIwXCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgPHVzZSBocmVmPVwiL21vb25fYXNzZXRzL2ljb25zLyR7bmFtZX0uc3ZnIyR7bmFtZX1cIj48L3VzZT5cbiAgPC9zdmc+YDtcblxuICByZXR1cm4gZnJhZ21lbnQuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZVN2Z0ljb247XG4iLCAiaW1wb3J0IGdlbmVyYXRlU3ZnSWNvbiBmcm9tIFwiLi4vdXRpbHMvZ2VuZXJhdGVTdmdJY29uXCI7XG5cbmNvbnN0IFNuYWNrYmFySG9vayA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICB0aGlzLnNldHVwKCk7XG4gIH0sXG4gIHNldHVwKCkge1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vb246c25hY2tiYXI6c2hvd1wiLCAoeyBkZXRhaWwgfSkgPT4ge1xuICAgICAgY29uc3QgeyB2YXJpYW50LCBjb250ZXh0LCBtZXNzYWdlLCBvcHRzIH0gPSBkZXRhaWw7XG4gICAgICB0aGlzLmFwcGVuZFNuYWNrYmFyKHsgdmFyaWFudCwgY29udGV4dCwgbWVzc2FnZSwgb3B0cyB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuaGFuZGxlRXZlbnQoXCJtb29uOnNuYWNrYmFyOnNob3dcIiwgKHsgZGV0YWlsIH0pID0+IHtcbiAgICAgIGNvbnN0IHsgdmFyaWFudCwgY29udGV4dCwgbWVzc2FnZSwgb3B0cyB9ID0gZGV0YWlsO1xuICAgICAgdGhpcy5hcHBlbmRTbmFja2Jhcih7IHZhcmlhbnQsIGNvbnRleHQsIG1lc3NhZ2UsIG9wdHMgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGFwcGVuZFNuYWNrYmFyKHsgdmFyaWFudCA9IFwiZmlsbFwiLCBjb250ZXh0ID0gXCJicmFuZFwiLCBtZXNzYWdlLCBvcHRzID0ge30gfSkge1xuICAgIGNvbnN0IHsgaWNvbiwgYWN0aW9uX2xhYmVsLCBhY3Rpb24gfSA9IG9wdHM7XG4gICAgY29uc3QgY3VycmVudFNuYWNrYmFycyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLW1vdW50ZWQ9J3RydWUnXVwiKTtcbiAgICBjb25zdCBzbmFja2JhckNvdW50ID0gcGFyc2VJbnQodGhpcy5lbC5kYXRhc2V0LmNvdW50IHx8IFwiMFwiLCAxMCkgfHwgMDtcbiAgICBjb25zdCBtYXhTbmFja2JhcnMgPSBwYXJzZUludCh0aGlzLmVsLmRhdGFzZXQubWF4U25hY2tiYXJzIHx8IFwiNVwiLCAxMCkgfHwgNTtcblxuICAgIGlmIChzbmFja2JhckNvdW50ID49IG1heFNuYWNrYmFycykge1xuICAgICAgY29uc3Qgb2xkZXN0U25hY2tiYXIgPSBjdXJyZW50U25hY2tiYXJzWzBdO1xuICAgICAgb2xkZXN0U25hY2tiYXIuc2V0QXR0cmlidXRlKFwiZGF0YS1yZW1vdmVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgIG9sZGVzdFNuYWNrYmFyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRGcm9udCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihcIltkYXRhLWZyb250PSd0cnVlJ11cIik7XG5cbiAgICBpZiAoY3VycmVudEZyb250KSB7XG4gICAgICBjdXJyZW50RnJvbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1mcm9udFwiLCBcImZhbHNlXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHNuYWNrYmFyID0gdGhpcy5jcmVhdGVOZXdTbmFja2Jhcih7XG4gICAgICB2YXJpYW50LFxuICAgICAgY29udGV4dCxcbiAgICAgIHNuYWNrYmFyQ291bnQsXG4gICAgICBpY29uLFxuICAgICAgbWVzc2FnZSxcbiAgICAgIGFjdGlvbl9sYWJlbCxcbiAgICAgIGFjdGlvbixcbiAgICB9KTtcblxuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoc25hY2tiYXIpO1xuICB9LFxuICBjcmVhdGVOZXdTbmFja2Jhcih7XG4gICAgdmFyaWFudCxcbiAgICBjb250ZXh0LFxuICAgIHNuYWNrYmFyQ291bnQsXG4gICAgaWNvbixcbiAgICBtZXNzYWdlLFxuICAgIGFjdGlvbl9sYWJlbCxcbiAgICBhY3Rpb24sXG4gIH0pIHtcbiAgICBjb25zdCBzbmFja2JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KFwiLS10b2FzdHMtbGVuZ3RoXCIsIHNuYWNrYmFyQ291bnQgKyAxKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImRhdGEtY291bnRcIiwgc25hY2tiYXJDb3VudCArIDEpO1xuICAgIHNuYWNrYmFyLnN0eWxlLnNldFByb3BlcnR5KFwiLS10b2FzdC1pbmRleFwiLCBzbmFja2JhckNvdW50KTtcblxuICAgIHNuYWNrYmFyLmNsYXNzTmFtZSA9IGBtb29uLXNuYWNrYmFyICR7XG4gICAgICB2YXJpYW50ICE9PSBcImZpbGxcIiA/IGBtb29uLXNuYWNrYmFyLSR7dmFyaWFudH1gIDogXCJcIlxuICAgIH0gJHtjb250ZXh0ICE9PSBcImJyYW5kXCIgPyBgbW9vbi1zbmFja2Jhci0ke2NvbnRleHR9YCA6IFwiXCJ9YDtcbiAgICBzbmFja2Jhci5zZXRBdHRyaWJ1dGUoXCJkYXRhLW1vdW50ZWRcIiwgXCJmYWxzZVwiKTtcbiAgICBzbmFja2Jhci5zZXRBdHRyaWJ1dGUoXCJkYXRhLWZyb250XCIsIFwiZmFsc2VcIik7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgc25hY2tiYXIuc2V0QXR0cmlidXRlKFwiZGF0YS1tb3VudGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgIHNuYWNrYmFyLnNldEF0dHJpYnV0ZShcImRhdGEtZnJvbnRcIiwgXCJ0cnVlXCIpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaWNvbkVsZW1lbnQgPSBnZW5lcmF0ZVN2Z0ljb24oaWNvbik7XG5cbiAgICBjb25zdCBzbmFja2Jhck1lc3NhZ2UgPSB0aGlzLmNyZWF0ZVNuYWNrYmFyTWVzc2FnZShtZXNzYWdlKTtcbiAgICBjb25zdCBtZXRhU2VjdGlvbiA9IHRoaXMuY3JlYXRlTWV0YVNlY3Rpb24oYWN0aW9uX2xhYmVsLCBhY3Rpb24sIHNuYWNrYmFyKTtcblxuICAgIHNuYWNrYmFyLmFwcGVuZChpY29uRWxlbWVudCk7XG5cbiAgICBzbmFja2Jhci5hcHBlbmQoc25hY2tiYXJNZXNzYWdlKTtcbiAgICBzbmFja2Jhci5hcHBlbmQobWV0YVNlY3Rpb24pO1xuXG4gICAgcmV0dXJuIHNuYWNrYmFyO1xuICB9LFxuICB1cGRhdGVTbmFja2JhcnMoKSB7XG4gICAgY29uc3QgY3VycmVudFNuYWNrYmFycyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLW1vdW50ZWQ9J3RydWUnXVwiKTtcbiAgICBjb25zdCBzbmFja2JhckNvdW50ID0gY3VycmVudFNuYWNrYmFycy5sZW5ndGg7XG5cbiAgICBjdXJyZW50U25hY2tiYXJzLmZvckVhY2goKHNuYWNrYmFyLCBpbmRleCkgPT4ge1xuICAgICAgc25hY2tiYXIuc3R5bGUuc2V0UHJvcGVydHkoXCItLXRvYXN0LWluZGV4XCIsIGluZGV4KTtcbiAgICB9KTtcblxuICAgIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkoXCItLXRvYXN0cy1sZW5ndGhcIiwgc25hY2tiYXJDb3VudCk7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNvdW50XCIsIHNuYWNrYmFyQ291bnQpO1xuICB9LFxuXG4gIGNyZWF0ZVNuYWNrYmFyTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgY29uc3Qgc25hY2tiYXJNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobWVzc2FnZSk7XG4gICAgcmV0dXJuIHNuYWNrYmFyTWVzc2FnZTtcbiAgfSxcbiAgY3JlYXRlTWV0YVNlY3Rpb24obGFiZWwsIGFjdGlvbiwgc25hY2tiYXIpIHtcbiAgICBjb25zdCBhY3Rpb25CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGFjdGlvbkJ0bi5jbGFzc05hbWUgPSBcIm1vb24tc25hY2tiYXItYWN0aW9uXCI7XG4gICAgYWN0aW9uQnRuLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgYWN0aW9uQnRuLnNldEF0dHJpYnV0ZShcInBoeC1jbGlja1wiLCBhY3Rpb24pO1xuXG4gICAgY29uc3QgbWV0YVNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG1ldGFTZWN0aW9uLmNsYXNzTmFtZSA9IFwibW9vbi1zbmFja2Jhci1tZXRhXCI7XG5cbiAgICBpZiAobGFiZWwgJiYgYWN0aW9uKSB7XG4gICAgICBtZXRhU2VjdGlvbi5hcHBlbmQoYWN0aW9uQnRuKTtcbiAgICB9XG5cbiAgICBjb25zdCBjbG9zZUJ0biA9IHRoaXMuY3JlYXRlQ2xvc2VCdXR0b24oc25hY2tiYXIpO1xuICAgIG1ldGFTZWN0aW9uLmFwcGVuZChjbG9zZUJ0bik7XG5cbiAgICByZXR1cm4gbWV0YVNlY3Rpb247XG4gIH0sXG4gIGNyZWF0ZUNsb3NlQnV0dG9uKHNuYWNrYmFyKSB7XG4gICAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGNvbnN0IGNsb3NlSWNvbiA9IGdlbmVyYXRlU3ZnSWNvbihcImNsb3NlXCIpO1xuICAgIGNsb3NlQnRuLmNsYXNzTmFtZSA9IFwibW9vbi1zbmFja2Jhci1jbG9zZVwiO1xuICAgIGNsb3NlQnRuLmFwcGVuZChjbG9zZUljb24pO1xuXG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHNuYWNrYmFyLnNldEF0dHJpYnV0ZShcImRhdGEtcmVtb3ZlZFwiLCBcInRydWVcIik7XG4gICAgICBzbmFja2Jhci5yZW1vdmUoKTtcbiAgICAgIHRoaXMudXBkYXRlU25hY2tiYXJzKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2xvc2VCdG47XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTbmFja2Jhckhvb2s7XG4iLCAiY29uc3QgVG9vbHRpcCA9IHtcbiAgbW91bnRlZCgpIHtcbiAgICBjb25zdCB0b29sdGlwID0gdGhpcy5lbDtcbiAgICBjb25zdCBjb250ZW50ID0gdG9vbHRpcC5xdWVyeVNlbGVjdG9yKFwiW3JvbGU9J3Rvb2x0aXAnXVwiKTtcblxuICAgY29uc3QgZ2V0QmFzZVBvc2l0aW9uID0gKCkgPT4gY29udGVudD8uZGF0YXNldC5iYXNlUG9zaXRpb247XG4gICAgbGV0IGlzUG9zaXRpb25lZCA9IGZhbHNlO1xuICAgIGxldCBvYnNlcnZlciA9IG51bGw7XG4gICAgbGV0IHJlc2l6ZVRpbWVvdXQgPSBudWxsO1xuXG4gICAgY29uc3QgcG9zaXRpb25DbGFzc2VzID0ge1xuICAgICAgdG9wOiBcIlwiLFxuICAgICAgYm90dG9tOiBcIm1vb24tdG9vbHRpcC1ib3R0b21cIixcbiAgICAgIHN0YXJ0OiBcIm1vb24tdG9vbHRpcC1zdGFydFwiLFxuICAgICAgZW5kOiBcIm1vb24tdG9vbHRpcC1lbmRcIlxuICAgIH07XG5cbiAgICBjb25zdCBjbGVhclBvc2l0aW9uQ2xhc3NlcyA9ICgpID0+IHtcbiAgICAgIE9iamVjdC52YWx1ZXMocG9zaXRpb25DbGFzc2VzKS5mb3JFYWNoKGNscyA9PiB7XG4gICAgICAgIGNscy5zcGxpdChcIiBcIikuZm9yRWFjaChjID0+IHtpZiAoYykgdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKGMpfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgYXBwbHlQb3NpdGlvbiA9IChwb3NpdGlvbikgPT4ge1xuICAgICAgY2xlYXJQb3NpdGlvbkNsYXNzZXMoKTtcbiAgICAgIHBvc2l0aW9uQ2xhc3Nlc1twb3NpdGlvbl0uc3BsaXQoXCIgXCIpLmZvckVhY2goYyA9PiB7XG4gICAgICAgIGlmIChjKSB0b29sdGlwLmNsYXNzTGlzdC5hZGQoYyk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2FsY3VsYXRlQmVzdFBvc2l0aW9uID0gKCkgPT4ge1xuICAgICAgY29uc3QgdG9vbHRpcFJlY3QgPSBjb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgcGFyZW50UmVjdCA9IHRvb2x0aXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB2aWV3cG9ydCA9IHtcbiAgICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgfTtcblxuICAgICAgY29uc3Qgc3BhY2UgPSB7XG4gICAgICAgIHRvcDogcGFyZW50UmVjdC50b3AsXG4gICAgICAgIGJvdHRvbTogdmlld3BvcnQuaGVpZ2h0IC0gcGFyZW50UmVjdC5ib3R0b20sXG4gICAgICAgIHN0YXJ0OiBwYXJlbnRSZWN0LmxlZnQsXG4gICAgICAgIGVuZDogdmlld3BvcnQud2lkdGggLSBwYXJlbnRSZWN0LnJpZ2h0XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBmaXRzID0ge1xuICAgICAgICB0b3A6IHRvb2x0aXBSZWN0LmhlaWdodCA8PSBzcGFjZS50b3AsXG4gICAgICAgIGJvdHRvbTogdG9vbHRpcFJlY3QuaGVpZ2h0IDw9IHNwYWNlLmJvdHRvbSxcbiAgICAgICAgc3RhcnQ6IHRvb2x0aXBSZWN0LndpZHRoIDw9IHNwYWNlLnN0YXJ0LFxuICAgICAgICBlbmQ6IHRvb2x0aXBSZWN0LndpZHRoIDw9IHNwYWNlLmVuZFxuICAgICAgfTtcblxuICAgICAgaWYgKGZpdHNbZ2V0QmFzZVBvc2l0aW9uKCldKSByZXR1cm4gZ2V0QmFzZVBvc2l0aW9uKCk7XG5cblxuICAgICAgY29uc3Qgc29ydGVkID0gT2JqZWN0LmVudHJpZXMoc3BhY2UpXG4gICAgICAgIC5maWx0ZXIoKFtwb3NdKSA9PiBmaXRzW3Bvc10pXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBiWzFdIC0gYVsxXSk7XG5cbiAgICAgIHJldHVybiBzb3J0ZWQubGVuZ3RoID4gMCA/IHNvcnRlZFswXVswXSA6IGdldEJhc2VQb3NpdGlvbigpO1xuICAgIH07XG5cbiAgICBjb25zdCBzZXR1cE9ic2VydmVyID0gKCkgPT4ge1xuICAgICAgaWYgKG9ic2VydmVyKSBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgIG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGVudHJpZXMgPT4ge1xuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgaWYgKCFlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICAgICAgY29uc3QgYmVzdCA9IGNhbGN1bGF0ZUJlc3RQb3NpdGlvbigpO1xuICAgICAgICAgICAgYXBwbHlQb3NpdGlvbihiZXN0KTtcbiAgICAgICAgICAgIGlzUG9zaXRpb25lZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmICghaXNQb3NpdGlvbmVkKSB7XG4gICAgICAgICAgICBhcHBseVBvc2l0aW9uKGdldEJhc2VQb3NpdGlvbigpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgcm9vdDogbnVsbCxcbiAgICAgICAgdGhyZXNob2xkOiAwLjk5LFxuICAgICAgfSk7XG5cbiAgICAgIG9ic2VydmVyLm9ic2VydmUoY29udGVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZVJlc2l6ZSA9ICgpID0+IHtcbiAgICAgIGlzUG9zaXRpb25lZCA9IGZhbHNlO1xuICAgICAgaWYgKG9ic2VydmVyKSBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICBpZiAocmVzaXplVGltZW91dCkgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVvdXQpO1xuXG4gICAgICByZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFwcGx5UG9zaXRpb24oZ2V0QmFzZVBvc2l0aW9uKCkpO1xuICAgICAgICBzZXR1cE9ic2VydmVyKCk7XG4gICAgICB9LCAzMDApO1xuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBoYW5kbGVSZXNpemUpO1xuXG4gICAgdG9vbHRpcC5fYXV0b1Bvc2l0aW9uQ2xlYW51cCA9ICgpID0+IHtcbiAgICAgIGlmIChvYnNlcnZlcikgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgaWYgKHJlc2l6ZVRpbWVvdXQpIGNsZWFyVGltZW91dChyZXNpemVUaW1lb3V0KTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGhhbmRsZVJlc2l6ZSk7XG4gICAgfTtcblxuICAgIGFwcGx5UG9zaXRpb24oZ2V0QmFzZVBvc2l0aW9uKCkpO1xuICAgIHNldHVwT2JzZXJ2ZXIoKTtcbiAgfSxcblxuICBkZXN0cm95ZWQoKSB7XG4gICAgdGhpcy5lbC5fYXV0b1Bvc2l0aW9uQ2xlYW51cD8uKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRvb2x0aXA7XG4iLCAiaW1wb3J0IEF1dGhlbnRpY2F0b3IgZnJvbSBcIi4vYXV0aGVudGljYXRvclwiO1xuaW1wb3J0IEJvdHRvbVNoZWV0SG9vayBmcm9tIFwiLi9ib3R0b21fc2hlZXRcIjtcbmltcG9ydCBDYXJvdXNlbEhvb2sgZnJvbSBcIi4vY2Fyb3VzZWxcIjtcbmltcG9ydCBDaGVja2JveEhvb2sgZnJvbSBcIi4vY2hlY2tib3hcIjtcbmltcG9ydCBEaWFsb2dIb29rIGZyb20gXCIuL2RpYWxvZ1wiO1xuaW1wb3J0IERyYXdlckhvb2sgZnJvbSBcIi4vZHJhd2VyXCI7XG5pbXBvcnQgRmlsZUlucHV0IGZyb20gXCIuL2ZpbGVfaW5wdXRcIjtcbmltcG9ydCBNb29uRHJvcGRvd24gZnJvbSBcIi4vZHJvcGRvd25cIjtcbmltcG9ydCBQYWdpbmF0aW9uSG9vayBmcm9tIFwiLi9wYWdpbmF0aW9uXCI7XG5pbXBvcnQgUG9wb3ZlciBmcm9tIFwiLi9wb3BvdmVyXCI7XG5pbXBvcnQgUmVzcG9uc2l2ZVNjcmVlbiBmcm9tIFwiLi9yZXNwb25zaXZlX3NjcmVlblwiO1xuaW1wb3J0IFNuYWNrYmFySG9vayBmcm9tIFwiLi9zbmFja2JhclwiO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSBcIi4vdG9vbHRpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEF1dGhlbnRpY2F0b3IsXG4gIEJvdHRvbVNoZWV0SG9vayxcbiAgQ2Fyb3VzZWxIb29rLFxuICBDaGVja2JveEhvb2ssXG4gIERpYWxvZ0hvb2ssXG4gIERyYXdlckhvb2ssXG4gIEZpbGVJbnB1dCxcbiAgTW9vbkRyb3Bkb3duLFxuICBQYWdpbmF0aW9uSG9vayxcbiAgUG9wb3ZlcixcbiAgUmVzcG9uc2l2ZVNjcmVlbixcbiAgU25hY2tiYXJIb29rLFxuICBUb29sdGlwLFxufTtcbiIsICIvLyBIb29rcyBmb3IgdGhlIG1vb25fZG9jcyBhcHBcblxuaW1wb3J0IENvZGVQcmV2aWV3IGZyb20gXCIuL0NvZGVQcmV2aWV3XCI7XG5pbXBvcnQgbW9vbkhvb2tzIGZyb20gXCIuLi8uLi8uLi9kZXBzL21vb25fbGl2ZS9hc3NldHMvanMvaG9va3MvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgQ29kZVByZXZpZXdIb29rOiBDb2RlUHJldmlldyxcbiAgLi4ubW9vbkhvb2tzLFxufTtcbiIsICJmdW5jdGlvbiBwb3B1bGF0ZVRva2VucygpIHtcbiAgY29uc3QgdG9rZW5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLXRva2VuXVwiKTtcbiAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuXG4gIHRva2Vucy5mb3JFYWNoKCh0b2tlbikgPT4ge1xuICAgIGNvbnN0IHRva2VuTmFtZSA9IHRva2VuLmdldEF0dHJpYnV0ZShcImRhdGEtdG9rZW5cIik7XG4gICAgaWYgKCF0b2tlbk5hbWUpIHJldHVybjtcbiAgICBjb25zdCB0b2tlbnNMaXN0ID0gdG9rZW5OYW1lLnNwbGl0KFwiLFwiKS5tYXAoKHQpID0+IHQudHJpbSgpKTtcblxuICAgIGNvbnN0IGdldFRva2VuVmFsdWUgPSAodCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUodCk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGxldCBmaW5hbFZhbHVlID0gdG9rZW5zTGlzdC5tYXAoZ2V0VG9rZW5WYWx1ZSkuam9pbihcIiBcIik7XG4gICAgaWYgKFxuICAgICAgdG9rZW5OYW1lLmluY2x1ZGVzKFwiLS10ZXh0LWJvZHktXCIpIHx8XG4gICAgICB0b2tlbk5hbWUuaW5jbHVkZXMoXCItLXRleHQtaGVhZGluZy1cIilcbiAgICApIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gZmluYWxWYWx1ZS5zcGxpdChcIiBcIik7XG4gICAgICBmaW5hbFZhbHVlID1cbiAgICAgICAgYCR7cGFydHNbMF19ICR7cGFydHNbMV19LyR7cGFydHNbMl19YCArXG4gICAgICAgIChwYXJ0cy5sZW5ndGggPiAzID8gYCAke3BhcnRzLnNsaWNlKDMpLmpvaW4oXCIgXCIpfWAgOiBcIlwiKTtcbiAgICB9XG4gICAgaWYgKHRva2VuTmFtZS5pbmNsdWRlcyhcIi0tZWZmZWN0LXNoYWRvdy1cIikpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gZmluYWxWYWx1ZS5zcGxpdChcIiBcIik7XG4gICAgICBmaW5hbFZhbHVlID0gYCR7cGFydHMuc2xpY2UoMCwgNCkuam9pbihcIiBcIil9ICR7cGFydHNcbiAgICAgICAgLnNsaWNlKDQsIDkpXG4gICAgICAgIC5qb2luKFwiIFwiKX0sXFxuJHtwYXJ0cy5zbGljZSg5LCAxMykuam9pbihcIiBcIil9ICR7cGFydHNcbiAgICAgICAgLnNsaWNlKDEzKVxuICAgICAgICAuam9pbihcIiBcIil9YDtcbiAgICAgIHRva2VuLnN0eWxlLndoaXRlU3BhY2UgPSBcInByZS13cmFwXCI7XG4gICAgfVxuICAgIHRva2VuLnRleHRDb250ZW50ID0gZmluYWxWYWx1ZTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBvcHVsYXRlVG9rZW5zO1xuIiwgIi8vIElmIHlvdXIgY29tcG9uZW50cyByZXF1aXJlIGFueSBob29rcyBvciBjdXN0b20gdXBsb2FkZXJzLCBvciBpZiB5b3VyIHBhZ2VzXG4vLyByZXF1aXJlIGNvbm5lY3QgcGFyYW1ldGVycywgdW5jb21tZW50IHRoZSBmb2xsb3dpbmcgbGluZXMgYW5kIGRlY2xhcmUgdGhlbSBhc1xuLy8gc3VjaDpcbi8vXG5pbXBvcnQgSG9va3MgZnJvbSBcIi4vaG9va3NcIjtcbmltcG9ydCBwb3B1bGF0ZVRva2VucyBmcm9tIFwiLi9wb3B1bGF0ZVRva2Vucy5qc1wiO1xuXG4oZnVuY3Rpb24gKCkge1xuICB3aW5kb3cuc3Rvcnlib29rID0geyBIb29rcyB9O1xuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZGlyID0gXCJsdHJcIjtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBkZXRhaWw6IHsgdG8gfSxcbiAgICB9ID0gZXZlbnQ7XG5cbiAgICBpZiAodG8uaW5jbHVkZXMoXCIvdG9rZW5zXCIpKSB7XG4gICAgICBwb3B1bGF0ZVRva2VucygpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6dXBkYXRlXCIsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgY29uc3QgeyBiYXNlVVJJOiB0byB9ID0gdGFyZ2V0O1xuXG4gICAgaWYgKHRvLmluY2x1ZGVzKFwidGhlbWU9ZGFya1wiKSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtb29uLXRoZW1lXCIsIFwiZGFya1wiKTtcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IFwibW9vbi10aGVtZT1kYXJrOyBtYXgtYWdlPTMxNTM2MDAwOyBwYXRoPS9cIjtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcImxpZ2h0LXRoZW1lXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiW2NvbG9yLXNjaGVtZTpsaWdodF1cIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJkYXJrLXRoZW1lXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwiZGFya1wiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIltjb2xvci1zY2hlbWU6ZGFya11cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibW9vbi10aGVtZVwiLCBcImxpZ2h0XCIpO1xuICAgICAgZG9jdW1lbnQuY29va2llID0gXCJtb29uLXRoZW1lPWxpZ2h0OyBtYXgtYWdlPTMxNTM2MDAwOyBwYXRoPS9cIjtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcImRhcmstdGhlbWVcIik7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJbY29sb3Itc2NoZW1lOmRhcmtdXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwiZGFya1wiKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcImxpZ2h0LXRoZW1lXCIpO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwiW2NvbG9yLXNjaGVtZTpsaWdodF1cIik7XG4gICAgfVxuXG4gICAgaWYgKHRvLmluY2x1ZGVzKFwiL3Rva2Vuc1wiKSkge1xuICAgICAgcG9wdWxhdGVUb2tlbnMoKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLGNBQWM7QUFBQSxJQUNsQixVQUFVO0FBRVIsV0FBSyxTQUFTLEtBQUssR0FBRyxjQUFjLDRCQUE0QjtBQUNoRSxXQUFLLFVBQVUsS0FBSyxHQUFHLGNBQWMsNkJBQTZCO0FBQ2xFLFdBQUssYUFBYSxLQUFLLEdBQUcsY0FBYyxhQUFhO0FBQ3JELFdBQUssZ0JBQWdCLEtBQUssR0FBRztBQUFBLFFBQzNCO0FBQUEsTUFDRjtBQUVBLFVBQUksQ0FBQyxLQUFLLFdBQVcsR0FBRztBQUV0QixhQUFLLE9BQU8saUJBQWlC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S0FBSyxVQUFVLE9BQU8sYUFBYTtBQUM1QyxpQkFBUyxLQUFLLFVBQVUsT0FBTyxzQkFBc0I7QUFDckQsaUJBQVMsS0FBSyxVQUFVLElBQUksWUFBWTtBQUN4QyxpQkFBUyxLQUFLLFVBQVUsSUFBSSxNQUFNO0FBQ2xDLGlCQUFTLEtBQUssVUFBVSxJQUFJLHFCQUFxQjtBQUFBLE1BQ25ELE9BQU87QUFDTCxxQkFBYSxRQUFRLGNBQWMsT0FBTztBQUMxQyxpQkFBUyxTQUFTO0FBQ2xCLGlCQUFTLEtBQUssVUFBVSxPQUFPLFlBQVk7QUFDM0MsaUJBQVMsS0FBSyxVQUFVLE9BQU8scUJBQXFCO0FBQ3BELGlCQUFTLEtBQUssVUFBVSxPQUFPLE1BQU07QUFDckMsaUJBQVMsS0FBSyxVQUFVLElBQUksYUFBYTtBQUN6QyxpQkFBUyxLQUFLLFVBQVUsSUFBSSxzQkFBc0I7QUFBQSxNQUNwRDtBQUVBLFVBQUksR0FBRyxTQUFTLFNBQVMsR0FBRztBQUMxQiwrQkFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxHQUFHOyIsCiAgIm5hbWVzIjogWyJob29rc19kZWZhdWx0IiwgImhvb2tzX2RlZmF1bHQiXQp9Cg==
