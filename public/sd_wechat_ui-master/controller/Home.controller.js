sap.ui.define([
    "sap/ui/core/mvc/Controller"
 ], function (Controller, Wechat) {
    "use strict";
 
    return Controller.extend("sap.ui.sd.controller.Home", {
        onInit: function() {
           this.code = this.getUrlParam('code');
           this.state = this.getUrlParam('state');
           this.getOwnerComponent().wechat.oAuth(this.code, this._handleNextStep.bind(this));
        },

         getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);  
            if (r != null) return unescape(r[2]); return null;
        },

        _handleNextStep: function (body) {
           this.wechatConfig = body;
           var oRouter = this.getOwnerComponent().getRouter();
           if (this.state === 'create') {
             oRouter.navTo("create",{
				openId: this.wechatConfig.openid
             });
           } else {
             oRouter.navTo("user",{
				openId: this.wechatConfig.openid
             });
           }
        }
    });
 
 });