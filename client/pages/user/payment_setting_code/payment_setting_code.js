/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const updatepaymode='/user/set/updatepaymode';//设置支付方式


const md5 = require( '../../../static/libs/script/md5.js' );//md5加密






Page({

    data:{

        thisPayMsg:'',//短息验证码

        disabled:true//按钮的状态

    },
    onLoad:function () {

        
        var payMode = wx.getStorageSync('jxPayMode');

        console.log(payMode)


    },

    messageFn:function (e) {

        var that=this;

        //保存输入验证码
        that.setData({

            thisPayMsg:e.detail.value,

            disabled:true

        });

 /*       if(e.detail.value.length==6){


            that.setData({

                disabled:false

            });



        }*/

    },

    buttonCheck:function () {

        var that=this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');



        if(!that.data.thisPayMsg){

            wx.showToast({

                title: '请输入密码',
                icon: 'none',

            })


        }


        else {

            /**
             * 接口：设置支付方式
             * 请求方式：POST
             * 接口：/user/set/getpaymode
             **/

            wx.request({

                url: app.globalData.URL+updatepaymode,

                method: 'POST',

                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                data:json2FormFn.json2Form({

                    msgMode:0,

                    pwdMode:0,

                    payPwd:md5.hexMD5(that.data.thisPayMsg)

                }),

                success: function (res) {

                    if(res.data.code=='0000'){

                        console.log(res.data.msg)

                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000,

                            success:function () {

                                setTimeout(function () {
                                    wx.redirectTo({url:'../payment_setting/payment_setting'})
                                },2000)

                            }
                        })


                    }

                    else {

                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000,

                        })

                    }

                    console.log(res)



                },

                fail: function (res) {

                    console.log(res)
                }

            })



        }


    }



})

