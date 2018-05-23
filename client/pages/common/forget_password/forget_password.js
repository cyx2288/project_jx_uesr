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

        confirmPassword:'',

        time: '获取验证码', //倒计时

        currentTime:60,

        locked:1//0为锁住 1为解锁

    },


   //发送验证码
    registmsg: function () {

        var thisForgetmsgUrl = app.globalData.URL + forgetmsg;

        var jx_sid = wx.getStorageSync('jxsid');

        var that = this;

            that.getCode();

            that.setData({

                disabled:true

            });

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

            header:{

                'jxsid': jx_sid,


            },

            success: function (res) {

                console.log(res.data);

                if(res.data.code=='0000'){

                    wx.showToast({

                        title: res.data.msg,
                        icon: 'none'

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


    },

    //确定

    settingFn: function () {

        var that = this;

        var url = app.globalData.URL + retrievalpwdUrl;

        var jx_sid = wx.getStorageSync('jxsid');

        var a = /[@#\$%\^&\*]+/g;

        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;

        //密码判空
        var _thisPassWord,_thisconfirmPassword;


        if(that.data.mobile==''){

            wx.showToast({

                title: '请输入手机号',
                icon: 'none'

            });
            return false;



        }

        else if (that.data.checkCode==''){

            wx.showToast({

                title: '请输入验证码',
                icon: 'none'

            });

            return false;



        }


        else if(that.data.password==''){

            console.log(1)
            wx.showToast({

                title: '请输入密码',
                icon: 'none'

            });

            return false;

        }

        else if(that.data.confirmPassword==''){


            wx.showToast({

                title: '请再次输入密码',
                icon: 'none'

            });

            return false;

        }


        else {

            _thisPassWord = md5.hexMD5(this.data.password);

            _thisconfirmPassword = md5.hexMD5(this.data.confirmPassword)

        }


        //校验密码
        if(a.test(that.data.password)){

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none'

            });

            return false

        }

        else if(reg.test(that.data.password)){

            wx.showToast({

                title: '密码长度为6-20位',
                icon: 'none'

            });

            return false
        }



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

                    password:_thisPassWord,

                    confirmPassword: _thisconfirmPassword,

                    code: that.data.checkCode
                }),



                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid': jx_sid

                },

                success: function (res) {

                    console.log(res.data);

                    if(res.data.code=='0000'){

                        wx.showToast({

                            title:res.data.msg,
                            icon: 'success'

                        });

                        wx.redirectTo({

                            url: '../signin/signin'

                        })



                    }


                    else if(res.data.code=='-1'){

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

    getCode:function () {

        var that = this;

        var currentTime = that.data.currentTime;

        var interval = setInterval(function () {

            currentTime--;

            that.setData({

                locked:0,

                time: currentTime+'秒'

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