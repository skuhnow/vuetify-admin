<template>
  <v-tooltip bottom :disabled="!hasLabel">
    <template v-slot:activator="{ on }">
      <v-icon v-if="value" v-on="on">{{ iconTrue }}</v-icon>
      <v-icon v-else v-on="on">{{ iconFalse }}</v-icon>
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script>
import Field from "../../../mixins/field";

/**
 * Show value as identifiable true/false icon.
 */
export default {
  mixins: [Field],
  props: {
    /**
     * True text for tooltip.
     */
    labelTrue: {
      type: String,
      default: "va.confirm.yes",
    },
    /**
     * False text for tooltip.
     */
    labelFalse: {
      type: String,
      default: "va.confirm.no",
    },
    /**
     * Icon for true value. Must be a valid MDI.
     */
    iconTrue: {
      type: String,
      default: "mdi-check",
    },
    /**
     * Icon for false value. Must be a valid MDI.
     */
    iconFalse: {
      type: String,
      default: "mdi-close",
    },
  },
  computed: {
    label() {
      return this.$t(this.value ? this.labelTrue : this.labelFalse);
    },
    hasLabel() {
      return !!this.label;
    },
  },
};
</script>
