<template>
  <!--
    Toggle sidebar.
    @event input
  -->
  <v-navigation-drawer
    :clipped="$vuetify.breakpoint.lgAndUp"
    app
    :dark="dark"
    :color="color"
    :mini-variant="miniVariant"
    :value="value"
    @input="(v) => $emit('input', v)"
  >
    <template v-slot:img="props">
      <!-- @slot Image background. -->
      <slot name="img" v-bind="props"></slot>
    </template>
    <v-list dense>
      <template v-for="(item, index) in clearedMenu.filter((l) => l)">
        <v-subheader v-if="item.heading && !miniVariant" :key="index">
          {{ item.heading }}
        </v-subheader>
        <v-divider v-else-if="item.divider" :key="index"></v-divider>
        <v-list-group
          v-else-if="item.children && item.children.length"
          :key="index"
          :value="item.expanded"
          :prepend-icon="item.icon"
          append-icon="mdi-chevron-up"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(child, i) in activeChildren(item.children)"
            :key="i"
            link
            class="pl-8"
            :to="child.link"
          >
            <v-list-item-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ child.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item v-else-if="item.text" :key="index" link :to="item.link">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
/**
 * Default customizable admin VNavigationDrawer with full hierarchical menu and minimize variant.
 */
export default {
  props: {
    /**
     * Main place for side menu, support hierarchical structure, MDI icons, heading and dividers.
     */
    menu: {
      type: Array,
      default: () => [],
    },
    /**
     * Minimize the sidebar and show only icons.
     */
    miniVariant: Boolean,
    /**
     * Main color of VNavigationDrawer.
     */
    color: {
      type: String,
      default: "white",
    },
    /**
     * Apply dark theme variant for VNavigationDrawer
     */
    dark: Boolean,
    /**
     * Control visibility
     */
    value: null,
  },
  methods: {
    activeChildren(children) {
      return children.filter((child) => !!child);
    },
  },
  computed: {
    clearedMenu() {
      let clearedMenu = [];
      this.menu.forEach((element) => {
        if (element === false) {
          return;
        }
        if ("divider" in element) {
          clearedMenu.push(element);
        }
        if ("link" in element) {
          clearedMenu.push(element);
        }
        if ("children" in element) {
          if (this.activeChildren(element["children"]).length > 0) {
            clearedMenu.push(element);
          }
        }
      });
      return clearedMenu;
    },
  },
};
</script>
