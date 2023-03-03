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
			var iProbability;
			// Never toep over the max
			if (this.points + this.game.stake > this.game.maxPoints) {
				return false;
			}

			var oBestCard = this.game.getBestCard();

			// No card played yet
			if (!oBestCard && this.hand.length < 3) {
				iProbability = this.getHandScore() * 12;

			// Card played, but we can beat it
			} else if (this.canBeat(oBestCard)) {
				if (this.hand.length === 1) {
					iProbability = 100;
				} else if (this.hand.length === 2) {
					iProbability = 40;
				} else {
					iProbability = 10;
				}
			// Card played, we cannot beat it
			} else {
				iProbability = 2;
			}

			var iRandom = Math.floor(Math.random() * 100);

			return iProbability >= iRandom;
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
				var oBestCard = this.game.getBestCard();
				var iProbability;

				// Never fold if currently played highest card
				if (oBestCard && oBestCard.playedBy === this) {
					return resolutionFunc(true);
				}

				// Never die by folding
				if (this.points + this.game.stake > this.game.maxPoints) {
					return resolutionFunc(true);
				}

				// No card played yet
				if (!this.hasPlayedCard()) {
					if (oBestCard && this.canBeat(oBestCard)) {
						iProbability = 90;
					} else {
						if (this.hand.length === 1) {
							iProbability = 0;
						} else {
							iProbability = 30 + (40 * this.getHandScore());
						}
					}
				// Already played a card
				} else {
					if (this.hand.length === 0) {
						iProbability = 0;
					} else {
						iProbability = 30 + (40 * this.getHandScore());
					}
				}
				
				var iRandom = Math.floor(Math.random() * 100);

				resolutionFunc(iProbability > iRandom);
			}.bind(this));

		}

	});
});