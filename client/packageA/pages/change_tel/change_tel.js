const app = getApp();

const getAllMobileUrl = '/user/user/getswitchuserinfo';

const changeMobile = '/user/user/switchuser';


Page({

    data: {


        mobileList:'',//电话号码

        mobile: '',

        showMobile: ''



    },

    onShow: function () {

        this.setData({

            showMobile: wx.getStorageSync('mobile').substr(0, 3) + '****' + wx.getStorageSync('mobile').substr(7),

            mobile: wx.getStorageSync('mobile')

        });

        var thisUserCenterUrl = app.globalData.URL + getAllMobileUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口： 获取用户切换信息
         * 请求方式： GET
         * 接口： /user/user/getswitchuserinfo
         * 入参：null
         **/
        wx.request({

            url: thisUserCenterUrl,

            method: 'GET',

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },


            success: function (res) {

                console.log(res.data);

                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)

                if(res.data.code=='3001') {

                    //console.log('登录');
                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../../pages/common/signin/signin'
                        })

                    },1500)

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else if(res.data.code == '0000') {

                    console.log(res.data);

                    for(var user of res.data.data){

                        user.showMobile = user.mobile.substr(0, 3) + '****' + user.mobile.substr(7);

                    }

                    that.setData({

                        mobileList: res.data.data

                    });

                }

            },

            fail: function (res) {

                console.log(res)

            }

        })



    },


    changeMobile: function (e) {

        var userId = e.currentTarget.dataset.userid;

        if(userId == 'none'){

            wx.switchTab({

                url: '../../../pages/user/mine/mine'

            });

            return false;

        }

        var thisUserCenterUrl = app.globalData.URL + changeMobile;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口： 获取用户切换信息
         * 请求方式： GET
         * 接口： /user/user/switchuser
         * 入参：null
         **/
        wx.request({

            url: thisUserCenterUrl,

            method: 'GET',

            data: {

                userId: userId

            },

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },


            success: function (res) {

                console.log(res);

                console.log(res.data);

                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)

                if(res.data.code=='3001') {

                    //console.log('登录');
                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../../pages/common/signin/signin'
                        })

                    },1500)

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else if(res.data.code == '0000') {

                    var Authorization = res.data.data;

                    wx.setStorageSync('Authorization',Authorization);

                    wx.setStorageSync('successVerify','true');

                    wx.reLaunch({

                        url:'../../../pages/user/mine/mine'
                    });

                }

            },

            fail: function (res) {

                console.log(res)

            }

        })




    },








});