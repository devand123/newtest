//DEPRECATED

//DEPRICATED

//DEPRICATED


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
    exploreMethod: function() {
      exploreView.init();
    },
    loginMethod: function() {
      //render the login page
      loginView.init();
    },
    registerMethod: function() {
      //render the registration page
      registerView.init();
    },
    messagesMethod: function() {
      // render the messages page
      messagesView.init();
    },
    composeMail: function() {
      // render the compose a new message page
      messagesView.composeInit();
    },
    logoutMethod: function() {
      // log out
      loginCheck.logUserOut();
    }
  };

  var MyRouter = Backbone.Marionette.AppRouter.extend({

    // This App Router's controller found in Controller.js
    controller: MainController,

    // Use App Router for pages with logic
    // 'Register' page for example
    // These mapped methods are found in Controller.js
    appRoutes: {
      'explore': 'exploreMethod',
      'login': 'loginMethod',
      'register': 'registerMethod',
      'messages': 'messagesMethod',
      'compose': 'composeMail',
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

  var appRouter = new MyRouter();

  function startRouter() {
    Backbone.history.start({pushState: true, root: './#'});
  }

  function init(href) {
    appRouter.navigate(href, {trigger: true});
  }

  return {
    init: init,
    startRouter: startRouter
  }

});
