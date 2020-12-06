import { attribute, input, shouldFormat } from "../helpers";
import { creditCardType } from "card-validator";

export default {
  bind(el, binding, vnode) {
    let prevValue;

    function dispatch(value, force = false) {
      const types = creditCardType(value);

      value = JSON.stringify(types);

      if (value !== prevValue || force) {
        // eslint-disable-next-line no-global-assign
        event = new Event("card-types");
        event.types = types;

        el.dispatchEvent(event);
      }

      prevValue = value;

      return types;
    }

    el.addEventListener("paste", e => {
      const clipboardData = e.clipboardData || window.clipboardData;
      const value = clipboardData.getData("text/plain");

      dispatch(value);
    });

    el.addEventListener("keyup", e => {
      if (shouldFormat(e)) {
        dispatch(e.target.value);
      }
    });

    el.addEventListener("card-types", ({ types }) => {
      const [type] = types;

      attribute(el, "maxlength", type && type.gaps.length + type.lengths.pop());
    });

    const { value } = input(el);

    if (value) {
      try {
        vnode.context.$nextTick(() => dispatch(value, true));
      } catch (error) {
        console.log("error line 51 = ", error);
      }
    }
  }
};
