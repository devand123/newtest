define([
  "jquery",
  "lodash",
  "backbone",
  "ejs",
  "views/makeview"
],

function($, _, Backbone, EJS, makeView) {

  EJS = window.EJS;

  function goToCompose(href, user) {
    // Navigate to compose from the user profile page
    // to compose a new message to that user
    Backbone.history.navigate(href, { trigger: true });
    // Automatically put the users name value in the Send-To field
    $('input[name="send-to"]').val(user);
    // Focus input automatically on the 'message-title' input
    $('input[name="message-title"]').focus();
  }

  // Navigation regions view on login
  var UserView = Backbone.View.extend({
    // Data is passed in thru Marionette's .show method
    // I edited the prototype (found in app.js init) to include an additional data parameter
    render: function(data) {

      // Pass the data into the render method in order to use it in the template
      var template = new EJS({ url: './templates/userprofile.ejs' }).render(data);
      this.$el.html(template);
    },
    events: {
      'click button[name="message-user"]': 'sendMessage'
    },
    sendMessage: function() {
      // get the value of the users username to use in the 'send-to' input on compose
      var username = $('input[name="username"]').val();
      // pass this value, plus the page to navigate to to goToCompose (function above this)
      goToCompose('/compose', username);
    }
  });

  function init(id) {

    var userView = new UserView();

    $.ajax({
      url: './getuser/' + id,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Success! : ' + data);

        var dataSent = {
          userName: data.username,
          eMail: data.email,
          userID: data.id,
          aboutMe: data.aboutme
        };

        makeView.viewConstruct(userView, dataSent);
      },
      error: function(data) {
        console.log('Error! : ' + data)
      }
    });
  }

  // Edit profile view
  var EditProfileView = Backbone.View.extend({
    render: function(data) {
      var template = new EJS({ url: './templates/editprofile.ejs' }).render(data);
      this.$el.html(template);
    },
    events: {
      'submit #edit-profile': 'formSubmit'
    },
    formSubmit: function(evt) {
      // Prevent default form action
      evt.preventDefault();

      // get the user id thats stored in the hidden input
      var id = $('input[name="uid"]').val();
      // get the value of the about me that the user set
      var aboutValue = $('textarea[name="about-me"]').val();

      // Create data to pass in
      var mydata = {
        aboutme: aboutValue
      };
      // Stringify it
      var stringified = JSON.stringify(mydata);

      //alert('id: ' + id + ' about: ' + aboutValue);

      $.ajax({
        url: './saveprofile/' + id,
        type: 'PUT',
        dataType: 'json',
        // send thru the stringified
        data: stringified,
        success: function(data) {
          console.log('Profile saved! Data loaded: ' + data);
          // load a message letting them know it was saved
          $('span.saved-status').html('Saved!');
          // get rid of the message
          $('span.saved-status').fadeOut(3000);

          //disable the submit button
          $('input[type="submit"]').attr('disabled', 'disabled');
        },
        error: function(data, data2, data3) {
          console.log('Error.. : ' + data + ' d2: ' + data2 + ' d3: ' + data3);
        }
      });

    }
  });

  // Edit profile view initiation
  // Maybe put in its own place?
  function editProfile() {
    // instantiate new edit profile view
    var editProf = new EditProfileView();

    // Get the user id with localstorage
    var apikey = localStorage.getItem('apiKey');
    // parse it for use
    var parsed = JSON.parse(apikey);
    // reference the id
    var id = parsed['uid'];

    //call same ajax function as above
    //*** you really need to refactor and automate all these ajax calls! ***
    $.ajax({
      // pass the id
      url: './getuser/' + id,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Success! : ' + data);

        var dataSent = {
          userName: data.username,
          eMail: data.email,
          userID: data.id,
          aboutMe: data.aboutme
        };

        makeView.viewConstruct(editProf, dataSent);
      },
      error: function(data) {
        console.log('Error! : ' + data)
      }
    });
  }

  return {
    init: init,
    editProfile: editProfile
  }

});
