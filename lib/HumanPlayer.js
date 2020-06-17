sap.ui.define([
	"mj/toepen/lib/Player"
], function(Player) {
	"use strict";

	return Player.extend("mj.toepen.AIPlayer", {

		currentTurn: false,
		icon: "sap-icon://customer",

		/**
		 * @param {string} sType - node type
		 */
		constructor: function() {
			this.name = "Player";
			this.human = true;
		},

		setCurrentTurn: function() {
			if (this.dead || this.folded) {
				return this.nextPlayer.setCurrentTurn();
			}

			this.hand.forEach(function(oCard) {
				oCard.playable = this.legalPlay(oCard);
			}.bind(this));

			this.currentTurn = true;
		},

		setCurrentWinner: function(bWinner) {
			this.currentWinner = bWinner;
		},

		decideJoinToep: function(oToeper) {

			if (this.nextPlayer === oToeper) {
				this.game.toepInProgress = false;
				this.game.stake += 1;
				return this.game.oController.redraw();
			}

			this.nextPlayer.decideJoinToep();
		}

	});
});