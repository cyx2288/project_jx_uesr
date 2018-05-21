/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const paymsgUrl = '/jx/action/paymsg';



Page({

    data:{

        mobile:'',//手机号

        last_time:'',//倒计时

        code:'',//验证码


    },
    onLoad:function () {


        var thisPaymsgUrl= app.globalData.URL+paymsgUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        var _mobile = wx.getStorageSync('mobile');

        var countdown = 120;

        that.setData({

            mobile:_mobile,

        });

        settime(that);

        function settime(that) {

            if (countdown < 0) {

                countdown = 120;

                return;

            } else {

                that.setData({

                    last_time:countdown

                });

                countdown--;
            }
            setTimeout(function () {
                    settime(that)
                }
                , 1000)





        }
        
        /**
         * 接口：设置支付密码（验证码）
         * 请求方式：GET
         * 接口：/jx/action/paymsg
         * 入参：null
         * */

        wx.request({

            url: thisPaymsgUrl,

            method: 'GET',

            header:{

                'jx_sid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                if(res.data.data.code=='0000'){



                }
                else {




                }




            },


            fail: function (res) {

                console.log(res)

            }

        })





    },
    
    codeFn:function () {

        var that = this;

        that.setData({



        })
        
    }



})

