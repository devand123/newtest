define([
  "jquery",
  "lodash",
  "backbone",
  "views/makeview",
  //message page
  "views/messages",
  //explore page
  "views/explore",
  //user profile view
  "views/user",
  //share page view
  "views/share",
  "logincheck",
  "events/loginvent"
],

function($, _, Backbone, makeView, messagesView, exploreView, userView, shareView, loginCheck, loginVent) {
  //var status = loginCheck.getStatus();

  //Controller for logged in users
  var LoggedInController = {
    exploreMethod: function() {
      exploreView.init();
    },
    composeMail: function() {
      // render the compose a new message page
      messagesView.composeInit();
    },
    messagesMethod: function() {
      // render the messages page
      messagesView.init();
    },
    singleMessage: function(id) {
      // Get the proper message by id
      messagesView.singleMessView(id);
      // Mark the message with this id as read
      messagesView.messageIsRead(id);
    },
    messagesSentPage: function() {
      // render messages the user sent page
      messagesView.sentMessagesInit();
    },
    messagesSentSingle: function(id) {
      // get single message from sent messages
      messagesView.singleSentMessage(id);
    },
    replyToMessage: function(id) {
      messagesView.replyToMessage(id);
    },
    showUser: function(id) {
      userView.init(id);
    },
    editProfile: function() {
      userView.editProfile();
    },
    sharePage: function() {
      console.log('share page!');
      shareView.init();
    }
  };

  var LoggedInRouter = Backbone.Marionette.AppRouter.extend({

    // This App Router's controller found in Controller.js
    controller: LoggedInController,

    // Use App Router for pages with logic
    // 'Register' page for example
    // These mapped methods are found in Controller.js
    appRoutes: {
      'explore': 'exploreMethod',
      'compose': 'composeMail',
      'messages': 'messagesMethod',
      'messages/:id': 'singleMessage',
      'sentmessages': 'messagesSentPage',
      'sentmessages/:id': 'messagesSentSingle',
      'reply/:id': 'replyToMessage',
      'users/:id': 'showUser',
      'editprofile': 'editProfile',
      'share': 'sharePage'
    }

  });

  function init() {
    //nothing to call, as this is binded to the 'userLogin' event as seen below
  }

  // Login event bound to the userLogin trigger in loginstate.js login();
  loginVent.bindTo(loginVent, 'userLogin', function() {

    // Router is only instantiated once the userLogin event is triggered
    // I triggered this in loginstate.login();
    // Events are unbound on loginstate.logout();
    var loggedRouter = new LoggedInRouter();
    loggedRouter.navigate('/messages', { trigger: true });

  });

  return {
    init: init
  }

});
