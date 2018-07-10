const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userVerify ='/user/center/userverify';//实名认证

const mineUrl ='/user/center/usercenter';//用户中心

const payeeUrl = '/record/selecthistoricalpayee';//查询历史收款人

Page({


    data: {


        userName:'',//姓名

        idNumber:'',//身份证

        isVerify:'',//是否认证

        hasUserName:true,//有没有用户姓名

    },


    onShow:function () {

        var that = this;

        var thisUserName = wx.getStorageSync('userName');

        var thisIdNumber = wx.getStorageSync('idNumber');

        var  _isVerify= wx.getStorageSync('isVerify');


        //console.log('是否认证'+_isVerify);

      /*  console.log('名字'+thisUserName)

        console.log('身份证'+thisIdNumber)*/

        that.setData({

            isVerify:_isVerify,

        });


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
                mask:true,

            })



        }

        else if(!check.test(that.data.idNumber)){

            wx.showToast({

                title: '身份证号格式错误',
                icon: 'none',
                mask:true,

            })



        }

        else {


            wx.showToast({

                title: '认证中',
                icon: 'loading',
                mask:true,

            })


            /**
             * 接口：实名认证
             * 请求方式：POST
             * 接口：/user/center/userverify
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

                        var _code = res.data.code;

                        //看是不是从支付设置的未认证页面过来
                        var _paySettingAuthentication = wx.getStorageSync('paySettingAuthentication');

                        var _personCenter = wx.getStorageSync('personCenter');

                        var _hrefId = wx.getStorageSync('hrefId');


                        if (_code == '0000') {

                            //存储实名认证状态
                            wx.setStorageSync('isVerify', '1');

                            //存储有没有认证操作成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                            wx.setStorageSync('successVerify','true');

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

                                    app.globalData.repeat(res.data.code,res.data.msg);

                                    if(res.data.code=='3001') {

                                        //console.log('登录');

                                        setTimeout(function () {

                                            wx.reLaunch({

                                                url:'../../common/signin/signin'
                                            })

                                        },1500);


                                        return false


                                    }

                                    else {

                                        console.log(res.data);

                                        wx.setStorageSync('userName', res.data.data.userName);

                                    }


                                },

                                fail: function (res) {

                                    console.log(res)
                                }

                            })


                            setTimeout(function () {

                                wx.showToast({

                                    title: '认证成功',
                                    icon: 'success',
                                    mask:true,

                                })

                            }, 500)

/*

                            console.log('未设置支付密码' + thisPayPwd);

                            console.log('从未设置跳转' + _hrefId);
*/

                           //console.log('从支付设置来应该是1='+_paySettingAuthentication);

                           //console.log('从个人中心过来应该是1='+_personCenter)


                            //判断退回的页面

    /*                        if (thisPayPwd=='0'&&_hrefId == '8') {


                                wx.redirectTo({

                                    url: '../code/code'

                                })


                            }*/

                            //支付设置页面未实名认证跳转到设置支付密码
/*
                            else if(_paySettingAuthentication=='1'){

                               console.log('从支付页面')

                                setTimeout(function () {

                                    wx.redirectTo({

                                        url: '../set_payment_psw/set_payment_psw'

                                    })

                                },1000)


                            }



*/

                             if(_personCenter=='1'){

                                console.log('从个人中心')

                                 setTimeout(function () {

                                     wx.navigateBack({

                                         delta: 1,

                                     })

                                     that.onLoad();


                                 },1000)


                            }

                             else if(_hrefId=='4'){

                                 setTimeout(function () {

                                wx.navigateBack({

                                    delta: 1,

                                })

                                 },1000)

                            }

                             else if(_hrefId=='8'){

                                 console.log('从转账');


                                 /**
                                  * 接口：查询历史收款人
                                  * 请求方式：post
                                  * 接口：/record/selecthistoricalpayee
                                  * 入参：null
                                  **/
                                 wx.request({

                                     url: app.globalData.URL + payeeUrl,

                                     method: 'POST',

                                     header: {

                                         'content-type': 'application/x-www-form-urlencoded',// post请求

                                         'jxsid': jx_sid,

                                         'Authorization': Authorization

                                     },

                                     success: function (res) {

                                         console.log(res.data);

                                         if(res.data.data){

                                             console.log('有历史')

                                             setTimeout(function () {

                                             wx.redirectTo({

                                                 url: '../transfer_accounts/transfer_accounts'

                                             })

                                             },1000)


                                         }

                                         else{

                                             console.log('没历史')

                                             setTimeout(function () {

                                             wx.redirectTo({

                                                 url: '../girokonto/girokonto'

                                             })
                                         },1000)

                                         }

                                     },


                                     fail: function (res) {

                                         console.log(res)

                                     }

                                 })



                             }


                        }



                        else {


                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask:true,

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