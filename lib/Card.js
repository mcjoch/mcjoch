sap.ui.define([
	"sap/ui/base/Object"
], function(BaseObject) {
	"use strict";

	var rankings = ["J", "Q", "K", "A", "7", "8", "9", "10"];
	
	return BaseObject.extend("mj.toepen.Card", {
	
		value: null,
		suit: null,
		
		
		/**
		 * @param {string} sType - node type
		 */
		constructor: function(value, suit) {
		
			this.value = value;
			this.suit = suit;
		},
		
		getRank: function () {
			return rankings.indexOf(this.value);
		}
		

		
	});
});