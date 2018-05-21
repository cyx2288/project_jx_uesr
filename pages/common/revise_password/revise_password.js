const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密

const changepwdUrl='/user/set/changepwd';//修改密码


Page({

    data:{

        oldPassword:'',//旧密码

        password:'',//新密码

        confirmPassword:''//确认密码

    },

    changePwd:function () {

        var that = this;

        var thisChangepwdUrl=app.globalData.URL+changepwdUrl;

        //获取用户数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：修改密码
         * 请求方式：POST
         * 接口：/user/set/changepwd
         * 入参：oldPassword，password，confirmPassword
         **/

        wx.request({

            url:  thisChangepwdUrl,

            method:'POST',

            data: json2FormFn.json2Form({

                oldPassword: md5.hexMD5(that.data.oldPassword) ,

                password: md5.hexMD5(that.data.password),//md5加密

                confirmPassword:that.data.confirmPassword

            }),

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jx_sid':jx_sid,

                'Authorization':Authorization

            },

            success: function(res) {

                console.log(res.data)

                if(res.data.code=='-1'){

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    });

                }

                else if(res.data.code=='0000'){

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                    });

                    wx.navigateTo({
                        delta: 1
                    })

                }
            },

            fail:function (res) {

                console.log(res)
            }

        })

    },


    oldPasswordFn:function (e) {

        var that = this;
        that.setData({
            oldPassword: e.detail.value
        });

    },

    passwordFn:function (e) {

        var that = this;
        that.setData({
            password: e.detail.value
        });

    },

    confirmPasswordFn:function (e) {

        var that = this;
        that.setData({
            confirmPassword: e.detail.value
        });

    },

});