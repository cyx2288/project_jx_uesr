const app = getApp();

const mineUrl = '/user/center/usercenter';//用户中心

Page({


    data: {

        userName:'',//姓名

        idNumber:'',//身份证

        isVerify:'',//是否认证

        nationality:'',//国籍

        idType:''//证件类型

    },


    onShow:function () {

        var that = this;

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：mobile
         **/
        wx.request({

            url: app.globalData.URL + mineUrl,

            method: 'POST',

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

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


                    that.setData({

                        isVerify:res.data.data.isVerify,

                        userName:res.data.data.userName,

                        idNumber:res.data.data.idNumber,

                        nationality:res.data.data.nationality,//国籍

                        idType:res.data.data.idType//证件类型

                    });



                }

            },

            fail: function (res) {

                console.log(res)
            }

        })




    },



})