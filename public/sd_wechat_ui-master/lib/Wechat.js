sap.ui.define([
	"sap/ui/base/ManagedObject"
], function (ManagedObject) {
	"use strict";

	return ManagedObject.extend("sap.ui.sd.lib.Wechat", {

		constructor : function (oController) {
            this._server = 'https://wechatsd.herokuapp.com';
			this._oController = oController;
		},

		exit : function () {
			delete this._server;
		},

		initSDK: function () {
			var url = location.href.split('#')[0];
			jQuery.ajax({
				type: 'POST',
				url: this._server + "/sign/wx-config?url=" + url,
				data: { Url: url},
				dataType: 'json',
				success: function (req) {
				 wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: req.appId, // 必填，公众号的唯一标识
					timestamp: req.timestamp, // 必填，生成签名的时间戳
					nonceStr: req.noncestr, // 必填，生成签名的随机串
					signature: req.signature,// 必填，签名
					jsApiList: ['checkJsApi',
								'onMenuShareTimeline',
								'onMenuShareAppMessage',
								'onMenuShareQQ',
								'onMenuShareWeibo',
								'onMenuShareQZone',
								'hideMenuItems',
								'showMenuItems',
								'hideAllNonBaseMenuItem',
								'showAllNonBaseMenuItem',
								'translateVoice',
								'startRecord',
								'stopRecord',
								'onVoiceRecordEnd',
								'playVoice',
								'onVoicePlayEnd',
								'pauseVoice',
								'stopVoice',
								'uploadVoice',
								'downloadVoice',
								'chooseImage',
								'previewImage',
								'uploadImage',
								'downloadImage',
								'getNetworkType',
								'openLocation',
								'getLocation',
								'hideOptionMenu',
								'showOptionMenu',
								'closeWindow',
								'scanQRCode',
								'chooseWXPay',
								'openProductSpecificView',
								'addCard',
								'chooseCard',
								'openCard'] 

				})
			 }
			});
		},

		oAuth: function (code,callback) {
			jQuery.ajax({
				type: 'POST',
				url: this._server + "/sign/open-id",
				data: {Code: code},
				success: function (req) {
					if (!req.errorcode) {
						callback(req);
					}
				},
				dataType: 'json'
			  });
		},

		checkAuth: function (openId, callback) {
			jQuery.ajax({
				type: "POST",
				url: this._server + "/user/check",
				data: { OpenId: openId },
				success: function(req){
					callback(!!req.email);
				},
				dataType: 'json'
			});
		},

		bindUser: function (data) {
			jQuery.ajax({
				type: "POST",
				url: this._server + "/user/bind",
				data: data,
				success: function(req){
					wx.closeWindow();
				},
				dataType: 'json'
			});
		},

		createOrder: function (data) {
			jQuery.ajax({
				type: "POST",
				url: this._server + "/order/create",
				data: data,
				success: function(req){
					wx.closeWindow();
				},
				dataType: 'json'
			});
		}
	});

});