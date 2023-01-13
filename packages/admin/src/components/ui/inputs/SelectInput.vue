<template>
  <v-select
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
    @input="update"
    persistent-hint
  >
  </v-select>
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
};
</script>
