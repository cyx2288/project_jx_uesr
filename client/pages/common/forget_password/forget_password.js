const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const md5 = require('../../../static/libs/script/md5.js');//md5加密

const retrievalpwdUrl = '/jx/action/retrievalpwd';//忘记密码的url地址

const forgetmsg = '/jx/action/forgetmsg';//发送短信验证码

Page({

    data: {

        mobile: '',//手机号

        checkCode: '',//验证码

        password: '',//密码

        confirmPassword: '',

        time: '获取验证码', //倒计时

        currentTime: 60,

        locked: 1,//0为锁住 1为解锁

        currentVoiceTime:60,//语音验证码倒计时
    },


    //发送验证码
    registmsg: function () {

        var thisForgetmsgUrl = app.globalData.URL + forgetmsg;

        var jx_sid = wx.getStorageSync('jxsid');

        var that = this;

        //如果手机号是正常的
        if (that.data.mobile == '' || that.data.mobile.length < 11) {

            wx.showToast({

                title: '请输入正确的手机号',
                icon: 'none'

            });

        }


        else {

            /**
             * 接口：忘记密码发送短信认证
             * 请求方式：/jx/action/forgetmsg
             * 接口：GET
             * 入参：mobile
             **/


            wx.request({//注册

                url: thisForgetmsgUrl,

                method: 'GET',

                data: {

                    mobile: that.data.mobile

                },

                header: {

                    'jxsid': jx_sid,


                },

                success: function (res) {

                    console.log(res.data);

                    //code3003返回方法
                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)

/*                        wx.showToast({
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
                            icon: 'none'

                        });

                        //倒计时开始
                        that.getCode();

                        //锁定
                        that.setData({

                            disabled: true

                        });


                    }

                    else {

                        wx.showToast({

                            title: res.data.msg,
                            icon: 'none'

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

    settingFn: function () {

        var that = this;

        var url = app.globalData.URL + retrievalpwdUrl;

        var jx_sid = wx.getStorageSync('jxsid');

        var a = /[@#\$%\^&\*]+/g;

        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;

        //如果手机号是正常的
        if (that.data.mobile == '' || that.data.mobile.length < 11) {

            wx.showToast({

                title: '请输入正确的手机号',
                icon: 'none'

            });

        }

        else if (that.data.checkCode == '' || that.data.checkCode.length < 6) {

            wx.showToast({

                title: '请输入正确的验证码',
                icon: 'none'

            });

        }

        //校验密码
        else if (a.test(that.data.password)) {

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none'

            });


        }

        else if (that.data.password.length < 6) {

            wx.showToast({

                title: '密码长度为6-20位',
                icon: 'none'

            });

        }
        else if(!reg.test(that.data.password)){

            wx.showToast({

                title: '密码需包含数字和字母',
                icon: 'none'

            });

        }

        else if (that.data.password != that.data.confirmPassword) {


            wx.showToast({

                title: '请保证两次输入密码一致',
                icon: 'none'

            });

        }


        else {



            /**
             * 接口：注册
             * 请求方式：POST
             * 接口：/jx/action/register
             * 入参：mobile，password，code
             **/

            wx.request({

                url: url,

                method: 'POST',

                data: json2FormFn.json2Form({

                    mobile: that.data.mobile,

                    password:md5.hexMD5(this.data.password),

                    confirmPassword: md5.hexMD5(this.data.confirmPassword),

                    code: that.data.checkCode
                }),


                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid': jx_sid

                },

                success: function (res) {
                    console.log(res.data);

                    //code3003返回方法
                    app.globalData.repeat(res.data.code,res.data.msg);

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)

                        /*                        wx.showToast({
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
                                success:function () {

                                    setTimeout(function () {

                                        wx.navigateBack({
                                            delta: 1
                                        })


                                    },1500)

                                }


                            });



                        }


                        else if (res.data.code == '-1') {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none'

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

    passwordFn: function (e) {

        var that = this;

        that.setData({

            password: e.detail.value

        });


    },

    confirmPasswordFn: function (e) {

        var that = this;

        that.setData({

            confirmPassword: e.detail.value

        });

    },

    getCode: function () {

        var that = this;

        var currentTime = that.data.currentTime;

        var interval = setInterval(function () {

            currentTime--;

            that.setData({

                locked: 0,

                time: currentTime + 's后重新发送'

            });
            if (currentTime <= 0) {

                clearInterval(interval);

                that.setData({

                    locked: 1,

                    time: '重新发送',

                    currentTime: 60,

                    disabled: false,

                })
            }
        }, 1000)
    },

    voiceFn:function () {

        var url = app.globalData.URL + '/jx/action/forgetaudiomsg';//发送语音验证码';

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
             * 接口：忘记密码发送语音短信认证
             * 请求方式：/jx/action/forgetaudiomsg
             * 接口：GET
             * 入参：mobile
             **/
            wx.request({//注册

                url: url,

                method: 'GET',


                data: {

                    channel:'jiaxin',

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