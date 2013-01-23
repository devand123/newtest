define([
  "jquery",
  "lodash",
  "backbone",
  "ejs"
],

function($, _, Backbone, EJS) {

  EJS = window.EJS;

  // Footer regions view on login
  var LoginFooter = Backbone.View.extend({
    render: function() {
      var template = new EJS({ url: './templates/footer-loggedin.ejs' }).render();
      this.$el.html(template);
    }
  });


  return LoginFooter;

});
