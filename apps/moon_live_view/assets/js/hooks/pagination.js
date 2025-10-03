const Pagination = {
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
      url: url.toString(),
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
  directions: { prev: "prev", next: "next" },
};

export default Pagination;
