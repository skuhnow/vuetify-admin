<p align="center">
<a href="https://vtec.okami101.io" target="_blank" rel="noopener"><img src="packages/docs/docs/.vuepress/public/logo.png" width="300"></a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/vtec-admin"><img src="https://img.shields.io/npm/v/vtec-admin.svg?style=flat-square" alt="Latest Version on NPM"></a>
<a href="https://www.npmjs.com/package/vtec-admin"><img src="https://img.shields.io/npm/l/vtec-admin.svg?style=flat-square" alt="License"></a>
</p>

# Vtec Admin

SPA admin library for Vue.js running on top of REST APIs, built on Vuetify and comes with dedicated Vue CLI plugin for 🚀. Ready to use on Laravel API backend by using official [Vtec Laravel Crud](https://github.com/okami101/vtec-laravel-crud) composer package, but can be used on every backend of your choice with your own data and authentication providers.

> See [full documentation](https://vtec.okami101.io)  
> Check [online demo](https://vtec-bookstore-demo.okami101.io/admin) -> use prefilled login (read only)  
> Note : this project is heavily inspired by [React Admin](https://github.com/marmelab/react-admin/) made by awesome [Marmelab Team](https://marmelab.com/)

[![demo](packages/docs/docs/.vuepress/public/screenshot.png)](https://vtec-bookstore-demo.okami101.io/admin)

## [Features](#features)

* Powered by Vuetify, and comes with nice [Material Theme by Creative Tim](https://github.com/creativetimofficial/vuetify-material-dashboard).
* Full standalone UI SPA admin that can be adapted to any backend (REST, GraphQL, SOAP, etc.) by writing your own data and auth providers by following specific contracts which ensure compatibility.
* Bare minimal Vue.js code needed to get your CRUD pages working via [DSL](https://en.wikipedia.org/wiki/Domain-specific_language) approach.
* If using Vue CLI project, which is heavily recommended, [Vue CLI plugin](packages/cli) will be your ideal companion by installing all minimal boilerplate code for immediate quick start. Can be used on any Vue.js based application as well.
* 100% Vue CLI friendly. Vtec Admin is simply a plugin which integrates within all of your existing plugins, notably Vue Router, Vuex and Vuetify. Keep total control of your Vue app by adding your own routes with custom pages, custom store modules, and full Vuetify theming as you are used to on Vue CLI base project.
* Ready to use data and auth providers for Laravel.
* Cookie based authentication auth provider for [Laravel Sanctum](https://github.com/laravel/sanctum). If you prefer JWT instead, simply write your own provider that follow specific auth contract.
* Advanced permissions.
* Official [Vtec Laravel Crud](https://github.com/okami101/vtec-laravel-crud) provided for insane quick start from top to bottom. Provides many backend features as spa authentication, profile editing, users management, impersonation, [translatable fields](https://github.com/spatie/laravel-translatable), [media support](https://github.com/spatie/laravel-medialibrary), [file manager](https://github.com/Studio-42/elFinder) with Wysiwyg bridges, etc.
* With combination of Laravel Crud and Vue CLI plugin, Vtec Admin allows you immediate start developement from backend to UI with already basic functional admin.
* Stay as little magic as possible by fully respecting each backend and frontend development environnement. If you know well Laravel and Vue CLI basics, so you're ready to go !
* CRUD code generators are offered on both Laravel backend and Vue frontend for even quicker ready-to-go API and UI with basic CRUD boilerplate code generation. Each can be totally used separatly.
* With usage of Vtec Admin, code generators as well as Vue.js power, feel the better mix between productivity, nice development experience and limitless customization.
* Full featured bookstore demo application, with [Laravel backend](examples/laravel) running on Docker and his associated [Vue CLI admin project](examples/demo) using [Vtec Admin](packages/admin).
* Complete documentation.
* Internationalization support via Vue I18n, with full english and french translations provided. Can be easily configured by taking user browser language.
* Translatable resource fields by contextual language selection on each crud page.
* Unique v-model context by form for minimal boilerplate code.
* Server-side form validation support.
* Autocomplete input with entity reference support.
* TinyMCE 5 as default Wysiwyg with elFinder bridge, can be replaced by your own.
* Full-featured datagrid, including multi-sort, pagination, global search, advanced filters, basic CSV export, live query string context. And of course with possibility of cell templating.
* Data iterator decoupled from datagrid which allows you total customization of list layout.
* Advanced filters as-you-type with many inputs: select, boolean, autocomplete for search by relations, with multiple, etc.
* Customizable by-row, bulk and global actions.
* Direct aside create/edit from list instead of separate crud page.
* Many fields and inputs components for various data types: select, boolean, number, rich text, etc.
* Create your own fields and inputs simply by extending mixins.
* To finish, for what it's worth, it's completely free.

## Why ⏩Vtec⏪

`vue-admin` was obviously already taken on NPM registry and I wanted to keep VA acronym. I'm a huge fan of Japanese cars and I remembered VTEC, a system designed for power optimization at low and high speed. So I found it very suited for this project, which tries to deliver highest efficency possible from top to bottom.

## [Installation](#installation)

Select your most suitable guide :

* If you choose Laravel as backend, follow [this optimized guide](https://github.com/okami101/vtec-laravel-crud#requirements).
* For all other cases, follow [the standard Vue CLI path](https://www.npmjs.com/package/vue-cli-plugin-vtec-admin#requirements).

### CRUD code generators

For best explanation of this feature, follow [this tutorial](https://vtec.okami101.io/tutorial).

## [At a glance](#code)

Basic admin initialization code :

```js
// src/plugins/admin.js
import VtecAdmin from "vtec-admin";
import "vtec-admin/dist/vuetify";
import "vtec-admin/dist/admin.css";

import { laravelDataProvider, sanctumAuthProvider } from "vtec-admin";
import { en, fr } from "vtec-admin";

import router from "@/router";
import store from "@/store";
import i18n from "@/i18n";
import resources from "@/resources";
import axios from "axios";

const http = axios.create();

export default new VtecAdmin({
  router,
  store,
  i18n,
  title: "My Admin App",
  locales: { en, fr },
  authProvider: sanctumAuthProvider(http),
  dataProvider: laravelDataProvider(http),
  resources,
});
```

> More explanation inside [Vtec Admin Readme](packages/admin#instanciation). This "boilerplate code" is automatically pre-generated by [Vtec Admin Vue CLI Plugin](packages/cli).

Then describe all of your backend resources :

```js
// src/resources/index.js
export default [
  {
    name: "books",
    icon: "mdi-book",
    translatable: true,
    permissions: ["admin", "editor", "author"],
  },
  {
    name: "reviews",
    icon: "mdi-comment",
    permissions: ["admin", "editor", "author"],
  },
  {
    name: "users",
    icon: "mdi-account",
    only: ["list", "delete"],
    permissions: ["admin"],
  },
];
```

Then create associated crud pages inside `resources` folder :

<details>
  <summary>List sample</summary>
  
```vue
<template>
  <!-- src/resources/Reviews/List.vue -->
  <base-material-card :icon="resource.icon" :title="title">
    <va-list
      v-model="selected"
      :options.sync="options"
      v-slot="props"
      flat
    >
      <va-datagrid
        :fields="fields"
        v-bind="props"
        v-model="selected"
        :options.sync="options"
      >
        <template v-slot:quality="{ item }">
          {{ item.rating >= 3 ? $t("good") : $t("bad") }}
        </template>
      </va-datagrid>
    </va-list>
  </base-material-card>
</template>

<script>
export default {
  props: ["resource", "title"],
  data() {
    return {
      fields: [
        {
          source: 'status',
          type: 'select',
        },
        { source: 'rating', type: 'rating' },
        'quality',
        'author',
        {
          source: 'publication_date',
          type: 'date',
          format: 'long',
        },
      ]
      options: {},
      selected: [],
    };
  },
};
</script>
```

</details>

<details>
  <summary>Show sample</summary>

```vue
<template>
  <!-- src/resources/Reviews/Show.vue -->
  <va-show>
    <v-row justify="center">
      <v-col lg="4">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2">
              {{ title }}
            </div>
          </template>
          <v-card-text>
            <va-field
              source="status"
              type="select"
              chip
            ></va-field>
            <va-field source="quality" v-if="item">
              {{ item.rating >= 3 ? $t("good") : $t("bad") }}
            </va-field>
            <va-field source="rating" type="rating"></va-field>
            <va-field source="body"></va-field>
            <va-field source="author"></va-field>
            <va-field
              source="publication_date"
              type="date"
              format="long"
            ></va-field>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </va-show>
</template>

<script>
export default {
  props: ["title", "item"],
};
</script>
```

</details>

<details>
  <summary>Create sample</summary>

```vue
<template>
  <!-- src/resources/Reviews/Create.vue -->
  <va-create>
    <reviews-form :title="title" :item="item"></reviews-form>
  </va-create>
</template>

<script>
import ReviewsForm from "./Form";

export default {
  props: ["title", "item"],
  components: {
    ReviewsForm,
  },
};
</script>
```

</details>

<details>
  <summary>Edit sample</summary>

```vue
<template>
  <!-- src/resources/Reviews/Edit.vue -->
  <va-edit>
    <reviews-form :id="id" :title="title" :item="item"></reviews-form>
  </va-edit>
</template>

<script>
import ReviewsForm from "./Form";

export default {
  props: ["id", "title", "item"],
  components: {
    ReviewsForm,
  },
};
</script>
```

</details>


<details>
  <summary>Form sample</summary>

```vue
<template>
  <!-- src/resources/Reviews/Form.vue -->
  <va-form :id="id" :item="item" :saving.sync="saving" v-model="model">
    <v-row justify="center">
      <v-col lg="6">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2">
              {{ title }}
            </div>
          </template>
          <v-card-text>
            <va-radio-group-input source="status" row></va-radio-group-input>
            <va-rating-input source="rating"></va-rating-input>
            <va-text-input source="body" multiline></va-text-input>
            <va-text-input source="author"></va-text-input>
            <va-date-input
              source="publication_date"
              format="long"
            ></va-date-input>
          </v-card-text>
          <va-save-button :saving="saving"></va-save-button>
        </base-material-card>
      </v-col>
    </v-row>
  </va-form>
</template>

<script>
export default {
  props: ["id", "title", "item"],
  data() {
    return {
      saving: false,
      model: {},
    };
  },
};
</script>
```

</details>

## Note on this main repo

It's contains all necessary projects to develop Vtec Admin and run demo and tutorial :

* [Vtec Admin Library](packages/admin), the main admin library.
* [Vtec Admin Vue CLI Plugin](packages/cli), the associated Vue CLI plugin which contains all base code boilerplate for quick install and UI commands code generator.
* [Vtec Laravel Crud](vtec-laravel-crud), git submodule of composer package to use on fresh Laravel project which facilitates Vtec Admin integration and includes server-side API commands generator.
* [Bookstore Admin Demo](examples/demo), full-featured admin sample build on top of main Vtec Admin Library.
* [Bookstore Laravel Demo](examples/laravel), suitable API backend for bookstore admin demo based on Laravel.
* [Admin Tutorial](examples/tutorial), finished tutorial after following [dedicated docs](https://vtec.okami101.io/tutorial) which aims to made a good showcase of YAML code generation power.
* [Vtec Docs](packages/docs), vuepress docs.

All of this projects are automatically linked together by symlinks (thanks to yarn workspaces and composer) for best library development experience. HMR from demo to admin library side-by-side is fully supported !

## [Usage](#usage)

### How to run demo locally

Be sure to have clone this repo with git submodules.  
If not use `git submodule init && git submodule update`. [Vtec Laravel Crud](vtec-laravel-crud) should be cloned.

Docker is required for quick-start run backend API. If you don't want it, follow [dedicated instructions](examples/laravel#classic).

Use Makefile for easy starting all necessery tools.
For Windows users just install [scoop](https://scoop.sh/) and `scoop install make`

Use `make help` for all detail commands.

In order to run demo :

```bash
make install # intall all yarn dependencies
make run-laravel-demo # run server api through docker (take a coffee if 1st time...)
make prepare-laravel-demo # initialize laravel app and inject dummy data (use it only at 1st launch)
make run-demo # compile all bookstore demo admin with HMR dev mode enabled
```

Admin panel should be autostart to [http://localhost:8080](http://localhost:8080)

### Run and build docs

Docs are built on VuePress. Use `make run-docs` to launch it and `make build-docs` for build it info static files inside "docs" repo root folder.

## [Simplified architecture](#architecture)

![Simplified architecture](packages/docs/docs/.vuepress/public/diagrams/architecture.svg)

## But why another admin panel again

### Main goals

* Nice ready-to-go Vuetify UI theme.
* SPA admin which delivers complete Vue.js power for admin UI development.
* Full backend independence by relying on low-level and replaceable auth and data providers.
* [DSL](https://en.wikipedia.org/wiki/Domain-specific_language) approach, minimal boilerplate code for best development experience.
* Powerful API (Laravel only) and UI code generators for highest productivity.
* Best balance between productivity and customization.
* Maximize usage of many other opensource projects.

The main goal of Vtec Admin is to get you rid off all CRUD boilerplate code that can be very nasty on real SPA Admin. Very bare minimal Vue.js code is needed to get your Vue CRUD pages working with standard nice basic layout. On the other side, with combination of Vue.js component development, you have limitless customization at hand. This is a sort of Vue.js little equivalent to well known [React Admin](https://github.com/marmelab/react-admin/), which uses even more extensive [DSL](https://en.wikipedia.org/wiki/Domain-specific_language) approach.

### Place of this project within other admin frameworks

So many admin panel are generaly tightly coulpled with backend framework and prevent us to switch easily. Besides most of the time it stays classic server-side templating engine oriented associated to good old jQuery plugins, with no usage of a powerfull UI framework as Vue.js. I think notably on [Backpack](https://backpackforlaravel.com/) for Laravel and [EasyAdmin](https://github.com/EasyCorp/EasyAdminBundle) for symfony world. The main advantage of this admin panels is to be highest productive as possible (and plently featured in case of Backpack) but tends to come with her own logic and stay first of all very configuration oriented.

On the other side, the official [Laravel Nova](https://nova.laravel.com/), although it is a very productive Vue SPA admin, with obviously big community, are not free, "closed" source, still Laravel-coupled and come with his own caveats (you tend to follow the "Nova" way for specifics needs with unnatural mix of coupled PHP and Vue development).

[React Admin](https://github.com/marmelab/react-admin/) (RA) is by far the coolest and most customizable admin panel on the market. Besides it's totally free and totally independent of any backend. Althought it isn't the more efficient way to build basic admin app from top to bottom with backend included, this is in my opinion the true way to build admin apps, just as LEGO&copy; !

But I'm a Vue.js fan and I didn't find a close equivalent based on it. So why not to try a make one, mainly for "fun" and hard training ?

### Case of API backend

By its nature, RA doesn't propose any helpers for backend framework. [Api Platform Demo](https://github.com/api-platform/demo) does awesome work for Symfony area with full Swagger automatisation, although it's a bit very extreme approach of minimal boilerplate, which leads to more magic and harder to extend. Moreover it's come with Hydra guessers for even less code on UI side as default which is not very suitable for real app in my opinion.

So I choose to make a [complete helper package](https://github.com/okami101/vtec-laravel-crud) for Laravel in order to have the best quick start experience possible, combined to generators for high productivity, while highly respecting the pure Laravel way to make CRUD resources. Absolutly no magic but damn good old YAML based code generators, similar as [Blueprint](https://github.com/laravel-shift/blueprint), with less features to confess.

## [State](#state)

> This is a really alpha state package, so plenty of bugs, don't waste your time of using it for real projects, only for adventurers !

Many of React Admin existing features has been transposed in this project, but without client-side data cache and optimistic UI which necessit many work for something i don't really need. Besides this feature undercut server-side validation.  
Client-side lazy and eager relationships fetching is not included as well, because more efficient directly on server-side with far less code. It's ok if you have full control of backend.

This app is of course far to be as sharp as RA which is the admin panel I highly recommended you to use for business apps, besides I didn't write a single test...  
Moreover RA has really fast growing contributions and tends to be the "de facto" standelone SPA admin.

More backend showcase examples as Symfony / NestJS / Spring Boot / ASP.NET Core in addition to existing Laravel would be nice but it asks really too much work for now, especially if I should develop a dedicated API Crud composer / npm / maven / NuGet packages for each...

> As this project was made entirely on my personal free time while I'm employed, and is totally free and open-source, don't expect any support of anything. This project was just mainly a personal challenge and only aims to satisfy my own needs on personal projects. For real production on essential sites I strongly advise you to go with [React Admin](https://github.com/marmelab/react-admin/) which is far more mature or use [Nova](https://nova.laravel.com/) for highest productivity with nice UI.

## Similar inspiring projects

### Standelone SPA admin panel builder

* [React Admin](https://github.com/marmelab/react-admin/), totally free and independent of any backend. Just build admin panel as LEGO&copy; ! But not the most productive as is (no backend helpers), and highest learning curve compared to the others. Can be even cooler if used within [Api Platform](https://github.com/api-platform/api-platform) for backend.

### Free Symfony classic admin panel

* [EasyAdmin](https://github.com/EasyCorp/EasyAdminBundle), standard admin builder, not many widgets by default but very efficient and heavily configurable by YML config files and extendable with twig templates.
* [Sonata Admin](https://github.com/sonata-project/SonataAdminBundle), super massive admin builder, maybe one of the most powerful and full featured free admin panel on the market, but not really the most seamless development experience (personal opinion).

### Some Laravel admin panels

* [Backpack](https://backpackforlaravel.com/), not free for commercial projects, with the good old school HTML jQuery. Can have quickly bloated code in case of specific custom development needs, but still stay one of the most productive admin panel on the market with a tons of widgets.
* [Official Laravel Nova](https://nova.laravel.com/), not free and the most expensive, but full featured and very efficient SPA admin builder for Laravel with Vue.js. Code as fast as Backpack but with modern UI Framework and nice Laravel-ish development experience.
* [Voyager](https://voyager.devdojo.com/), free admin panel available for Laravel.

## Full documentation

Full documentation can be found on the [Vtec docs website](https://vtec.okami101.io).

## License

This project is open-sourced software licensed under the [MIT license](https://adr1enbe4udou1n.mit-license.org).
