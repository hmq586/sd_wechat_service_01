sap.ui.define([
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/SimpleType',
    'sap/ui/model/ValidateException',
    'sap/ui/model/json/JSONModel'
], function (MessageBox, MessageToast, Controller, SimpleType, ValidateException, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.sd.controller.Create", {
        onInit: function () {
             var oRouter = this.getOwnerComponent().getRouter();
			 oRouter.getRoute("create").attachMatched(this._onRouteMatched, this);
        },
        
        handleValueHelp : function (oController) {
            this.inputId = oController.oSource.sId;
            // create value help dialog
            if (!this._valueHelpDialog) {
                this._valueHelpDialog = sap.ui.xmlfragment(
                    "sap.ui.sd.view.OrderType",
                    this
                );
                this.getView().addDependent(this._valueHelpDialog);
            }

            // open value help dialog
            this._valueHelpDialog.open();
        },

        _onRouteMatched : function (oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
            this.openId = oArgs.openId;
            this.getOwnerComponent().wechat.checkAuth(this.openId, function(auth) {
                if (!auth) {
                    var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                    var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                    MessageBox.warning(
                        "You have no anthorization to create sales order, please do request first.",
                        {
                            actions: [sap.m.MessageBox.Action.CLOSE],
                            styleClass: bCompact ? "sapUiSizeCompact" : "",
                            onClose: function(sAction) {
                                wx.closeWindow();
                            }
                        }
                    );
                }
            }.bind(this));
		 },

        handleCustomerHelp: function(oController) {
            this.inputId = oController.oSource.sId;
            // create value help dialog
            if (!this._CustomerDialog) {
                this._CustomerDialog = sap.ui.xmlfragment(
                    "sap.ui.sd.view.Customer",
                    this
                );
                this.getView().addDependent(this._CustomerDialog);
            }

            // open value help dialog
            this._CustomerDialog.open();
        },

        onSubmit: function() {
            var oView = this.getView();
            var bValidationError = false;

            var OrderType = oView.byId('inputOrderType');
            var SoldToParty = oView.byId('inputSoldToParty');
            var ShipToParty = oView.byId('inputShipToParty');
            var CusReference = oView.byId('inputCusRef');
            var CusReferenceDate = oView.byId('inputCusRefDate');

            var values = [OrderType,SoldToParty,ShipToParty,CusReference,CusReferenceDate];

            jQuery.each(values, function (i, oInput) {
                var v = oInput.getValue();
                if (v && v.length > 0) {
                    
                }else{
                    oInput.setValueState("Error");
                    bValidationError = true;
                }
            });

            if (!bValidationError) {
                MessageToast.show("Sales order created successfully!");
                this.getOwnerComponent().wechat.createOrder({
                    "OpenId": this.openId,
                    "OrderType": OrderType.getValue(),
                    "SoldToParty": SoldToParty.getValue(),
                    "ShipToParty": ShipToParty.getValue(),
                    "CusReference": CusReference.getValue(),
                    "CusReferenceDate": CusReferenceDate.getValue()
                });
                wx.closeWindow();
            } else {
                MessageBox.alert("A validation error has occured. Complete your input first");
            }
        },

        _handleValueHelpSearch : function (evt) {
            var sValue = evt.getParameter("value");
            var oFilter = new Filter(
                "Name",
                sap.ui.model.FilterOperator.Contains, sValue
            );
            evt.getSource().getBinding("items").filter([oFilter]);
        },

        _handleValueHelpClose : function (evt) {
            var oSelectedItem = evt.getParameter("selectedItem");
            if (oSelectedItem) {
                var productInput = this.byId(this.inputId);
                productInput.setValue(oSelectedItem.getTitle());
            }
            evt.getSource().getBinding("items").filter([]);
        }
    });
 });