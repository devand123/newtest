// All things to do with making views here

define([
  "jquery",
  "lodash",
  "backbone",
  "marionette",
  "ejs",
  "myapp",
  "views/loginnav"
],

function($, _, Backbone, Marionette, EJS, MyApp, LoginNav) {

  EJS = window.EJS;

  // This is a region that changes upon login
  MyApp.addRegions({
      navigationRegion: $('nav.navcontain')
  });

  // The region manager for the #main div
  var mgr = new Backbone.Marionette.Region({
    el: $('#main')
  });

  // Handles the incoming view for specific views
  var viewConstruct = function(view, data) {
    mgr.show(view, data);
  };

  // Generic view to create dynamic views on the fly for pages without logic
  var MainView = Backbone.View.extend({
    initialize: function(data) {
      // something here
    },
    render: function(template) {
      this.$el.html(template);
    }
  });

  // Handles the incoming view for non-specific views
  function showPage(tempName, message) {
    message = message || 'An error has occured. Please try again.';
    // instantiate new non-specific page view
    var pageView = new MainView();

    // Append a message for certain templates (like error.ejs)
    var data = { error: message };

    // specify the tempate name thats passed from the router and reference
    // its .ejs template file
    var template = new EJS({ url: './templates/' + tempName + '.ejs' }).render(data);
    // pass the template to the render function of the MainView above
    pageView.render(template);

    // manage the region so that the view will close and unbind whenever a new
    // view is inserted into the #main div
    mgr.show(pageView);
  }

  // Initialize the login views for the regions
  // Data is passed to this function to be rendered in the view per the EJS template
  function loginView(data) {
    // Reference the logged in nav view
    var loginNavView = new LoginNav();

    // change the region upon login, and pass the appropriate user data through
    MyApp.navigationRegion.show(loginNavView, data);
  }


  return {
    showPage: showPage,
    viewConstruct: viewConstruct,
    loginView: loginView
 };

});
