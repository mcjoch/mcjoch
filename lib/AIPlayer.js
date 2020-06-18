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

			this.toepTurnFinished = this.chanceToToep();

			this.toepTurnFinished.then(function() {
				var iRandomDelay = Math.floor(Math.random() * 1000) + 1000;

				setTimeout(function() {
					this.playCard(this.pickCard());
				}.bind(this), iRandomDelay);
			}.bind(this));

		},

		chanceToToep: function() {
			return new Promise(function(resolve) {
				if (this.game.lastToeper !== this && this.decidesToToep()) {
					this.toep(resolve);
				} else {
					resolve();
				}
			}.bind(this));

		},

		decidesToToep: function() {
			var iProbability = Math.floor(Math.random() * 100);

			return iProbability >= 90;
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
		},

		decideJoinToep: function() {
			return new Promise(function(resolutionFunc) {
				var iProbability = Math.floor(Math.random() * 100);

				resolutionFunc(iProbability > 70);
			}.bind(this));

		}

	});
});