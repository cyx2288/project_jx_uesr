const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const getDetailRecord ='/user/withdraw/getdetailrecord';//获取详情



Page({

    data: {

        bankName: '',
        bankNo: '',
        orderAmount: '',
        orderId: '',
        orderState: '',
        payAmount: '',
        rate:'',
        rateAmount:'',
        type:''
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

                that.setData({

                    bankName: res.data.data.bankName,

                    bankNo: res.data.data.bankNo,

                    orderAmount: res.data.data.orderAmount,

                    orderState: res.data.data.orderState,

                    orderId: res.data.data.orderId,

                    payAmount: res.data.data.payAmount,

                    rate:res.data.data.rate,

                    rateAmount:res.data.data.rateAmount,


                })


            },

            fail: function (res) {

                console.log(res)

            }

        })






    },


});