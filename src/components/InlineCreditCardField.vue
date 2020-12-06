<template>
  <form-group class="credit-card-field-wrapper" @click="clickHandler">
    <slot name="control">
      <div
        class="credit-card-field"
        :class="mergeClasses(controlClasses, variantClass, classes)"
      >
        <div class="credit-card-field-icon-wrapper">
          <div class="credit-card-field-icon-card">
            <div class="credit-card-field-icon-front">
              <icon
                :icon="['fab', 'cc-jcb']"
                data-brand="jcb"
                class="credit-card-field-icon"
              />
              <icon
                :icon="['fab', 'cc-visa']"
                data-brand="visa"
                class="credit-card-field-icon"
              />
              <icon
                :icon="['fab', 'cc-amex']"
                data-brand="amex"
                class="credit-card-field-icon"
              />
              <icon
                :icon="['fab', 'cc-discover']"
                data-brand="discover"
                class="credit-card-field-icon"
              />
              <icon
                :icon="['fab', 'cc-mastercard']"
                data-brand="mastercard"
                class="credit-card-field-icon"
              />
              <icon
                :icon="['fab', 'cc-diners-club']"
                data-brand="dinersclub"
                class="credit-card-field-icon"
              />
              <icon
                :icon="['far', 'credit-card']"
                data-brand="unknown"
                class="credit-card-field-icon"
                width="20"
                height="18"
              />
            </div>
            <div class="credit-card-field-icon-back">
              <icon
                :icon="['fas', 'credit-card']"
                class="credit-card-field-icon"
                width="23.33"
                height="20"
              />
            </div>
          </div>
        </div>

        <div class="credit-card-field-fields">
          <input
            v-focus.transform
            v-validate:number="validateNumber"
            v-model="card.number"
            max="19"
            type="text"
            placeholder="Card number"
            class="credit-card-field-field credit-card-field-number"
            :class="
              mergeClasses({
                'is-empty': !card.number,
                'is-invalid': validated.number === false
              })
            "
          />

          <div class="credit-card-field-security-fields">
            <input
              v-focus
              v-validate:expiration="validateExpiration"
              v-model="card.expiration"
              type="text"
              placeholder="MM / YY"
              maxlength="7"
              class="credit-card-field-field credit-card-field-expiration"
              :class="
                mergeClasses({
                  'is-empty': !card.expiration,
                  'is-invalid': validated.expiration === false
                })
              "
            />
            <input
              v-focus="validateCvc"
              v-validate:cvc="validateCvc"
              v-model="card.cvc"
              type="text"
              placeholder="CVC"
              autocomplete="off"
              class="credit-card-field-field credit-card-field-cvc"
              :class="
                mergeClasses({
                  'is-empty': !card.cvc,
                  'is-invalid': validated.cvc === false
                })
              "
            />
            <input
              v-focus="validatePostalCode"
              v-validate:postalCode="validatePostalCode"
              v-model="card.postalCode"
              max="5"
              type="text"
              placeholder="Zip"
              maxlength="5"
              class="credit-card-field-field credit-card-field-postal"
              :class="
                mergeClasses({
                  'is-empty': !card.postalCode,
                  'is-invalid': validated.postalCode === false
                })
              "
            />
          </div>

          <div class="credit-card-field-placeholder-mask">Number</div>
          <div class="credit-card-field-number-mask" v-html="card.number"></div>
        </div>
      </div>
    </slot>

    <slot name="activity-indicator">
      <div v-show="activity" class="credit-card-field-activity">
        <activity-indicator size="sm" type="dots" center />
      </div>
    </slot>

    <slot />

    <slot name="help">
      <help-text v-if="helpText" v-html="helpText" />
    </slot>

    <slot name="feedback">
      <form-feedback v-if="validFeedback" v-html="validFeedback" valid />
      <form-feedback v-if="invalidFeedback" v-html="invalidFeedback" invalid />
    </slot>
  </form-group>
</template>

<script>
/* eslint-disable */
import Payment from "payment";
import Variant from "vue-interface/src/Mixins/Variant";
import HelpText from "vue-interface/src/Components/HelpText";
import FormControl from "vue-interface/src/Mixins/FormControl";
import FormGroup from "vue-interface/src/Components/FormGroup";
import MergeClasses from "vue-interface/src/Mixins/MergeClasses";
import FormFeedback from "vue-interface/src/Components/FormFeedback";
import { FontAwesomeIcon as Icon } from "@fortawesome/vue-fontawesome";
import ActivityIndicator from "vue-interface/src/Components/ActivityIndicator";

