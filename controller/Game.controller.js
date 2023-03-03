sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"mj/toepen/lib/Game",
	"sap/ui/core/Fragment"
], function(Controller, formatter, JSONModel, Game, Fragment) {
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
		
		onToep: function(oEvent) {
			if (!this.game.player.toep()) {
				return;
			}
		},

		openStartGameDialog: function() {
			if (!this._oDialog) {
				Fragment.load({
					id: this.getView().getId(),
					name: "mj.toepen.view.StartGame",
					type: "XML",
					controller: this
				}).then(function(oDialog) {
					this._oDialog = oDialog;
					this.getView().addDependent(this._oDialog);
					this._oDialog.open();
				}.bind(this));
			} else {
				this._oDialog.open();
			}
			
		},

		howToPlay: function() {
			window.open("https://gamerules.com/rules/toepen-card-game/", '_blank');	
		},

		startNewGame: function(oEvent) {
			var iNumPlayers = Number(this.getView().byId("numPlayersButton").getSelectedKey());
			var iNumPoints = Number(this.getView().byId("numPointsButton").getSelectedKey());

			this.game.start(iNumPlayers, iNumPoints);
			this._oDialog.close();
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