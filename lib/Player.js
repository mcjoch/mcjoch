sap.ui.define([
	"sap/ui/base/Object",
	'sap/m/MessageToast'
], function(BaseObject, MessageToast) {
	"use strict";

	return BaseObject.extend("mj.toepen.Player", {

		hand: null,
		game: {},
		nextPlayer: null,
		name: "",
		points: 0,
		folded: false,

		/**
		 * @param {string} sType - node type
		 */
		init: function(oGame) {
			this.game = oGame;
			this.hand = [];
		},

		assignPoints: function(iPoints) {
			this.points += iPoints;

			if (this.points >= this.game.maxPoints) {
				this.dead = true;
			}
		},
		
		toep: function() {
			if (this.game.lastToeper === this) {
				return MessageToast.show("You cannot Toep twice in a row");
			}
			
			this.game.lastToeper = this;
			
			MessageToast.show(this.name + " toeps!");
			
			this.nextPlayer.decideJoinToep(this);
		},
		
		fold: function() {
			this.folded = true;
			this.hand = [];
			this.assignPoints(this.game.stake);
			
			MessageToast.show(this.name + " folds!");
		},

		playCard: function(oCard) {
			oCard.playedBy = this;

			if (!this.legalPlay(oCard)) {
				return;
			}

			this.hand = this.hand.filter(function(filteredCard) {
				return filteredCard !== oCard;
			});

			this.endTurn();

			this.game.playCard(oCard);
		},

		endTurn: function() {
			this.currentTurn = false;

			this.hand.forEach(function(oCard) {
				oCard.playable = false;
			}.bind(this));
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