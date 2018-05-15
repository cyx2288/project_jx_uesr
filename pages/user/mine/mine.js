
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const mineUrl ='/user/center/usercenter';//登录的url

const joinEntURL = '/user/workunit/selectisjoinent'//有带加入企业




Page({

    data:{


        mobile:'',//个人中心手机号

        wages:'',//工资余额

        hasJoinEnt:true,//默认不显示有新的邀请 true为不显示 false为显示


    },

    onLoad:function () {

        var thisMineurl = app.globalData.URL+ mineUrl;

        var thisJoinEntURL = app.globalData.URL + joinEntURL;

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


        /**
         * 接口：有待加入企业
         * 请求方式：GET
         * 接口：/user/workunit/selectisjoinent
         * 入参：null
         **/
        wx.request({

            url:  thisJoinEntURL,

            method:'GET',

            header: {

                'jx_sid':jx_sid,

                'Authorization':Authorization

            },

            success: function(res) {

                console.log(res.data);


                //判断是否显示有新邀请

                var hasEntType = res.data.data.type;

                if(hasEntType=='1'){

                    that.setData({

                        hasJoinEnt:false,

                    })

                }

                else {

                    that.setData({

                        hasJoinEnt:true

                    })

                }






            },

            fail:function (res) {

                console.log(res)
            }

        })

    },





});