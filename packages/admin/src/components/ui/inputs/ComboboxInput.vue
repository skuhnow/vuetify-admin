<template>
  <v-combobox
    v-bind="commonProps"
    :disabled="disabled"
    :readonly="readonly"
    :class="{ 'v-input--is-disabled': readonly }"
    :filled="filled"
    :multiple="multiple"
    :chips="chips"
    :autofocus="autofocus"
    :small-chips="smallChips"
    :item-text="getItemText"
    :item-value="getItemValue"
    :items="items || choices"
    @change="change"
    @input="updateInternal"
    persistent-hint
  >
    <template v-slot:selection="data">
      <span>{{ renderCallback(data.item) }}</span>
    </template>
    <template v-slot:item="data">
      <span>{{ renderCallback(data.item) }}</span>
    </template>
  </v-combobox>
</template>

<script>
import Input from "../../../mixins/input";
import Multiple from "../../../mixins/multiple";
import Editable from "../../../mixins/editable";
import ReferenceInput from "../../../mixins/reference-input";
import Disabled from "../../../mixins/disabled";

/**
 * Value editing from a fixed choices. Support multiple and references.
 * If no choices, by default, takes localized enums with source as value from your VueI18n resources locales.
 */
export default {
  mixins: [Input, Multiple, Editable, ReferenceInput, Disabled],
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  async created() {
    this.items = await this.fetchChoices();
  },
  methods: {
    updateInternal(value) {
      let actVal = value;
      if (value !== null && typeof value === "object") {
        actVal = value[this.getItemValue];
      }
      this.update(actVal);
    },
    renderCallback(value) {
      if (value === null) {
        return value;
      }
      if (typeof value === "object") {
        return value["name"];
      }

      const foundInChoices = this.choices.filter(
        (item) => item[this.getItemValue] === value
      );
      if (foundInChoices.length > 0) {
        return foundInChoices[0][this.getItemText];
      }

      return value;
    },
  },
};
</script>
