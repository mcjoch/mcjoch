sap.ui.define([
	"mj/toepen/lib/Player",
	'sap/m/MessageToast'
], function(Player, MessageToast) {
	"use strict";

	return Player.extend("mj.toepen.AIPlayer", {

		currentTurn: false,
		icon: "sap-icon://it-host",

		/**
		 * @param {string} sType - node type
		 */
		constructor: function() {

		},

		setCurrentWinner: function(bWinner) {
			this.currentWinner = bWinner;
		},

		setCurrentTurn: function() {

			if (this.dead || this.folded) {
				return this.nextPlayer.setCurrentTurn();
			}

			this.currentTurn = true;

			var iRandomDelay = Math.floor(Math.random() * 1000) + 1000;

			setTimeout(function() {
				this.playCard(this.pickCard());
			}.bind(this), iRandomDelay);
		},

		decideJoinToep: function(oToeper) {
			
			
			setTimeout(function() {
				var iProbability = Math.floor(Math.random() * 100);

				if (this.folded) {
					MessageToast.show(this.name + " already folded!");
				} else if (iProbability > 60) {
					this.fold();
				} else {
					MessageToast.show(this.name + " joins!");
				}

				if (this.nextPlayer === oToeper) {
					return this.game.finishToep();
				}

				this.nextPlayer.decideJoinToep(oToeper);
				this.game.oController.redraw();
				
			}.bind(this), 1200);

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