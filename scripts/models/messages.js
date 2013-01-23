define([
  "jquery",
  "lodash",
  "backbone"
],

function($, _, Backbone) {

  var MessagesModel = Backbone.Model.extend({
    defaults: {
      to: '',
      title: '',
      body: '',
      received: null,
      uid: null,
      usersent: ''
    },
    url: './sendmessage',
    initialize: function() {
      //console.log('messages model init');
    },
    setMessage: function(to, title, body, date, uid, userSent) {
      this.set({
        to: to,
        title: title,
        body: body,
        received: date,
        uid: uid,
        usersent: userSent
      });
      console.log(to + ' ' + title + ' ' + body + ' ' + date);
    }

  });

  return MessagesModel;

});
