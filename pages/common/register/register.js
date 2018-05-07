const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密







const registerUrl='/jx/action/register';//注册的url地址

const registmsg='/jx/action/registmsg';//发送短信验证码

Page({

    data:{

        mobile:'',//手机号

        checkCode:'',//验证码

        password:''//密码

    },

    register:function () {

        var url=app.globalData.URL+registerUrl;

        console.log(json2FormFn.json2Form({
            mobile: this.data.mobile ,
            password: md5.hexMD5(this.data.password),//md5加密
            code:this.data.checkCode
        }))

        wx.request({//注册

            url:  url,

            method:'POST',

            data: json2FormFn.json2Form({
                mobile: this.data.mobile ,
                password: md5.hexMD5(
                    this.data.password
                )
                ,//md5加密
                code:this.data.checkCode
            }),

            header: {
                'content-type': 'application/x-www-form-urlencoded' // post请求
            },

            success: function(res) {
                console.log(res.data)
            },

            fail:function (res) {
                console.log(res)
            }

        })

    },

    registmsg:function () {

        var url=app.globalData.URL+registmsg;

        console.log(this.data)

        wx.request({//注册

            url:  url,

            method:'GET',

            data: {
                mobile: this.data.mobile 
            },

            success: function(res) {
                console.log(res.data)
            },

            fail:function (res) {
                console.log(res)
            }

        })


    },

    telFn:function (e) {

        var that = this;
        that.setData({
            mobile: e.detail.value
        });

    },

    codeFn:function (e) {

        var that = this;
        that.setData({
            checkCode: e.detail.value
        });

    },

    passwordFn:function (e) {

        var that = this;
        that.setData({
            password: e.detail.value
        });

    }

});