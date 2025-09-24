const DrawerHook = {
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

    // dialog.addEventListener("cancel", () => {
    //   this.close();
    // });
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

export default DrawerHook;
