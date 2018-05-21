/**
 * Created by ZHUANGYI on 2018/5/14.
 **/

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const updatepaymodeUrl='/user/set/updatepaymode';//修改支付校验方式


Page({

    data:{

        msgMode:'1',

        pwdMode:'0',

        code:'',

        payPwd:'',

    },
    
    changModelFn:function () {

        var that = this;

        var thisUpdatepaymodeUrl=app.globalData.URL+updatepaymodeUrl;



        //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        /**
         * 接口：修改支付验证方式
         * 请求方式：POST
         * 接口：/user/set/updatepaymode
         * 入参： msgMode，pwdMode，code，payPwd
         **/

        wx.request({

            url:  thisUpdatepaymodeUrl,

            method:'POST',

            data: json2FormFn.json2Form({


                msgMode:that.data.msgMode,

                pwdMode:that.data.pwdMode,

                code:that.data.code,

                payPwd:that.data.payPwd,


            }),

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function(res) {

                console.log(res.data)


            },

            fail:function (res) {

                console.log(res)
            }

        })

        
    }





})