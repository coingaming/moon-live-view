const BottomSheetHook = {
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

    // TBD: This correction should be removed once moon ui components is updated
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
      if (!isDragging) return;

      currentY = e.touches ? e.touches[0].clientY : e.clientY;
      deltaY = startY - currentY;
      const newHeight = Math.min(
        maxHeight,
        Math.max(minHeight, startHeight + deltaY)
      );

      dialogBox.style.height = `${newHeight}px`;
    };

    const onDragEnd = () => {
      if (!isDragging) return;
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
        max: maxHeight,
      };

      const closestSnap = Object.entries(snapPoints).reduce((prev, curr) =>
        Math.abs(curr[1] - currentHeight) < Math.abs(prev[1] - currentHeight)
          ? curr
          : prev
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
  },
};

export default BottomSheetHook;
