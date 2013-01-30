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
      'click li a': 'markActive'
    },
    markActive: function(evt) {
      var currentActive = $('.nav li.active');
      // equals either the hash of the target, or an empty string so it 
      // wont return undefined when trying to be broken
      var thisLink = evt.target.hash || '';
      
      // if the link is the users link, dont let it go active.
      if(thisLink.match(/#users./)) {
        $(currentActive).removeClass('active');
        return;
      }
      else {
        // remove the current active links active class
        $(currentActive).removeClass('active');
        //give the link being requested an active state
        $('.nav li a[href="' + thisLink + '"]').not('.user-options li a').parent().addClass('active');
      }
    }
  });


  return LoginNav;

});
