define([
  "jquery",
  "lodash",
  "backbone",
  "views/makeview",
  //login page
  "views/login",
  //registration page
  "views/register",
  "logincheck"
],

function($, _, Backbone, makeView, loginView, registerView, loginCheck) {

  var MainController = {
    loginMethod: function() {
      //render the login page
      loginView.init();
    },
    registerMethod: function() {
      //render the registration page
      registerView.init();
    },
    logoutMethod: function() {
      // log out
      loginCheck.logUserOut();
    }
  };

  var MainRouter = Backbone.Marionette.AppRouter.extend({

    // This App Router's controller found in Controller.js
    controller: MainController,

    // Use App Router for pages with logic
    // 'Register' page for example
    // These mapped methods are found in Controller.js
    appRoutes: {
      'login': 'loginMethod',
      'register': 'registerMethod',
      'logout': 'logoutMethod'
    },
    
    // Use routes to show regular pages with no logic
    // 'Home' page for example
    routes: {
      'home': 'homePage'
    },
    homePage: function() {
      makeView.showPage('home');
    }

  });

  // Called init router, as it only contains routes for the not loggged in user
  var initMainRouter = new MainRouter();

  function init(href) {
    initMainRouter.navigate(href, {trigger: true});
  }

  return {
    init: init
  }

});
