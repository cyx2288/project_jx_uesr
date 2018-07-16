const app = getApp();

const jykUrl = '/open/jyk/redirect';//加油卡

const trainticketUrl = '/open/trainticket/redirect';//火车票

const codeUrl = '/open/code/redirect';//二维码

const didiUrl='/open/didi/redirect';//滴滴

const jbtUrl ='/open/jbt/redirect';//嘉白条

const jdUrl = '/open/jd/redirect';//京东

const mtUrl ='/open/mt/redirect';//美团



Page({

    data:{

        jykUrl:'',//加油卡URL

        trainUrl:'',//高铁管家URL

        codeUrl:'',//二维码URL

        didiUrl:'',//滴滴

    },
    onShow: function () {

        var that = this;

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        wx.showNavigationBarLoading();

        setTimeout(function () {

            wx.hideNavigationBarLoading()

        },500);

        //加油卡
        wx.request({//注册

            url: app.globalData.URL + jykUrl,

            method: 'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                //console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

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



                    that.setData({

                        jykUrl:res.data.data,
                    })



                }


            },

            fail: function (res) {

                console.log(res)
            }

        })

        //火车票
        wx.request({//注册

            url: app.globalData.URL + trainticketUrl,

            method: 'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                //console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

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

                    that.setData({

                        trainUrl:res.data.data,
                    })



                }


            },

            fail: function (res) {

                console.log(res)
            }

        })

        //二维码
        wx.request({//注册

            url: app.globalData.URL + codeUrl,

            method: 'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                //console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

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

                    that.setData({

                        codeUrl:res.data.data,
                    })



                }


            },

            fail: function (res) {

                console.log(res)
            }

        })

        //滴滴
        wx.request({//注册

            url: app.globalData.URL + didiUrl,

            method: 'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                //console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

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

                    that.setData({

                        didiUrl:res.data.data,
                    })



                }


            },

            fail: function (res) {

                console.log(res)
            }

        })

        //嘉白条
        wx.request({//注册

            url: app.globalData.URL + jbtUrl,

            method: 'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                //console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

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



                    that.setData({

                        jbtUrl:res.data.data,
                    })



                }


            },

            fail: function (res) {

                console.log(res)
            }

        })

        //美团
        wx.request({//注册

            url: app.globalData.URL + mtUrl,

            method: 'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                //console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

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

                    that.setData({

                        mtUrl:res.data.data,
                    })



                }


            },

            fail: function (res) {

                console.log(res)
            }

        })

        //京东
        wx.request({//注册

            url: app.globalData.URL + jdUrl,

            method: 'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                //console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

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

    urlFn:function (e) {


            wx.navigateTo({

                url:"../webView/index"

            });


        wx.setStorageSync('GoUrl',e.currentTarget.dataset.url);

        wx.setStorageSync('GoNav',e.currentTarget.dataset.name);

        console.log(wx.getStorageSync('GoUrl'));

        console.log(wx.getStorageSync('GoNav'));

    },

    urlNoramlFn:function (e) {


        wx.navigateTo({

            url:"../normal_webView/index"

        });


        wx.setStorageSync('GoUrl',e.currentTarget.dataset.url);

        wx.setStorageSync('GoNav',e.currentTarget.dataset.name);

        console.log(wx.getStorageSync('GoUrl'));

        console.log(wx.getStorageSync('GoNav'));

    },







});