import "../icons";

export default {
  name: "credit-card-field",
  mixins: [MergeClasses, Variant, FormControl],
  components: {
    ActivityIndicator,
    FormGroup,
    FormFeedback,
    HelpText,
    Icon
  },
  props: {
    activity: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    "card.number": function(newVal) {
      this.brand = this.card.brand = Payment.fns.cardType(newVal) || "unknown";
      this.validated.number = null;

      if (this.$el.querySelector(".credit-card-field-lg")) {
        this.showSecurityFields = this.card.number.length >= 14;
      }
    },
    "card.expiration": function(newVal) {
      this.validated.expiration = null;
    },
    "card.cvc": function(newVal) {
      this.validated.cvc = null;
    },
    "card.postalCode": function(newVal) {
      this.validated.postalCode = null;
    }
  },
  directives: {
    focus: {
      bind(el, binding, vnode) {
        el.addEventListener("focus", event => {
          el.style.transform = "";
          el.classList.add("is-focused");
          vnode.context.isFocused = true;
          vnode.context.focusedElement = event.target;
        });

        el.addEventListener("blur", event => {
          el.classList.remove("is-focused");
          vnode.context.isFocused = false;

          if (
            binding.modifiers.transform &&
            vnode.context.shouldTransform(el)
          ) {
            vnode.context.addTransform(el);
          }
        });
      }
    },
    validate: {
      bind(el, binding, vnode) {
        function validate(isValid) {
          vnode.context.validated[binding.arg] =
            el.value === "" ? false : binding.value && binding.value(el.value);
          vnode.context.$emit(
            isValid ? "valid" : "invalid",
            vnode.context.getEventPayload(el, isValid)
          );

          if (
            vnode.context.isComplete() &&
            vnode.context.isValid() &&
            vnode.context.hasChanged()
          ) {
            vnode.context.$emit(
              "complete",
              vnode.context.getEventPayload(el, isValid)
            );
          }
        }

        function maxLength(isValid) {
          return (
            el.getAttribute("max") &&
            el.value.length >= parseInt(el.getAttribute("max"))
          );
        }

        el.addEventListener("keydown", event => {
          const isValid = binding.value && binding.value(el.value);

          if (
            (isValid || maxLength()) &&
            vnode.context.isPrintableKeyCode(event)
          ) {
            event.preventDefault();
          } else if (!el.value && event.keyCode === 8) {
            vnode.context.focusPrevElement(el);
          }

          vnode.context.previousValue = JSON.stringify(vnode.context.card);
        });

        el.addEventListener("keyup", event => {
          if (vnode.context.isPrintableKeyCode(event)) {
            const isValid = binding.value && binding.value(el.value);

            if (maxLength()) {
              validate(isValid);
            }

            if (isValid) {
              vnode.context.focusNextElement(el);
            }

            vnode.context.$emit("input", vnode.context.card);

            if (vnode.context.hasChanged()) {
              vnode.context.$emit(
                "change",
                vnode.context.getEventPayload(el, isValid)
              );
            }
          }
        });

        el.addEventListener("blur", event => {
          el.value !== "" && validate(binding.value && binding.value(el.value));
        });
      }
    }
  },
  data: () => ({
    width: null,
    isFocused: false,
    focusedElement: null,
    previousValue: null,
    showSecurityFields: false,
    brand: null,
    validated: {
      number: null,
      expiration: null,
      cvc: null,
      postalCode: null
    },
    card: {
      brand: null,
      number: null,
      expiration: null,
      cvc: null,
      postalCode: null
    }
  }),
  computed: {
    classes() {
      const classes = {
        "show-security-fields": this.showSecurityFields,
        "credit-card-field-sm": this.width < 300,
        "credit-card-field-lg": this.width > 400,
        "has-activity": this.activity,
        "is-focused": this.isFocused,
        "is-invalid": this.isInvalid()
      };

      classes[`brand-${this.brand || "unknown"}`] = true;

      if (this.isFocused) {
        classes[`is-focused-${this.getClassName(this.focusedElement)}`] = true;
      } else if (this.focusedElement) {
        classes[
          `last-focused-${this.getClassName(this.focusedElement)}`
        ] = true;
      }

      for (let i in this.validated) {
        classes[`is-invalid-${i}`] = this.validated[i] === false;
      }

      return classes;
    }
  },
  methods: {
    addTransform(el) {
      const positionInfo = this.$el
        .querySelector(".credit-card-field-number-mask")
        .getBoundingClientRect();
      const parts = el.value.split(" ");
      const totalWidth = positionInfo.width;
      const width = this.getTextWidth(parts[parts.length - 1].trim(), el);
      el.style.transform = "translateX(" + (totalWidth - width) * -1 + "px)";
    },
    shouldTransform(el, offset = 1.25) {
      const totalWidth =
        el.offsetWidth -
        this.$el.querySelector(".credit-card-field-security-fields")
          .offsetWidth;
      return totalWidth <= this.getTextWidth(el.value, el) * offset;
    },
    getDefaultCard() {
      return {
        number: this.$attrs.number || "",
        expiration: this.$attrs.expiration || "",
        cvc: this.$attrs.cvc || "",
        postalCode: this.$attrs.postalCode || ""
      };
    },
    getCardField() {
      return this.$el.querySelector(".credit-card-field");
    },
    getEventPayload(el, isValid) {
      const card = JSON.parse(JSON.stringify(this.card));
      const expiration = card.expiration.split("/");

      card.numberFormatted = card.number;
      card.number = card.number.replace(/\s/g, "");
      card.expMonth = expiration[0] ? expiration[0].trim() : null;
      card.expYear = expiration[1] ? expiration[1].trim() : null;

      return {
        card: card,
        brand: this.brand,
        invalid: this.isInvalid(),
        complete: this.isComplete(),
        input: {
          el: el,
          valid: isValid
        }
      };
    },
    getTextWidth(text, el) {
      const defaultView = (el.ownerDocument || document).defaultView;
      const computedStyle = defaultView.getComputedStyle(el);
      // re-use canvas object for better performance
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      context.margin = 0;
      context.font = computedStyle.font;
      var metrics = context.measureText(text);
      return metrics.width;
    },
    getClassName(el) {
      const classes = el.classList.item(1).split("-");
      return classes[classes.length - 1];
    },
    focusNextElement(el) {
      if (el.nextElementSibling && el.nextElementSibling.children[0]) {
        el.nextElementSibling.children[0].focus();
      } else if (el.nextElementSibling) {
        el.nextElementSibling.focus();
      }
    },
    focusPrevElement(el) {
      if (!el.value && el.previousElementSibling) {
        el.previousElementSibling.focus();
      } else if (!el.value) {
        this.$el.querySelector(".credit-card-field-number").focus();
      }
    },
    hasChanged() {
      return this.previousValue !== JSON.stringify(this.card);
    },
    validateCvc(value) {
      return Payment.fns.validateCardCVC(value);
    },
    validateNumber(value) {
      return Payment.fns.validateCardNumber(value);
    },
    validateExpiration(value) {
      return Payment.fns.validateCardExpiry(value);
    },
    validatePostalCode(value) {
      return value.match(/^\d{5}(?:[-\s]\d{4})?$/) !== null;
    },
    isPrintableKeyCode(event) {
      const keycode = event.keyCode;
      return (
        (keycode > 47 && keycode < 58) || // number keys
        keycode === 32 ||
        keycode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91) || // letter keys
        (keycode > 95 && keycode < 112) || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223) // [\]' (in order)
      );
    },
    isValid() {
      for (let i in this.validated) {
        if (this.validated[i] !== true) {
          return false;
        }
      }

      return true;
    },
    isInvalid() {
      for (let i in this.validated) {
        if (this.validated[i] === false) {
          return true;
        }
      }

      return false;
    },
    isComplete() {
      return !!(
        this.validated.number &&
        this.validated.expiration &&
        this.validated.cvc &&
        this.validated.postalCode
      );
    },
    onResize(event) {
      this.width = this.$el.offsetWidth;
      return this.onResize;
    },
    clickHandler(event) {
      if (!event.target.classList.contains("credit-card-field-field")) {
        this.focusedElement
          ? this.focusedElement.focus()
          : this.$el.querySelector(".credit-card-field-field").focus();
      }
    }
  },
  created() {
    this.card = this.getDefaultCard();
  },
  mounted() {
    Payment.formatCardCVC(this.$el.querySelector(".credit-card-field-cvc"));
    Payment.restrictNumeric(
      this.$el.querySelector(".credit-card-field-postal")
    );
    Payment.formatCardNumber(
      this.$el.querySelector(".credit-card-field-number")
    );
    Payment.formatCardExpiry(
      this.$el.querySelector(".credit-card-field-expiration")
    );

    this.$emit("input", this.card);

    window.addEventListener("resize", this.onResize());
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/inline-credit-card-field.scss";
</style>
