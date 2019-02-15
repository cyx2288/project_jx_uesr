const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const getDetailRecord = '/user/withdraw/getdetailrecord';// 获取账户订单记录详情



Page({

    data: {

        orderAmount: '',

        orderId: '',

        orderState: '',

        orderType:'',

        /*payAmount: '',*/

        createDate:'',

        userName:'',//转账姓名

        mobile:'',//转账号码

        remark:'',//转账备注

    },


    onShow: function () {

        var that = this;

        //有几个ajax请求
        var ajaxCount = 1;


        var thisGetDetailRecord = app.globalData.URL + getDetailRecord;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _transferOrderId = wx.getStorageSync('transferOrderId');

        var _orderId = wx.getStorageSync('orderId');

        var _orderType = wx.getStorageSync('orderType');

        var _mobile = wx.getStorageSync('transferMobile');

        var _billHref = wx.getStorageSync('billHref');

        that.setData({

            orderType:_orderType


        });

        console.log(that.data.orderType)

        if(_billHref=='4'){


            console.log('从账单过来的')


            /**
             * 接口：获取账户订单记录详情
             * 请求方式：GET
             * 接口：/user/withdraw/getdetailrecord
             * 入参：orderId
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

                        if(res.data.data.remark){

                            that.setData({

                                remark:res.data.data.remark,

                            })

                        }

                        that.setData({


                            orderAmount:  res.data.data.orderAmount,

                            orderState: res.data.data.orderState,

                            orderId: res.data.data.orderId,

                            orderType: res.data.data.orderType,

                            userName:res.data.data.userName,

                            mobile:res.data.data.mobile,

                           /* payAmount: res.data.data.payAmount,*/

                            createDate: res.data.data.createDate,


                        })

                    }


                },

                fail: function (res) {

                    console.log(res)

                }

            })


        }

        else if(_billHref=='6'){

            console.log('从查看订单');


            /**
             * 接口：获取账户订单记录详情
             * 请求方式：GET
             * 接口：/user/withdraw/getdetailrecord
             * 入参：orderId
             **/
            wx.request({

                url: thisGetDetailRecord,

                method: 'GET',

                data: {

                    orderId: _transferOrderId,

                    orderType:'02',


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

                        if(res.data.data.remark){

                            that.setData({

                                remark:res.data.data.remark,

                            })

                        }

                        that.setData({


                            orderAmount:  res.data.data.orderAmount,

                            orderState: res.data.data.orderState,

                            orderId: res.data.data.orderId,

                            orderType: res.data.data.orderType,

                            userName:res.data.data.userName,

                            mobile:res.data.data.mobile,

                           /* payAmount: res.data.data.payAmount,*/

                            createDate: res.data.data.createDate,


                        })

                    }


                },

                fail: function (res) {

                    console.log(res)

                }

            })

        }


    },


    /*payFn: function () {

        var that =this;

        var thisCashUrl = app.globalData.URL + cashUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _isSecurity = wx.getStorageSync('isSecurity');

        wx.showModal({

            title: '确认付款',
            content: '支付金额￥' + that.data.payAmount + ',提现金额￥'+that.data.orderAmount+',手续费￥'+that.data.rateAmount,
            confirmText: '确认付款',
            confirmColor:'#fe9728',

            success: function (res) {

                if (res.confirm) {

                    if(_isSecurity=='1'){

                        console.log('开启短信验证');

                        wx.navigateTo({

                            url: '../sms_verification/sms_verification'
                        })



                    }

                    else if(_isSecurity=='2'){

                        console.log('开启支付密码');

                        wx.navigateTo({

                            url: '../pws_verification/pws_verification'
                        })


                    }

                    else if(_isSecurity=='3'){

                        console.log('啥都没开启');

                        confirmation()

                    }



                }

                else if (res.cancel) {


                }
            }
        });



        function confirmation() {

            /!**
             * 接口：获取账户提现记录
             * 请求方式：GET
             * 接口：/user/withdraw/dowithdraw
             * 入参：bizId,bankCardId,balance,payPassword,code
             * *!/

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

                    app.globalData.repeat(res.data.code,res.data.msg);

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)


                        return false


                    }

                    else {

                        if (res.data.code == '0000') {

                            wx.redirectTo({

                                url: '../pay_success/pay_success'
                            })

                        }

                        else {

                            wx.redirectTo({

                                url: '../pay_fail/pay_fail'
                            })
                        }

                    }

                },


                fail: function (res) {

                    console.log(res)

                }

            })


        }


    },*/



});