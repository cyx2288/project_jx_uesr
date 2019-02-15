const app = getApp();

const mineUrl = '/user/center/usercenter';//用户中心


Page({

    data:{

        errorCause:''

    },
    onShow:function () {

        var that = this;

        //获取数据
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

                app.globalData.token(res.header.Authorization)

                if (res.data.code == '3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url: '../../common/signin/signin'
                        })

                    }, 1500)


                    return false


                }

                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else {



                    that.setData({

                        errorCause:res.data.data.refuseReason
                    })




                }

            },

            fail: function (res) {

                console.log(res)
            }

        })


        wx.setStorageSync('successVerify', 'true');



    },

    goAgainFn:function () {

        wx.redirectTo({

            url: '../../../packageA/pages/choose_certification/choose_certification'

        })

    }

});