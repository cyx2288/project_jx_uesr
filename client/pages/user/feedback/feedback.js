const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const feedbackUrl ='/salary/home/getfeedback';//登录的url


Page({

    data: {

             isIpx: '',

             contentTitle:'',

             fixedInput: false,


    },

    onShow: function () {


        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisfeedbackUrl = app.globalData.URL + feedbackUrl;

        var that = this;

        var ipX = app.globalData.isIpx;


        that.setData({


            isIpx: ipX ,


        })

        console.log(that.data.isIpx)

        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/salary/home/getfeedback
         * 入参：feedbackDTO,pageNum,pageSize
         **/

        /*wx.request({

            url: thisfeedbackUrl,

            method: 'POST',

            data: json2FormFn.json2Form({



            }),

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                console.log(res.data);


            },

            fail: function (res) {

                console.log(res)
            }

        })*/



    },

    changeInput:function () {


        var that = this;

        that.setData({

            fixedInput: true,

        })


    },

    inputChange:function () {

        var that = this;

        that.setData({

            contentTitle: e.detail.value,

        })

    }


});