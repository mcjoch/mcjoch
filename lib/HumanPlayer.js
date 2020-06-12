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
			this.currentTurn = true;
		}

	});
});