sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"mj/toepen/model/formatter"
], function(Controller, formatter) {
	"use strict";

	return Controller.extend("mj.toepen.controller.App", {

		formatter: formatter,

		onInit: function () {

		}
	});
});