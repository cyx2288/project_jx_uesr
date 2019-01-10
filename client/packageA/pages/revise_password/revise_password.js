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
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var a = /[@#\$%\^&\*]+/g;

        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;


        //校验原密码

        if(that.data.oldPassword==''){

            wx.showToast({

                title: '请输入原密码',
                icon: 'none',
                mask:true,

            });

        }

        else if(that.data.password==''||that.data.password.length<6){

            wx.showToast({

                title: '请输入正确的新密码',
                icon: 'none',
                mask:true,

            });


        }

        else if(that.data.confirmPassword==''||that.data.confirmPassword.length<6){

            wx.showToast({

                title: '请再次输入正确的密码',
                icon: 'none',
                mask:true,

            });

        }

        else if(a.test(that.data.password)||a.test(that.data.confirmPassword)){

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none',
                mask:true,

            });

        }

        else if(that.data.password.length<6||that.data.confirmPassword.length<6){

            wx.showToast({

                title: '密码长度为6-20位',
                icon: 'none',
                mask:true,

            });

        }

        else if(!reg.test(that.data.password)){

            wx.showToast({

                title: '密码需包含数字和字母',
                icon: 'none',
                mask:true,

            });

        }

        else if(that.data.password!=that.data.confirmPassword){
            wx.showToast({

                title: '两次密码输入不一致',
                icon: 'none',
                mask:true,

            });

        }



        else {



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

                    confirmPassword:md5.hexMD5(that.data.confirmPassword)

                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid':jx_sid,

                    'Authorization':Authorization

                },

                success: function(res) {

                    console.log(res.data)

                    //code3003返回方法
                    app.globalData.repeat(res.data.code,res.data.msg);



                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../../pages/common/signin/signin'
                            })

                        },1500)

                 /*       wx.showToast({
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
                                icon: 'success',
                                mask:true,
                            });

                            setTimeout(function () {

                                wx.navigateBack({
                                    delta: 1
                                })

                            }, 1000)


                        }

                        else {

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                mask:true,
                            });

                        }

                    }


                },

                fail:function (res) {

                    console.log(res)
                }

            })

        }



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