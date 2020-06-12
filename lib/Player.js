sap.ui.define([
	"sap/ui/base/Object"
], function(BaseObject) {
	"use strict";

	return BaseObject.extend("mj.toepen.Player", {

		hand: null,
		game: {},
		nextPlayer: null,
		name: "",

		/**
		 * @param {string} sType - node type
		 */
		init: function(oGame) {
			this.game = oGame;
			this.hand = [];
		},

		playCard: function(oCard) {
			oCard.playedBy = this;
			
			if (!this.legalPlay(oCard)) {
				return;
			}

			this.hand = this.hand.filter(function(filteredCard) {
				return filteredCard !== oCard;
			});
			
			this.currentTurn = false;
			this.game.playCard(oCard);
		},
		
		legalPlay: function(oCard) {
			var leadingCard = this.game.cardsOnBoard[0];
			
			if (!leadingCard) {
				return true;
			}
			
			if (leadingCard.suit === oCard.suit) {
				return true;
			}
			
			return this.getCardsInHandMatchingSuit(leadingCard.suit).length === 0;
		},
		
		getCardsInHandMatchingSuit: function(sSuit) {
			return this.hand.filter(function(filteredCard) {
				return filteredCard.suit === sSuit;
			});
		},
		
		setName: function(sName) {
			this.name = sName;
		},
		
		setNextPlayer: function(oPlayer) {
			this.nextPlayer = oPlayer;
		},
		
		
		getNextPlayer: function() {
			return this.nextPlayer;
		}
		
		
		
	

	});
});