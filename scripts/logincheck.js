//logincheck.js
//check to see if the user is logged in or not

define([
  "jquery",
  "lodash",
  "backbone",
  "models/loginstate",
  "events/loginvent"
],

function($, _, Backbone, LoginState, loginVent) {

  // Handles login, and logout

  // Handles the login state for the user once they log in.
  var logstate = new LoginState();

  function logUserIn(data) {
    // Pass the data through to send to the login function above in the LoginState View
    logstate.login(data);
  }
  
  function logUserOut() {
    logstate.logout();
  }


  return {
    logUserIn: logUserIn,
    logUserOut: logUserOut
 }

});
