const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const getDetailRecord = '/user/withdraw/getdetailrecord';//获取详情

const checkcashUrl = '/user/work/checkwithdraw';//检测用户发起提现操作

const cashUrl = '/user/withdraw/dowithdraw';// 获取账户提现记录

Page({

    data: {

        bankName: '',

        bankNo: '',

        orderAmount: '',

        orderId: '',

        orderState: '',

        orderType: '',

        payAmount: '',

        rate: '',

        createDate:'',

        rateAmount: '',

        type: '',

        userName:'',

        mobile:'',

        errorMsg:'',

        alipayNo:'',



    },


    onLoad: function () {

        var that = this;

        var thisGetDetailRecord = app.globalData.URL + getDetailRecord;

        //有几个ajax请求
        var ajaxCount = 1;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _orderId = wx.getStorageSync('orderId');

        var _orderType = wx.getStorageSync('orderType')


        that.setData({


            userName:wx.getStorageSync('userName'),

            mobile:wx.getStorageSync('mobile'),


        })



        console.log('zfb为09 银行卡为08'+wx.getStorageSync('orderdowithdraw'))



        /**
         * 接口：
         * 请求方式：GET
         * 接口：/user/withdraw/getdetailrecord
         * 入参：orderId,orderType
         **/
        wx.request({

            url: thisGetDetailRecord,

            method: 'GET',

            data: {

                orderId: _orderId,

                orderType:_orderType,

            },

            header: {

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

                            url:'../../common/signin/signin'
                        })

                    },1500)

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else {

                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();






                    that.setData({


                        orderAmount: res.data.data.orderAmount,

                        orderState: res.data.data.orderState,

                        orderId: res.data.data.orderId,

                        payAmount: res.data.data.payAmount,

                        rate: res.data.data.rate,

                        rateAmount: res.data.data.rateAmount,

                        createDate: res.data.data.createDate,

                        orderType:res.data.data.orderType,




                    })



                    if(res.data.data.bankName&&res.data.data.bankNo){

                        that.setData({


                            bankName: res.data.data.bankName,

                            bankNo: res.data.data.bankNo,

                        })



                    }


                    if(res.data.data.alipayNo){

                        that.setData({

                            alipayNo:res.data.data.alipayNo,

                        })



                    }


                    if(res.data.data.errorMsg){


                        that.setData({

                            errorMsg: res.data.data.errorMsg,

                        })

                    }

                }


            },

            fail: function (res) {

                console.log(res)

            }

        })

    },

    payFn: function () {

        var that =this;

        var thisCashUrl = app.globalData.URL + cashUrl;

        var thisCheckcashUrl = app.globalData.URL + checkcashUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _isSecurity = wx.getStorageSync('isSecurity');



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

                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)


                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)

                    /*                    wx.showToast({
                     title: res.data.msg,
                     icon: 'none',
                     duration: 1500,
                     success:function () {



                     }

                     })*/

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }
                else {

                    if (res.data.code == '0000') {

                        wx.showModal({

                            title: '确认付款',
                            content: '支付金额￥' + that.data.payAmount + ',提现金额￥' + that.data.orderAmount + ',手续费￥' + that.data.rateAmount,
                            confirmText: '确认付款',
                            confirmColor: '#fe9728',

                            success: function (res) {

                                if (res.confirm) {

                                    if (_isSecurity == '1') {

                                        console.log('开启短信验证');

                                        wx.navigateTo({

                                            url: '../sms_verification/sms_verification'
                                        })


                                    }

                                    else if (_isSecurity == '2') {

                                        console.log('开启支付密码');

                                        wx.navigateTo({

                                            url: '../pws_verification/pws_verification'
                                        })


                                    }

                                    else if (_isSecurity == '3') {

                                        console.log('啥都没开启');

                                        confirmation()

                                    }


                                }

                                else if (res.cancel) {


                                }
                            }
                        });


                    }
                    else {


                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1000
                        })

                    }

                }
            },


            fail: function (res) {

                console.log(res)

            }

        });







        function confirmation() {

    /**
     * 接口：获取账户提现记录
     * 请求方式：GET
     * 接口：/user/withdraw/dowithdraw
     * 入参：bizId,bankCardId,balance,payPassword,code
     * */

    wx.request({

        url: thisCashUrl,

        method: 'GET',

        data: {

            bizId: that.data.orderId,//订单id

            bankCardId: that.data.bankCardId,//银行卡id

            balance: that.data.orderAmount,//提取现金

        },
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

                /*                     wx.showToast({
                 title: res.data.msg,
                 icon: 'none',
                 duration: 1500,
                 success: function () {



                 }

                 })*/

                return false


            }

            else if(res.data.code=='3004'){

                var Authorization = res.data.token.access_token;//Authorization数据

                wx.setStorageSync('Authorization', Authorization);

                return false
            }

            else {

                if (res.data.code == '0000') {

                    wx.redirectTo({

                        url: '../pay_success/pay_success'
                    })

                }

                else {

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1000
                    })
                }

            }

        },


        fail: function (res) {

            console.log(res)

        }

    })


}


    }


});