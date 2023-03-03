sap.ui.define([
	"mj/toepen/lib/Player",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function(Player, Dialog, Button, Text) {
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

		decideJoinToep: function() {
			return new Promise(function(resolve) {

				var oDialog = new Dialog({
					title: this.game.lastToeper.name + ' Toeps!',
					type: 'Message',
					content: new Text({
						text: 'Do you want to join?'
					}),
					beginButton: new Button({
						type: "Accept",
						text: 'Join',
						press: function() {
							resolve(true);
							oDialog.close();
						}
					}),
					endButton: new Button({
						type: "Reject",
						text: 'Fold',
						press: function() {
							resolve(false);
							oDialog.close();
						}
					}),
					afterClose: function() {
						oDialog.destroy();
					}
				});

				oDialog.open();
			}.bind(this));

		}

	});
});