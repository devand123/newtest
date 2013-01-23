// allForms.js
// For universal form functions

define([
  "jquery",
  "lodash",
  "backbone",
],

function($, _, Backbone, hashchange) {

	//fuck around with this bitch later
	var formsView = Backbone.View.extend({
		tagName: 'form',
		events: {
			"click label": "focusinput"
		},
		focusinput: function() {
			var labelName = $('label').attr('for');
			$('input[name="' + labelName + '"]').focus();
		}
	});

  function labelFocus(formName) {
    // Get id of the passed in form
    var formID = $(formName).attr('id');
    // Create a selector for that form's labels
    var theSelector = '#' + formID + ' label';

    // On the click of that forms labels
    $(theSelector).on("click", function(evt) {

      var labelName = $(this).attr('for');
      //var inputName = $(this).attr('name');
      var input = $('input[name="' + labelName + '"]');

      $(input).focus();
      
    });
  }

  function init(formName) {

      $(document).ready(function() {
          labelFocus(formName);
        });

      $(window).hashchange(function() {
          labelFocus(formName);
      });

  }

  return {
    init: init
 }

});
