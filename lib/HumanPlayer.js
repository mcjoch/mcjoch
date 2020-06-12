sap.ui.define([
	"mj/toepen/lib/Player"
], function(Player) {
	"use strict";

	return Player.extend("mj.toepen.AIPlayer", {

		currentTurn: false,
		
		/**
		 * @param {string} sType - node type
		 */
		constructor: function() {
			this.name = "Player";
		},
		
		setCurrentTurn: function() {
			this.currentTurn = true;
		}

	});
});