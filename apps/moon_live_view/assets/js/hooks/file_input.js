const FileInput = {
  mounted() {
    const inputRef = this.el.dataset.inputRef;
    const input = this.getInputElement(inputRef);
    const span = this.getSpanElement(inputRef);

    if (!input || !span) return;

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
      span.textContent =
        files.length === 1 ? files[0].name : `${files.length} Files`;
    });
  },
};

export default FileInput;
