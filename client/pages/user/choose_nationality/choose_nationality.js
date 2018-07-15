const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const countryUrl ='/user/country/getcountry';//查询国籍

Page({


    data: {



    },


    onShow:function () {

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：查询国籍
         * 请求方式：POST
         * 接口：/user/country/getcountry
         * 入参：countryName
         * */
        wx.request({

            url: app.globalData.URL + countryUrl,

            method: 'POST',

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code, res.data.msg);

                if (res.data.code == '3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url: '../../common/signin/signin'
                        })

                    }, 1500)


                    return false


                }

                else {

                    var countrylist = res.data.data

                    for(var x in countrylist){

                        console.log(x)
                    }


                }


            },


            fail: function (res) {

                console.log(res)

            }

        })




    },

})