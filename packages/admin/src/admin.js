import upperFirst from "lodash/upperFirst";
import isEmpty from "lodash/isEmpty";

import aside from "./store/aside";
import messages from "./store/messages";
import auth from "./store/auth";
import guest from "./store/guest";
import api from "./store/api";

import resourceCrudModule from "./store/resource";
import resourceCrudRoutes from "./router/resource";

export default class VtecAdmin {
  constructor({
    router,
    store,
    i18n,
    title,
    routes,
    locales,
    translations,
    authProvider,
    dataProvider,
    resources,
    options,
    canAction,
  }) {
    /**
     * Options properties
     */
    this.title = title;
    this.locales = locales;
    this.translations = translations;
    this.authProvider = authProvider;
    this.dataProvider = dataProvider;
    this.options = options || {};

    /**
     * Permissions helper & directive
     */
    this.can = (permissions) =>
      !authProvider ||
      isEmpty(permissions) ||
      !isEmpty(
        (Array.isArray(permissions) ? permissions : [permissions]).filter(
          (p) => -1 !== store.getters["auth/getPermissions"].indexOf(p)
        )
      );

    /**
     * Format usable resources object
     */
    this.resources = resources
      .map((r) => {
        return typeof r === "string"
          ? {
              name: r,
            }
          : r;
      })
      .map((r) => {
        /**
         * Get valid actions by whitelist and blacklist
         */
        let actions = ["list", "show", "create", "edit", "delete"].filter(
          (a) => {
            if ((r.actions || []).length) {
              return r.actions.includes(a);
            }

            if ((r.except || []).length) {
              return !r.except.includes(a);
            }

            return true;
          }
        );

        let getName = (count) => i18n.tc(`resources.${r.name}.name`, count);

        return {
          ...r,
          icon: r.icon || "mdi-view-grid",
          actions,
          getName,
          singularName: getName(1),
          pluralName: getName(10),
          getTitle: (action, item = null) => {
            let nameKey = `resources.${r.name}.name`;
            let titleKey = `resources.${r.name}.titles.${action}`;

            if (item) {
              return (
                (i18n.te(titleKey)
                  ? i18n.t(titleKey, item)
                  : i18n.t(`va.pages.${action}`, {
                      resource: i18n.tc(nameKey, 1).toLowerCase(),
                      label:
                        typeof r.label === "function"
                          ? r.label(item)
                          : item[r.label],
                    })) + ` #${item.id}`
              );
            }
            return i18n.te(titleKey)
              ? i18n.t(titleKey)
              : i18n.t(`va.pages.${action}`, {
                  resource: i18n
                    .tc(nameKey, action === "list" ? 10 : 1)
                    .toLowerCase(),
                });
          },
          canAction: (action) => {
            /**
             * Test if action exist for this resource
             */
            if (!actions.includes(action)) {
              return false;
            }

            /**
             * Use custom action if defined
             */
            if (canAction) {
              let result = canAction({
                resource: r,
                action,
                can: this.can,
              });

              /**
               * If valid boolean return this value instead of default next behavior
               */
              if (typeof result === "boolean") {
                return result;
              }
            }

            /**
             * Get permissions for asked action
             */
            let permissions = (r.permissions || [])
              .filter((p) => {
                return typeof p === "string" || p.actions.includes(action);
              })
              .map((p) => {
                return typeof p === "string" ? p : p.name;
              });

            // Test if current user can access
            return this.can(permissions);
          },
        };
      });

    /**
     * Get full resource object meta from name
     */
    this.getResource = (name) => this.resources.find((r) => r.name === name);

    /**
     * Resource link helper with action permission test
     */
    this.getResourceLink = (link) => {
      let getLink = ({ name, icon, text, action }) => {
        action = action || "list";
        let resource = this.getResource(name);
        let { canAction, singularName, pluralName } = resource;

        if (!canAction(action)) {
          return false;
        }

        return {
          icon: icon || resource.icon,
          text: text || (action === "list" ? pluralName : singularName),
          link: { name: `${name}_${action}` },
        };
      };

      if (typeof link === "object") {
        return getLink(link);
      }
      return getLink({ name: link });
    };

    /**
     * Resource links list helper
     */
    this.getResourceLinks = (links) => {
      return links
        .map((link) => {
          if (typeof link === "object") {
            if (link.children) {
              return link;
            }

            return this.getResourceLink(link);
          }
          return this.getResourceLink({ name: link });
        })
        .filter((r) => r);
    };

    /**
     * Load i18n locales
     */
    Object.keys(locales).forEach((locale) => {
      i18n.mergeLocaleMessage(locale, { va: locales[locale] });
    });

    /**
     * Default try to humanize i18n locale
     */
    i18n.missing = (locale, key, vm, values) => {
      let label = key;
      let lastIndex = key.lastIndexOf(".");

      if (lastIndex !== -1) {
        label = key.substr(lastIndex + 1, key.length);
      }

      return upperFirst(label.replace("_", " "));
    };

    /**
     * Auth store & api dispatcher module injection
     */
    store.registerModule("aside", aside);
    store.registerModule("messages", messages);
    store.registerModule("api", api);
    store.registerModule(
      "auth",
      this.authProvider ? auth(this.authProvider, router) : guest
    );

    /**
     * Add API resources modules dynamically
     */
    this.resources.forEach((resource) =>
      store.registerModule(
        resource.name,
        resourceCrudModule({
          provider: this.dataProvider,
          resource,
          i18n,
        })
      )
    );

    /**
     * Add resources routes dynamically
     */
    routes.children = (routes.children || []).concat(
      this.resources.map((resource) =>
        resourceCrudRoutes({
          store,
          i18n,
          resource,
          title: this.title,
        })
      )
    );

    router.addRoutes([routes]);

    /**
     * Global confirm dialog function
     */
    this.confirm = (title, message) =>
      store.dispatch("messages/confirm", { title, message });

    /**
     * Global toaster object
     */
    this.toast = ["success", "error", "info", "warning", "message"].reduce(
      (o, action) => ({
        ...o,
        [action]: (message) =>
          store.commit("messages/showToast", {
            color: action !== "message" ? action : null,
            message,
          }),
      }),
      {}
    );

    /**
     * Check Auth after each navigation
     */
    router.beforeEach(async (to, from, next) => {
      if (to.name !== from.name) {
        /**
         * Set main and document title
         */
        document.title = to.meta.title
          ? `${to.meta.title} | ${this.title}`
          : this.title;

        /**
         * Auto close aside
         */
        store.commit("aside/close");

        /**
         * Check and refresh authenticated user with last permissions
         * after each navigation
         */
        await store.dispatch("auth/checkAuth", to);
      }

      next();
    });
  }
}
