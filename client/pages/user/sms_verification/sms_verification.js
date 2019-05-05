/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const withdrawmsgUrl = '/jx/action/withdrawmsg';//提现发送短信认证

const cashUrl = '/user/withdraw/dowithdraw';// 用户发起提现操作

const transferUrl = '/user/transfer/dotransfer';//用户发起转账操作



Page({

    data:{

        mobile:'',//手机号

        newMobile:'',

        last_time:'',//倒计时

        idNumber:'',//份证号

        tokenMsg:'',//验证码标识

        code:'',//验证码

        showModal: false,//弹框

        titleContent:'',//弹框内容

        imgalist:['http://wechat.fbwin.cn/images/qrcode_jx.jpg'],

        currentVoiceTime:60,//语音验证码

        hiddenText:true,//是否显示语音验证码



    },
    onLoad:function () {


        var thisWithdrawmsgUrl= app.globalData.URL+withdrawmsgUrl;

        var that = this;

        //有几个ajax请求
        var ajaxCount = 1;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _mobile = wx.getStorageSync('mobile');

        var _operation = wx.getStorageSync('operation');

        //0-提现到银行卡 1-提现到支付宝

        var _chooseActive = wx.getStorageSync('chooseActive');

      /*  console.log('到底是转账还是提现'+_operation);*/

        console.log('1-支付宝 0-银行卡'+_chooseActive);

        var countdown = 60;

        that.setData({

            mobile:_mobile,

            newMobile:_mobile.substr(0, 3) + '****' + _mobile.substr(7),

            locked:0,

        });

        //console.log(_mobile)

        settime(that);

        function settime(that) {

            if (countdown < 0) {

                that.setData({

                    locked:1,

                    hiddenText:false

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

        console.log(that.data.mobile)


        if(_operation=='cash'){

            //发送支付宝短信认证
            if(_chooseActive=='1'){


                /**
                 * 接口：提现到支付宝 支付发送短信认证
                 * 请求方式：GET
                 * 接口：/jx/action/withdrawmsgalipay
                 * 入参：moblie
                 * */

                wx.request({

                    url: app.globalData.URL+'/jx/action/withdrawmsgalipay',

                    method: 'GET',

                    header:{

                        'jxsid':jx_sid,

                        'Authorization':Authorization

                    },

                    success: function (res) {

                        console.log(res.data);

                        app.globalData.repeat(res.data.code,res.data.msg);

                        app.globalData.token(res.header.Authorization)

                        if(res.data.code=='3001') {

                            //console.log('登录');

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 1500,
                                success:function () {

                                    setTimeout(function () {

                                        wx.reLaunch({

                                            url:'../../common/signin/signin'
                                        })

                                    },1500)

                                }

                            })

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


                            if (res.data.code == '0000') {

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

                        }




                    },


                    fail: function (res) {

                        console.log(res)

                    }

                })

            }
            else {


                /**
                 * 接口：提现发送短信认证
                 * 请求方式：GET
                 * 接口：/jx/action/withdrawmsg
                 * 入参：moblie
                 * */

                wx.request({

                    url: thisWithdrawmsgUrl,

                    method: 'GET',

                    header:{

                        'jxsid':jx_sid,

                        'Authorization':Authorization

                    },

                    success: function (res) {

                        console.log(res.data);

                        app.globalData.repeat(res.data.code,res.data.msg);

                        app.globalData.token(res.header.Authorization)

                        if(res.data.code=='3001') {

                            //console.log('登录');

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 1500,
                                success:function () {

                                    setTimeout(function () {

                                        wx.reLaunch({

                                            url:'../../common/signin/signin'
                                        })

                                    },1500)

                                }

                            })

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


                            if (res.data.code == '0000') {

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

                        }




                    },


                    fail: function (res) {

                        console.log(res)

                    }

                })

            }




        }
        else if(_operation=='transfer'){

            /**
             * 接口：转账发送短信认证
             * 请求方式：GET
             * 接口：/jx/action/dotransferp
             * 入参：moblie
             * */

            wx.request({

                url: app.globalData.URL+'/jx/action/dotransferp',

                method: 'GET',

                header:{

                    'jxsid':jx_sid,

                    'Authorization':Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1500,
                            success:function () {

                                setTimeout(function () {

                                    wx.reLaunch({

                                        url:'../../common/signin/signin'
                                    })

                                },1500)

                            }

                        })

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


                        if (res.data.code == '0000') {

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

                    }




                },


                fail: function (res) {

                    console.log(res)

                }

            })


        }








    },

    buttonCheck:function () {

        var that = this;

        var thisCashUrl = app.globalData.URL + cashUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //提现--------------------------------------------------------------

        var _balance = wx.getStorageSync('balance');



        var _alipayId = wx.getStorageSync('alipayId');  //提现到支付宝

        var _bankCardId = wx.getStorageSync('bankCardId'); //提现到银行卡






        //转账---------------------------------------------------------------
        //转账部分
        var _transferBalance = wx.getStorageSync('transferBalance');//转账金额

        var _transferCash = wx.getStorageSync('transferCash');//转账金额页面

        var _mobile = wx.getStorageSync('transferMobile');//转账手机号

        var _transferTips = wx.getStorageSync('transferTips');//备注


        if(!that.data.code){

            wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 1000
            })


        }


        else if(_transferCash=='5'){


            console.log('转账')


            /**
             * 接口：获取账户转账记录
             * 请求方式：GET
             * 接口：/user/transfer/dotransfer
             * 入参：mobile,balance,code,remark
             * */

            wx.request({

                url: app.globalData.URL + transferUrl,

                method: 'GET',

                data: {

                    mobile: _mobile,//手机号

                    balance: _transferBalance,//转账现金

                    code: that.data.code,//短信验证

                    remark:_transferTips


                },
                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

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


                        //订单详情
                        wx.setStorageSync('transferOrderId', res.data.data);

                        //console.log(wx.getStorageSync('transferOrderId'));

                        //存储有没有提现成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                        wx.setStorageSync('successVerify','true');


                        if (res.data.code == '0000') {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask:true,

                            })



                            setTimeout(function () {

                                wx.redirectTo({

                                    url: '../transfer_success/transfer_success'
                                })

                            },1500)



                        }
                        else if(res.data.code == '-10'){

                            that.setData({

                                showModal: true,

                                titleContent:'转账',//弹框内容

                            })


                        }

                        else {




                            wx.showToast({

                                title: res.data.msg,

                                icon: 'none',
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


        else if(_transferCash=='6'){


            if(wx.getStorageSync('chooseActive')=='1'){

                wx.setStorageSync('orderdowithdraw','09')


                /**
                 * 接口：用户发起支付宝提现操作
                 * 请求方式：GET
                 * 接口：/user/withdraw/dowithdrawtoalipay
                 * 入参：alipayId,balance,code
                 * */

                wx.request({

                    url: app.globalData.URL+'/user/withdraw/dowithdrawtoalipay',

                    method: 'GET',

                    data: {

                        alipayId: _alipayId,//银行卡id

                        balance: _balance,//提取现金

                        code: that.data.code,//短信验证


                    },
                    header: {

                        'jxsid': jx_sid,

                        'Authorization': Authorization

                    },

                    success: function (res) {

                        console.log(res.data);

                        app.globalData.repeat(res.data.code,res.data.msg);

                        app.globalData.token(res.header.Authorization)

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


                            //缓存点单号
                            wx.setStorageSync('cashOrderId', res.data.data);

                            //存储有没有提现成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                            wx.setStorageSync('successVerify', 'true');

                            if (res.data.code == '0000') {


                                wx.showToast({

                                    title: res.data.msg,

                                    icon: 'none',

                                })

                                wx.redirectTo({

                                    url: '../pay_success/pay_success'
                                })

                            }

                            else if(res.data.code == '-10'){

                                that.setData({

                                    showModal: true,

                                    titleContent:'提现',//弹框内容

                                })


                            }

                            else {

                                wx.showToast({

                                    title: res.data.msg,

                                    icon: 'none',

                                })
                            }

                        }

                    },


                    fail: function (res) {

                        console.log(res)

                    }

                })


            }
            else {

                wx.setStorageSync('orderdowithdraw','08')



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

                        code: that.data.code,//短信验证


                    },
                    header: {

                        'jxsid': jx_sid,

                        'Authorization': Authorization

                    },

                    success: function (res) {

                        console.log(res.data);

                        app.globalData.repeat(res.data.code,res.data.msg);

                        app.globalData.token(res.header.Authorization)

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


                            //缓存点单号
                            wx.setStorageSync('cashOrderId', res.data.data);

                            //存储有没有提现成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                            wx.setStorageSync('successVerify', 'true');

                            if (res.data.code == '0000') {


                                wx.showToast({

                                    title: res.data.msg,

                                    icon: 'none',

                                })

                                wx.redirectTo({

                                    url: '../pay_success/pay_success'
                                })

                            }

                            else if(res.data.code == '-10'){

                                that.setData({

                                    showModal: true,

                                    titleContent:'提现',//弹框内容

                                })


                            }

                            else {

                                wx.showToast({

                                    title: res.data.msg,

                                    icon: 'none',

                                })
                            }

                        }

                    },


                    fail: function (res) {

                        console.log(res)

                    }

                })


            }




        }







    },
    
    codeFn:function (e) {

        var that = this;

        that.setData({

            code:e.detail.value,

        })

    },

    hasCodeFn:function () {

        var that = this;

        var thisWithdrawmsgUrl= app.globalData.URL+withdrawmsgUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var countdown = 60;

        settime(that);

        function settime(that) {

            if (countdown < 0) {

                that.setData({

                    locked:1,

                    hiddenText:false,//是否显示语音验证码



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

        if(wx.getStorageSync('operation')=='cash'){


            /**
             * 接口：提现发送短信认证
             * 请求方式：GET
             * 接口：/jx/action/withdrawmsg
             * 入参：null
             * */

            wx.request({

                url: thisWithdrawmsgUrl,

                method: 'GET',

                header:{

                    'jxsid':jx_sid,

                    'Authorization':Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)

                        /*                          wx.showToast({
                         title: res.data.msg,
                         icon: 'none',
                         duration: 1500,
                         success:function () {



                         }

                         })*/

                        return false


                    }
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        return false
                    }

                    else {


                        if (res.data.code == '0000') {

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

                    }




                },


                fail: function (res) {

                    console.log(res)

                }

            })




        }

        else if(wx.getStorageSync('operation')=='transfer'){

            /**
             * 接口：转账发送短信认证
             * 请求方式：GET
             * 接口：/jx/action/dotransferp
             * 入参：null
             * */

            wx.request({

                url: app.globalData.URL+'/jx/action/dotransferp',

                method: 'GET',

                header:{

                    'jxsid':jx_sid,

                    'Authorization':Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1500,
                            success:function () {

                                setTimeout(function () {

                                    wx.reLaunch({

                                        url:'../../common/signin/signin'
                                    })

                                },1500)

                            }

                        })

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


                        if (res.data.code == '0000') {

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

                    }




                },


                fail: function (res) {

                    console.log(res)

                }

            })

        }



    },

    voiceFn:function () {


        var that = this;

        var currentVoiceTime = that.data.currentVoiceTime;

        console.log(currentVoiceTime)


        if(currentVoiceTime<60){

            wx.showToast({

                title: '操作过于频繁，请稍后再试',
                icon: 'none',
                mask: true,

            });


        }
        else {

            if(wx.getStorageSync('chooseActive')=='1'){

                /**
                 * 接口：提现到支付宝 支付发送语音短信认证
                 * 请求方式：/jx/action/withdrawmsgalipayaudio
                 * 接口：GET
                 * 入参：null
                 **/
                wx.request({//注册

                    url: app.globalData.URL + '/jx/action/withdrawmsgalipayaudio',

                    method: 'GET',


                    success: function (res) {

                        console.log(res.data);

                        //存储数据
                        var jx_sid = res.header.jxsid;//jx_sid数据

                        //存储数据
                        wx.setStorageSync('jxsid', jx_sid);


                        if (res.data.code == '0000') {


                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask: true,

                            });



                            //倒计时开始
                            var interval = setInterval(function () {

                                currentVoiceTime--;

                                that.setData({

                                    currentVoiceTime: currentVoiceTime

                                });


                                if (currentVoiceTime <= 0) {

                                    clearInterval(interval);

                                    that.setData({

                                        currentVoiceTime:60,

                                    })

                                }

                            }, 1000)


                        }

                        else {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask: true,

                            });

                        }


                    },

                    fail: function (res) {

                        console.log(res)
                    }

                })





            }

            else {

                /**
                 * 接口：支付发送语音验证码
                 * 请求方式：/jx/action/withdrawmsgaudio
                 * 接口：GET
                 * 入参：null
                 **/
                wx.request({//注册

                    url: app.globalData.URL + '/jx/action/withdrawmsgaudio',

                    method: 'GET',


                    success: function (res) {

                        console.log(res.data);

                        //存储数据
                        var jx_sid = res.header.jxsid;//jx_sid数据

                        //存储数据
                        wx.setStorageSync('jxsid', jx_sid);


                        if (res.data.code == '0000') {


                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask: true,

                            });



                            //倒计时开始
                            var interval = setInterval(function () {

                                currentVoiceTime--;

                                that.setData({

                                    currentVoiceTime: currentVoiceTime

                                });


                                if (currentVoiceTime <= 0) {

                                    clearInterval(interval);

                                    that.setData({

                                        currentVoiceTime:60,

                                    })

                                }

                            }, 1000)


                        }

                        else {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask: true,

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

    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {


    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {

        var that = this

        that.setData({
            showModal: false
        });
    },

    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {

        var that = this;

        that.hideModal();
    },


    previewImage: function (e) {
        wx.previewImage({
            current: this.data.imgalist, // 当前显示图片的http链接
            urls: this.data.imgalist // 需要预览的图片http链接列表
        })
    },




})

