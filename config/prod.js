const commonConfig = require('./common');
const prodConfig = Object.assign({}, commonConfig, {
  secret: {
    token: 'wechat123456',
    appid: 'wx27da4d9c25135f8b',
    secret: 'b8a6ac1939347ca5fddc4ebeca204710'
  },
  server: 'https://wechatsd.herokuapp.com/wechat',
  uiServer: 'https://wechatsd.herokuapp.com/sd_wechat_ui-master/',
  sdApi: 'https://ldai1cc2.wdf.sap.corp:50001/sap/opu/odata/sap/API_SALES_ORDER_WITHOUT_CHARGE_SRV/A_SalesOrderWithoutCharge',
  credential: '_SAPI072128:x[MeZU6e[7cdkRk%jse2'
});

module.exports = prodConfig;
