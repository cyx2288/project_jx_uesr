
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const mineUrl ='/user/center/usercenter';//登录的url




Page({

    data:{


        mobile:'',//个人中心手机号

        wages:''//工资余额


    },

    onLoad:function () {

        var thisMineurl = app.globalData.URL+ mineUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        //获取余额
        var thisWages = wx.getStorageSync('wages');

        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：mobile
         **/
        wx.request({

            url:  thisMineurl,

            method:'POST',

            data: json2FormFn.json2Form({

                mobile:this.data.mobile,

            }),

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jx_sid':jx_sid,

                'Authorization':Authorization

            },

            success: function(res) {

                console.log(res.data);

                //存储手机号码
                that.setData({
                    mobile:res.data.data[0]
                });

                //存储余额
                that.setData({
                    wages:thisWages
                })
            },

            fail:function (res) {
                console.log(res)
            }

        })

    },



});