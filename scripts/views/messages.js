//Messages.js

define([
  "jquery",
  "lodash",
  "backbone",
  "marionette",
  "ejs",
  "views/makeview",
  "models/messages",
  "collections/messages"
],

function($, _, Backbone, Marionette, EJS, makeView, MessagesModel, MessagesCollection) {

  EJS = window.EJS;

  // Messages Index Page
  var MessageView = Backbone.View.extend({
    initialize: function() {
    },
    render: function(data) {
      var template = new EJS({ url: './templates/messages.ejs' }).render(data);
      this.$el.html(template);
    },
    renderNewMessage: function(data) {
      // This renders the messages when the messages page is loaded
      var template = new EJS({ url: './templates/newmessage.ejs' }).render(data);
      $('#message-table tbody').append(template);
    },
    // For the sent messages page
    renderNewSentMessage: function(data) {
      // This renders the messages when the messages page is loaded
      var template = new EJS({ url: './templates/newsentmessage.ejs' }).render(data);
      $('#message-table tbody').append(template);
    },
    renderSingleMessage: function(data) {
      var template = new EJS({ url: './singlemessage.ejs' }).render();
      this.$el.html(template);
    },
    events: {
      'change input[name=markMessage]': 'markMessage',
      'click button[name=deletemessage]': 'deleteMessage'
    },
    markMessage: function(evt) {
      // Add proper active class to delete button depending on if a message
      // is checked or not.
      if($('input[name=markMessage]').is(':checked')) {
        // If a message is checked, make sure the delete button has active class
        $('button[name=deletemessage]').addClass('active');
      }
      else {
        // If not, remove active class
        $('button[name=deletemessage]').removeClass('active');
      }
      // On change, if not selected, make sure the class on the TR
      // is removed for each that isnt. .parent().parent() refers to the TR
      $('input[name=markMessage]:not(checked)').each(function() {
        $(this).parent().parent().removeClass('selected');
      });

      // For each checked input
      $('input[name=markMessage]:checked').each(function() {
        // Add a selected class to the table row to show its selected
        $(this).parent().parent().addClass('selected');
      });
    },
    deleteMessage: function() {
      // Check if any table rows are highlighted for an action
      if($('tr').hasClass('selected')) {
        // just how many are currently selected
        var howMany = $('tr.selected').length;

        // ternary operator wasnt working properly, so i went the long route.
        // basically just handling the message to keep it logical
        if(howMany > 1) {
          var num = 'these ' + howMany + ' messages?';
        }
        else {
          var num = 'this ' + howMany + ' message?';
        }

        // Are you sure you want to delete?
        var conf = confirm('Are you sure you want to delete ' + num);
        if(conf === true) {
          // For each checked off/selected row
          $('input[name=markMessage]:checked').each(function() {

            // Get the hidden input field by going to 'this' closest parent (.markMessage)
            // and then extracting the value out from it
            // We do it this way because we need 'THIS' id, so the proper id, and not just
            // any other id is called
            var area = $(this).closest('.markMessage').children('input[name=mail-id]');
            var id = $(area).val();
            // Reference 'this' so I could use it in the ajax below
            var self = this;

            $.ajax({
              // append the id to the ajax call
              url: './deletemessage/' + id,
              type: 'DELETE',
              success: function(data) {
                console.log('Success! : ' + data);
                // If successful, remove this element from the dom
                $(self).parent().parent().fadeOut('fast');
                setTimeout(function() {
                  $(self).parent().parent().remove();
                }, 2000);
              },
              error: function(data) {
                console.log('Error... : ' +data);
              }
            });

          });
        }
        else {
          return false;
        }
      }
      // if no table rows are highlighted for action, return no action/false
      else {
        return false;
      }
    }
  });

  // Reply message view
  // Actually replying to a message
  var ReplyMessageView = Backbone.View.extend({
    render: function(data) {
      var template = new EJS({ url: './templates/reply.ejs' }).render(data);
      this.$el.html(template);
    },
    events: {
      'submit form': 'formSubmit'
    },
    formSubmit: function(evt) {
      // Prevent default form behaviour
      evt.preventDefault();
      // Make hidden form field to hold user sent from id value
      // Username of user that message is being sent to
      var sendTo = $('input[name="sendtousername"]').val();
      var messageTitle = $('input[name="message-title"]').val();
      var messageBody = $('textarea[name="message-body"]').val();
      // Instantiate a new date to send
      var newDate = new Date();
      // The users id that was originally stored when they first sent the message
      // since this is a REPLY
      var sentFrom = $('input[name="comingfromthisuser"]').val();

      // Go through local storage to grab the user sending this message's username
      // Should probably alter the DB to save this eventually
      // But for now this will do
      // Basic user info is stored in our localStorage under 'apiKey'
      var getUsername = localStorage.getItem('apiKey');
      // Parse it
      var parsed = JSON.parse(getUsername);
      // Extract username from it & use it as data for userSent property on messages model below
      var sentFromUsername = parsed["username"];

      // Instantiate a new message model
      var replymessage = new MessagesModel();

      // Set the message with the data above
      replymessage.setMessage(sendTo, messageTitle, messageBody, newDate, sentFrom, sentFromUsername);
      // Send and save the model to the db
      replymessage.save();

      // Display a 'message sent' message to the user
      $('#reply-message').empty().append('<h1>Reply Message</h1> <p>Message sent! Thank you..</p>');

      // Redirect the user back to their messages page
      setTimeout(function() {
        Backbone.history.navigate('/messages', { trigger: true });
      }, 2000);
    }
  });

  // Just bringing up the view of reply to message
  function replyToMessage(id) {

    var replyView = new ReplyMessageView();

    $.ajax({
      url: './replyto/' + id,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        var stringify = JSON.stringify(data);
        var parsed = JSON.parse(stringify);

        $(parsed).each(function() {
          // Actual message ID
          var id = this.id;
          // The ID of the recipeint of the message
          var sendto = this.sendto;
          var messagetitle = this.messagetitle;
          var messagebody = this.messagebody;
          var received = this.receiveddate;
          // ID of who the message is from
          var fromid = this.fromid;
          // Username of the user this message is from
          var fromuser = this.usersent;

          var newdata = {
            messageID: id,
            sendTo: sendto,
            messageTitle: messagetitle,
            messageBody: messagebody,
            receivedDate: received,
            fromUser: fromuser,
            fromID: fromid
          };

          //Construct the reply view with the data
          makeView.viewConstruct(replyView, newdata);

      });
      },
      error: function(data) {
        console.log('error: ' + data);
      }
    });
  }

  //messageIsRead sets whatever posts have been read already
  function messageIsRead(id) {
    // Get the current users userID per their localStorage stored apiKey
    var lstorage = localStorage.getItem('apiKey');
    // Parse it, since its JSON
    var parsed = JSON.parse(lstorage);
    // Extract the user id
    var uid = parsed["uid"];

      // Timeout for half a second so the data can load and be compared
      // before performing the update on the data
      setTimeout(function() {

        // Hidden input field containing the 'send to' id (aka the current user viewing the messages's id)
        var hiddenID = $('.messageview input[name="send-to-id"]').val();

        // Compare this id to the apiKey user id
        // If they match, mark the message as read, otherwise return false
        if(uid === hiddenID) {

          $.ajax({
            url: './updatemessage/' + id,
            type: 'PUT',
            success: function(data) {
              console.log('message read status update successful! : ' + data);
            },
            error: function(data, data2, data3) {
              console.log('message update error: ' + data + ' ' + data2 + ' ' + data3);
            }
          });
        }
        else {
          console.log('IDs do not match! Request failed.');
          return false;
        }

      }, 500);
  }

  //Viewing a single message you've received
  var SingleMessageView = Backbone.View.extend({
    initialize: function() {
    },
    render: function(data) {
      var template = new EJS({ url: './templates/singlemessage.ejs' }).render(data);
      this.$el.html(template);
    },
    events: {
      'click button[name=delete-message]': 'messageDelete'
    },
    messageDelete: function() {
      // Confirm if the user really wants to delete the message
      var conf = confirm('Are you sure you want to delete this message?');
      // If they do, do it.
      if(conf === true) {
        // the messages id to delete
        var id = $('input[name="message-id"]').val();

        $.ajax({
          // append the id to the ajax call
          url: './deletemessage/' + id,
          type: 'DELETE',
          success: function(data) {
            console.log('Success! : ' + data);
            // If successful, fade out
            $('.messageview').fadeOut(1500);
            // and navigate back to messages
            setTimeout(function() {
              Backbone.history.navigate('/messages', { trigger: true });
            }, 1500);
          },
          error: function(data) {
            console.log('Error... : ' +data);
          }
        });
      }
      else {
        // do nothing
      }
    }
  });
  
  // Single message view
  // Need to find a way to cut down on ajax, as I have 2 duplicate functions grabbing the same data for
  // such little things.  
  function singleMessView(id) {
    // instantiate a single message view
    var singleMess = new SingleMessageView();

    // Get the current users userID per their localStorage stored apiKey
    var lstorage = localStorage.getItem('apiKey');
    // Parse it, since its JSON
    var parsed = JSON.parse(lstorage);
    // Extract the user id
    var uid = parsed["uid"];

    $.ajax({
      url: './getmessages/' + id,
      type: 'GET',
      data: { uid: uid },
      dataType: "json",
      success: function(data) {
        console.log('successful! Data loaded: ' + data);

        //console.log(JSON.parse(data));
        var stringIt = JSON.stringify(data);
        var parsed = JSON.parse(stringIt);

        //console.log('string it: ' + stringIt);
        //console.log(parsed[0]);
        
        $(parsed).each(function() {
          var id = this.id;
          var sendto = this.sendto;
          var messagetitle = this.messagetitle;
          var messagebody = this.messagebody;
          var received = this.receiveddate;
          var fromid = this.uid;
          var fromuser = this.usersent;

          var data = {
            messageID: id,
            sendTo: sendto,
            messageTitle: messagetitle,
            messageBody: messagebody,
            receivedDate: received,
            fromUser: fromuser,
            fromID: fromid
          };

          // Construct the single message view
          makeView.viewConstruct(singleMess, data);
        });

      },
      error: function(data, data2, data3) {
        console.log('Error: ' + data + ' data 2: ' + data2 + ' data3: ' + data3);
    }
  });

  }


  // Show the messages index page

  function init() {
    // Construct data to be used in the message view template
    // this sets the pages title since this view is used for sent messages as well
    var templateData = {
      pageTitle: 'Messages Home',
      // Defines whether its 'to' (for sent messages template) or 'From' for inbox
      messageType: 'From',
      // the time the message was sent's title
      sentTimeTitle: 'Received',
      // Whether to hide message tools or not
      hideTools: false
    };

    // Construct the messages view
    var messageView = new MessageView();
    makeView.viewConstruct(messageView, templateData);

    // Define user ID variable so the database knows which messages to get for which id.
    // We get this from localstorage, where we stored their API key info
    // Which consists of a json array of info about their account.
    var getUserid = localStorage.getItem('apiKey');
    // Parse the json data you received from localstorage
    var parsed = JSON.parse(getUserid);
    // Reference that data to be sent in the request to the db
    var uid = parsed["uid"];

    $.ajax({
      url: './getmessages',
      type: 'GET',
      dataType: "json",
      // Pass in the uid as specified above
      data: { uid: uid },
      success: function(data) {
        console.log('successful! Data loaded: ' + data);

        // if data length is 0, make sure there is a 'no messages' message displayed
        if(data.length === 0) {
          $('<tr><td colspan="5"><p>You currently have no messages</p></td></tr>').appendTo('#message-table tbody');
        }
        
        //console.log(JSON.parse(data));
        var stringIt = JSON.stringify(data);
        var parsed = JSON.parse(stringIt);

        //console.log('string it: ' + stringIt);
        //console.log(parsed[0]);
        
        $(parsed).each(function() {
          var id = this.id;
          var sendto = this.sendto;
          var messagetitle = this.messagetitle;
          var messagebody = this.messagebody;
          var received = this.receiveddate;
          var fromid = this.uid;
          var fromuser = this.usersent;
          var isread = this.isread;

          // if isread has been set to read (change from 0 to 1)
          // define a class to apply to the message td
          // '==' is supposed to be bad, but was the only thing that worked
          if(isread == 1) {
            var isReallyRead = 'isread';
          }
          else {
            var isReallyRead = null;
          }

          var data = {
            messageID: id,
            sendTo: sendto,
            messageTitle: messagetitle,
            messageBody: messagebody,
            receivedDate: received,
            fromUser: fromuser,
            fromID: fromid,
            isRead: isReallyRead
          };

          messageView.renderNewMessage(data);
        });

      },
      error: function(data, data2, data3) {
        console.log('Error: ' + data + ' data 2: ' + data2 + ' data3: ' + data3);
    }
  });

  }

  //This is the message composed, and appended to the view
  var NewMessageView = Backbone.View.extend({
    render: function(data) {
      var template = new EJS({ url: './templates/newmessage.ejs' }).render(data);
      this.$el.html(template);
    }
  });

  // Sent messages page

  function sentMessagesInit() {

    // Construct the data for the Sent Messages page title
    var templateData = {
      pageTitle: 'Sent Messages',
      // Changes where it would say 'from' viewing your inbox
      messageType: 'Sent To',
      sentTimeTitle: 'Sent At',
      // Whether to hide message tools or not
      hideTools: true
    };

    // Construct a new messages view
    var sentMessageView = new MessageView();
    makeView.viewConstruct(sentMessageView, templateData);

    // Define user ID variable so the database knows which messages to get for which id.
    // We get this from localstorage, where we stored their API key info
    // Which consists of a json array of info about their account.
    var getUserid = localStorage.getItem('apiKey');
    // Parse the json data you received from localstorage
    var parsed = JSON.parse(getUserid);
    // Reference that data to be sent in the request to the db
    var uid = parsed["uid"];

    $.ajax({
      url: './getsentmessages',
      type: 'GET',
      dataType: "json",
      // Pass in the uid as specified above
      data: { uid: uid },
      success: function(data) {
        console.log('successful! Data loaded: ' + data);

        // if data length is 0, make sure there is a 'no messages' message displayed
        if(data.length === 0) {
          $('<tr><td colspan="5"><p>You have not sent any messages.</p></td></tr>').appendTo('#message-table tbody');
        }
        
        //console.log(JSON.parse(data));
        var stringIt = JSON.stringify(data);
        var parsed = JSON.parse(stringIt);

        //console.log('string it: ' + stringIt);
        //console.log(parsed[0]);
        
        $(parsed).each(function() {
          var id = this.id;
          // id of the user this was sent to
          var sendto = this.sendto;
          // username of the user the message was sent to
          var sendtoname = this.sendtoname;
          var messagetitle = this.messagetitle;
          var messagebody = this.messagebody;
          var received = this.receiveddate;
          var fromid = this.uid;
          var fromuser = this.usersent;
          var isread = this.isread;

          var data = {
            messageID: id,
            sendToID: sendto,
            sendToUsername: sendtoname,
            messageTitle: messagetitle,
            messageBody: messagebody,
            receivedDate: received,
            fromUser: fromuser,
            fromID: fromid
          };

          sentMessageView.renderNewSentMessage(data);
        });

      },
      error: function(data, data2, data3) {
        console.log('Error: ' + data + ' data 2: ' + data2 + ' data3: ' + data3);
    }
  });
  }

  // Single sent messages view
  // Same as normal single message from above, just different url.

   //Viewing a single sent messages (messages youve sent)
  var SingleSentMessageView = Backbone.View.extend({
    initialize: function() {
    },
    render: function(data) {
      var template = new EJS({ url: './templates/singlesentmessage.ejs' }).render(data);
      this.$el.html(template);
    }
  });


  function singleSentMessage(id) {

    // instantiate a single message view
    var singleSentMess = new SingleSentMessageView();

    // Get the current users userID per their localStorage stored apiKey
    var lstorage = localStorage.getItem('apiKey');
    // Parse it, since its JSON
    var parsed = JSON.parse(lstorage);
    // Extract the user id
    var uid = parsed["uid"];

    $.ajax({
      url: './getsentmessages/' + id,
      type: 'GET',
      data: { uid: uid },
      dataType: "json",
      success: function(data) {
        console.log('successful! Data loaded: ' + data);

        //console.log(JSON.parse(data));
        var stringIt = JSON.stringify(data);
        var parsed = JSON.parse(stringIt);

        //console.log('string it: ' + stringIt);
        //console.log(parsed[0]);
        
        $(parsed).each(function() {
          var id = this.id;
          var sendto = this.sendto;
          var messagetitle = this.messagetitle;
          var messagebody = this.messagebody;
          var received = this.receiveddate;
          var fromid = this.uid;
          var fromuser = this.usersent;

          var data = {
            messageID: id,
            sendTo: sendto,
            messageTitle: messagetitle,
            messageBody: messagebody,
            receivedDate: received,
            fromUser: fromuser,
            fromID: fromid
          };

          // Construct the single message view
          makeView.viewConstruct(singleSentMess, data);
        });

      },
      error: function(data, data2, data3) {
        console.log('Error: ' + data + ' data 2: ' + data2 + ' data3: ' + data3);
    }
  });

  }

  // Compose message page view

  // User hint view is used for the user hint event
  var UserHintView = Backbone.View.extend({
    render: function(data) {
      var template = new EJS({ url: './templates/compose-userlisting.ejs' }).render(data);
      // append this template to the view thats already there
      $('ul.user-list').append(template);
    }
  });

  var ComposeView = Backbone.View.extend({
    render: function(data) {
      var template = new EJS({ url: './templates/composemail.ejs' }).render(data);
      this.$el.html(template);
    },
    events: {
      'keyup input[name="send-to"]': 'showHint',
      'click ul.user-list li': 'fillUser',
      'blur input[name="send-to"]': 'blurInput',
      'submit form': 'formSubmit'
    },
    showHint: function() {

      // Empty out the results list on each keydown
      // So a new list is appended for the newly requested result
      $('ul.user-list').empty();

      // If the inputs value is greater than 0
      if($('input[name="send-to"]').val().length !== 0) {

        // Show the div that would display the user that is being typed out
        $('div.show-users').css('display', 'block');

        // get the value of the send-to upon keydown
        var username = $('input[name="send-to"]').val();

        $.ajax({
          url: './getmatchinguser',
          type: 'GET',
          data: { username: username },
          dataType: 'json',
          success: function(data) {
            //console.log('successful!: ' + data);

            // Stringify it
            var stringify = JSON.stringify(data);
            // Parse it
            var parsed = JSON.parse(stringify);

            // For each of the parsed results, do something
            $(parsed).each(function() {

              var username = this.username;

              var dataSent = {
                username: username
              };

              // Instantiate new user hint view
              var userhint = new UserHintView();
              // Create the new view with the data from the query
              userhint.render(dataSent);

            });

          },
          error: function(data) {
            console.log(data);
          }
        });

        // If there are no matching users, display a message saying so
        // Set timeout so that it doesnt read the value before the query is made
        setTimeout(function() {
          // If a userlisting is not present in the dom
          if($('ul.user-list li.userlisting').length === 0) {
            // append a message stating there are no matching users
            $('ul.user-list').empty().append('<li class="no-users">No users by this username</li>');
          }
          else {
            // If there are matches after this point, remove the previously appended message.
            $('ul.user-list li.no-users').remove();
          }
        }, 1000);

      }
      // if the value is zero, make sure the hint box goes away
      else {
        $('div.show-users').css('display', 'none');
      }
      
    },
    fillUser: function(evt) {
      // Get the value of whatever was cliecked
      var thisValue = $(evt.target).text();

      // If the no users message is present, clear the value
      // return focus to the send-to on an empty value
      // do not let it retun anything else
      if(thisValue === 'No users by this username') {
        // reset the value and focus on the 'send-to' input
        $('input[name="send-to"]').val('').focus();
        // Hide the show-users div
        $('.show-users').css('display', 'none');
        // Do not return anything
        return false;
      }
      else {
        // Put that value into the send-to input field
        // We trim it to cut out any white space that may be surrounding it (it will fuck up the query otherwise)
        $('input[name="send-to"]').val($.trim(thisValue));

        // Close the hint box
        $('.show-users').css('display', 'none');

        // Focus on the message title field
        $('input[name="message-title"]').focus();
      }
    },
    blurInput: function() {
      // $('div.show-users').css('display', 'none');
    },
    formSubmit: function(evt) {

      var sendTo = $('input[name="send-to"]').val();
      var messageTitle = $('input[name="message-title"]').val();
      var messageBody = $('#compose-message textarea').val();

      // Clear any past errors if any at all
      // The validation will create a new one for each time it finds an error
      $('span.error').empty();

      // Get the localStorage user api key info
      var gettingUid = localStorage.getItem('apiKey');
      // Parse it for use;  we really only are needing the uid here (user id)
      var parsed = JSON.parse(gettingUid);
      // Define the user sendings ID
      var uid = parsed["uid"];
      // Define the user sendings username
      var userSent = parsed["username"];

      // Prevent default form submission functionality
      evt.preventDefault();

      // validation since backbone validation is a pain in the ass
      if((sendTo === '') || (messageTitle === '') || (messageBody === '')) {
        $('span.error').append('All fields required. <br/>');
        return false;
      }
      else {

        var message = new MessagesModel();
        var newDate = new Date();

        // Set the message with the messages model setMessage method
        message.setMessage(sendTo, messageTitle, messageBody, newDate, uid, userSent);
        
        // Save the model to the server
        message.save(
        null,
        {
          success: function(data) {
            console.log('successful save!');
            // Display a 'message sent' message to the user
            $('#compose-message').empty().append('<p>Message sent! Thank you..</p>');

            // Navigate to messages view
            // Trigger true makes it GO! ; False just changes the URL; It is false by default.
            setTimeout(function() {
              Backbone.history.navigate('/messages', {trigger: true});
            }, 2000);

          },
          error: function(data, data2, data3) {
            console.log('Error, no message sent! : ' + data);
            // append error message to the error span
            $('span.error').append('Must send to a valid username.');
            return false;
          }
        }
      );

    } //end validation

    }
  });

  // Show the compose page

  function composeInit() {
    // Construct the compose mail view
    var composeView = new ComposeView();
    makeView.viewConstruct(composeView);
  }


  return {
    init: init,
    composeInit: composeInit,
    singleMessView: singleMessView,
    messageIsRead: messageIsRead,
    replyToMessage: replyToMessage,
    sentMessagesInit: sentMessagesInit,
    singleSentMessage: singleSentMessage
 }

});
