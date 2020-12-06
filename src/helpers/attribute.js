import input from "./input";

const attribute = (el, attr, value) =>
  input(el)[value ? "setAttribute" : "removeAttribute"](attr, value);

export default attribute;
