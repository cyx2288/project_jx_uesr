const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userCenterUrl = '/user/center/usercenter';//用户中心的url

const logOutUrl = '/user/set/logout';//退出登录url


Page({

    data: {


        mobile:'',//电话号码

        isVerify:'',//是否认证

        verifyValue:'',//认证文案

        idNumber:''//身份证号码


    },

    onLoad: function () {

        var thisUserCenterUrl = app.globalData.URL + userCenterUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');



        /**
         * 接口：
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：null
         **/
        wx.request({

            url: thisUserCenterUrl,

            method: 'POST',

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                wx.setStorageSync('idNumber',res.data.data.idNumber);

                wx.setStorageSync('isVerify',res.data.data.isVerify);

                that.setData({

                    mobile:res.data.data.mobile,

                    isVerify:res.data.data.isVerify,

                    idNumber:res.data.data.idNumber


                });


            },

            fail: function (res) {

                console.log(res)

            }

        })



    },


    logOutFn:function () {

        var thisLogOutUrl = app.globalData.URL + logOutUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');


        wx.showModal({
            title: '提示',
            content: '确定要退出登录？',
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) {

                if (res.confirm) {

                    logOut();


                }

                else if (res.cancel) {



                }
            }
        });


        function logOut() {

            /**
             * 接口：
             * 请求方式：POST
             * 接口：/user/center/usercenter
             * 入参：null
             **/
            wx.request({

                url:thisLogOutUrl,

                method: 'GET',

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    var thisCode = res.data.code;


                    if(thisCode =='0000'){

                        //跳回登录页
                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    }

                },

                fail: function (res) {

                    console.log(res)

                }

            })


        }


    },








});