<template>
  <div id="app" class="container">
    <router-link to="/">Back to home</router-link>

    <h1>credit-card-field</h1>

    <h3>Overview</h3>

    <p>
      This component is meant to be a standalone Vue component that attempts to
      provide a credit card UI that improves conversions from other fields.
    </p>

    <h3>Basic Usage</h3>

    <form>
      <credit-card-field
        v-model="card"
        number="4242424242424242"
        :activity="activity"
        @change="onChange"
        @valid="onValid"
        @invalid="onInvalid"
      />
    </form>

    <p>
      The field works like most input fields and will update the model
      reactively. The card is represent as an object with various properties
      associated with the input.
    </p>

    <div class="alert alert-info">{{ card }}</div>
  </div>
</template>

<script>
import CreditCardField from "@/components/CreditCardField";

export default {
  components: {
    CreditCardField
  },
  data: () => ({
    card: {},
    activity: false
  }),
  methods: {
    onChange() {
      console.log('change', arguments);
    },
    //eslint-disable-next-line
    onValid(e) {
      this.activity = true;

      setTimeout(() => {
        this.activity = false;
      }, 1000);
    },
    onInvalid() {
      console.log('invalid', arguments)
    }
  },
};
</script>
