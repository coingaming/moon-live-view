const CarouselHook = {
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
        element: this.el,
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
        index: this.el.dataset.activeSlideIndex,
      });
    }
  },
};

const scrollToIndex = ({ element, index }) => {
  const totalItems = element.querySelectorAll(".moon-carousel-item").length;

  if (!isValidIndex(index, totalItems)) {
    return;
  }

  const activeSlideIndex = parseInt(element.dataset.activeSlideIndex);

  scroll({ index, element });

  updateDataAttribute(element, activeSlideIndex, index);
};

const scrollLeft = ({ currentIndex, element }) => {
  if (currentIndex <= 0) {
    return currentIndex;
  }

  const nextIndex = currentIndex - 1;
  scroll({ index: nextIndex, element });

  return nextIndex;
};

const scrollRight = ({ currentIndex, totalItems, element }) => {
  if (currentIndex >= totalItems - 1) {
    return currentIndex;
  }

  const nextIndex = currentIndex + 1;
  scroll({ index: nextIndex, element });

  return nextIndex;
};

const scroll = ({ index, element }) => {
  const activeSlide = element.querySelector(`#${element.id}-slide-${index}`);

  updateButtonArrows({ element, newIndex: index });

  activeSlide.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
};

const updateButtonArrows = ({ element, newIndex }) => {
  const prevArrowButton = element.querySelector(`#${element.id}-arrow-start`);
  const nextArrowButton = element.querySelector(`#${element.id}-arrow-end`);

  if (!prevArrowButton || !nextArrowButton) {
    return;
  }

  updateButtonArrow(prevArrowButton, newIndex <= 0);
  updateButtonArrow(nextArrowButton, newIndex >= getTotalItems(element) - 1);
};

const updateButtonArrow = (arrowButton, isDisabled) => {
  if (isDisabled) {
    arrowButton.setAttribute("disabled", "");
    return;
  }
  arrowButton.removeAttribute("disabled");
};

const getTotalItems = (element) =>
  element.querySelectorAll(".moon-carousel-item").length;

const updateDataAttribute = (element, activeIndex, newIndex) => {
  if (activeIndex === newIndex) {
    return;
  }

  element.removeAttribute("data-active-slide-index");
  element.setAttribute("data-active-slide-index", newIndex);
};

const isValidIndex = (index, totalItems) => {
  if (isNaN(index)) {
    return false;
  }

  if (index < 0 || index >= totalItems) {
    return false;
  }

  return true;
};

export default CarouselHook;
