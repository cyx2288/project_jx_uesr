const app = getApp();

const jykUrl = '/open/jyk/redirect';//加油卡

const trainticketUrl = '/open/trainticket/redirect';//火车票

const codeUrl = '/open/code/redirect';//二维码

const didiUrl='/open/didi/redirect';//滴滴

const jbtUrl ='/open/jbt/redirect';//嘉白条

const jdUrl = '/open/jd/redirect';//京东

const mtUrl ='/open/mt/redirect';//美团

const mineUrl = '/user/center/usercenter';//用户中心



Page({

    data:{

        jykUrl:'',//加油卡URL

        trainUrl:'',//高铁管家URL

        codeUrl:'',//二维码URL

        didiUrl:'',//滴滴

        mtUrl:'',//美团

        jbtUrl:'',//嘉白条

        jdUrl:'',//京东

        isOpen:''//是否在

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

        });

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
        /*wx.request({//注册

            url: app.globalData.URL + codeUrl,

            method: 'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                console.log(res.data.data);

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

        })*/

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

                    console.log(res.data.data);


                    that.setData({

                        isOpen:res.data.data.isOpen

                    })

                }



            },

            fail: function (res) {

                console.log(res)
            }

        })





    },

    urlFn:function (e) {

        var that = this;

        if((that.data.isOpen=='0'&&that.data.isVerify == '3')||(that.data.isOpen=='0'&&that.data.isVerify == '0')){

            //存指定的页面  （在实名认证中取值）
            wx.setStorageSync('hrefId','6');


            wx.showModal({
                title: '提示',
                content: '为保障账户资金安全，实名用户才能使用账户消费，请先完成实名认',
                cancelText: '取消',
                confirmText: '去认证',
                confirmColor:'#fe9728',
                success: function (res) {

                    if (res.confirm) {

                        wx.navigateTo({

                            url: '../../user/no_certification/certification'

                        })

                    }

                    else if (res.cancel) {


                    }



                }
            });

        }

        else if(that.data.isOpen=='0'&&that.data.isVerify == '2'){

            //存指定的页面  （在实名认证中取值）
            wx.setStorageSync('hrefId','6');


            wx.showModal({
                title: '提示',
                content: '实名认证审核中，审核通过后即可使用账户消费',
                showCancel:false,
                confirmText: '我知道了',
                confirmColor:'#fe9728',
                success: function (res) {

                    if (res.confirm) {

                    }

                    else if (res.cancel) {


                    }



                }
            });


        }

        else {

            //初始化变量 - 实名认证&&提现成功&&有
            wx.setStorageSync('successVerify', 'true');

            //首页变量初始化
            wx.setStorageSync('successRefresh', 'true');

            wx.navigateTo({

                url:"../webView/index"

            });

            wx.setStorageSync('GoUrl',e.currentTarget.dataset.url);

            wx.setStorageSync('GoNav',e.currentTarget.dataset.name);

        }


        console.log(wx.getStorageSync('GoUrl'));

        console.log(wx.getStorageSync('GoNav'));

    },







});