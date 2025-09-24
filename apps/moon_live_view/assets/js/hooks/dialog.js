const DialogHook = {
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
  },
};

export default DialogHook;
