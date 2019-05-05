const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const mobilecheck = '/jx/action/newmobilecheck';//新手机号验证

const changeMobileUrl ='/user/set/changemobile';//登录的url


Page({

    data: {

        mobile: '',//手机号

        checkCode: '',//验证码

        time: '获取验证码', //倒计时

        currentTime:60,

        locked:1,//0为锁住 1为解锁

        oldCodeMsg:'',

        hiddenText:true,

        currentVoiceTime:60,//语音验证码倒计时



    },
    
    onShow:function () {

        var that = this;

        var _changeTokenMsg = wx.getStorageSync('changeTokenMsg');

        console.log('上次的验证码'+_changeTokenMsg)

        that.setData({

            oldCodeMsg:_changeTokenMsg,

        })
        
    },

    getmsg: function () {

        var that = this;

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //如果手机号是正常的
        if(that.data.mobile==''||that.data.mobile.length<11){

            wx.showToast({

                title: '请输入正确的手机号',
                icon: 'none',
                mask:true,

            });

        }


        else {


            /**
             * 接口：注册发送短信认证
             * 请求方式：/jx/action/newmobilecheck
             * 接口：GET
             * 入参：mobile
             **/
            wx.request({//注册

                url: app.globalData.URL + mobilecheck,

                method: 'GET',

                data: {

                    mobile: that.data.mobile

                },

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
                                mask: true,

                            });


                            //倒计时开始
                            that.getCode();

                            //锁定
                            that.setData({

                                disabled: true

                            });


                        }

                        else if (res.data.code == '-7') {


                            wx.showModal({
                                title: '提示',
                                content: res.data.msg,
                                showCancel: false,
                                confirmText: '我知道了',
                                confirmColor: '#fe9728',
                                success: function (res) {

                                    if (res.confirm) {

                                    }

                                    else if (res.cancel) {


                                    }


                                }
                            });

                        }

                        else {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask: true,

                            });

                        }

                    }


                },

                fail: function (res) {

                    console.log(res)
                }

            })

        }
    },

    changeMobileFn: function () {

        var that = this;


        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        //校验手机号
        if(that.data.mobile==''||that.data.mobile.length<11){

            wx.showToast({

                title: '请输入正确的手机号',
                icon: 'none',
                mask:true,

            });

        }

            //校验短信验证码
        else if(that.data.checkCode==''){

            wx.showToast({

                title: '请输入验证码',
                icon: 'none',
                mask:true,

            });

        }

        else if(that.data.checkCode.length<6){

            wx.showToast({

                title: '请输入正确的短信验证码',
                icon: 'none',
                mask:true,

            });



        }


        else{

            /**
             * 接口：更换用户手机号
             * 请求方式：POST
             * 接口：/user/set/changemobile
             * 入参：mobile，password，code
             **/

            wx.request({

                url: app.globalData.URL+changeMobileUrl,

                method: 'POST',

                data: json2FormFn.json2Form({

                    mobile: that.data.mobile,

                    oldCode: that.data.oldCodeMsg,

                    newCode: that.data.checkCode
                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid':jx_sid,

                    'Authorization':Authorization

                },

                success: function (res) {


                    console.log(res.data.data);

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

                        if (res.data.code == '-1') {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask: true,

                            });

                        }


                        else {


                            setTimeout(function () {

                                wx.showToast({

                                    title: res.data.msg,
                                    icon: 'none',
                                    mask: true,

                                });

                            }, 800);


                            wx.navigateBack({
                                delta: 2
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

    telFn: function (e) {

        var that = this;

        that.setData({

            mobile: e.detail.value

        });

    },

    codeFn: function (e) {

        var that = this;

        that.setData({

            checkCode: e.detail.value

        });

    },

    getCode:function () {

        var that = this;

        var currentTime = that.data.currentTime;

        var interval = setInterval(function () {

            currentTime--;

            that.setData({

                locked:0,

                time: currentTime+'s后重新发送'

            });
            if (currentTime <= 0) {

                clearInterval(interval);

                that.setData({

                    locked:1,

                    time: '重新发送',

                    currentTime:60,

                    disabled: false,

                    hiddenText:false
                })
            }
        }, 1000)
    },

    voiceFn:function () {

        var url = app.globalData.URL + '/jx/action/newmobileaudiocheck';//发送语音验证码';

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

            /**
             * 接口：注册发送语音短信认证
             * 请求方式：/jx/action/newmobileaudiocheck
             * 接口：GET
             * 入参：mobile
             **/
            wx.request({//注册

                url: url,

                method: 'GET',


                data: {

                    mobile: that.data.mobile

                },



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









    },


});