sap.ui.define([
	"sap/ui/base/Object"
], function(BaseObject) {
	"use strict";

	var rankings = ["J", "Q", "K", "A", "7", "8", "9", "10"];
	
	var oScores = {
		"J": 0 ,
		"Q": 0, 
		"K": 0, 
		"A": 0, 
		"7": 1, 
		"8": 2, 
		"9": 4, 
		"10": 8
	};
	
	return BaseObject.extend("mj.toepen.Card", {
	
		value: null,
		suit: null,
		playable: false,
		
		
		/**
		 * @param {string} sType - node type
		 */
		constructor: function(value, suit) {
		
			this.value = value;
			this.suit = suit;
		},
		
		getRank: function () {
			return rankings.indexOf(this.value);
		},
		
		getScore: function() {
			return oScores[this.value];
		},
		
		beats: function(oCard) {
			if (this.suit !== oCard.suit) {
				return false;
			}
			
			return (this.getRank() > oCard.getRank());
		}
		

		
	});
});