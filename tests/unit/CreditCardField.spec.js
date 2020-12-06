import { shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import CreditCardField from "@/components/CreditCardField.vue";

describe("CredirCardField.vue", () => {
  it("if component is a Vue instance", () => {
    const wrapper = shallowMount(CreditCardField);
    expect(wrapper.isVueInstance()).to.be.true;
  });
});
