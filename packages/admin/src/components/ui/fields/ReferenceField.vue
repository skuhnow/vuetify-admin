<template>
  <span v-if="value">
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <v-chip
      v-else-if="chip && link"
      :color="getColor(value)"
      :small="small"
      :to="link"
    >
      <slot :value="value" :item="referenceItem">{{ getItemText }}</slot>
    </v-chip>
    <router-link v-else-if="link" :to="link">
      <slot :value="value" :item="referenceItem">{{ getItemText }}</slot>
    </router-link>
    <span v-else>
      <!-- @slot Content placeholder for further customization, guess the resource text by default. -->
      <slot :value="value" :item="referenceItem">{{ getItemText }}</slot>
    </span>
  </span>
</template>

<script>
import Field from "../../../mixins/field";
import Reference from "../../../mixins/reference";

/**
 * Display a reference link to another existing resource. Can auto fetch the the target resource from source ID if asked.
 */
export default {
  mixins: [Field, Reference],
  props: {
    /**
     * Show link as a chip.
     */
    chip: Boolean,
    /**
     * Allow resource auto fetching from source.
     */
    fetch: Boolean,
    /**
     * Display the value of the lookup value (the "id") as a suffix. Example: "Companyname (company_id)"
     */
    displayIdValue: String,
    /**
     * Optional reference for the link
     */
    actionReference: String,
  },
  data: () => {
    return {
      loading: false,
      referenceItem: null,
    };
  },
  computed: {
    getId() {
      return this.referenceItem
        ? Array.isArray(this.referenceItem)
          ? this.referenceItem[0][this.itemValue]
          : this.referenceItem[this.itemValue]
        : this.value;
    },
    link() {
      let resource = this.$admin.getResource(this.resolvedReference);

      if (resource.routes.includes(this.action)) {
        if (this.action === "list") {
          return {
            name: `${this.resolvedReference}_list`,
            query: {
              filter: JSON.stringify({ q: this.getItemText }),
            },
          };
        }
        return {
          name: `${this.resolvedReference}_${this.action}`,
          params: {
            id: this.getId,
          },
        };
      }

      return null;
    },
    getItemText() {
      if (!this.referenceItem) {
        return this.value;
      }

      let resource = this.$admin.getResource(this.reference);
      let text = this.itemText || resource.label;

      if (typeof text === "function") {
        return text(this.referenceItem);
      }
      if (Array.isArray(this.referenceItem)) {
        let returnValue = [];
        this.referenceItem.forEach((item) => {
          if (item !== null && typeof item === "object") {
            if (this.displayIdValue) {
              returnValue.push(
                item[text] + " (" + item[this.displayIdValue] + ")"
              );
            } else {
              returnValue.push(item[text]);
            }
          } else {
            returnValue.push(item);
          }
        });
        return returnValue.join(", ");
      }

      return this.referenceItem[text] || this.referenceItem;
    },
    resolvedReference() {
      return this.actionReference ? this.actionReference : this.reference;
    },
  },
  watch: {
    value: {
      async handler(newVal) {
        if (newVal === Object(newVal)) {
          /**
           * Full reference object is already loaded
           */
          this.referenceItem = newVal;
          return;
        }

        if (this.fetch && newVal) {
          this.loading = true;
          try {
            let { data } = await this.$store.dispatch(`${this.reference}/getOne`, { id: newVal });
            this.referenceItem = data;
          } catch (e) {
            this.referenceItem = null;
          }

          this.loading = false;
        }
      },
      immediate: true,
    },
  },
};
</script>
