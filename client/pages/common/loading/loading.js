
const app = getApp();

const mineUrl = '/user/center/usercenter';//用户中心


Page({

    onShow:function () {

        var thisMineurl = app.globalData.URL + mineUrl;

        //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        wx.showLoading({

            mask:true,
            title: '跳转中',

        })


        if(!jx_sid && !Authorization){

            /**
             * 接口：用户中心
             * 请求方式：POST
             * 接口：/user/center/usercenter
             * 入参：mobile
             **/
            wx.request({

                url: thisMineurl,

                method: 'POST',

                header: {
                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code,res.data.msg);

                    if(res.data.code=='3001') {

                        //console.log('登录过期');

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

                        setTimeout(function () {

                            wx.switchTab({

                                url:'../../wages/index/index'
                            })

                        },1500)


                    }

                },

                fail: function (res) {

                    console.log(res)
                }

            })




        }

        else {

            setTimeout(function () {

                wx.switchTab({

                    url:'../../wages/index/index'
                })

            },1500)



        }
    }


})