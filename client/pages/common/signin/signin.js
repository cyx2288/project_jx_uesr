/**
 * Created by ZHUANGYI on 2018/5/7.
 */

const app = getApp();

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const header = require( '../../../static/libs/script/header.js' );//json转换函数

const signUrl ='/jx/action/login';//登录的url

const checkOutUrl = '/jx/action/checkloginexc'//登录异常


Page({


data:{

    mobile:'',

    password:'',



},

    //转发
    onShareAppMessage: function () {
        return {
            title: '嘉薪平台',
            path: '/pages/common/signin/signin',
            imageUrl:'/static/icon/logo/share.jpg'
        }
    },

    onShow:function () {

        //console.log(wx.getStorageSync('Authorization'));

    },

    signin:function () {

      var url = app.globalData.URL+signUrl;



        var that=this;

        //有几个ajax请求
        var ajaxCount = 1;

        var empty = /[@#\$%\^&\*]+/g;

        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;


        if(that.data.mobile==''){

          wx.showToast({

              title: '请输入手机号',
              icon: 'none'

          });

      }

      else if(that.data.password ==''){

            wx.showToast({

                title: '请输入密码',
                icon: 'none'

            });

        }


      else {



            //获取code标识
            wx.login({

                success: function (res) {

                    if (res.code) {

                        console.log(res.code)

                        /**
                         * 接口：校验登录异常
                         * 请求方式：POST
                         * 接口：/jx/action/checkloginexc
                         * 入参：mobile，code
                         **/

                        wx.request({

                            url: app.globalData.URL+checkOutUrl,

                            method: 'POST',

                            data: json2FormFn.json2Form({

                                mobile: that.data.mobile,

                                code:res.code,


                            }),

                            header: {

                                'content-type': 'application/x-www-form-urlencoded' // post请求

                            },

                            success: function (res) {

                                var code = res.data.code;

                                console.log(res.data);

                                if(code=='-7'){

                                    wx.showModal({
                                        title: '提示',
                                        content: res.data.msg,
                                        cancelText: '取消',
                                        confirmText: '确定',
                                        confirmColor:'#fe9728',
                                        success: function (res) {

                                            if (res.confirm) {

                                                console.log(that.data.password)


                                                wx.login({

                                                    success: function (res) {

                                                        if (res.code) {

                                                            console.log(res.code)

                                                            /**
                                                             * 接口：登录
                                                             * 请求方式：POST
                                                             * 接口：/jx/action/login
                                                             * 入参：mobile，password,code
                                                             **/

                                                            wx.request({

                                                                url: url,

                                                                method: 'POST',

                                                                data: json2FormFn.json2Form({

                                                                    mobile: that.data.mobile,

                                                                    password: md5.hexMD5(that.data.password),

                                                                    code: res.code,


                                                                }),

                                                                header: {

                                                                    'content-type': 'application/x-www-form-urlencoded' // post请求

                                                                },

                                                                success: function (res) {

                                                                    var code = res.data.code;

                                                                    console.log(res.data);

                                                                    if (code == '-1') {

                                                                        wx.showToast({

                                                                            title: res.data.msg,
                                                                            icon: 'none',
                                                                            duration: 2000


                                                                        });

                                                                        return false;


                                                                    }

                                                                    else if (code == '0000') {

                                                                        var Authorization = res.data.token.access_token;//Authorization数据

                                                                        var jx_sid = res.header.jxsid;//jx_sid数据

                                                                        //登录成功后调用
                                                                        (function countDownAjax() {

                                                                            ajaxCount--;

                                                                            app.globalData.ajaxFinish(ajaxCount)

                                                                        })();

                                                                        //存储数据
                                                                        wx.setStorageSync('jxsid', jx_sid);

                                                                        wx.setStorageSync('Authorization', Authorization);

                                                                        wx.setStorageSync('idNumber', res.data.data.idNumber);

                                                                        wx.setStorageSync('userName', res.data.data.userName);

                                                                        wx.setStorageSync('isVerify', res.data.data.isVerify);

                                                                        /*
                                                                         console.log('用户姓名：'+ wx.getStorageSync('userName'));

                                                                         console.log('用户身份证：'+ wx.getStorageSync('idNumber'));

                                                                         console.log('是否已注册：'+ wx.getStorageSync('isVerify'));
                                                                         */


                                                                        //console.log(header.header(Authorization,jx_sid));

                                                                        wx.switchTab({

                                                                            url: '../../wages/index/index'
                                                                        })
                                                                    }


                                                                },

                                                                fail: function (res) {

                                                                    console.log(res)
                                                                }

                                                            })

                                                        }

                                                    }

                                                })


                                            }

                                            else if (res.cancel) {


                                            }

                                        }
                                    });



                                }


                                else if(code=='0000'){

                                    wx.login({

                                        success: function (res) {

                                            if (res.code) {

                                                console.log(res.code)


                                                /**
                                                 * 接口：登录
                                                 * 请求方式：POST
                                                 * 接口：/jx/action/login
                                                 * 入参：mobile，password,code
                                                 **/

                                                wx.request({

                                                    url: url,

                                                    method: 'POST',

                                                    data: json2FormFn.json2Form({

                                                        mobile: that.data.mobile,

                                                        password: md5.hexMD5(that.data.password),

                                                        code:res.code,


                                                    }),

                                                    header: {

                                                        'content-type': 'application/x-www-form-urlencoded' // post请求

                                                    },

                                                    success: function (res) {

                                                        var code = res.data.code;

                                                        console.log(res.data);

                                                        if (code == '-1') {

                                                            wx.showToast({

                                                                title: res.data.msg,
                                                                icon: 'none',
                                                                duration: 2000


                                                            });

                                                            return false;


                                                        }

                                                        else if (code == '0000') {

                                                            var Authorization = res.data.token.access_token;//Authorization数据

                                                            var jx_sid = res.header.jxsid;//jx_sid数据

                                                            //登录成功后调用
                                                            (function countDownAjax() {

                                                                ajaxCount--;

                                                                app.globalData.ajaxFinish(ajaxCount)

                                                            })();

                                                            //存储数据
                                                            wx.setStorageSync('jxsid', jx_sid);

                                                            wx.setStorageSync('Authorization', Authorization);

                                                            wx.setStorageSync('idNumber', res.data.data.idNumber);

                                                            wx.setStorageSync('userName', res.data.data.userName);

                                                            wx.setStorageSync('isVerify', res.data.data.isVerify);

                                                            /*
                                                             console.log('用户姓名：'+ wx.getStorageSync('userName'));

                                                             console.log('用户身份证：'+ wx.getStorageSync('idNumber'));

                                                             console.log('是否已注册：'+ wx.getStorageSync('isVerify'));
                                                             */


                                                            //console.log(header.header(Authorization,jx_sid));

                                                            wx.switchTab({

                                                                url: '../../wages/index/index'
                                                            })
                                                        }


                                                    },

                                                    fail: function (res) {

                                                        console.log(res)
                                                    }

                                                })

                                            }

                                        }

                                    })


                                }
                            },

                            fail: function (res) {

                                console.log(res)
                            }

                        })






                    }

                }
            })

      }



    },

    telFn:function (e) {

        var that = this;
        that.setData({
            mobile: e.detail.value
        });



    },

    passwordFn:function (e) {

        var that = this;

        that.setData({

            password: e.detail.value
        });


    },


})