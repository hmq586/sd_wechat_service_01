sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/sd/controller/HelloDialog",
	"sap/ui/sd/lib/Wechat"
], function (UIComponent, JSONModel, ResourceModel, HelloDialog, Wechat) {
    "use strict";
    return UIComponent.extend("sap.ui.sd.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            // set data model
            var oData = {
                recipient: {
                    name: "World"
                }
            };
            var oModel = new JSONModel(oData);
            this.setModel(oModel);

            // set i18n model
            var i18nModel = new ResourceModel({
                bundleName: "sap.ui.sd.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");

            // set dialog
            this._helloDialog = new HelloDialog(this.getRootControl());

            this.wechat = new Wechat(this.getRootControl());
            
            // create the views based on the url/hash
            this.getRouter().initialize();

            // init wechat SDK
            this.wechat.initSDK();
		},

		exit : function() {
			this._helloDialog.destroy();
			delete this._helloDialog;
		},

		openHelloDialog : function () {
			this._helloDialog.open();
        }
    });
});