define([
  "jquery",
  "lodash",
  "backbone",
  "marionette",
],

function($, _, Backbone, Marionette) {

// Instance of my application
  var MyApp = new Backbone.Marionette.Application();

  // Regions to update in my app upon login
  MyApp.addRegions({
    navigationRegion: $('nav.navcontain'),
    footerRegion: $('.footer p.left')
  });

  MyApp.addInitializer(function(options) {
    //if my options specify a function, execute it
    if(typeof options === "function") {
      options();
    }
    // if they specify a string, console.log it
    if(typeof options === "string") {
      console.log('My App says: ' + options);
    }
  });

  return MyApp;

});
