<template>
  <div v-if="$route.path === '/'" class="container">
    <h3>{{ examplesTitle }}</h3>
    <ul>
      <li v-for="(page, key) in examples" :key="key">
        <router-link :to="`/examples/${key}`">{{ key }}</router-link>
      </li>
    </ul>
  </div>

  <component v-else-if="routeComponent" :is="routeComponent" />

  <div v-else>
    <h1 class="text-center mt-5">{{ pageNotFound }}</h1>
  </div>
</template>

<script>
import examples from "../examples";

export default {
  data: () => ({
    examples,
    pageNotFound: "Page Not Found",
    examplesTitle: "Examples"
  }),
  computed: {
    routeComponent() {
      return examples[this.$route.path.split("/")[2]];
    }
  }
};
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap.scss";
</style>
