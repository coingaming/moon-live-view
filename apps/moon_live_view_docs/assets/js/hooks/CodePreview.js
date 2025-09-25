const CodePreview = {
  mounted() {
    // Cache DOM elements
    this.button = this.el.querySelector("[data-code-preview-button]");
    this.wrapper = this.el.querySelector("[data-code-preview-wrapper]");
    this.toggleSpan = this.el.querySelector("#toggleSpan");
    this.buttonWrapper = this.el.querySelector(
      "[data-code-preview-button-wrapper]"
    );

    if (!this.hideButton()) {
      // Add event listener for toggling open/close
      this.button.addEventListener("click", () => this.toggle());
    }
  },
  toggle() {
    // Toggle between open and close states
    if (this.wrapper.classList.contains("max-h-96")) {
      this.close();
    } else {
      this.open();
    }
  },
  open() {
    // Batch class changes for open state
    this.wrapper.classList.add("max-h-96", "overflow-auto");
    this.wrapper.classList.remove("max-h-space-128");
    this.buttonWrapper.classList.add("h-space-40", "[&_svg]:rotate-180");
    this.toggleSpan.textContent = "Collapse";
  },
  close() {
    // Batch class changes for close state
    this.wrapper.classList.remove("max-h-96", "overflow-auto");
    this.wrapper.classList.add("max-h-space-128");
    this.buttonWrapper.classList.remove("h-space-40", "[&_svg]:rotate-180");
    this.toggleSpan.textContent = "Expand";
  },
  hideButton() {
    // Hide button if wrapper height is less than or equal to MIN_HEIGHT
    const MIN_HEIGHT = 90;
    if (this.wrapper.clientHeight <= MIN_HEIGHT) {
      this.buttonWrapper.style.display = "none";
      return true;
    }
    return false;
  },
};

export default CodePreview;
