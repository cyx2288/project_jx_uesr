const app = getApp();

const jdUrl ='/open/jd/redirect';//登录的url


Page({

    data:{


        jdUrl:'',

    },
    onShow: function () {

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisJdUrl = app.globalData.URL + jdUrl;

        var that = this;

            wx.request({//注册

                url: thisJdUrl,

                method: 'GET',

                header: {

                    'jxsid':jx_sid,

                    'Authorization':Authorization

                },


                success: function (res) {

                    console.log(res.data);

                    //code3003返回方法
                    app.globalData.repeat(res.data.code,res.data.msg);

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

                        wx.showLoading({

                            title: '加载中',
                        })

                        setTimeout(function(){

                            wx.hideLoading()

                        },2000)


                        that.setData({

                            jdUrl:res.data.data,
                        })


                    }


                },

                fail: function (res) {

                    console.log(res)
                }

            })





    },



});