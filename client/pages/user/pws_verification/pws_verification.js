/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const cashUrl = '/user/withdraw/dowithdraw';// 用户发起提现操作

const transferUrl = '/user/transfer/dotransfer';//用户发起转账操作



Page({

    data:{

        mobile:'',//手机号

        idNumber:'',//份证号

        payPassword:'',//支付密码


    },

    onShow:function () {


        var that = this;


        //如果设置成功的话 返回输入页面值清空

        var _clearPsw = wx.getStorageSync('clearPsw');


        //存储在设置支付密码成功之后8为正常 4为要调用支付设置接口
        wx.setStorageSync('paySettingHref','8');



        if(_clearPsw=='6'){


            that.setData({

                payPassword:'',//支付密码

            })

        }



    },

    clickCash:function () {

        var that = this;

        var thisCashUrl = app.globalData.URL + cashUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //提现部分
        var _balance = wx.getStorageSync('balance');

        var _bankCardId = wx.getStorageSync('bankCardId');

        //转账部分
        var _transferBalance = wx.getStorageSync('transferBalance');

        var _transferCash = wx.getStorageSync('transferCash');

        var _mobile = wx.getStorageSync('transferMobile');

        var _transferTips = wx.getStorageSync('transferTips');//备注


        //判断密码是否为空
        if(!that.data.payPassword){

            wx.showToast({

                title: '请输入支付密码！',
                icon: 'none',
                mask:true,

            })


        }

        else {


            if(_transferCash=='5'){



                /**
                 * 接口：获取账户转账记录
                 * 请求方式：GET
                 * 接口：/user/transfer/dotransfer
                 * 入参：mobile,balance,payPassword
                 * */

                wx.request({

                    url: app.globalData.URL + transferUrl,

                    method: 'GET',

                    data: {


                        mobile: _mobile,//手机号

                        balance: _transferBalance,//转账现金

                        payPassword: md5.hexMD5(that.data.payPassword),//密码

                        remark:_transferTips




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
                        else if(res.data.code=='3004'){

                            var Authorization = res.data.token.access_token;//Authorization数据

                            wx.setStorageSync('Authorization', Authorization);

                            return false
                        }

                        else {


                            //订单详情
                            wx.setStorageSync('transferOrderId', res.data.data);

                            console.log(wx.getStorageSync('transferOrderId'));

                            //存储有没有提现成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                            wx.setStorageSync('successVerify','true');


                            if (res.data.code == '0000') {

                                wx.showToast({

                                    title: res.data.msg,
                                    icon: 'none',
                                    mask:true,

                                })



                                setTimeout(function () {

                                    wx.redirectTo({

                                        url: '../transfer_success/transfer_success'
                                    })

                                },1500)



                            }

                            else if(res.data.code == '-3'){

                                //在设置支付密码中取值
                                wx.setStorageSync('payHtml','-3');

                                //存储在设置支付密码成功之后8为正常 4为要调用支付设置接口
                                wx.setStorageSync('paySettingHref','8');

                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    cancelText: '我知道了',
                                    confirmText: '忘记密码',
                                    confirmColor:'#fe9728',
                                    success: function(res) {
                                        if (res.confirm) {

                                            wx.navigateTo({

                                                url:'../code/code'
                                            })

                                        } else if (res.cancel) {


                                            wx.navigateBack({
                                                delta: 1
                                            })

                                        }
                                    }
                                })

                            }

                            else if(res.data.code == '-4'){

                                //在设置支付密码中取值
                                wx.setStorageSync('payHtml','-4')

                                wx.setStorageSync('paySettingHref','8');

                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    cancelText: '忘记密码',
                                    confirmText: '重新输入',
                                    confirmColor:'#fe9728',
                                    success: function(res) {
                                        if (res.confirm) {

                                            //重新输入 密码清空
                                            that.setData({

                                                payPassword:'',//支付密码
                                            })
                                            console.log('用户点击确定')

                                        } else if (res.cancel) {
                                            wx.navigateTo({

                                                url:'../code/code'
                                            })

                                        }
                                    }
                                })
                            }

                            else {




                                wx.showToast({

                                    title: res.data.msg,

                                    icon: 'none',
                                    mask:true,

                                })
                            }

                        }

                    },


                    fail: function (res) {

                        console.log(res)

                    }

                })


            }

            else if(_transferCash=='6'){
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


                        bankCardId: _bankCardId,//银行卡id

                        balance: _balance,//提取现金

                        payPassword: md5.hexMD5(that.data.payPassword),//短信验证


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
                        else if(res.data.code=='3004'){

                            var Authorization = res.data.token.access_token;//Authorization数据

                            wx.setStorageSync('Authorization', Authorization);

                            return false
                        }

                        else {

                            wx.setStorageSync('cashOrderId', res.data.data);

                            //console.log(wx.getStorageSync('cashOrderId'));

                            //存储有没有提现成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                            wx.setStorageSync('successVerify','true');



                            if (res.data.code == '0000') {

                                wx.showToast({

                                    title: res.data.msg,

                                    icon: 'none',
                                    mask:true,

                                })

                                setTimeout(function () {

                                    wx.redirectTo({

                                        url: '../pay_success/pay_success'
                                    })

                                },1500)



                            }

                            else if(res.data.code == '-3'){

                                //在设置支付密码中取值
                                wx.setStorageSync('payHtml','-3')

                                //存储在设置支付密码成功之后8为正常 4为要调用支付设置接口
                                wx.setStorageSync('paySettingHref','8');

                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    cancelText: '我知道了',
                                    confirmText: '忘记密码',
                                    confirmColor:'#fe9728',
                                    success: function(res) {
                                        if (res.confirm) {

                                            wx.navigateTo({

                                                url:'../code/code'
                                            })

                                        } else if (res.cancel) {


                                            wx.navigateBack({
                                                delta: 1
                                            })

                                        }
                                    }
                                })

                            }

                            else if(res.data.code == '-4'){

                                //在设置支付密码中取值
                                wx.setStorageSync('payHtml','-4')

                                wx.setStorageSync('paySettingHref','8');

                                wx.showModal({
                                    title: '提示',
                                    content: res.data.msg,
                                    cancelText: '忘记密码',
                                    confirmText: '重新输入',
                                    confirmColor:'#fe9728',
                                    success: function(res) {
                                        if (res.confirm) {

                                            //重新输入 密码清空
                                            that.setData({

                                                payPassword:'',//支付密码
                                            })
                                            console.log('用户点击确定')

                                        } else if (res.cancel) {
                                            wx.navigateTo({

                                                url:'../code/code'
                                            })

                                        }
                                    }
                                })
                            }

                            else {




                                wx.showToast({

                                    title: res.data.msg,

                                    icon: 'none',
                                    mask:true,

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




    },



    payPasswordFn:function (e) {

        var that = this;

        that.setData({

            payPassword:e.detail.value,

        })

        
    }



})

