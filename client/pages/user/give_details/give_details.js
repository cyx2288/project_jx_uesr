const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const getDetailRecord ='/user/withdraw/getdetailrecord';//获取详情


Page({

    data: {

        bankName: '11',
        bankNo: '6259000000000011111',
        orderAmount: '100.00',
        orderId: '300118051853218224659805',
        orderState: '3',
        payAmount: '100.00',
        rate:'0',
        rateAmount:'0.00',
        type:'01'
    },


    onLoad:function () {

        var that = this;

        var thisGetDetailRecord = app.globalData.URL + getDetailRecord;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _orderId = wx.getStorageSync('orderId');

        /**
         * 接口：
         * 请求方式：GET
         * 接口：/user/withdraw/getdetailrecord
         * 入参：orderId
         **/
        wx.request({

            url:thisGetDetailRecord,

            method: 'GET',

            data:{

                orderId:_orderId,

            },

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },



            success: function (res) {

                console.log(res.data);


            },

            fail: function (res) {

                console.log(res)

            }

        })






    },


});