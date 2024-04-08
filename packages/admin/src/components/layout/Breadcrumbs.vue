<template>
  <div>
    <v-breadcrumbs v-if="breadcrumbItems" :items="breadcrumbItems" />
    <v-breadcrumbs v-else :items="items" />
  </div>
</template>

<script>
/**
 * Default admin component for breadcrumbs, will generate automatically hierarchical links from current route.
 * Support hierarchical CRUD structure.
 */
export default {
  computed: {
    breadcrumbItems() {
      return this.$store.state.breadcrumbs.items;
    },
    items() {
      return this.$route.matched.map((route) => {
        return {
          text: route.meta && route.meta.title ? route.meta.title : route.name,
          exact: true,
          to: route.path === "" ? "/" : route,
        };
      });
    },
  },
};
</script>

<style>
.theme--light .v-breadcrumbs {
  background-color: #fff;
}
</style>
