const config = require('../config');
const request = require('request');

var getTokenOptions = {
    url: config.sdApi,
    method: "GET",
    json:true,
    headers: {
        "content-type": "application/json",
        'Authorization': 'Basic ' + new Buffer(config.credential).toString('base64'),
        "x-csrf-token" :"fetch"
    }
};

function getToken() {
    return new Promise(function(resolve,reject){
        var requestC = request.defaults({jar: true});
        requestC(getTokenOptions,function(error,response,body){
         var csrfToken = response.headers['x-csrf-token'];
         if(!csrfToken){
            reject({message:"token fetch error"});
            return;
         }
         resolve(csrfToken);
        }); // end of requestC
       });
  }

function _createSalesOrder(token){
return new Promise(function(resolve, reject){
    var oPostData = {
        "SalesOrderWithoutCharge": "",
        "SalesOrderWithoutChargeType": "SD2", 
        "SalesOrganization": "1000",
        "DistributionChannel": "10",
        "OrganizationDivision": "10",
        "SalesGroup": "",
        "SalesOffice": "",
        "SalesDistrict": "000001",
        "SoldToParty": "100003",
        "to_Item": {
            "results": [
            {
                "Material": "H11",
                "RequestedQuantity": "1",
                "RequestedQuantityUnit": "EA",
                "to_ScheduleLine": {
                    "results": [
                    {
                    "ScheduleLine": "1",
                    "OrderQuantityUnit": "EA",
                    "ConfdOrderQtyByMatlAvailCheck": "1",
                    "DeliveredQtyInOrderQtyUnit": "1",
                    "OpenConfdDelivQtyInOrdQtyUnit": "1",
                    "DelivBlockReasonForSchedLine": ""
                    }
                ]
                }
            }
            ]
        }
        } ;
    var requestC = request.defaults({jar: true});
    var createOptions = {
            url: config.sdApi,
            method: "POST",
            json:true,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': token
            },
            body:oPostData
    };
    
    requestC(createOptions,function(error,response,data){
        if(error){
            reject(error.message);
        }else {
            resolve(data);
        }
    });// end of requestC
}); 
}

module.exports = function createSales(){
    getToken().then(function(token) {
    console.log("token received: " + token);
    _createSalesOrder(token).then(function(data){
      var message = "Sales order created: " + data.entry.content.properties.SalesOrderWithoutCharge;
      console.log(message);
      resolve(message);
    });
  });
  };