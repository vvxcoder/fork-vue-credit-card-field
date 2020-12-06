import { input } from "../helpers";

const bind = (el, { arg, value }, vnode) => {
  input(el).addEventListener(arg, e => {
    if (value instanceof Function) {
      value(e);
    }

    vnode.context.$emit(arg, e);
  });
};

export default bind;
