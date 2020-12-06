import { shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import InlineCreditCardField from "@/components/InlineCreditCardField.vue";

describe("InlineCredirCardField.vue", () => {
  it("if component is a Vue instance", () => {
    const wrapper = shallowMount(InlineCreditCardField);
    expect(wrapper.isVueInstance()).to.be.true;
  });
});
