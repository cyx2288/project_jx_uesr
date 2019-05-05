/**
 * Created by ZHUANGYI on 2018/5/14.
 *//*var bankList = {

    data:[
        {
            icon:'',
            bankName:'中国银行',
        },
        {
            icon:'',
            bankName:'农业银行',
        },

        {
            icon:'',
            bankName:'工商银行',
        },
        {
            icon:'',
            bankName:'建设银行',
        },

        {
            icon:'',
            bankName:'交通银行',
        },
        {
            icon:'',
            bankName:'中国邮政储蓄银行',
        },
        {
            icon:'',
            bankName:'广发银行',
        },
        {
            icon:'',
            bankName:'浦发银行',
        },        {
            icon:'',
            bankName:'浙江泰隆商业银行',
        },
        {
            icon:'',
            bankName:'招商银行',
        },

        {
            icon:'',
            bankName:'民生银行',
        },
        {
            icon:'',
            bankName:'兴业银行',
        },

        {
            icon:'',
            bankName:'中信银行',
        },
        {
            icon:'',
            bankName:'华夏银行',
        },
        {
            icon:'',
            bankName:'光大银行',
        },
        {
            icon:'',
            bankName:'北京银行',
        },
        {
            icon:'',
            bankName:'上海银行',
        },
        {
            icon:'',
            bankName:'天津银行',
        },

        {
            icon:'',
            bankName:'大连银行',
        },
        {
            icon:'',
            bankName:'杭州商业银行',
        },

        {
            icon:'',
            bankName:'宁波银行',
        },
        {
            icon:'',
            bankName:'厦门银行',
        },
        {
            icon:'',
            bankName:'广州银行',
        },
        {
            icon:'',
            bankName:'平安银行',
        },        {
            icon:'',
            bankName:'浙商银行',
        },
        {
            icon:'',
            bankName:'上海农商银行',
        },

        {
            icon:'',
            bankName:'重庆银行',
        },
        {
            icon:'',
            bankName:'江苏银行',
        },

        {
            icon:'',
            bankName:'北京农村商业银行',
        },
        {
            icon:'',
            bankName:'济宁银行',
        },
        {
            icon:'',
            bankName:'台州银行',
        },
        {
            icon:'',
            bankName:'深圳发展银行',
        },
        {
            icon:'',
            bankName:'成都银行',
        },
        {
            icon:'',
            bankName:'徽商银行',
        },


    ]





}*/

const app = getApp();

const mineUrl ='/user/center/usercenter';//用户中心

const bankUrl = '/user/bank/getbankcardinfo';

const detBankUrl = '/user/bank/deletebankcardinfo';

Page({

    data:{

        alipayList:[],//支付宝列表

        alipayId:'',//支付宝唯一id

        alipayNo:'',//支付宝号



    },

    onShow:function () {

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //有几个ajax请求
        var ajaxCount = 1;





            /**
             * 接口：获取用户支付宝信息
             * 请求方式：GET
             * 接口：/user/bank/getbankcardinfo
             * 入参：null
             * */

            wx.request({

                url: app.globalData.URL+'/user/alipay/getuseralipayinfo',

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


                        //存储银行卡
                        wx.setStorageSync('alipayList', res.data.data.list);

                        that.setData({

                            alipayList: res.data.data.list,

                        })




                    }


                },


                fail: function (res) {
                    console.log(res)
                }

            })


    },

    addCardFn:function () {

        var that = this;

        var thisMineurl = app.globalData.URL+ mineUrl;


        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：mobile
         **/
        wx.request({

            url:  thisMineurl,

            method:'POST',

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function(res) {


                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)

                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../../pages/common/signin/signin'
                        })

                    },1500)

                    /*           wx.showToast({
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

                    console.log(res.data);

                    wx.setStorageSync('userName', res.data.data.userName);

                    console.log('姓名' + wx.getStorageSync('userName'))

                }


            },

            fail:function (res) {

                console.log(res)
            }

        })


        wx.navigateTo({

            url: '../add_zfb/add_zfb'

        })



    },

    detZfbFn:function (e) {

        var thisDetBankUrl = app.globalData.URL+detBankUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //选择支付宝账号后需要刷新页面

        wx.setStorageSync('refreshCash','0')




        that.setData({

            alipayId:e.target.dataset.alipay,



        })
        //console.log(that.data.bankCardId)


       wx.showModal({
            title: '提示',
            content: '确认删除该支付宝账号？',
            cancelText: '取消',
            confirmText: '确定',
           confirmColor:'#fe9728',
            success: function (res) {

                if (res.confirm) {

                    delCard()

                    that.onShow();



                }

                else if (res.cancel) {


                }


            }
        });


        function delCard() {


            /**
             * 接口：删除用户支付宝信息
             * 请求方式：GET
             * 接口：/user/alipay/delalipayinfo
             * 入参：alipayId
             * */

            wx.request({

                url: app.globalData.URL+'/user/alipay/delalipayinfo',

                method: 'GET',

                data:{

                    alipayId:that.data.alipayId

                },

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

                        },1500)

                        /*           wx.showToast({
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

                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                        });

                        that.onShow();

                    }


                },


                fail: function (res) {

                    console.log(res)

                }

            })
        }






    },

    chooseZfbFn:function (e) {


        var pages = getCurrentPages();

        var prevPage = pages[pages.length - 2];//当前页面的上一个页面


        //在提现显示银行卡页面

        wx.setStorageSync('chooseCard','1');

        if(prevPage){


            prevPage.setData({

                alipayId:e.currentTarget.dataset.id,

                alipayNo:e.currentTarget.dataset.no





            })


            wx.navigateBack({
                delta: 1
            })



        }


    }


})
