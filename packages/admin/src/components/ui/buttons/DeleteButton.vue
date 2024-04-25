<template>
  <va-action-button
    v-if="hasAction('delete')"
    :hide-label="icon"
    :label="$t('va.actions.delete')"
    icon="mdi-trash-can"
    :color="color || 'red'"
    :text="text"
    :disabled="disabled"
    @click="onDelete"
  ></va-action-button>
</template>

<script>
import Button from "../../../mixins/button";
import Disabled from "../../../mixins/disabled.js";

/**
 * Button for all delete resource action. Comes with confirm dialog.
 * Auto hide if no delete action available unless show prop is active.
 */
export default {
  mixins: [Button, Disabled],
  props: {
    /**
     * Redirect to resource list after successful deletion.
     * Default redirect active if current page is resource being deleted.
     */
    redirect: Boolean,
    overrideDeleteTitle: String,
    overrideDeleteMessage: String,
    text: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    async onDelete() {
      if (!this.item) {
        /**
         * Custom delete action if no item.
         * Used for bulk delete button which has his custom logic.
         */
        this.$emit("delete");
        return;
      }

      if (
        await this.$admin.confirm(
          this.$t(this.deleteTitle, {
            resource: this.currentResource.singularName.toLowerCase(),
            id: this.item[this.currentResource.label],
          }),
          this.$t(this.deleteMessage, {
            resource: this.currentResource.singularName.toLowerCase(),
            id: this.item[this.currentResource.label],
          })
        )
      ) {
        await this.$store.dispatch(`${this.resource}/delete`, {
          id: this.item.id,
        });

        if (this.redirect) {
          this.$router.push({ name: `${this.resource}_list` });
          return;
        }

        this.$store.dispatch("api/refresh", this.resource);

        /**
         * Triggered on successful deletion of resource item.
         */
        this.$emit("deleted");
      }
    },
  },
  computed: {
    deleteTitle() {
      if (this.overrideDeleteTitle) {
        return this.overrideDeleteTitle;
      } else {
        return "va.confirm.delete_title";
      }
    },
    deleteMessage() {
      if (this.overrideDeleteMessage) {
        return this.overrideDeleteMessage;
      } else {
        return "va.confirm.delete_message";
      }
    },
  },
};
</script>
