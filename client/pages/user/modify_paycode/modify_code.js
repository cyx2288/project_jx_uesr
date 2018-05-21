const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密

const modifycode='/user/set/updatepaypwd';//注册的url地址






Page({

    data:{

        oldPassword:'',//原手机密码

        password:'',//新密码

        confirmPassword:''//密码

    },

    modifyCode:function () {

        var url=app.globalData.URL+modifycode;

        console.log(json2FormFn.json2Form({
            mobile: this.data.mobile ,
            password: md5.hexMD5(this.data.password),//md5加密
            code:this.data.checkCode
        }))

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        wx.request({

            url:  url,

            method:'POST',

            data: json2FormFn.json2Form({
                oldPassword: md5.hexMD5(
                    this.data.oldPassword
                ),
                password: md5.hexMD5(
                    this.data.password
                ),

                confirmPassword:md5.hexMD5(
                    this.data.confirmPassword
                )
            }),

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization
            },

            success: function(res) {
                console.log(res.data);

                if(res.data.code=='-1'){

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    });

                }else if(res.data.code=='0000'){

                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                    });

                    wx.navigateTo({

                        url:"pages/user/reset_payment/reset_payment"
                    })
                }
            },

            fail:function (res) {
                console.log(res)
            }

        })

    },

    /**
     * 接口：
     * 请求方式：
     * 接口：GET
     * 入参：
     **/

   /* registmsg:function () {

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
*/
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

    openToast: function () {
        wx.showToast({
            title: '修改成功',
            icon: 'success',
        });
    },

});