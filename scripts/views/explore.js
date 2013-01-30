//Registration.js

define([
  "jquery",
  "lodash",
  "backbone",
  "ejs",
  "views/makeview",
  "logincheck",
  "models/users",
  "navtracker"
],

// get users by last logged in date/time limit 25 -- grab the 25th user's id
// then for next page: get users by last logged in date/time limit 25 after last users stored id
function($, _, Backbone, EJS, makeView, loginCheck, Users, navTracker) {

  EJS = window.EJS;

  var ExploreView = Backbone.View.extend({
    initialize: function() {
      navTracker.markActive('#explore');

      _.bindAll(this, 'scrollDetect');
      $(window).on('scroll', this.scrollDetect);
    },
    render: function(data) {
      var template = new EJS({ url: './templates/explore.ejs' }).render(data);
      this.$el.html(template);
    },
    renderSubView: function(data) {
      var template = new EJS({ url: './templates/exploresingle.ejs' }).render(data);
      $(template).appendTo('#explore-page');
    },
    onClose: function() {
      //unbind the events on scroll so other pages dont look for this pages items
      $(window).unbind('scroll', this.scrollDetect);

      //remove the navs active state
      navTracker.removeState('#explore');
    },
    scrollDetect: function() {
      // to control the flow
      var throttled = _.throttle(this.getMoreUsers, 1000);
      // call it, which calls the below getMoreUsers function
      throttled();
    },
    getMoreUsers: function() {
      // The top of the window, plus the height of the window
      var theTop = $(window).scrollTop() + $(window).height();
      // the user-row div
      var userRow = $('.user-row');
      // the last user-row div on the page (-1 = last, -5 is 5th up from last)
      // update when the top of the screen + the screen height reaches the top of
      // the last row div
      var lastRow = userRow.eq(-1).offset().top;

      // The id specified with the last .user-row result hidden id input
      var theID = $('.user-row input[name="user-id"]').last().val();

      // If the top of the page + the height of the window has reached the top of
      // the last user-row div, make an ajax call for more users to be displayed
      // then display then with the exploreSubView function above
      if(theTop > lastRow) {
            $.ajax({
              url: './getusersagain',
              type: 'GET',
              dataType: "json",
              data: { id: theID },
              success: function(data) {
                // if there is no data, return false!
                if(data.length === 0) {
                  // if there is no data, just return
                  console.log('no data!');
                  return;
                }
                else {
                  var stringify = JSON.stringify(data);
                  var parsed = JSON.parse(stringify);
                  // build the new explore sub views
                  // send in the parsed data for use in the exploreSubView function above
                  exploreSubView(parsed);

                }

              },
              error: function(data) {
                console.log('error happened ' + data);
              }
          });
        }
    }
  });

  var SingleExplore = Backbone.View.extend({
    render: function(data) {
      var template = new EJS({ url: './templates/exploresingle.ejs' }).render(data);
      $('#explore-page').append(template);
    }
  });

  function exploreSubView(parsedData) {

    // just instantiate a new explore view?
    var newExploreView = new SingleExplore();

    $(parsedData).each(function() {
        var id = this.id;
        var username = this.username;
        var email = this.email;
        var profile = this.profile;

        var exploreData = {
          username: username,
          email: email,
          userType: profile,
          userID: id
        };

      // then use that view just for its sub views?
      newExploreView.render(exploreData);

    });
  }

  function buildExploreView(parsedData) {

    var exploreview = new ExploreView();
    makeView.viewConstruct(exploreview);

    $(parsedData).each(function() {
        var id = this.id;
        var username = this.username;
        var email = this.email;
        var profile = this.profile;

        var exploreData = {
          username: username,
          email: email,
          userType: profile,
          userID: id
        };

        exploreview.renderSubView(exploreData);

      });
  }

  function init() {

    // get the users in the database to add to the userlist object below, which is passed to the explore page
    // view template as data to be rendered.
    $.ajax({
            url: './getusers',
            type: 'GET',
            dataType: "json",
            success: function(data) {

              var stringify = JSON.stringify(data);
              var parsed = JSON.parse(stringify);

              buildExploreView(parsed);

            },
            error: function(data) {
              console.log('error happened' + data);
            }
        });

  }


  return {
    init: init
 };

});
