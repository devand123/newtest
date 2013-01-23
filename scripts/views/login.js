//Registration.js

define([
  "jquery",
  "lodash",
  "backbone",
  "ejs",
  "views/makeview",
  "logincheck"
],

function($, _, Backbone, EJS, makeView, loginCheck) {

  EJS = window.EJS;

  var LoginView = Backbone.View.extend({
    initialize: function() {
      //this.render();
    },
    render: function() {
      //makeView.makeView('login', this);
      var template = new EJS({ url: './templates/login.ejs' }).render();
      this.$el.html(template);
    },
    events: {
      "submit form": "formSubmit"
    },
    formSubmit: function(evt) {
      var username = $('input[name="username"]').val();
      var password = $('input[name="password"]').val();

      evt.preventDefault();

      $.ajax({
            url: './loginuser',
            type: 'GET',
            dataType: "json",
            data: { username: username, password: password },
            success: function(data) {
              console.log('User found! Username: ' + data.username + '; Email: ' + data.email);

              // Reference this data, and pass it into the 
              // logUserIn() for use in the template
              var loggedInViewData = {
                username: data.username,
                email: data.email,
                uid: data.uid
              };

              // the user's db ID sent back from the GET request
              //var userid = data.uid;

              // Set the logincheck.js status to true, and log the user in
              // as well as utilize the data referenced above in the templates
              //-----------------------------------------------------------------
              // send the users id over so the login state could be set on that
              // users particular account
              loginCheck.logUserIn(loggedInViewData);

            },
            error: function(data, data2, data3) {
              $('span.super-error').html('<p>Wrong username and/or password combination.</p>');
              console.log('Not logged in. No user found. ' + data + ' data 2: ' + data2 + ' data3: ' + data3);
            }
        });

      }
  });

  function init() {
    var logView = new LoginView();
    makeView.viewConstruct(logView);
  }

  return {
    init: init
 };

});
