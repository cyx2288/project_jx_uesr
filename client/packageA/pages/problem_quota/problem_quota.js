
const app = getApp();

Page({


    data: {

        bankCard: {},

        alipay: {}

    },


    onLoad: function () {

        this.checkwithdrawAlipay();

        this.withdrawRate();

    },

    checkwithdrawAlipay:function () {

        var that = this;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        /**
         * 接口：获取支付宝限额信息
         * 请求方式：POST
         * 接口：/user/withdraw/getalipaylimit
         * 入参：null
         **/

        wx.request({

            url: app.globalData.URL+'/user/withdraw/getalipaylimit',

            method: 'GET',

            header:{

                'jxsid':jx_sid,

                'Authorization':Authorization

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

                    },1500);


                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }else {

                    var alipay = {};

                    alipay.amountMax = res.data.data.amountMax;

                    alipay.dayMaxAmount = res.data.data.dayMaxAmount;

                    alipay.monthMaxAmount  = res.data.data.monthMaxAmount;

                    alipay.monthMaxAmountByIdNumber = res.data.data.monthMaxAmountByIdNumber;

                    that.setData({

                        alipay: alipay

                    });

                }


            },


            fail: function (res) {
                console.log(res)
            }

        })


    },


    withdrawRate:function () {

        var that = this;

        var thisCheckcashUrl = app.globalData.URL + '/user/work/checkwithdraw';

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        /**
         * 接口：检测用户发起提现操作
         * 请求方式：GET
         * 接口：/user/work/checkwithdraw
         * 入参：null
         * */

        wx.request({

            url: thisCheckcashUrl,

            method: 'GET',

            header: {

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

                else if (res.data.code == '3004') {

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else {

                    var bankCard = {};

                    bankCard.amountMax = res.data.data.amountMax;

                    bankCard.dayMaxAmount = res.data.data.dayMaxAmount;

                    bankCard.monthMaxAmount  = res.data.data.monthMaxAmount;

                    bankCard.monthMaxAmountByIdNumber = res.data.data.monthMaxAmountByIdNumber;

                    that.setData({

                        bankCard: bankCard

                    });

                }

            }

        })


    },

});