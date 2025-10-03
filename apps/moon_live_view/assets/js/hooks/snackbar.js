import generateSvgIcon from "../utils/generateSvgIcon";

const SnackbarHook = {
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
      action,
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
    action,
  }) {
    const snackbar = document.createElement("div");

    this.el.style.setProperty("--toasts-length", snackbarCount + 1);
    this.el.setAttribute("data-count", snackbarCount + 1);
    snackbar.style.setProperty("--toast-index", snackbarCount);

    snackbar.className = `moon-snackbar ${
      variant !== "fill" ? `moon-snackbar-${variant}` : ""
    } ${context !== "brand" ? `moon-snackbar-${context}` : ""}`;
    snackbar.setAttribute("data-mounted", "false");
    snackbar.setAttribute("data-front", "false");

    requestAnimationFrame(() => {
      snackbar.setAttribute("data-mounted", "true");
      snackbar.setAttribute("data-front", "true");
    });

    const iconElement = generateSvgIcon(icon, this.el.dataset.iconPath || "");

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
    const closeIcon = generateSvgIcon("close");
    closeBtn.className = "moon-snackbar-close";
    closeBtn.append(closeIcon);

    closeBtn.addEventListener("click", () => {
      snackbar.setAttribute("data-removed", "true");
      snackbar.remove();
      this.updateSnackbars();
    });

    return closeBtn;
  },
};

export default SnackbarHook;
