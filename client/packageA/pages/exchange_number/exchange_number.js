const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userCenterUrl = '/user/center/usercenter';//用户中心的url

Page({

    data:{

        mobile:''

    },

    onShow:function(){


        var that = this;
        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //存取数据 在认证页面
        wx.setStorageSync('hrefId','1');

        //有几个ajax请求
        var ajaxCount = 1;

        /**
         * 接口：个人中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + userCenterUrl,

            method: 'POST',

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

                    return false


                }

                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else {



                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();

                    //存最新的手机号 后面那个页面获取
                    wx.setStorageSync('changeMobile',res.data.data.mobile);

                    console.log('最新手机号'+ wx.getStorageSync('changeMobile'));


                    that.setData({

                        mobile: res.data.data.mobile.substr(0, 3) + '****' + res.data.data.mobile.substr(7),



                    });





                }

            },

            fail: function (res) {

                console.log(res)

            }

        })



    },


    changeNumFn:function () {

        wx.navigateTo({

            url:'../code/code'
        })
    }
    

})