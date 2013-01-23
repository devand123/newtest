define([
  "jquery",
  "lodash",
  "backbone"
],

function($, _, Backbone) {

  var Users = Backbone.Model.extend({
    defaults: {
      username: 'Username',
      password: 'password',
      email: 'email@email.com'
    },
    url: './registeruser',
    initialize: function() {
      console.log('Users model initialized');
    },
    setUser: function(username, password, email) {
      this.set({
        username: username,
        password: password,
        email: email
      });
      console.log(this.get('username') + this.get('password') + this.get('email'));
    }

  });

  return Users;

});
