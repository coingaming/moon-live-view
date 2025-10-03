const setIndeterminateState = (el) => {
  el.indeterminate = el.dataset.indeterminate !== undefined;
};

const CheckboxHook = {
  mounted() {
    setIndeterminateState(this.el);
  },
  updated() {
    setIndeterminateState(this.el);
  },
};

export default CheckboxHook;
