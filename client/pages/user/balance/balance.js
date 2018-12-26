const app = getApp();

const radixPointFn = require('../../../static/libs/script/radixPoint');//ajax请求

const pageJumpFn = require('../../../static/libs/script/pageJump');//页面跳转

const balanceUrl = '/user/account/getbalance';//获取用户余额

const payeeUrl = '/record/selecthistoricalpayee';//查询历史收款人

const statusUrl = '/user/bank/getsalarystatus';//获取用户工资金额状况

const mineUrl = '/user/center/usercenter';//用户中心

const transferUrl = '/user/work/checktransfer';//检测用户发起转账操作

const cashUrl = '/user/work/checkwithdraw';//用户发起提现操作


Page({

    data:{

        wages:'--.--',//可提资金

        enableSalary:'--.--',

        frozenSalary:'--.--',//冻结资金

        totalSalary:'--.--',//工资余额

        isVerify:'',

        showModal: false,//弹框

        titleContent:'',//弹框内容

        imgalist:['http://wechat.fbwin.cn/images/qrcode_jx.jpg'],

    },

    onShow:function () {

        //有几个ajax请求
        var ajaxCount = 3;

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

                        wages: radixPointFn.splitK(res.data.data)//用户余额

                    });




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
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

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

                       /* console.log(res.data)*/


                        (function countDownAjax() {

                            ajaxCount--;

                            app.globalData.ajaxFinish(ajaxCount)

                        })();



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

        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：mobile
         **/
        wx.request({

            url: app.globalData.URL+ mineUrl,

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

                        isVerify:res.data.data.isVerify

                    });





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
        var _isVerify = that.data.isVerify;


        //没认证的去认证 已认证直接跳接口
        if (_isVerify == '0'||_isVerify == '3') {

            //存指定的页面  （在实名认证中取值）
            wx.setStorageSync('hrefId','10');

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
            wx.setStorageSync('hrefId','10');

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
             * 接口：用户发起转账操作
             * 请求方式：get
             * 接口：/user/transfer/dotransfer
             * 入参：null
             **/
            wx.request({

                url: app.globalData.URL + transferUrl,

                method: 'GET',

                data: {

                    mobile: wx.getStorageSync('mobile'),


                },

                header: {


                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    console.log(res.data.code)

                    if(res.data.code=='-10'){

                        that.setData({

                            showModal: true,

                            titleContent:'转账',//弹框内容

                        })


                    }
                    else {


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

                                    //储存刚进来时候的状态 在转账成功的时候获取


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


                fail: function (res) {

                    console.log(res)

                }

            })







        }


        
    },

    frozenFn:function () {


        wx.showModal({
            title: '不可提金额只可消费，不可提现',
            content: '在“我的发薪企业”中同意企业邀请，身份验证通过后，即可提现',
            cancelText: '取消',
            confirmText: '加入企业',
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

    detailFn:function () {

        pageJumpFn.pageJump('../details/details')

    },

    cashFn:function () {

        var that = this;
        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //获取已认证未认证
        var _isVerify = that.data.isVerify;

        if (_isVerify == '0' || _isVerify == '3') {

            console.log('没认证1')

            //存指定的页面  （在实名认证中取值）
            wx.setStorageSync('hrefId', '4');


            wx.showModal({
                title: '提示',
                content: ' 当前账户尚未进行实名认证，完成认证后方可提现',
                cancelText: '取消',
                confirmText: '去认证',
                confirmColor: '#fe9728',
                success: function (res) {

                    if (res.confirm) {

                        wx.navigateTo({

                            url: '../no_certification/certification'

                        })

                    }

                    else if (res.cancel) {

                      /*  wx.navigateBack({
                            delta: 1
                        })*/
                    }

                    else {

                       /* wx.navigateBack({
                            delta: 1
                        })*/


                    }

                }
            });


        }
        else if (_isVerify == '2') {

            console.log('没认证2')

            //存指定的页面  （在实名认证中取值）
            wx.setStorageSync('hrefId', '4');


            wx.showModal({
                title: '提示',
                content: '实名认证审核中，审核通过后方可提现',
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#fe9728',
                success: function (res) {

                    if (res.confirm) {

                      /*  wx.navigateBack({
                            delta: 1
                        })
*/
                    }

                    else if (res.cancel) {

                    }

                    else {

                        // wx.navigateBack({
                        //     delta: 1
                        // })


                    }

                }
            });


        }

        else {

            /**
             * 接口：用户发起提现操作
             * 请求方式：get
             * 接口：/user/withdraw/dowithdraw
             * 入参：null
             **/
            wx.request({

                url: app.globalData.URL + cashUrl,

                method: 'GET',

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    console.log(res.data.code)

                    if(res.data.code=='-10'){

                        that.setData({

                            showModal: true,

                            titleContent:'提现',//弹框内容

                        })


                    }
                    else {


                        pageJumpFn.pageJump('../cash/cash')

                    }

                },


                fail: function (res) {

                    console.log(res)

                }

            })
        }







    },

    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {


    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {

        var that = this

        that.setData({
            showModal: false
        });
    },

    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {

        var that = this;

        that.hideModal();
    },


    previewImage: function (e) {
        wx.previewImage({
            current: this.data.imgalist, // 当前显示图片的http链接
            urls: this.data.imgalist // 需要预览的图片http链接列表
        })
    },


});