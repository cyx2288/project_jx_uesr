/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const  paymsgUrl = '/jx/action/paymsg';//1、设置支付密码 onload调用

const checkpaypwdcodeUrl = '/user/set/checkpaypwdcode';//2、校验支付密码验证码



Page({

    data:{

        mobile:'',//手机号

        last_time:'',//倒计时

        idNumber:'',//份证号

        tokenMsg:'',//验证码标识

        code:'',//验证码

        disabled:true,//按钮的可点击

        locked:1//0为锁住 1为解锁


    },
    onLoad:function () {

        var thisPaymsgUrl= app.globalData.URL+paymsgUrl;

        var that = this;

        //有几个ajax请求
        var ajaxCount = 1;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _mobile = wx.getStorageSync('mobile');

        var countdown = 60;

        var _forgetTab = wx.getStorageSync('isPayPwd')

        console.log(_forgetTab)

        if(_forgetTab=='0'){

            wx.setNavigationBarTitle({

                title:'设置支付密码'
            })
        }

        else {
            wx.setNavigationBarTitle({

                title:'忘记支付密码'
            })

        }

        that.setData({

            mobile:_mobile.substr(0, 3) + '****' + _mobile.substr(7),

            locked:0,

        });

        settime(that);

        function settime(that) {

            if (countdown < 0) {

                that.setData({

                    locked:1,
                })

                countdown = 60;

                return;

            } else {

                that.setData({

                    locked:0,

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

                (function countDownAjax() {

                    ajaxCount--;

                    app.globalData.ajaxFinish(ajaxCount)

                })();

                //console.log(res.data.code=='-1')

                if(res.data.code=='0000'){

                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',

                    })

                }
                else if(res.data.code=='-1') {

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

        //console.log('输入完成')

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

                if(res.data.code=='0000'){

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        success:function () {

                            setTimeout(function () {

                                //跳转身份认证
                                wx.navigateTo({

                                    url:'../id_card/id_card'
                                })

                            },1500)


                        }




                    })

                    //存取tokenMsg
                    wx.setStorageSync('tokenMsg',res.data.data.tokenMsg);






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
    
    codeFn:function (e) {

        var that = this;

        that.setData({

            code:e.detail.value,

        })


        //六位时按钮亮起
        if(e.detail.value.length==6){

            that.setData({

                disabled:false

            })

        }

        //console.log(that.data.code)
        
    },

    hasCodeFn:function () {

        var that = this;

        var thisPaymsgUrl= app.globalData.URL+paymsgUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var countdown = 60;

        settime(that);

        function settime(that) {

            if (countdown < 0) {

                that.setData({

                    locked:1,

                });

                countdown = 60;

                return;

            } else {

                that.setData({

                    last_time:countdown,

                    locked:0,

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

                console.log(res.data.code=='-1')

                if(res.data.code=='0000'){



                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',

                    })

                }
                else if(res.data.code=='-1') {

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

    }





})

