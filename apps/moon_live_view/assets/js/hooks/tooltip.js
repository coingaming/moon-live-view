const Tooltip = {
  mounted() {
    const tooltip = this.el;
    const content = tooltip.querySelector("[role='tooltip']");

   const getBasePosition = () => content?.dataset.basePosition;
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
      Object.values(positionClasses).forEach(cls => {
        cls.split(" ").forEach(c => {if (c) tooltip.classList.remove(c)});
      });
    };

    const applyPosition = (position) => {
      clearPositionClasses();
      positionClasses[position].split(" ").forEach(c => {
        if (c) tooltip.classList.add(c);
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

      if (fits[getBasePosition()]) return getBasePosition();


      const sorted = Object.entries(space)
        .filter(([pos]) => fits[pos])
        .sort((a, b) => b[1] - a[1]);

      return sorted.length > 0 ? sorted[0][0] : getBasePosition();
    };

    const setupObserver = () => {
      if (observer) observer.disconnect();

      observer = new IntersectionObserver(entries => {
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
        threshold: 0.99,
      });

      observer.observe(content);
    };

    const handleResize = () => {
      isPositioned = false;
      if (observer) observer.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        applyPosition(getBasePosition());
        setupObserver();
      }, 300);
    };

    window.addEventListener("resize", handleResize);

    tooltip._autoPositionCleanup = () => {
      if (observer) observer.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };

    applyPosition(getBasePosition());
    setupObserver();
  },

  destroyed() {
    this.el._autoPositionCleanup?.();
  }
};

export default Tooltip;
