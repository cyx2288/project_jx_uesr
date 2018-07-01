/**
 * Created by ZHUANGYI on 2018/5/14.
 **/

const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const mineUrl ='/user/center/usercenter';//用户中心

const getpaymodeUrl = '/user/set/getpaymode';//查询支付方式

const updatepaymode = '/user/set/updatepaymodesecond';//设置支付方式


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

        //区别是在设置页面修改密码成功还是在提现中忘记密码设置成功（在设置密码成功后取值）
        //wx.setStorageSync('paySettingHref','4');

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

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)

/*                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success:function () {



                        }

                    })*/

                    return false


                }

                else {

                    //获取是否设置密码
                    wx.setStorageSync('isPayPwd', res.data.data.isPayPwd);

                }


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

                else {

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


                }


            },

            fail: function (res) {

                console.log(res)
            }

        })


    },

    changMessageModelFn: function (e) {

        var that = this;

        //console.log(that.data.msgMode);//现在的短信提示状态

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //短信打开的时候
        if(e.detail.value==true){

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

                    else {


                        if (res.data.code == '0000') {


                            //存储时候修改支付方式 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                            wx.setStorageSync('successVerify', 'true');


                            console.log(res.data.msg)

                            /*提示信息*/
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000
                            })

                            /*按钮变为正常*/

                            that.setData({

                                pwdMode: false,

                            })

                        }

                    }

                },

                fail: function (res) {

                    console.log(res)
                }

            })


        }


        //短信关闭的时候
        else if(e.detail.value==false){

            console.log('关')
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

                    pwdMode: 1,

                }),

                success: function (res) {

                    console.log(res)

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

                    else {


                        if (res.data.code == '0000') {


                            //存储时候修改支付方式 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                            wx.setStorageSync('successVerify', 'true');


                            console.log(res.data.msg)

                            /*提示信息*/
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000
                            })

                            /*按钮变为正常*/
                            that.setData({

                                pwdMode:true,

                            })

                        }

                    }

                },

                fail: function (res) {

                    console.log(res)
                }

            })





        }







        // if (that.data.msgMode) {//现在的状态是不是打开
        //
        //     wx.showModal({
        //
        //         title: '提示',
        //
        //         content: '是不是需要关闭短信动态验证',
        //
        //         confirmColor:'#fe9728',
        //
        //         success: function (res) {
        //
        //             if (res.confirm) {
        //
        //                 console.log('用户点击确定');
        //
        //                 wx.setStorageSync('jxPayMode', '3');//免密
        //
        //                 wx.redirectTo({url: '../payment_setting_message/payment_setting_message'})
        //
        //             } else if (res.cancel) {
        //
        //                 console.log('用户点击取消');
        //
        //                 that.setData({
        //
        //                     msgMode: true
        //
        //                 });
        //
        //             }
        //
        //         }
        //
        //     })
        //
        // }
        //
        // else if (!that.data.msgMode) {//现在的状态是不是关闭
        //
        //     if (that.data.pwdMode) {//如果另一个状态是打开的，不允许打开两个验证
        //
        //         wx.showToast({
        //             title: '请先关闭支付密码验证',
        //             icon: 'none',
        //             duration: 2000
        //         })
        //
        //         that.setData({
        //
        //             msgMode: false
        //
        //         });
        //
        //     }
        //
        //     else {//如果另一个状态是关闭的，可以打开
        //
        //         //缓存jx_sid&&Authorization数据
        //         var jx_sid = wx.getStorageSync('jxsid');
        //
        //         var Authorization = wx.getStorageSync('Authorization');
        //
        //         //succsee前是关闭
        //         that.setData({
        //
        //             msgMode: false
        //
        //         });
        //
        //         /**
        //          * 接口：设置支付方式
        //          * 请求方式：POST
        //          * 接口：/user/set/getpaymode
        //          **/
        //         wx.request({
        //
        //             url: app.globalData.URL + updatepaymode,
        //
        //             method: 'POST',
        //
        //             header: {
        //
        //                 'content-type': 'application/x-www-form-urlencoded', // post请求
        //
        //                 'jxsid': jx_sid,
        //
        //                 'Authorization': Authorization
        //
        //             },
        //
        //             data: json2FormFn.json2Form({
        //
        //                 msgMode: 1,
        //
        //                 pwdMode: 0,
        //
        //             }),
        //
        //             success: function (res) {
        //
        //                 console.log(res)
        //
        //                 app.globalData.repeat(res.data.code,res.data.msg);
        //
        //                 if(res.data.code=='3001') {
        //
        //                     //console.log('登录');
        //
        //                     setTimeout(function () {
        //
        //                         wx.reLaunch({
        //
        //                             url:'../../common/signin/signin'
        //                         })
        //
        //                     },1500)
        //
        //                     /*                    wx.showToast({
        //                      title: res.data.msg,
        //                      icon: 'none',
        //                      duration: 1500,
        //                      success:function () {
        //
        //
        //
        //                      }
        //
        //                      })*/
        //
        //                     return false
        //
        //
        //                 }
        //
        //                 else {
        //
        //
        //                     if (res.data.code == '0000') {
        //
        //
        //                         //存储时候修改支付方式 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
        //                         wx.setStorageSync('successVerify', 'true');
        //
        //
        //                         console.log(res.data.msg)
        //
        //                         /*提示信息*/
        //                         wx.showToast({
        //                             title: res.data.msg,
        //                             icon: 'none',
        //                             duration: 2000
        //                         })
        //
        //                         /*按钮变为正常*/
        //                         that.setData({
        //
        //                             msgMode: true
        //
        //                         });
        //
        //
        //                     }
        //
        //                 }
        //
        //             },
        //
        //             fail: function (res) {
        //
        //                 console.log(res)
        //             }
        //
        //         })
        //
        //     }
        //
        // }


    },


    changCodeModelFn: function (e) {

        var that = this;

        var _isPayPwd = wx.getStorageSync('isPayPwd')

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        console.log(_isPayPwd)

        //console.log(that.data.pwdMode);//现在的支付提示状态

        //console.log(e.detail.value);


        if (that.data.pwdMode){

            console.log('支付密码关闭')

            //关闭的时候要去验证支付密码

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

                    msgMode: 1,

                    pwdMode: 0

                }),

                success: function (res) {

                    console.log(res);

                    if (res.data.code == '0000') {

                        //刷新跟人中心
                        wx.setStorageSync('successVerify', 'true');

                        console.log('设置成功' + wx.getStorageSync('successVerify'))

                        console.log(res.data.msg);

                        /*提示信息*/
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                        });


                        //直接打开短信的
                        that.setData({

                            msgMode:true,


                        });







                    }

                },

                fail: function (res) {

                    console.log(res)
                }

            })




    }

        else {

            console.log('支付密码打开')

            //支付密码打开的时候

            var isPayPwd = wx.getStorageSync('isPayPwd');//是不是设置过支付密码

            console.log('是否设置过支付密码=' + isPayPwd)


            if (isPayPwd == 1) {//设置过 直接打开就行

                console.log('设置过')


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

                            //刷新跟人中心
                            wx.setStorageSync('successVerify', 'true');

                            console.log('设置成功' + wx.getStorageSync('successVerify'))

                            console.log('时候实名认证了='+_isVerify)

                            console.log(res.data.msg);

                            /*提示信息*/
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000
                            });


                            //直接打开
                            that.setData({

                                pwdMode: true,


                            });

                            if(that.data.pwdMode){

                                that.setData({

                                    msgMode:false,


                                });

                            }







                        }

                    },

                    fail: function (res) {

                        console.log(res)
                    }

                })


            }

            else {//如果没有设置过 先判断有没有实名认证

                console.log('没设置过');

                //先不让swtich打开
                that.setData({

                    pwdMode: false

                });

                var _isVerify = wx.getStorageSync('isVerify');

                //没有认证的先去认证 再设置支付密码
                if (_isVerify == '0') {

                    wx.showModal({
                        title: '提示',
                        content: '当前账户尚未进行实名认证，完成实名认证后即可设置支付密码',
                        cancelText: '取消',
                        confirmText: '去认证',
                        confirmColor: '#fe9728',
                        success: function (res) {

                            if (res.confirm) {

                                //储存一下从设置密码过去 在实名认证中区分是返回上一页还是跳到设置密码(实名认证中取出值)
                                wx.setStorageSync('paySettingAuthentication','1')

                                wx.navigateTo({

                                    url: '../no_certification/certification'

                                })


                            }

                            else if (res.cancel) {

                                that.setData({

                                    msgMode: true,

                                })

                            }
                        }
                    });


                }

                else {

                    //储存一下从设置密码过去

                    //储存一下从设置密码过去 用于判断后退还是跳连接(在设置密码中取出值)
                    wx.setStorageSync('paySetting','1')


                    wx.showModal({

                        title: '提示',
                        cancelText: '取消',

                        confirmText: '去设置',

                        content: '还未设置支付密码，设置后即可开启',

                        confirmColor: '#fe9728',

                        success: function (res) {

                            if (res.confirm) {

                                console.log('用户点击确定')

                                wx.navigateTo({url: '../code/code'})

                            } else if (res.cancel) {


                                console.log('用户点击取消');

                                that.setData({

                                    msgMode: true,

                                })

                            }

                        }

                    })


                }


            }




        }





        // //支付密码关闭的时候
        // else if(e.detail.value==false){
        //
        //     console.log('关闭的时候')
        //
        //     /**
        //      * 接口：设置支付方式
        //      * 请求方式：POST
        //      * 接口：/user/set/getpaymode
        //      **/
        //     wx.request({
        //
        //         url: app.globalData.URL + updatepaymode,
        //
        //         method: 'POST',
        //
        //         header: {
        //
        //             'content-type': 'application/x-www-form-urlencoded', // post请求
        //
        //             'jxsid': jx_sid,
        //
        //             'Authorization': Authorization
        //
        //         },
        //
        //         data: json2FormFn.json2Form({
        //
        //             msgMode: 1,
        //
        //             pwdMode: 0
        //
        //         }),
        //
        //         success: function (res) {
        //
        //             console.log(res);
        //
        //             if (res.data.code == '0000') {
        //
        //                 //刷新跟人中心
        //                 wx.setStorageSync('successVerify','true');
        //
        //                 console.log('设置成功'+wx.getStorageSync('successVerify'))
        //
        //                 console.log(res.data.msg);
        //
        //                 /*提示信息*/
        //                 wx.showToast({
        //                     title: res.data.msg,
        //                     icon: 'none',
        //                     duration: 2000
        //                 });
        //
        //                 /*按钮变为正常*/
        //                 that.setData({
        //
        //                     msgMode:true,
        //
        //                 })
        //
        //
        //             }
        //
        //         },
        //
        //         fail: function (res) {
        //
        //             console.log(res)
        //         }
        //
        //     })
        //
        //
        //
        //
        // }

    /*            if (that.data.pwdMode) {//现在的状态是不是打开

                    wx.showModal({

                        title: '提示',

                        content: '是不是需要关闭支付密码验证',

                        confirmColor:'#fe9728',

                        success: function (res) {

                            if (res.confirm) {

                                console.log('用户点击确定')

                                wx.setStorageSync('jxPayMode', '3');//免密

                                //if(!_isPayPwd){

                                    wx.redirectTo({url: '../payment_setting_code/payment_setting_code'})

                                //}

                      /!*          that.setData({

                                    pwdMode: false

                                });
        *!/



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

                            /!**
                             * 接口：设置支付方式
                             * 请求方式：POST
                             * 接口：/user/set/getpaymode
                             **!/
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


                                        wx.setStorageSync('successVerify','true');

                                        console.log('设置成功'+wx.getStorageSync('successVerify'))

                                        console.log(res.data.msg);

                                        /!*提示信息*!/
                                        wx.showToast({
                                            title: res.data.msg,
                                            icon: 'none',
                                            duration: 2000
                                        });

                                        /!*按钮变为正常*!/
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
                                    confirmColor:'#fe9728',
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

                                    confirmColor:'#fe9728',

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





                       }


                    }

                }*/
    }


})