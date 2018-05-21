
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const billUrl ='/user/withdraw/getsimplerecord';//我的账单的url




Page({

    data:{

        billList:[],

        orderId:'',

    },

    onLoad:function () {

        var thisBillUrl = app.globalData.URL + billUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：获取账户提现记录
         * 请求方式：GET
         * 接口：/user/withdraw/getsimplerecord
         * 入参：null
         **/
        wx.request({

            url: thisBillUrl,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                that.setData({

                    billList:res.data.data.list,



                })



            },

            fail: function (res) {

                console.log(res)

            }

        })






    },

    clickBill:function (e) {

        var that = this;

        that.setData({

            orderId:e.currentTarget.dataset.no,
        })

        console.log(e.currentTarget)

        wx.navigateTo({

            url: '../give_details/give_details'

        })

        wx.setStorageSync('orderId',that.data.orderId)



    }




});