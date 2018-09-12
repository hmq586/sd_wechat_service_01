sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
 ], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.sd.controller.App", {
        onOpenDialog : function () {
			this.getOwnerComponent().openHelloDialog();
		}
    });
 });