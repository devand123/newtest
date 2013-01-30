//Messages.js

define([
  "jquery",
],

function($) {

  // This should be called from the initialize method of whatever view wants to
  // mark their tab as active upon initializing.
  // (this makes it safe so that if the page is loaded, and the link isnt clicked,
  // it will still reflect an active status)
  var markActive = function(linkName) {

    // if any active elements currently
    var currentActive = $('.nav li.active');

    //remove their active state
    $(currentActive).removeClass('active');

    // match the nav link with the supplied link name per the function call
    var tab = $('.nav li a[href="' + linkName + '"]').not('.user-options li a').parent();

    // give the new link requesting the active state, the active class
    $(tab).addClass('active');
  }

  var removeState = function(page) {
    var linkToRemove = $('.nav li a[href="' + page + '"]').parent();
    $(linkToRemove).removeClass('active');
  }

  return {
    markActive: markActive,
    removeState: removeState
  }

});
