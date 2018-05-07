const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const md5 = require('../../../static/libs/script/md5.js');//md5加密

const signinUrl = '/jx/action/login';//登录的url地址


Page({

    data: {

        mobile: '',//手机号

        password: ''//密码

    },


    signin: function () {

        var url = app.globalData.URL + signinUrl;

        console.log(json2FormFn.json2Form({
            mobile: this.data.mobile,
            password: //md5.hexMD5(
            this.data.password
            //)
            ,//md5加密
        }))

        wx.request({//注册

            url: url,

            method: 'POST',

            data: json2FormFn.json2Form({
                mobile: this.data.mobile,
                password: //md5.hexMD5(
                this.data.password
                //)
                ,//md5加密
            }),

            header: {
                'content-type': 'application/x-www-form-urlencoded' // post请求
            },

            success: function (res) {

                var thisCode = res.data.code;

                console.log(res.data)

                if (thisCode == '0000') {

                    wx.switchTab({//跳转有tab的页面

                        url: '../../wages/index/index',

                        success: function () {

                            console.log('跳转成功')

                        },        //成功后的回调；


                        fail: function () {

                            console.log('跳转失败')

                        }

                    })

                }

                else {

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })


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

    passwordFn: function (e) {

        var that = this;
        that.setData({
            password: e.detail.value
        });

    }

});