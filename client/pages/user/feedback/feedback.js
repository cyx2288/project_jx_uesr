const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const feedbackUrl ='/salary/home/getfeedback';//登录的url


Page({

    data: {

             isIpx: '',

             contentTitle:'',

             fixedInput: false,

             feedBackList:[],//反馈消息列表


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


        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/salary/home/getfeedback
         * 入参：feedbackDTO,pageNum,pageSize
         **/

        wx.request({

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

                console.log(res.data.data.list[0].details)

                that.setData({

                    feedBackList:res.data.data.list[0].details,

                })

       /*         app.globalData.repeat(res.data.code,res.data.msg);

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







                }*/

            },

            fail: function (res) {

                console.log(res)
            }

        })



    },

    changeInput:function () {


        var that = this;

        that.setData({

            fixedInput: true,

        })


    },

    inputBlur:function () {

        var that = this;

        that.setData({

            fixedInput: false,

        })

    },

    inputChange:function () {

        var that = this;

        that.setData({

            contentTitle: e.detail.value,

        })

    }


});