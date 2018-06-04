/**
 * Created by ZHUANGYI on 2018/5/14.
 **/

const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const mineUrl ='/user/center/usercenter';//用户中心

const getpaymodeUrl = '/user/set/getpaymode';//查询支付方式

const updatepaymode = '/user/set/updatepaymode';//设置支付方式


Page({

    data: {

        msgMode: false,

        pwdMode: false,

    },

    onShow: function () {

        var that = this;

        var thisgetpaymodeUrl = app.globalData.URL + getpaymodeUrl;

        var thisMineurl = app.globalData.URL+ mineUrl;

         //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：mobile
         **/
        wx.request({

            url:  thisMineurl,

            method:'POST',

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function(res) {

                console.log(res.data);

                //获取是否设置密码
                wx.setStorageSync('isPayPwd',res.data.data.isPayPwd);


            },

            fail:function (res) {

                console.log(res)
            }

        })



        /**
         * 接口：查询支付方式
         * 请求方式：POST
         * 接口：/user/set/getpaymode
         **/

        wx.request({

            url: thisgetpaymodeUrl,

            method: 'POST',

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res)

                if (res.data.data.isSecurity == 1) {//短信验证

                    that.setData({

                        msgMode: true,

                        pwdMode: false

                    });

                }

                else if (res.data.data.isSecurity == 2) {//支付验证

                    that.setData({

                        msgMode: false,

                        pwdMode: true

                    });

                }

                else if (res.data.data.isSecurity == 3) {//免密

                    that.setData({

                        msgMode: false,

                        pwdMode: false

                    });

                }


            },

            fail: function (res) {

                console.log(res)
            }

        })


    },

    changMessageModelFn: function (e) {

        var that = this;

        console.log(that.data.msgMode);//现在的短信提示状态

        if (that.data.msgMode) {//现在的状态是不是打开

            wx.showModal({

                title: '提示',

                content: '是不是需要关闭短信动态验证',

                success: function (res) {

                    if (res.confirm) {

                        console.log('用户点击确定');

                        wx.setStorageSync('jxPayMode', '3');//免密

                        wx.redirectTo({url: '../payment_setting_message/payment_setting_message'})

                    } else if (res.cancel) {

                        console.log('用户点击取消');

                        that.setData({

                            msgMode: true

                        });

                    }

                }

            })

        }

        else if (!that.data.msgMode) {//现在的状态是不是关闭

            if (that.data.pwdMode) {//如果另一个状态是打开的，不允许打开两个验证

                wx.showToast({
                    title: '请先关闭支付密码验证',
                    icon: 'none',
                    duration: 2000
                })

                that.setData({

                    msgMode: false

                });

            }

            else {//如果另一个状态是关闭的，可以打开

                //缓存jx_sid&&Authorization数据
                var jx_sid = wx.getStorageSync('jxsid');

                var Authorization = wx.getStorageSync('Authorization');

                //succsee前是关闭
                that.setData({

                    msgMode: false

                });

                /**
                 * 接口：设置支付方式
                 * 请求方式：POST
                 * 接口：/user/set/getpaymode
                 **/
                wx.request({

                    url: app.globalData.URL + updatepaymode,

                    method: 'POST',

                    header: {

                        'content-type': 'application/x-www-form-urlencoded', // post请求

                        'jxsid': jx_sid,

                        'Authorization': Authorization

                    },

                    data: json2FormFn.json2Form({

                        msgMode: 1,

                        pwdMode: 0,

                    }),

                    success: function (res) {

                        console.log(res)

                        if (res.data.code == '0000') {

                            console.log(res.data.msg)

                            /*提示信息*/
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000
                            })

                            /*按钮变为正常*/
                            that.setData({

                                msgMode: true

                            });


                        }

                    },

                    fail: function (res) {

                        console.log(res)
                    }

                })

            }

        }


    },


    changCodeModelFn: function (e) {

        var that = this;

        var _isPayPwd = wx.getStorageSync('isPayPwd')

        console.log(_isPayPwd)

        console.log(that.data.pwdMode);//现在的支付提示状态

        if (that.data.pwdMode) {//现在的状态是不是打开

            wx.showModal({

                title: '提示',

                content: '是不是需要关闭支付密码验证',

                success: function (res) {

                    if (res.confirm) {

                        console.log('用户点击确定')

                        wx.setStorageSync('jxPayMode', '3');//免密

                        //if(!_isPayPwd){

                            wx.redirectTo({url: '../payment_setting_code/payment_setting_code'})

                        //}

              /*          that.setData({

                            pwdMode: false

                        });
*/



                    } else if (res.cancel) {

                        console.log('用户点击取消');



                        that.setData({

                            pwdMode: that.data.pwdMode

                        });

                    }

                }

            })

        }

        else if (!that.data.pwdMode) {//现在的状态是不是关闭

            if (that.data.msgMode) {//如果另一个状态是打开的，不允许打开两个验证

                wx.showToast({
                    title: '请先关闭短信动态验证',
                    icon: 'none',
                    duration: 2000
                })

                that.setData({

                    pwdMode: false

                });

            }

            else {//如果另一个状态是关闭的，可以打开


                var isPayPwd = wx.getStorageSync('isPayPwd');//是不是设置过支付密码

                console.log('是否设置过支付密码='+isPayPwd)

                if (isPayPwd==1) {//设置过

                    console.log('设置过')

                    //缓存jx_sid&&Authorization数据
                    var jx_sid = wx.getStorageSync('jxsid');

                    var Authorization = wx.getStorageSync('Authorization');

                    that.setData({

                        pwdMode: false

                    });

                    /**
                     * 接口：设置支付方式
                     * 请求方式：POST
                     * 接口：/user/set/getpaymode
                     **/
                    wx.request({

                        url: app.globalData.URL + updatepaymode,

                        method: 'POST',

                        header: {

                            'content-type': 'application/x-www-form-urlencoded', // post请求

                            'jxsid': jx_sid,

                            'Authorization': Authorization

                        },

                        data: json2FormFn.json2Form({

                            msgMode: 0,

                            pwdMode: 1

                        }),

                        success: function (res) {

                            console.log(res);

                            if (res.data.code == '0000') {

                                console.log(res.data.msg);

                                /*提示信息*/
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'none',
                                    duration: 2000
                                });

                                /*按钮变为正常*/
                                that.setData({

                                    pwdMode: true

                                });


                            }

                        },

                        fail: function (res) {

                            console.log(res)
                        }

                    })


                }
               //
               else {//没有设置过

                     console.log('没设置过');

                    var _isVerify = wx.getStorageSync('isVerify');



                    //没有认证的先去认证 再设置支付密码
                    if(_isVerify=='0'){


                        wx.showModal({
                            title: '提示',
                            content: '当前账户尚未进行实名认证，完成实名认证后即可设置支付密码',
                            cancelText: '取消',
                            confirmText: '去认证',
                            success: function (res) {

                                if (res.confirm) {

                                    wx.navigateTo({

                                        url: '../no_certification/certification'

                                    })


                                }

                                else if (res.cancel) {

                                    that.setData({

                                        pwdMode: false

                                    });


                                }
                            }
                        });




                    }

                    else {

                        wx.showModal({

                            title: '提示',

                            content: '请先设置支付验证码',

                            success: function (res) {

                                if (res.confirm) {

                                    console.log('用户点击确定')

                                    wx.redirectTo({url: '../code/code'})

                                } else if (res.cancel) {

                                    console.log('用户点击取消');

                                    that.setData({

                                        pwdMode: false

                                    });

                                }

                            }

                        })


                    }







               //
               }


            }

        }
    }


})