define([
  "jquery",
  "lodash",
  "backbone",
  "ejs"
],

function($, _, Backbone, EJS) {

  EJS = window.EJS;

  // Share page view
  var ShareView = Backbone.View.extend({
    // Data is passed in thru Marionette's .show method
    // I edited the prototype (found in app.js init) to include an additional data parameter
    render: function(data) {
      // Pass the data into the render method in order to use it in the template
      var template = new EJS({ url: './templates/share.ejs' }).render(data);
      this.$el.html(template);
  }
  });


  return LoginNav;

});
