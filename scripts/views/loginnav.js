define([
  "jquery",
  "lodash",
  "backbone",
  "ejs"
],

function($, _, Backbone, EJS) {

  EJS = window.EJS;

  // Navigation regions view on login
  var LoginNav = Backbone.View.extend({
    // Data is passed in thru Marionette's .show method
    // I edited the prototype (found in app.js init) to include an additional data parameter
    render: function(data) {

      // Pass the data into the render method in order to use it in the template
      var template = new EJS({ url: './templates/loginnav.ejs' }).render(data);
      this.$el.html(template);
    },
    events: {
      'click li.usercontain': 'userContainClick'
    },
    userContainClick: function() {
      $('li.usercontain ul').toggleClass('stayshown');
    }
  });


  return LoginNav;

});
