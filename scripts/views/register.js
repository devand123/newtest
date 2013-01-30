//Registration.js

define([
  "jquery",
  "lodash",
  "backbone",
  "ejs",
  "views/makeview",
  "logincheck",
  "models/users"
],

function($, _, Backbone, EJS, makeView, loginCheck, Users) {

  EJS = window.EJS;

  function focusFormCheck() {

    // Get the id name of the form name passed thru
    //var formID = formName.attr('id');
    // Construct a selector for that forms input fields
    //var theSelector = '#' + formID + ' input';
    var formName = $('form#register');


    var removeError = function(obj) {

      // Grab this inputs proper corresponding label by its matching name
      var errorLabelSpan = $('label[for="' + $(obj).attr('name') + '"] span');

      // obj used with 'this' below
      $(obj).removeClass('error');
      // Clear the errorspan
      $(errorLabelSpan).empty();
    };

    var addError = function(obj, errorMessage) {

      // Grab this inputs proper corresponding label by its matching name
      var errorLabelSpan = $('label[for="' + $(obj).attr('name') + '"] span');

      // Append the error message
      // Empty it due to no duplication
      $(errorLabelSpan).empty().append(errorMessage);

      // Add error class to the object passed through. ('this' in this class)
      $(obj).addClass('error');
    };

    // For each input on the register form
    // See theSelector variable above if confused
    $(theSelector).blur(function(evt) {

      // The name attribute of this input
      var thisAttr = $(this).attr('name');
      // The value of this input
      var thisVal = $(this).val();

      // For the username field
      if(thisAttr === 'username') {
        if(thisVal.length === 0) {
          addError(this, 'Username needs to be more than 0 characters');
        }
        else {
          removeError(this);
        }
      }

      // For password field
      if(thisAttr === 'password') {
        // Check if password value is less than 8 characters long
        if(thisVal.length < 8) {
          addError(this, 'Needs to be atleast 8 characters!');
        }
        else {
          removeError(this);
        }
      }

      // Password confirm field
      if(thisAttr === 'passwordconfirm') {

        var passField = $('input[name="password"]'),
            orignalPassValue = passField.val();

        // If the confirmation password does not match the original password value
        if(thisVal !== orignalPassValue || thisVal.length < 8) {
          // manually add the error class to the original passfield
          $(passField).addClass('error');
          // add error to this field as well
          addError(this, 'Passwords do not match!');
        }
        else {
          removeError(this);
          // also remove error class from original password field
          $(passField).removeClass('error');
        }
      }

    });

  }


  function formcheck(username, password, email) {

      // grab the incoming form's id name
      //var formID = $(theForm).attr('id');
      // create a selector for that form's input fields
      //var theSelector = '#' + formID + ' input';
      // reference the value of those fields
      //var inputs = $(theSelector).val();
      var inputs = $('#register input').val();
      var errorLabelSpan = $('#register label span');
      var errorText = $('span.super-error');

      // If errors exist, or the inputs values are empty do not let it return/submit data
      if(errorLabelSpan.text().length || inputs.length === 0) {
        // append error message
        $(errorText).empty().append('<p>You cant submit with errors, silly!</p>');
        // do not let it go through
        return false;
      }

      // otherwise if all is well, submit and save it
      else {
        // Instantiates new Users model
        var newuser = new Users();
        // Passes the values from the register form to the model
        newuser.setUser(username, password, email);
        // Saves the model to the server asynchronously.
        newuser.save();

        $('#register').empty().append('<p>Thank you ' + username + '! Go <a href="#login">Login</a>!</p>');

        var data = {
          username: username,
          password: password
        };

        setTimeout(function(evt) {
          Backbone.history.navigate('/login', { trigger: true });
        }, 3000);

      }

  }

  var RegisterView = Backbone.View.extend({
    initialize: function() {
      //validate form thru this function
      //focusFormCheck();
    },
    render: function() {
      var template = new EJS({ url: './templates/register.ejs' }).render();
      this.$el.html(template);
    },
    events: {
      "submit form": "formSubmit"
    },
    formSubmit: function(evt) {
      var username = $('input[name="username"]').val(),
          password = $('input[name="password"]').val(),
          passwordConfirm = $('input[name="passwordconfirm"]').val(),
          email = $('input[name="email"]').val();

      // Prevent default form submission process
      evt.preventDefault();

      formcheck(username, password, email);
    }
  });

  function init() {
    var registerview = new RegisterView();
    makeView.viewConstruct(registerview);
  }


  return {
    init: init
 };

});
