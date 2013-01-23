define([
  "jquery",
  "lodash",
  "backbone",
  "models/messages"
],

function($, _, Backbone, MessagesModel) {

	// Collection for Messages Model

	var MessagesCollection = Backbone.Collection.extend({
		model: MessagesModel
	});

	return MessagesCollection;

});
