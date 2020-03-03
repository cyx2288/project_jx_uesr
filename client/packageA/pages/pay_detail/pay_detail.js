
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const radixPointFn = require('../../../static/libs/script/radixPoint');//ajax请求

const detailUrl = '/user/withdraw/getdetailrecord';

Page({
    
    data: {
        
        orderType: '',
        
        orderState: '',
        
        orderAmount: '',
        
        payAmount: '',
        
        payType: '',
        
        createData: '',
        
        orderId: '',
        
        itemName: '',
        
        mobileNumber: '',
        
        faceValue: '',
        
        cardNo: '',

        userName: '',

        mobile: '',

        refundTotal: '',

        voucher: ''
        
    },
    
    onShow: function () {
        
        var that = this;

        var ajaxCount = 1;

        var transferUrl = app.globalData.URL + detailUrl;

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _orderId = wx.getStorageSync('orderId');

        var _orderType = wx.getStorageSync('orderType');

        var _mobile = wx.getStorageSync('transferMobile');
        that.setData({

            orderType:_orderType,

            orderId: _orderId


        });

        /**
         * 接口：获取账户订单记录详情
         * 请求方式：GET
         * 接口：/user/withdraw/getdetailrecord
         * 入参：orderId
         **/
        wx.request({

            url: transferUrl,

            method: 'GET',

            data: {

                orderId: _orderId,

                orderType:_orderType,


            },

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },


            success: function (res) {

                console.log(res.data);


                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)

                if(res.data.code=='3001') {

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)


                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else {

                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();

                    var _userName = wx.getStorageSync('userName');

                    var _mobile = wx.getStorageSync('mobile');

                    var errorMsg = '';


                    if(res.data.data.errorMsg){

                        errorMsg =  res.data.data.errorMsg

                    }

                    var itemName = '';

                    var mobileNumber = '';

                    var faceValue = '';

                    var cardNo = '';

                    var refundTotal = '';

                    var voucher = '';

                    res.data.data.itemName && (itemName = res.data.data.itemName);

                    res.data.data.mobileNumber && (mobileNumber = res.data.data.mobileNumber);

                    res.data.data.faceValue && (faceValue = res.data.data.faceValue);

                    res.data.data.cardNo && (cardNo = res.data.data.cardNo);

                    res.data.data.refundTotal && (refundTotal = res.data.data.refundTotal);

                    res.data.data.orderRemark && (itemName = res.data.data.orderRemark);

                    res.data.data.b_amount && (voucher = res.data.data.b_amount);

                    that.setData({

                        orderAmount:  res.data.data.orderAmount,

                        orderState: res.data.data.orderState,

                        payAmount: res.data.data.payAmount,

                        createDate: res.data.data.createDate,

                        payType: res.data.data.payType,

                        errorMsg: errorMsg,

                        itemName: itemName,

                        mobileNumber: mobileNumber,

                        faceValue: faceValue,

                        cardNo: cardNo,

                        userName:_userName,

                        mobile: _mobile,

                        refundTotal: refundTotal,

                        voucher: voucher,

                    });

                }


            },

            fail: function (res) {

                console.log(res)

            }

        })
        
    }
    
});