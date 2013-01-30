define([
  "jquery",
  "lodash",
  "backbone",
  "events/loginvent",
  "views/makeview",
  "routers/loggedinrouter"
],

function($, _, Backbone, loginVent, makeView, loggedRouter) {

  // usage in logincheck.js
  var LoginState = Backbone.Model.extend({
      defaults: {
        //0 for false, anything else true
        status: 0,
        userId: null,
        apiKey: null
      },
      initialize: function() {
        this.on('change:apiKey', function() {
          // get the key that was set
          var theKey = this.get('apiKey');
          // add to localstorage apiKey strigified
          localStorage.setItem('apiKey', JSON.stringify(theKey));
          //console.log(this.get('apiKey'));
        });
      },
      // Take in the data
      login: function(passedData) {

        // Set the status of this model to true or 1
        this.set({ status: 1 });
        // Set the userId so that other methods can utilize it (like logout below)
        this.set({ userId: passedData.uid });
        //console.log('user id on raw model: ' + this.get('userId'));

        // Set the api key to store in localstorage (see above in initialize)
        this.set({ 
          apiKey: {
              username: passedData.username,
              email: passedData.email,
              uid: passedData.uid
            }
        });

        // This enables the loggedinrouter.
        // You can find what this triggers in the loggedinrouter file
        loginVent.trigger('userLogin');

        // Set the variables for use in the template
        var username = this.get('apiKey').username;
        var email = this.get('apiKey').email;
        var uid = this.get('apiKey').uid;
        
        // Set up the data object to send over to the template
        var dataToTemplate = {
          username: username,
          email: email,
          uid: uid
        };

        // Apply it to the loginView function for it to use in its .show->.render method
        // based off of my augments to Marionettes .show prototype in app.js
        makeView.loginView(dataToTemplate); 

        // Update the users loginstatus to true in the database
        $.ajax({
              url: './loginuser/' + passedData.uid,
              type: 'PUT',
              success: function(data) {

                console.log('Login status set to true!');
              },
              error: function(data) {
                console.log('Login status could not successfully be set');
              }
          });
      },
      logout: function() {
        // Set this models status to false or 0
        this.set({ status: 0 });
        // Set api key to null
        this.set({ apiKey: null });
        // Remove local storage of their api key
        localStorage.removeItem('apiKey');
        // Define the user ID for use in the ajax logout function below
        var userId = this.get('userId');

        // unbind all events triggered by login
        loginVent.unbindAll();

        $.ajax({
              url: './logoutuser/' + userId,
              type: 'PUT',
              success: function(data) {

                makeView.showPage('logout');

                //Navigate to the login form.
                Backbone.history.navigate('/login');
                // Reload the page after 2.5-3 seconds to refresh the template
                setTimeout(function() {
                  window.location.reload(true);
                }, 2500);

              },
              error: function(data) {
                //console.log('login status could not be set server-side' + ' Data: ' + data + ' Status reads: ' + status);
              }
          });

      }

  });

  return LoginState;

});
