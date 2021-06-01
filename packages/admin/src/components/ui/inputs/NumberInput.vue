<template>
  <v-text-field
    v-bind="commonProps"
    :filled="filled"
    type="number"
    :step="step"
    :min="min"
    :max="max"
    @change="change"
    @input="update"
    persistent-hint
  ></v-text-field>
</template>

<script>
import Input from "../../../mixins/input";
import Editable from "../../../mixins/editable";

/**
 * Optimized for number editing. Just a type number input with step, min and max attribute behavior.
 */
export default {
  mixins: [Input, Editable],
  props: {
    format: {
      type: Function,
    },
    parse: {
      type: Function,
    },
    /**
     * Number to be edited.
     * @model
     */
    value: {
      type: Number,
      default: null,
    },
    /**
     * Use full filled background color style.
     */
    filled: {
      type: Boolean,
      default: true,
    },
    /**
     * The interval step.
     */
    step: {
      type: Number,
      default: 1,
    },
    /**
     * The minimum accepted value.
     */
    min: Number,
    /**
     * The maximum accepted value.
     */
    max: Number,
  },
  methods: {
    getItem(value) {
      let returnValue = value === undefined ? this.value : value;
      if (typeof this.parse === "function") {
        return this.parse(returnValue);
      }
      return returnValue;
    },
    update(value) {
      /**
       * Update model in the injected form if available.
       */
      if (this.formState) {
        let formStateValue = value;
        if (typeof this.format === "function") {
          formStateValue = this.format(value);
        }
        this.formState.update({
          source: this.uniqueFormId,
          value: formStateValue,
        });
      }

      /**
       * Set value into input.
       */
      this.input = value;

      /**
       * Triggered if value updated.
       */
      this.$emit("input", value);
    },
  },
};
</script>
