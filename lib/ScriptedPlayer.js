sap.ui.define([
	"mj/toepen/lib/AIPlayer"
], function(AIPlayer) {
	"use strict";

	return AIPlayer.extend("mj.toepen.ScriptedPlayer", {
		pickCard: function() {
			var leadingCard = this.game.cardsOnBoard[0];
			var aOptions = this.hand;

			// We get to start
			if (!leadingCard) {
				if (this.hand.length > 2) {
					return this.lowestCard(aOptions);
				} else {
					return this.highestCard(aOptions);
				}
			}


			var aOptions = this.getCardsInHandMatchingSuit(leadingCard.suit);
			
			// If we have no matching card we can play any card.
			if (aOptions.length === 0) {
				aOptions = this.hand;
			}
			
			// If player has no cards matching leading suit, any card is valid
			if (this.canBeat(leadingCard)) {
				return this.highestCard(aOptions);
			}
			
			// If we can't win, just play lowest card
			return this.lowestCard(aOptions);
		},
		
		lowestCard: function(aCards) {
			var oLowestCard = aCards[0];
			aCards.forEach(function(oCard) {
				if (oCard.getRank() < oLowestCard.getRank()) {
					oLowestCard = oCard;
				}
			});
			
			return oLowestCard;
		},

		highestCard: function(aCards) {
			var oHighestCard = aCards[0];
			aCards.forEach(function(oCard) {
				if (oCard.getRank() > oHighestCard.getRank()) {
					oHighestCard = oCard;
				}
			});
			
			return oHighestCard;
		}

	});

});