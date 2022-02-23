<template>
  <div>
    <va-action-button
      v-bind="$attrs"
      :hide-label="icon"
      :label="label || defaultLabel"
      icon="mdi-cancel"
      :color="color || 'secondary'"
      :text="text"
      @click="onClick"
    ></va-action-button>
  </div>
</template>

<script>
import Button from "../../../mixins/button";

export default {
  mixins: [Button],
  props: {
    /**
     * Remove background button.
     */
    text: Boolean,
    /**
     * Override default label.
     */
    label: String,
  },
  computed: {
    defaultLabel() {
      return this.$t("va.actions.cancel");
    },
  },
  methods: {
    onClick() {
      this.$router.push({ name: `${this.resource}_list` });
    },
  },
};
</script>
