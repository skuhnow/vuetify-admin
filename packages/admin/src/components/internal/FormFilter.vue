<template>
  <form>
    <v-row>
      <v-col cols="12" sm="auto" v-for="(item, index) in filters" :key="index">
        <div class="d-flex align-center">
          <v-btn
            small
            text
            icon
            class="mr-2"
            v-if="!item.alwaysOn"
            @click="remove(item)"
          >
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
          <slot
            :name="item.source"
            :source="item.source"
            :label="item.label"
            v-bind="item.attributes"
            :value="value[item.source]"
          >
            <input-filter
              :ref="item.source"
              :type="item.type"
              :source="item.source"
              :label="item.label"
              v-bind="item.attributes"
              :value="value[item.source]"
              @input="(val) => update(item, val)"
            >
            </input-filter>
          </slot>
        </div>
      </v-col>
    </v-row>
  </form>
</template>

<script>
import InputFilter from "./InputFilter";

export default {
  components: {
    InputFilter,
  },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    filters: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.setFocusOnFirstFilter();
  },
  methods: {
    setFocusOnFirstFilter() {
      if (this.filters.length === 0) {
        return;
      }
      const firstFilterSource = this.filters[0].source;
      const element = this.$refs[firstFilterSource][0].$el;

      if (element) {
        setTimeout(() => {
          const input = element.querySelector("input:not([type=hidden]),textarea:not([type=hidden])");
          if (input) {
            setTimeout(() => {
              input.focus();
            }, 0);
          }
        }, 1);
      }
    },
    remove(filter) {
      let value = { ...this.value };
      delete value[filter.source];

      this.$emit("remove", filter);
      this.$emit("input", value);
    },
    update(item, value) {
      this.$emit("input", {
        ...this.value,
        [item.source]: value,
      });
    },
  },
};
</script>
