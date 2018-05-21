/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const  paymsgUrl = '/jx/action/paymsg';//1、设置支付密码 onload调用

const checkpaypwdcodeUrl = '/user/set/checkpaypwdcode';//2、校验支付密码验证码

const checkidnumberUrl = '/user/set/checkidnumber';//校验身份证号







Page({

    data:{

        mobile:'',//手机号

        last_time:'',//倒计时

        idNumber:'',//份证号

        tokenMsg:'',//验证码标识

        code:'',//验证码


    },
    onLoad:function () {


        var thisPaymsgUrl= app.globalData.URL+paymsgUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _mobile = wx.getStorageSync('mobile');

        var countdown = 60;

        that.setData({

            mobile:_mobile,

        });

        settime(that);

        function settime(that) {

            if (countdown < 0) {

                countdown = 60;

                return;

            } else {

                that.setData({

                    last_time:countdown

                });

                countdown--;
            }
            setTimeout(function () {
                    settime(that)
                }
                , 1000)


        }

        /**
         * 接口：校验支付密码验证码
         * 请求方式：GET
         * 接口：设置支付密码
         * 入参：code
         * */

        wx.request({

            url: thisPaymsgUrl,

            method: 'GET',

            data:{

                code:that.data.code,


            },
            header:{

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                if(res.data.code=='0000'){

                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',
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

    codeUrlFn:function () {

        var thisCheckpaypwdcodeUrl= app.globalData.URL+checkpaypwdcodeUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：校验支付密码验证码
         * 请求方式：POST
         * 接口：/user/set/checkpaypwdcode
         * 入参：code
         * */

        wx.request({

            url: thisCheckpaypwdcodeUrl,

            method: 'POST',

            data:json2FormFn.json2Form({

                code:that.data.code

            }),

            header:{

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                if(res.data.data.code=='0000'){



                }
                else {


                }

            },


            fail: function (res) {

                console.log(res)

            }

        })

    },
    
    codeFn:function (e) {

        var that = this;

        that.setData({

            code:e.detail.value,

        })
        
    }



})

