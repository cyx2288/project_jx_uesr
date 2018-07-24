const app = getApp();

const radixPointFn = require('../../../static/libs/script/radixPoint');//ajax请求

const balanceUrl = '/user/account/getbalance';//获取用户余额

const payeeUrl = '/record/selecthistoricalpayee';//查询历史收款人

const statusUrl = '/user/bank/getsalarystatus';//获取用户工资金额状况


Page({

    data:{

        wages:'--.--',//可提资金

        enableSalary:'--.--',

        frozenSalary:'--.--',//冻结资金

        totalSalary:'--.--',//工资余额

    },

    onShow:function () {

        //有几个ajax请求
        var ajaxCount = 1;

        //获取用户余额
        var thisBalanceUrl = app.globalData.URL + balanceUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');




        /**
         * 接口：获取用户余额
         * 请求方式：GET
         * 接口：/user/account/getbalance
         * 入参：null
         **/
        wx.request({

            url: thisBalanceUrl,

            method: 'GET',

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

                    that.setData({

                        wages: radixPointFn.splitK(res.data.data)//用户余额

                    });


                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();

                }

            },


            fail: function (res) {

                console.log(res)

            }

        })

        /**
         * 接口：获取用户工资金额状况
         * 请求方式：GET
         * 接口：/user/bank/getsalarystatus
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + statusUrl,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                //wx.setStorageSync('wages', res.data.data);

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500);

                    return false


                }

                else {

                    if(!res.data.data.frozenSalary&&!res.data.data.totalSalary){

                        that.setData({

                            frozenSalary:'0.00',

                            enableSalary:'0.00',

                            totalSalary:'0.00',


                        })


                    }

                    else {

                        console.log(res.data)

                        that.setData({

                            frozenSalary:radixPointFn.splitK(res.data.data.frozenSalary),

                            enableSalary:radixPointFn.splitK(res.data.data.enableSalary),

                            totalSalary:radixPointFn.splitK(res.data.data.totalSalary),


                        })


                    }




                }

            },


            fail: function (res) {

                console.log(res)

            }

        })





    },

    transferUrlFn:function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        //获取已认证未认证
        var _isVerify = wx.getStorageSync('isVerify');


        //没认证的去认证 已认证直接跳接口
        if (_isVerify == '0'||_isVerify == '3') {

            //存指定的页面  （在实名认证中取值）
            wx.setStorageSync('hrefId','8');

            wx.setStorageSync('personCenter','2')

            wx.showModal({
                title: '提示',
                content: ' 为保障账户资金安全，实名用户才能使用转账服务，请先完成实名认证',
                cancelText: '取消',
                confirmText: '去认证',
                confirmColor:'#fe9728',
                success: function (res) {

                    if (res.confirm) {

                        wx.navigateTo({

                            url: '../no_certification/certification'

                        })

                    }

                    else if (res.cancel) {


                    }



                }
            });



        }

        else if(_isVerify == '2'){
            //存指定的页面  （在实名认证中取值）
            wx.setStorageSync('hrefId','8');

            wx.setStorageSync('personCenter','2');

            wx.showModal({
                title: '提示',
                content: '实名认证审核中，审核通过后即可使用转账服务',
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


        else{

            /**
             * 接口：查询历史收款人
             * 请求方式：post
             * 接口：/record/selecthistoricalpayee
             * 入参：null
             **/
            wx.request({

                url: app.globalData.URL + payeeUrl,

                method: 'POST',

                header: {

                    'content-type': 'application/x-www-form-urlencoded',// post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    console.log(res.data.data)

                    if(res.data.data.length !=0){

                        console.log('有历史')

                        wx.navigateTo({

                            url: '../transfer_accounts/transfer_accounts'

                        })
                    }

                    else {

                        console.log('没历史')

                        wx.navigateTo({

                            url: '../girokonto/girokonto'

                        })


                    }

                },


                fail: function (res) {

                    console.log(res)

                }

            })






        }


        
    },

    frozenFn:function () {


        wx.showModal({
            title: '冻结工资只可消费，不可提现',
            content: '在’我的发薪企业’中同意企业邀请，身份验证通过后即可解冻资金',
            cancelText: '取消',
            confirmText: '去解冻',
            confirmColor:'#fe9728',
            success: function (res) {

                if (res.confirm) {

                    //点击去解冻 储存 用于判断跳回哪个页面(再实名认证成功之后获取）
                    wx.setStorageSync('goFrozen','1');

                    wx.navigateTo({

                        url: '../../user/company/company'
                    })

                }

                else if (res.cancel) {



                }
            }
        });

    },

    

});