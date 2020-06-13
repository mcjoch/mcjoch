sap.ui.define([
	"sap/ui/core/Control"
], function(Control) {
	"use strict";
	return Control.extend("mj.toepen.controls.Card", {
		metadata: {

			properties: {
				value: {
					type: "string"
				},
				suit: {
					type: "string"
				},
				won: {
					type: "boolean"
				},
				active: {
					type: "boolean",
					defaultValue: true
				}
			},

			events: {
				"select": {}
			},

			dnd: {
				draggable: true,
				droppable: false
			}

		},
		init: function() {

		},

		onclick: function(evt) {
			this.fireSelect();
		},

		getSymbol: function() {
			switch (this.getSuit()) {
				case "hearts":
					return "♥";
				case "clubs":
					return "♣";
				case "diamonds":
					return "♦";
				case "spades":
					return "♠";
			}

		},

		getColor: function() {
			switch (this.getSuit()) {
				case "hearts":
				case "diamonds":
					return "red";
				case "clubs":
				case "spades":
					return "black";
			}

		},

		renderer: function(oRm, oControl) {
			oRm.openStart("div", oControl);
			oRm.writeControlData(oControl);
			oRm.class("card");
			if (oControl.getWon()) {
				oRm.class("winner");
			}
			
			if (!oControl.getActive()) {
				oRm.class("inactive");
			}
			
			oRm.class(oControl.getColor());
			oRm.openEnd();

			oRm.text(oControl.getValue());
			oRm.write("<br>");

			oRm.openStart("div", oControl);
			oRm.class("symbol");
			oRm.openEnd();
			oRm.text(oControl.getSymbol());
			oRm.close("div");

			oRm.close("div");
		}

	});
});