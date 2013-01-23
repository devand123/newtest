define([
  "jquery",
  "lodash",
  "backbone",
  "marionette",
  // apps main init router
  "routers/initrouter",
  "myapp",
  "logincheck"
],

function($, _, Backbone, Marionette, initRouter, MyApp, loginCheck) {

  // Check if the user is logged in upon MyApp initialization
    var options = {
      isLoggedIn: function() {
        //localstorage get apiKey if any, resume previous state?
        var status = localStorage.getItem('apiKey');
        //console.log(status);

        // if no status exists, return false
        if(status === null) {
          //console.log('there is no status?: ' + status);
          // if there is any apiKey present that is empty, remove it
          localStorage.removeItem('apiKey');
          //do not let it return anything
          return false;
        }
        // if there is a localstorage record saved, do something with it
        else {
          // parse the status for raw value use
          var theStatus = JSON.parse(status);

          // Set the values to send as data
          var username = theStatus["username"];
          var email = theStatus["email"];
          var uid = theStatus["uid"];

          // Construct object to send to logUserIn function
          var data = {
            username: username,
            email: email,
            uid: uid
          };

          //Send the data and invoke logUserIn function
          loginCheck.logUserIn(data);
        }
      }
    };

  // Augmented a couple of prototypes for backbone and marionette
  // so far mostly concerning handleing views
  function protoAugment() {

    Backbone.View.prototype.close = function() {
      // if the view has an onClose method, use it
      
      if(this.onClose) {
        // call the onClose method
        this.onClose();
        //console.log('did i work?');
      }
      // if it doesnt, do nothing
      else {
        // do nothing
      }

    }

    // Rewrite the Marionette show method to accept an additional optional data parameter, which would be passed
    // to the render method, and used in the templates if there is a data attr specified.
    Marionette.Region.prototype.show = function(view, data) {
      this.ensureEl();
      this.close();

      view.render(data);
      this.open(view);

      Marionette.triggerMethod.call(view, "show");
      Marionette.triggerMethod.call(this, "show", view);

      this.currentView = view;
    }

  }


  function init() {

    // initialize protoAugment function above
    protoAugment();

    // Make sure the page shows the correct page being requested per the hash
    $(document).ready(function() {

      // Start up MyApp
      // Call the isloggedin method to check to see if the user is logged in or not
      MyApp.start(options.isLoggedIn);

      // Start up the Backbone history
      Backbone.history.start({pushState: true, hashChange: true, root: 'newtest'});

      //On the click of any link except those with a data bypass
      $(this).on("click", "a:not([data-bypass])", function(evt) {
        // Get the absolute anchor href.
        var href = $(this).attr("href");
        
        // If the href exists and is a hash route, run it through Backbone.
        if (href && href.indexOf("#") === 0) {
          // Stop the default event to ensure the link will not cause a page
          // refresh.
          evt.preventDefault();

          // push whatever route throgh here.
          initRouter.init(href);
        }

      });

    });

  }

  return {
    init: init
  }

});
