const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const getDate=require('../../../static/libs/script/date.js');

const clearingUrl = '/user/account/clearing';//登录的url


Page({

    data: {

        balanceList: [],//工资明细




    },

    onLoad: function () {

        var thisClearingurl = app.globalData.URL + clearingUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisUserClearId = wx.getStorageSync('userClearId');


        /**
         * 接口：
         * 请求方式：GET
         * 接口：/user/account/clearing
         * 入参：userClearId
         **/
        wx.request({

            url: thisClearingurl,

            method: 'GET',

            data: {

                userClearId: thisUserClearId

            },

            header: {

                'jx_sid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                var _balanceList = res.data.data.list;



                that.setData({

                    balanceList:_balanceList

                })






            },

            fail: function (res) {

                console.log(res)

            }

        })

    },


});