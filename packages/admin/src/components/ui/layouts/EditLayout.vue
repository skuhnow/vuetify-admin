<template>
  <va-action-page :title="title">
    <template slot="actions">
      <va-list-button
        v-if="!disableList"
        :resource="resource"
        :item="item"
      ></va-list-button>
      <va-show-button
        v-if="enableShow"
        :resource="resource"
        :item="item"
      ></va-show-button>
      <!-- @slot Additional custom action buttons placeholder. -->
      <slot name="actions"></slot>
      <va-clone-button
        v-if="!disableClone"
        :resource="resource"
        :item="item"
      ></va-clone-button>
      <va-delete-button
        v-if="!disableDelete"
        :resource="resource"
        :item="item"
        redirect
      ></va-delete-button>
      <va-locale-button :resource="resource"></va-locale-button>
    </template>
    <!-- @slot Page content placeholder. -->
    <slot v-if="item"></slot>
  </va-action-page>
</template>

<script>
import Page from "../../../mixins/page";

/**
 * Page layout for resource edition.
 * Contain specific related action as deleting, cloning, showing as well as translation action.
 */
export default {
  mixins: [Page],
  props: {
    disableList: Boolean,
    // hide "show" action by default (propably don't need it if you are in edit mode)
    enableShow: Boolean,
    disableClone: Boolean,
    disableDelete: Boolean,
  },
};
</script>
