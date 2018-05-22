/**
 * Created by ZHUANGYI on 2018/5/21.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const checkidnumberUrl = '/user/set/checkidnumber';//3、校验身份证号


Page({

    data: {

        userName:'',

        idNumber:'',


    },

    onLoad:function () {

        var that = this;

        var _userName = wx.getStorageSync('userName')

        that.setData({

            userName:_userName,

        })



    },

    checkIdNumberFn:function () {

        var that = this;

        var thisCheckidnumberUrl = app.globalData.URL + checkidnumberUrl;

        var jx_sid = wx.getStorageSync('jxsid');


        var Authorization = wx.getStorageSync('Authorization');

        var _tokenMsg = wx.getStorageSync('tokenMsg');

        console.log(_tokenMsg);

        /**
         * 接口：校验身份证号
         * 请求方式：POST
         * 接口：/user/set/checkidnumber
         * 入参：idNumber,tokenMsg
         * */

        wx.request({

            url: thisCheckidnumberUrl,

            method: 'POST',

            data:json2FormFn.json2Form({

                idNumber: that.data.idNumber,

                tokenMsg:_tokenMsg


            }),

            header: {

                'content-type':'application/x-www-form-urlencoded', // post请求

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                 wx.setStorageSync('tokenMsg',res.data.data.tokenMsg);

                console.log('身份证：'+wx.getStorageSync('tokenMsg'))

                if(res.data.code=='0000'){

                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',

                    })

                    //跳转身份认证
                    wx.navigateTo({

                        url:'../set_payment_psw/set_payment_psw'
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

    idNumberFn:function (e) {

        var that=this;

        that.setData({

            idNumber:e.detail.value

        })

    }


})