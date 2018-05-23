/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const cashUrl = '/user/withdraw/dowithdraw';// 用户发起提现操作



Page({

    data:{

        mobile:'',//手机号

        idNumber:'',//份证号

        payPassword:'',//支付密码


    },
    clickCash:function () {

        var that = this;

        var thisCashUrl = app.globalData.URL + cashUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _balance = wx.getStorageSync('balance');

        var _bankCardId = wx.getStorageSync('bankCardId');



        /**
         * 接口：获取账户提现记录
         * 请求方式：GET
         * 接口：/user/withdraw/dowithdraw
         * 入参：bizId,bankCardId,balance,payPassword,code
         * */

        wx.request({

            url: thisCashUrl,

            method: 'GET',

            data: {


                bankCardId: _bankCardId,//银行卡id

                balance: _balance,//提取现金

                payPassword: md5.hexMD5(that.data.payPassword),//短信验证


            },
            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                wx.setStorageSync('orderId',res.data.data);

                if (res.data.code == '0000') {

                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',

                    })

                    wx.redirectTo({

                        url: '../pay_success/pay_success'
                    })

                }

                else {

                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',

                    })
                }

            },


            fail: function (res) {

                console.log(res)

            }

        })


    },



    payPasswordFn:function (e) {

        var that = this;

        that.setData({

            payPassword:e.detail.value,

        })

        
    }



})

