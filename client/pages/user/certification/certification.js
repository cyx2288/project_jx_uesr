const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userVerify ='/user/center/userverify';//实名认证

Page({


    data: {


        userName:'',//姓名

        idNumber:'',//身份证

        isVerify:'',//是否认证



    },


    onShow:function () {

        var that = this;

        var thisUserName = wx.getStorageSync('userName');

        var thisIdNumber = wx.getStorageSync('idNumber');

        var  _isVerify= wx.getStorageSync('isVerify');

        console.log('是否认证'+_isVerify);

        console.log('名字'+thisUserName)

        console.log('身份证'+thisIdNumber)

        that.setData({

            isVerify:_isVerify,

            userName:thisUserName,

            idNumber:thisIdNumber

        });





    },

    submitVerifyFn:function () {

        var thisUserVerify = app.globalData.URL + userVerify;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisUserName = wx.getStorageSync('userName');

        var thisIdNumber = wx.getStorageSync('idNumber');

        wx.showToast({

            title: '认证中',
            icon: 'loading',

        })


        /**
         * 接口：
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：userName,idNumber
         **/
        wx.request({

            url:thisUserVerify,

            method: 'POST',

            data: json2FormFn.json2Form({

                userName:thisUserName,

                idNumber:thisIdNumber

            }),

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },



            success: function (res) {

                console.log(res.data);

                var _code = res.data.code;

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success:function () {

                            setTimeout(function () {

                                wx.reLaunch({

                                    url:'../../common/signin/signin'
                                })

                            },1500)

                        }

                    })

                    return false


                }

                else {

                    if (_code == '0000') {


                        setTimeout(function () {

                            wx.showToast({

                                title: '认证成功',
                                icon: 'success',

                            })

                        }, 500)

                        wx.redirectTo({

                            url: '../personal/personal'
                        });

                        that.onLoad();


                    }

                    else {

                        wx.showToast({

                            title: '认证失败',
                            icon: 'none',


                        })
                    }
                }




            },

            fail: function (res) {

                console.log(res)

            }

        })



    },


})