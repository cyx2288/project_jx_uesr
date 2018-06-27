const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const md5 = require('../../../static/libs/script/md5.js');//md5加密

const registerUrl = '/jx/action/register';//注册的url地址

const registmsg = '/jx/action/registmsg';//发送短信验证码


const signUrl ='/jx/action/login';//登录的url


Page({

    data: {

        mobile: '',//手机号

        checkCode: '',//验证码

        password: '',//密码

        time: '获取验证码', //倒计时

        currentTime:60,

        locked:1//0为锁住 1为解锁

    },



    registmsg: function () {

        var url = app.globalData.URL + registmsg;

        var that = this;

        //如果手机号是正常的
        if(that.data.mobile==''||that.data.mobile.length<11){

            wx.showToast({

                title: '请输入正确的手机号',
                icon: 'none'

            });

        }

        else {


            /**
             * 接口：注册发送短信认证
             * 请求方式：/jx/action/register
             * 接口：GET
             * 入参：mobile
             **/
            wx.request({//注册

                url: url,

                method: 'GET',

                data: {

                    mobile: this.data.mobile

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
                            icon: 'none'

                        });


                        //倒计时开始
                        that.getCode();

                        //锁定
                        that.setData({

                            disabled:true

                        });


                    }

                    else {

                        wx.showToast({

                            title: res.data.msg,
                            icon: 'none'

                        });

                    }


                },

                fail: function (res) {

                    console.log(res)
                }

            })

        }
    },

    register: function () {

        var that = this;

        //有几个ajax请求
        var ajaxCount = 1;

        var url = app.globalData.URL + registerUrl;

        var jx_sid = wx.getStorageSync('jxsid');

        var a = /[@#\$%\^&\*]+/g;

        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;


        //校验手机号
        if(that.data.mobile==''||that.data.mobile.length<11){

            wx.showToast({

                title: '请输入正确的手机号',
                icon: 'none'

            });

        }

            //校验短信验证码
        else if(that.data.checkCode==''||that.data.checkCode.length<6){

            wx.showToast({

                title: '请输入正确的短信验证码',
                icon: 'none'

            });

        }

        //校验密码
        else if(a.test(that.data.password)){

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none'

            });


        }

        else if(that.data.password.length<6){

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

        else{

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

                    password: md5.hexMD5(
                        that.data.password
                    )
                    ,//md5加密
                    code: that.data.checkCode
                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid': jx_sid

                },

                success: function (res) {

                    console.log(res.data);

                        (function countDownAjax() {

                            ajaxCount--;

                            app.globalData.ajaxFinish(ajaxCount)

                        })();

                        if(res.data.code=='-1'){

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none'

                            });

                        }

                        else {

                            wx.showToast({

                                title:'注册成功',
                                icon: 'none'

                            });

                            setTimeout(function () {

                                that.signin();//自动登录

                            },500)



                            //注册成功跳转登录页
                            /*wx.redirectTo({

                             url:'../signin/signin'
                             })*/

                        }




                },

                fail: function (res) {

                    console.log(res)

                }

            })



        }




    },

    signin:function () {

        var url = app.globalData.URL+signUrl;

        var that=this;


        //有几个ajax请求
        var ajaxCount = 1;

        var empty = /[@#\$%\^&\*]+/g;

        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;


        if(that.data.mobile==''||that.data.mobile.length<11){

            wx.showToast({

                title: '请输入正确手机号',
                icon: 'none'

            });

        }

        else if(empty.test(that.data.password)){

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none'

            });

        }


        else if(that.data.password==''||that.data.password.length<6){

            wx.showToast({

                title: '请输入6位到20位密码',
                icon: 'none'

            });


        }

        else if(!reg.test(that.data.password)){

            wx.showToast({

                title: '密码需包含数字和字母',
                icon: 'none'

            });

        }

        else {


            /**
             * 接口：登录
             * 请求方式：POST
             * 接口：/jx/action/login
             * 入参：mobile，password
             **/

            wx.request({

                url:  url,

                method:'POST',

                data: json2FormFn.json2Form({

                    mobile:that.data.mobile,

                    password:md5.hexMD5(that.data.password),

                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded' // post请求

                },

                success: function(res) {

                    var code = res.data.code;

                    console.log(res.data);

                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();

                    if(code == '-1'){

                        wx.showToast({

                            title: res.data.msg,
                            icon: 'none'

                        });

                        return false;


                    }

                    else if(code == '0000'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        var jx_sid = res.header.jxsid;//jx_sid数据

                        //存储数据
                        wx.setStorageSync('jxsid', jx_sid);

                        wx.setStorageSync('Authorization', Authorization);

                        wx.setStorageSync('idNumber', res.data.data.idNumber);

                        wx.setStorageSync('userName', res.data.data.userName);

                        wx.setStorageSync('isVerify',res.data.data.isVerify);

                        //console.log('用户姓名：'+ wx.getStorageSync('userName'));

                        //console.log('用户身份证：'+ wx.getStorageSync('idNumber'));

                        //console.log('是否已注册：'+ wx.getStorageSync('isVerify'));

                        //console.log(header.header(Authorization,jx_sid));

                        setTimeout(function () {

                            wx.switchTab({

                                url:'../../wages/index/index'
                            })

                        },500)


                    }


                },

                fail:function (res) {

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

                    disabled: false
                })
            }
        }, 1000)
    }


});