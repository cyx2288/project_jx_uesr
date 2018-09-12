/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const paymsg='/jx/action/closepaymsg';//短信验证

const updatepaymode='/user/set/updatepaymodesecond';//设置支付方式

Page({

    data:{

        mobile:'',

        last_time:'',//倒计时

        thisPayMsg:'',//短息验证码

        disabled:true,//按钮的状态

        locked:1//0为锁住 1为解锁
        
    },
    onLoad:function () {

        var that=this;

        //有几个ajax请求
        var ajaxCount = 1;

        var _mobile = wx.getStorageSync('mobile');

        //缓存修改方式
        var payMode = wx.getStorageSync('jxPayMode');

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //console.log(payMode)

        that.setData({

            locked:0,

            mobile:_mobile.substr(0, 3) + '****' + _mobile.substr(7),
            
            
        })



        /**
         * 接口：短信验证码
         * 请求方式：GET
         * 接口：/jx/action/closepaymsg
         **/

        wx.request({

            url: app.globalData.URL+paymsg,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data.msg);

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');
                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)
 /*                   wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success:function () {



                        }

                    })
*/
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


                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        mask:true,

                    })

                }

            },


            fail: function (res) {
                console.log(res)
            }

        });



        /*倒计时*/

        (function () {

            settime(that);

            var countdown = 60;

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

        })();




    },

    messageFn:function (e) {

        var that=this;

        //保存输入验证码
        that.setData({

            thisPayMsg:e.detail.value,

            disabled:true

        });

/*        if(e.detail.value.length==6){


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

                title: '请输入验证码',
                icon: 'none',
                mask:true,

            })



        }

        else if(that.data.thisPayMsg.length<6){

            wx.showToast({

                title: '输入的验证码有误',
                icon: 'none',
                mask:true,

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

                    code:that.data.thisPayMsg

                }),

                success: function (res) {

                    app.globalData.repeat(res.data.code,res.data.msg);

                    if(res.data.code=='3001') {

                        //console.log('登录');
                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)
                        /*                   wx.showToast({
                         title: res.data.msg,
                         icon: 'none',
                         duration: 1500,
                         success:function () {



                         }

                         })
                         */
                        return false


                    }
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        return false
                    }

                    else {

                        if (res.data.code == '0000') {

                            //存储有没有支付密码修改成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                            wx.setStorageSync('successVerify', 'true');


                            console.log(res.data.msg)

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000,
                                mask:true,

                                success: function () {

                                    setTimeout(function () {
                                        wx.redirectTo({url: '../payment_setting/payment_setting'})
                                    }, 2000)

                                }
                            })


                        }

                        else {

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000,
                                mask:true,

                            })

                        }

                    }




                },

                fail: function (res) {

                    console.log(res)
                }

            })


        }

    },

    hasCodeFn:function () {

        var that = this;

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
         * 接口：短信验证码
         * 请求方式：GET
         * 接口：/jx/action/closepaymsg
         **/

        wx.request({

            url: app.globalData.URL+paymsg,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data.msg);

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');
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

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000,
                        mask:true,
                    })

                }

            },


            fail: function (res) {
                console.log(res)
            }

        });

    }



})

