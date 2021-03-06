define([
  "jquery",
  "lodash",
  "backbone",
  "views/makeview",
  //login page
  "views/login",
  //registration page
  "views/register",
  //message page
  "views/messages",
  //explore page
  "views/explore",
  "logincheck"
],

function($, _, Backbone, makeView, loginView, registerView, messagesView, exploreView, loginCheck) {

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
      //both no link and /login will go to the login page
      '': 'loginMethod',
      'login': 'loginMethod',
      'register': 'registerMethod',
      'logout': 'logoutMethod'
    },
    
    // Use routes to show regular pages with no logic
    // UPDATE: GOT RID OF IT, NOW PRESENTED WITH LOGIN UPON INDEX
    // 'Home' page for example
    routes: {
     // '': 'homePage'
    },
    homePage: function() {
      //makeView.showPage('home');
      //alert('yip');
    }

  });

  // Called init router, as it only contains routes for the not loggged in user
  var initRouter = new MainRouter();

  function init(href) {
    initRouter.navigate(href, {trigger: true});
  }

  return {
    init: init
  }

});
