sap.ui.define([
	"mj/toepen/lib/Player"
], function(Player) {
	"use strict";

	return Player.extend("mj.toepen.AIPlayer", {

		currentTurn: false,
		icon: "sap-icon://it-host",
		
		/**
		 * @param {string} sType - node type
		 */
		constructor: function() {

		},
		
		setCurrentTurn: function() {
			this.currentTurn = true;
			
			var iRandomDelay = Math.floor(Math.random() * 1000) + 1500;
			
			setTimeout(function(){
				this.playCard(this.pickCard());  
			}.bind(this), iRandomDelay);
		},
		
		pickCard: function() {
			var leadingCard = this.game.cardsOnBoard[0];
			var aOptions = this.hand;
			
			// if there is a leading card we should try to follow it
			if (leadingCard) {
				var aOptions = this.getCardsInHandMatchingSuit(leadingCard.suit);
			}
			
			// If player has no cards matching leading suit, any card is valid
			if (aOptions.length === 0) {
				aOptions = this.hand;
			}
			
			var index = Math.floor(Math.random() * aOptions.length);
			// Pick random card from optons
			return aOptions[index];
		}
		
		
		
	});
});