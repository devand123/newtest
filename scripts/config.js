// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    libs: "../scripts/libs",
    plugins: "../scripts/plugins",

    // Libraries.
    ejs: "../scripts/libs/ejs",
    jquery: "../scripts/libs/jquery",
    lodash: "../scripts/libs/lodash",
    backbone: "../scripts/libs/backbone",
    marionette: "../scripts/libs/bbmarionette"
  },

  shim: {
  // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: ["jquery", "lodash"],
      exports: "Backbone"
  },
    marionette: {
      deps: ["jquery", "lodash", "backbone"],
      exports: "Marionette"
  }

    // Backbone.LayoutManager depends on Backbone.
    //"plugins/backbone.layoutmanager": ["backbone"]
  }

});
