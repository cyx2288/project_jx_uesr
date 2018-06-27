const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密

const modifycode='/user/set/updatepaypwd';//更新支付验证码的接口






Page({

    data:{

        oldPassword:'',//原手机密码

        password:'',//新密码

        confirmPassword:''//密码

    },

    modifyCode:function () {

        var url=app.globalData.URL+modifycode;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //连续
        var reg='1234567890_0987654321';

        //重负
        var regText = /^(?=.*\d+)(?!.*?([\d])\1{5})[\d]{6}$/;

        var a = /[@#\$%\^&\*]+/g;

        var that=this;


        //如果手机号是正常的
        if(that.data.oldPassword==''||that.data.oldPassword.length<6){

            wx.showToast({

                title: '请输入6位验证码',
                icon: 'none'

            });

        }

        else if(that.data.password==''||that.data.password.length<6){

            wx.showToast({

                title: '请输入6位新验证码',
                icon: 'none'

            });

        }

        else if(a.test(that.data.password)||a.test(that.data.confirmPassword)){

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none'

            });

        }

        //连续
        else if(reg.indexOf(that.data.password)>=0){

            wx.showToast({

                title: '请输入非连续、重复的6位密码',
                icon: 'none'

            });

        }

        //重复
        else if(!regText.test(that.data.password)){

            wx.showToast({

                title: '请输入非连续、重复的6位密码',
                icon: 'none'

            });

        }

        else if(that.data.confirmPassword !=that.data.password){

            wx.showToast({

                title: '请两次输入相同的验证码',
                icon: 'none'

            });

        }


        else{

            //支付
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

                    else {

                        if (res.data.code == '-1') {

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                            });

                        } else if (res.data.code == '0000') {

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                            });

                            setTimeout(function () {

                                wx.navigateBack({
                                    delta: 2
                                })

                            }, 500)


                        }

                    }
                },

                fail:function (res) {
                    console.log(res)
                }

            })


        }


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

/*    openToast: function () {
        wx.showToast({
            title: '修改成功',
            icon: 'success',
        });
    },*/

});