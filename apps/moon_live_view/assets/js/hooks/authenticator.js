let Authenticator = {
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
    const shouldFocus =
      this.inputs.length > 0 &&
      (active === document.body || Array.from(this.inputs).includes(active)) &&
      Array.from(this.inputs).every(i => !i.value);

    if (shouldFocus) {
      this.inputs[0].focus();
    }
  },

  bindListener(input, event, handler) {
    input.addEventListener(event, handler);
    this.eventListeners.push({ input, event, handler });
  },

  teardown() {
    if (!this.eventListeners) return;
    this.eventListeners.forEach(({ input, event, handler }) => {
      input.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  },

  getCode() {
    return Array.from(this.inputs).map(i => i.value).join('');
  },

  reset() {
    this.inputs.forEach(i => i.value = "");
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

export default Authenticator;
