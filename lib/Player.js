sap.ui.define([
	"sap/ui/base/Object"
], function(BaseObject) {
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

			// No need to assign if already dead
			if (this.dead) {
				return;
			}

			this.points += iPoints;

			if (this.points >= this.game.maxPoints) {
				this.dead = true;
			}

		},

		toep: function(resolve) {
			if (this.game.lastToeper === this) {
				return this.game.showMessage("You cannot Toep twice in a row");
			}

			this.game.lastToeper = this;

			this.game.showMessage(this.name + " toeps!");

			this.nextPlayer.setJoinToepTurn(this, resolve);
		},

		setJoinToepTurn: function(oToeper, resolve) {

			if (this.folded || this.dead) {

				if (this.nextPlayer === oToeper) {
					return this.game.finishToep(resolve);
				}
				this.nextPlayer.setJoinToepTurn(oToeper, resolve);
				return this.game.oController.redraw();
			}

			setTimeout(function() {

				this.decideJoinToep().then(function(bJoins) {
					if (bJoins) {
						this.game.showMessage(this.name + " joins!");
					} else {

						this.fold();
					}
					if (this.nextPlayer === oToeper) {
						return this.game.finishToep(resolve);
					}

					this.nextPlayer.setJoinToepTurn(oToeper, resolve);
					this.game.oController.redraw();
				}.bind(this));

			}.bind(this), 1200);

		},

		fold: function() {
			this.folded = true;
			this.hand = [];
			this.assignPoints(this.game.stake);

			this.game.showMessage(this.name + " folds!");
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
		},

		hasPlayedCard: function() {
			var aPlayedByMe = this.game.cardsOnBoard.filter(function(oCard) {
				return oCard.playedBy === this;
			}.bind(this));

			return aPlayedByMe.length === 1;
		},
		
		canBeat: function(oCardToBeat) {
			var bCanWin = false;
			this.hand.forEach(function(oCardInHand) {
				if (oCardInHand.beats(oCardToBeat)) {
					bCanWin = true;
				}
			});
			
			return bCanWin;
		},
		
		getHandScore: function() {
			var oTotal = 0;
			this.hand.forEach(function(oCard) {
				oTotal += oCard.getScore();
			});
			
			return oTotal/this.hand.length;
		}

	});
});