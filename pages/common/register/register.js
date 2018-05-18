const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const md5 = require('../../../static/libs/script/md5.js');//md5加密

const registerUrl = '/jx/action/register';//注册的url地址

const registmsg = '/jx/action/registmsg';//发送短信验证码

Page({

    data: {

        mobile: '',//手机号

        checkCode: '',//验证码

        password: ''//密码

    },


    registmsg: function () {

        var url = app.globalData.URL + registmsg;

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
                var jx_sid = res.header.jx_sid;//jx_sid数据

                //存储数据
                wx.setStorageSync('jx_sid', jx_sid);


            },

            fail: function (res) {

                console.log(res)
            }

        })


    },

    register: function () {

        var url = app.globalData.URL + registerUrl;

        var jx_sid = wx.getStorageSync('jx_sid');

        console.log(json2FormFn.json2Form({

            mobile: this.data.mobile,

            password: md5.hexMD5(this.data.password),//md5加密

            code: this.data.checkCode

        }));

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

                mobile: this.data.mobile,

                password: md5.hexMD5(
                    this.data.password
                )
                ,//md5加密
                code: this.data.checkCode
            }),

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jx_sid': jx_sid

            },

            success: function (res) {

                console.log(res.data)

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

    }

});