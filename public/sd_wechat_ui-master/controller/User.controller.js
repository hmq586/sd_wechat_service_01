 sap.ui.define([
     'jquery.sap.global',
     'sap/m/MessageBox',
     'sap/m/MessageToast',
     'sap/ui/core/mvc/Controller',
     'sap/ui/model/SimpleType',
     'sap/ui/model/ValidateException',
     'sap/ui/model/json/JSONModel'
 ], function (jQuery, MessageBox, MessageToast, Controller, SimpleType, ValidateException, JSONModel) {
     "use strict";

     return Controller.extend("sap.ui.sd.controller.User", {

         /**
          * Lifecycle hook that is called when the controller is instantiated
          */
         onInit: function () {
             var oView = this.getView();

             var oRouter = this.getOwnerComponent().getRouter();

			 oRouter.getRoute("user").attachMatched(this._onRouteMatched, this);

             oView.setModel(new JSONModel({
                 Code: "",
                 Email: ""
             }));

             // attach handlers for validation errors
             sap.ui.getCore().getMessageManager().registerObject(oView.byId("inputEmail"), true);
             sap.ui.getCore().getMessageManager().registerObject(oView.byId("inputCode"), true);
         },

         _onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
            this.openId = oArgs.openId;
		 },
         /**
          * Event handler for the continue button
          */
         onSubmit: function () {
             // collect input controls
             var oView = this.getView();
             var aInputs = [
                 oView.byId("inputEmail"),
                 oView.byId("inputCode")
             ];
             var bValidationError = false;

             // check that inputs are not empty
             // this does not happen during data binding as this is only triggered by changes
             jQuery.each(aInputs, function (i, oInput) {
                 var oBinding = oInput.getBinding("value");
                 try {
                     oBinding.getType().validateValue(oInput.getValue());
                 } catch (oException) {
                     oInput.setValueState("Error");
                     bValidationError = true;
                 }
             });

             if (aInputs[1].getValue() != '000000') {
                 bValidationError = true;
             }
             // output result
             if (!bValidationError) {
                 MessageToast.show("Request send successfully!");
                 this.doBinding({
                     Email: aInputs[0].getValue(),
                     Code: aInputs[1].getValue(),
                     OpenId: this.openId
                 });
             } else {
                 MessageBox.alert("A validation error has occured. Complete your input first");
             }
         },

         doBinding: function(data) {
            this.getOwnerComponent().wechat.bindUser(data);
            wx.closeWindow();
         },

         /**
          * Custom model type for validating an E-Mail address
          * @class
          * @extends sap.ui.model.SimpleType
          */
         customEMailType: SimpleType.extend("email", {
             formatValue: function (oValue) {
                 return oValue;
             },
             parseValue: function (oValue) {
                 //parsing step takes place before validating step, value could be altered here
                 return oValue;
             },
             validateValue: function (oValue) {
                 // The following Regex is NOT a completely correct one and only used for demonstration purposes.
                 // RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
                 var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                 if (!oValue.match(rexMail)) {
                     throw new ValidateException("'" + oValue + "' is not a valid email address");
                 }
             }
         }),
         //get validation code
         onGetCode: function () {
            var oButton = this.getView().byId('buttonGetCode');

            oButton.setEnabled(false);
            oButton.setText('sending..');
         }
     });
 });