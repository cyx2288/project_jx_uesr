const app = getApp();

const mineUrl = '/user/center/usercenter';//用户中心

const radixPointFn = require('../../../static/libs/script/radixPoint');//ajax请求

const pageJumpFn = require('../../../static/libs/script/pageJump');//页面跳转

const joinEntURL = '/user/workunit/selectisjoinent';//有带加入企业

const balanceUrl = '/user/account/getbalance';//获取用户余额

const statusUrl = '/user/bank/getsalarystatus';//获取用户工资金额状况



Page({

    data: {


        mobile: '',//个人中心手机号

        totalSalary: '',//工资余额

        hasJoinEnt: true,//默认不显示有新的邀请 true为不显示 false为显示

        isVerify: '',//是否认证

        hasNewMsg: true,//默认不显示有新消息 true为不显示 false为显示

        needRefresh: true,//刷新的开关 false为不刷新 true为刷新,

        //controlNum:1,//控制重复点击


    },

    onShow: function () {


        var that = this;

        //防止忘记密码倒退 导航名字
        wx.setNavigationBarTitle({

            title: '我的'
        });




        //首页和我的来回切换
        //wx.setStorageSync('successVerify','true')

        //实名认证 & 工资余额 & 是否加入新企业 & 新消息 & 支付认证 & 是否设置支付密码 - 存储有没有认证操作成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
        var _successVerify = wx.getStorageSync('successVerify');

        //console.log('我的刷新'+wx.getStorageSync('successVerify'))

        //如果操作了某个需要变动的数据 赋值
        if (_successVerify) {

            that.setData({

                needRefresh: _successVerify

            })

        }


        else {

            that.setData({

                needRefresh: 'true'

            })

        }

        //时间戳
        function timestamp() {

            //获取当前时间戳
            var timestamp = Date.parse(new Date());

            return timestamp / 1000

        }


        function ajax() {


            ajaxShow();


            //ajax 加载后存储变量值改变 - 认证成功
            wx.setStorageSync('successVerify', 'false');

            var _time = timestamp();

            wx.setStorageSync('mineTimer', _time);

        }

        if (that.data.needRefresh == 'true') {

            //console.log('变量控制刷新');

            ajax()

        }

        else {

            var _mineTimer = wx.getStorageSync('mineTimer');

            if (timestamp() - _mineTimer >= 120) {

                //console.log('超时刷新 超时：' + (timestamp() - _mineTimer))

                ajax()

            }

            else {

                console.log('不刷新')

            }

        }


        function ajaxShow(){


            //有几个ajax请求
            var ajaxCount = 3;

            var thisMineurl = app.globalData.URL + mineUrl;

            var thisJoinEntURL = app.globalData.URL + joinEntURL;

            //获取用户余额
            var thisBalanceUrl = app.globalData.URL + balanceUrl;

            //获取数据
            var jx_sid = wx.getStorageSync('jxsid');

            var Authorization = wx.getStorageSync('Authorization');

            //存储从哪儿过来
            wx.setStorageSync('goHtml', '3');



            /**
             * 接口：用户中心
             * 请求方式：POST
             * 接口：/user/center/usercenter
             * 入参：mobile
             **/
            wx.request({

                url: thisMineurl,

                method: 'POST',

                header: {
                    'content-type': 'application/x-www-form-urlencoded', // post请求

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

                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                    }

                    else {


                        var _mobile = res.data.data.mobile.substr(0, 3) + '****' + res.data.data.mobile.substr(7);

                        var ishasNewMsg = res.data.data.isHaveNewMsg;



                        (function countDownAjax() {

                            ajaxCount--;

                            app.globalData.ajaxFinish(ajaxCount)

                        })();


                        //获取手机号
                        wx.setStorageSync('mobile', res.data.data.mobile);

                        //获取是否设置密码
                        wx.setStorageSync('isPayPwd', res.data.data.isPayPwd);

                        //是否开启验证
                        wx.setStorageSync('isSecurity', res.data.data.isSecurity);

                        //存姓名和身份证
                        wx.setStorageSync('idNumber', res.data.data.idNumber);

                        wx.setStorageSync('userName', res.data.data.userName);

                        //是否实名认证
                        wx.setStorageSync('isVerify', res.data.data.isVerify);

                        //证件类型 只有花名册导入的时候有
                        wx.setStorageSync('idType',res.data.data.idType);

                        //国籍
                        wx.setStorageSync('nationality',res.data.data.nationality);

                        wx.setStorageSync('source',res.data.data.source)

                        wx.setStorageSync('ishasNewMsg',ishasNewMsg)


                        //如果审核不通过的话 存储一下不通过的原因
                        if(wx.getStorageSync('isVerify')=='3'){

                            wx.setStorageSync('refuseReason',res.data.data.refuseReason);

                        }


                        //存储手机号码
                        that.setData({

                            mobile: _mobile,

                            isVerify: wx.getStorageSync('isVerify')


                        });


                        //判断是否有新消息

                        if (ishasNewMsg == '1') {

                            that.setData({

                                hasNewMsg: false,

                            })

                        }

                        else {

                            that.setData({

                                hasNewMsg: true

                            })

                        }



                    }

                },

                fail: function (res) {

                    console.log(res)
                }

            })


            /**
             * 接口：有待加入企业
             * 请求方式：GET
             * 接口：/user/workunit/selectisjoinent
             * 入参：null
             **/
            wx.request({

                url: thisJoinEntURL,

                method: 'GET',

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    //判断是否显示有新邀请

                    app.globalData.repeat(res.data.code, res.data.msg);

                    app.globalData.token(res.header.Authorization)


                    if (res.data.code == '3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url: '../../common/signin/signin'
                            })

                        }, 1500)

                        /*                       wx.showToast({
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

                        console.log(res.data.data)

                        var hasEntType = res.data.data.type;


                        //判断是否有加入企业

                        if (hasEntType == '1') {


                            that.setData({

                                hasJoinEnt: false,

                            })

                        }

                        else {

                            that.setData({

                                hasJoinEnt: true

                            })

                        }


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

                    app.globalData.token(res.header.Authorization)

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


                        if(!res.data.data.totalSalary){


                            that.setData({

                                totalSalary:'--.--'

                            })



                        }

                        else {

                            console.log(res.data);

                            that.setData({

                                totalSalary:radixPointFn.splitK(res.data.data.totalSalary),


                            });

                        }





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


            setTimeout(function () {

                that.showDot()

            },500)













        }




    },

    wagesFn:function () {



        pageJumpFn.pageJump("../../../pages/user/balance/balance")

/*
        if(that.data.controlNum=='1'){


            that.setData({

                    controlNum:0

            })

            wx.navigateTo({

                url:"../../../pages/user/balance/balance"

            })

            that.setData({

                controlNum:1

            })



        }
*/




    },

    //我的账单
    billFn:function () {


        wx.setStorageSync('whichBill','3');

        pageJumpFn.pageJump("../../../packageA/pages/bill/bill")



    },

    //发薪企业
    companyFn:function () {

        //点击去解冻&点击发薪企业后储存 用于判断跳回企业还是工资余额(再实名认证成功之后获取）
        wx.setStorageSync('goFrozen','2');

        pageJumpFn.pageJump("../company/company")

    },

    //银行卡
    bankFn:function () {

        wx.removeStorageSync('chooseActive');

        wx.removeStorageSync('addCard')

        pageJumpFn.pageJump("../../../packageA/pages/card/card")


    },

    //消息
    feedbackFn:function () {

        pageJumpFn.pageJump("../feedback_message/feedback_message")


    },

    //设置
    settingFn:function () {

        pageJumpFn.pageJump("../setting/setting")


    },

    //帮助中心
    helpFn:function () {

        pageJumpFn.pageJump("../../../packageA/pages/help_service/help_service")


    },

    //显示小圆点
    showDot:function () {

        var that = this;


        //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        console.log('取值消息'+that.data.hasNewMsg)

        console.log('取值企业'+that.data.hasJoinEnt)



        if(!that.data.hasJoinEnt|| !that.data.hasNewMsg){

            setTimeout(function () {

                wx.showTabBarRedDot({

                    index:1

                })


            },10)


        }else {

            setTimeout(function () {

                wx.hideTabBarRedDot({

                    index:1

                })

            },10)

        }


    },

    //转发
    onShareAppMessage: function () {

        return {
            title: '嘉薪平台',
            path: '/pages/common/signin/signin',
            imageUrl: '/static/icon/logo/share.jpg'

        }
    },


});