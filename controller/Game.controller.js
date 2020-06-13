sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"mj/toepen/lib/Game"
], function(Controller, formatter, JSONModel, Game) {
	"use strict";

	return Controller.extend("mj.toepen.controller.App", {

		formatter: formatter,
		game: {},

		onInit: function() {
			this.game = new Game(this);
			this.setModel(new JSONModel(this.game), "gameModel");
			
			this.getRouter().getTarget("home").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		},
		
		handleRouteMatched: function() {
			this.openStartGameDialog();
		},

		_getStartGameDialog: function() {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("mj.toepen.view.StartGame", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		
		openStartGameDialog: function() {
			this._getStartGameDialog().open();
		},
	
		startNewGame: function(oEvent, iNumPlayers) {
			this.game.start(iNumPlayers);
			this._getStartGameDialog().close();
			this.redraw();
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
			document.activeElement.blur();
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
		},
		
		/**
		 * Returns the application router
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}

	});
});