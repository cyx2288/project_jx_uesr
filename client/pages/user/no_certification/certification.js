const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userVerify ='/user/center/userverify';//实名认证

const mineUrl ='/user/center/usercenter';//用户中心

Page({


    data: {


        userName:'',//姓名

        idNumber:'',//身份证

        isVerify:'',//是否认证

        hasUserName:true


    },


    onShow:function () {

        var that = this;

        var thisUserName = wx.getStorageSync('userName');

        var thisIdNumber = wx.getStorageSync('idNumber');

        var  _isVerify= wx.getStorageSync('isVerify');

        //console.log('是否认证'+_isVerify);

        console.log('名字'+thisUserName)

        console.log('身份证'+thisIdNumber)

        that.setData({

            isVerify:_isVerify,

        })


        if(thisUserName){


            that.setData({

                userName:thisUserName,

                idNumber:thisIdNumber,

                hasUserName:true


            });


        }

        else {

            that.setData({

                userName:that.data.userName,

                idNumber:that.data.idNumber,

                hasUserName:false


            });



        }








    },

    submitVerifyFn:function () {

        var thisUserVerify = app.globalData.URL + userVerify;

        var thisMineurl = app.globalData.URL+ mineUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');


        var Authorization = wx.getStorageSync('Authorization');

        //存指定的页面

        var _hrefId = wx.getStorageSync('hrefId');

        var thisPayPwd =  wx.getStorageSync('isPayPwd');


        var check = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

        if(!that.data.userName||!that.data.idNumber){

            wx.showToast({

                title: '请输入姓名和身份证号',
                icon: 'none',

            })



        }

        else if(!check.test(that.data.idNumber)){

            wx.showToast({

                title: '身份证号格式错误',
                icon: 'none',

            })



        }

        else {


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

                    userName:that.data.userName,

                    idNumber:that.data.idNumber

                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded',// post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },



                success: function (res) {

                    console.log(res.data);

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

                        var _code = res.data.code;

                        if (_code == '0000') {

                            wx.setStorageSync('isVerify', '1');

                            //认证成功后调用个人中心接口
                            /**
                             * 接口：用户中心
                             * 请求方式：POST
                             * 接口：/user/center/usercenter
                             * 入参：mobile
                             **/
                            wx.request({

                                url: thisMineurl,

                                method: 'POST',

                                header: {
                                    'content-type': 'application/x-www-form-urlencoded', // post请求

                                    'jxsid': jx_sid,

                                    'Authorization': Authorization

                                },

                                success: function (res) {

                                    console.log(res.data);

                                    wx.setStorageSync('userName', res.data.data.userName);


                                },

                                fail: function (res) {

                                    console.log(res)
                                }

                            })


                            setTimeout(function () {

                                wx.showToast({

                                    title: '认证成功',
                                    icon: 'success',

                                })

                            }, 500)


                            console.log('未设置支付密码' + thisPayPwd);

                            console.log('从未设置跳转' + _hrefId);


                            if (thisPayPwd == '0' && _hrefId == '8') {


                                wx.redirectTo({

                                    url: '../code/code'

                                })


                            }

                            else {


                                wx.navigateBack({

                                    delta: 1,

                                })

                                that.onLoad();

                            }


                        }

                        else {


                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',


                            })


                        }

                    }




                },

                fail: function (res) {

                    console.log(res)

                }

            })


        }









    },

    nameFn:function (e) {

        var that = this;

        that.setData({

            userName: e.detail.value
        });

    },

    idFn:function (e) {

        var that = this;

        that.setData({

            idNumber: e.detail.value

        });

    },


})