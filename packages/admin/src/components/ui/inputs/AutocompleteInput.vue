<template>
  <component
    :is="taggable ? 'v-combobox' : 'v-autocomplete'"
    :disabled="disabled"
    :readonly="readonly"
    :class="{ 'v-input--is-disabled': readonly }"
    v-bind="commonProps"
    :filled="filled"
    :multiple="multiple"
    :chips="chips"
    :autofocus="autofocus"
    :small-chips="smallChips"
    :loading="loading"
    :item-text="getItemText"
    :item-value="getItemValue"
    :items="items || choices"
    :return-object="returnObject"
    :search-input.sync="search"
    @change="change"
    @input="onInput"
    persistent-hint
    :filter="filterCallback"
  >
    <template v-slot:selection="data" v-if="$scopedSlots.selection || renderCallback">
      <!-- @slot Define a custom selection appearance -->
      <span v-if="renderCallback">{{ renderCallback(data.item) }}</span>
      <slot v-else name="selection" v-bind="data"></slot>
    </template>
    <template v-slot:item="data" v-if="$scopedSlots.item || renderCallback">
      <!-- @slot Define a custom item appearance -->
      <span v-if="renderCallback">{{ renderCallback(data.item) }}</span>
      <slot v-else name="item" v-bind="data"></slot>
    </template>
  </component>
</template>

<script>
import Input from "../../../mixins/input";
import Multiple from "../../../mixins/multiple";
import Disabled from "../../../mixins/disabled";
import ReferenceInput from "../../../mixins/reference-input";
import get from "lodash/get";

/**
 * Value editing from a searchable choices. Support multiple and references.
 * Allows searching of linked resources from your API.
 */
export default {
  mixins: [Input, Multiple, ReferenceInput, Disabled],
  props: {
    /**
     * Minimum characters to tap before search query launch.
     */
    minChars: {
      type: Number,
      default: 1,
    },
    /**
     * Name of request query for searching into your API.
     */
    searchQuery: {
      type: String,
      default: "q",
    },
    /**
     * Enable taggable mode. Transform autocomplete into combobox.
     */
    taggable: Boolean,
    returnObject: Boolean,
    initialLoad: {
      type: Boolean,
      default: true,
    },
    itemsPerPage: {
      type: Number,
      default() {
        return get(this.$admin.options, "autoComplete.itemsPerPage") || 50;
      },
    },
    renderCallback: {
      type: Function,
      default: null,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    emptyOption: {
      type: Boolean,
      default: false,
    },
    emptyOptionText: {
      type: String,
      default: 'Empty',
    },
  },
  data() {
    return {
      search: null,
    };
  },
  created() {
    if (this.initialLoad) {
      this.loadList();
    }
  },
  methods: {
    filterCallback(item, queryText, itemText) {
      if (this.reference && this.fetchedItems && this.fetchedItems.length) {
        const itemJson = JSON.stringify(item);
        return this.fetchedItems.filter(fetchedItem => JSON.stringify(fetchedItem) === itemJson).length > 0;
      }
      return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
    },
    async loadCurrentChoices(value) {
      if (this.reference && value) {
        this.items = await this.fetchCurrentChoices(value);
        await this.loadList();
      }
    },
    async loadList(val = null) {
      if (this.emptyOption) {
        let empty = {};
        empty[this.getItemText] = this.emptyOptionText;
        empty[this.getItemValue] = '~empty~';

        this.items = [
          ...[empty],
          ...(this.items || []),
          ...((await this.fetchChoices(val, this.itemsPerPage)) || []),
        ];
        return;
      }

      this.items = [
        ...(this.items || []),
        ...((await this.fetchChoices(val, this.itemsPerPage)) || [])
      ];
    },
    resetList() {
      this.items = [];
    },
    onInput(value) {
      this.update(value);
      this.search = "";
    },
  },
  watch: {
    input: {
      handler(newVal) {
        /**
         * Fetch full object as soon as we get input value
         */
        this.loadCurrentChoices(newVal);
      },
      immediate: true,
    },
    async search(val) {
      if (!val || val.length < this.minChars) {
        return;
      }

      await this.loadList(val);
    },
  },
};
</script>
