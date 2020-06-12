sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"mj/toepen/lib/Game"
], function(Controller, formatter, JSONModel, Game) {
	"use strict";

	return Controller.extend("mj.toepen.controller.App", {

		formatter: formatter,

		onInit: function () {
			this.game = new Game(this, 4);
			this.setModel(new JSONModel(this.game), "gameModel");
		},
		
		selectCard: function(oEvent) {
			
			// Don't play card outside turn
			if (!this.game.player.currentTurn) {
				return;
			}
			
			var oSelectedCard = oEvent.getSource().getBindingContext("gameModel").getObject();
			
			this.game.player.playCard(oSelectedCard);
		},
		
		redraw: function() {
			this.getModel("gameModel").updateBindings();
		},
	
		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},
		
		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		}

	});
});