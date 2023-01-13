<template>
  <v-textarea
    v-if="multiline"
    v-bind="commonProps"
    auto-grow
    :autofocus="autofocus"
    :filled="filled"
    :disabled="disabled"
    :readonly="readonly"
    :class="{ 'v-input--is-disabled': readonly }"
    @change="change"
    @input="update"
    persistent-hint
  ></v-textarea>
  <v-text-field
    v-else
    v-bind="commonProps"
    :autofocus="autofocus"
    :filled="filled"
    :disabled="disabled"
    :readonly="readonly"
    :class="{ 'v-input--is-disabled': readonly }"
    @change="change"
    @input="update"
    :type="type"
    persistent-hint
    :append-icon="showCopyPaste ? 'mdi-content-copy' : ''"
    @click:append="copyToClipboard()"
  >
    <template v-slot:message="{ message }">
      <span v-html="message"></span>
    </template>
  </v-text-field>
</template>

<script>
import Input from "../../../mixins/input";
import Disabled from "../../../mixins/disabled";
import Editable from "../../../mixins/editable";

/**
 * Text editing for text value type via a basic text input.
 * Support textarea mode for long text via `multiline` prop.
 * Can be use for any date, datetime or time editing, use type set on `date`, `datetime-local` or `time`.
 * Render will depend of browser support.
 */
export default {
  mixins: [Input, Editable, Disabled],
  props: {
    /**
     * Text to be edited.
     * @model
     */
    value: {
      type: String,
      default: "",
    },
    /**
     * Type of text input. All HTML type allowed.
     */
    type: {
      type: String,
      default: "text",
    },
    /**
     * Transform text input into textarea.
     */
    multiline: Boolean,
    /**
     * Use full filled background color style.
     */
    filled: {
      type: Boolean,
      default: true,
    },
    showCopyPaste: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    copyToClipboard() {
      this.$copyText(this.value).then(() => {
        this.$store.commit(`messages/showToast`, {
          color: "success",
          message: `Text copied!`,
        });
      });
    },
  },
};
</script>
