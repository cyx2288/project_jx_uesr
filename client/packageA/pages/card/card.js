/**
 * Created by ZHUANGYI on 2018/5/14.
 */


const app = getApp();

const bankCardJson = require('../../../static/libs/script/bankCardJson.js');//银行卡图标

const mineUrl ='/user/center/usercenter';//用户中心

const bankUrl = '/user/bank/getbankcardinfo';

const detBankUrl = '/user/bank/deletebankcardinfo';

Page({

    data:{

        bankList:[],//银行卡列表

        bankCardId:'',//银行卡唯一id

        bankNo:'',//银行卡号

        bankName:'',//银行卡名称

        cardType:'',//银行卡种类

    },

    onShow:function () {

        var thisBankUrl = app.globalData.URL+bankUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        wx.removeStorageSync('addCard');


        //有几个ajax请求
        var ajaxCount = 1;



            /**
             * 接口：获取用户银行卡信息
             * 请求方式：GET
             * 接口：/user/bank/getbankcardinfo
             * 入参：null
             * */
            wx.request({

                url: thisBankUrl,

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
                        wx.setStorageSync('bankList', res.data.data);

                        that.setData({

                            bankList: res.data.data,

                        })

                        //0703 写的 不要删掉
                        var _bankList = res.data.data

                        //console.log(that.data.bankList)


                        for(var x in _bankList){

                            //console.log(that.data.bankList[x].bankName)

                            for (var y in bankCardJson.bankCardJson){

                                if(bankCardJson.bankCardJson[y].name==_bankList[x].bankName){

                                    break;

                                }

                            }


                            _bankList[x].bankImg=bankCardJson.bankCardJson[y].img

                            //console.log( _bankList[x].bankImg=bankCardJson.bankCardJson[y].img)

                        }

                        that.setData({

                            bankList:_bankList

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

        var _isVerify = wx.getStorageSync('isVerify');

        //判断是否认证
        if(_isVerify=='0'||_isVerify=='3'){

            wx.showModal({
                title: '提示',
                content: ' 未完成实名认证的用户，需先完成实名认证才可添加银行卡',
                cancelText: '取消',
                confirmText: '去认证',
                confirmColor:'#fe9728',
                success: function (res) {


                    if (res.confirm) {

                        wx.navigateTo({


                            url: '../choose_certification/choose_certification'

                        })

                    }

                    else if (res.cancel) {




                    }
                }
            });


        }

        else if (_isVerify == '2') {

            //存指定的页面  （在实名认证中取值）
            wx.setStorageSync('hrefId','4');


            //未认证情况下不弹出键盘
            that.setData({

                autoFocus:false//是否弹出键盘


            })

            wx.showModal({
                title: '提示',
                content: '实名认证审核中，审核通过后即可添加银行卡',
                showCancel:false,
                confirmText: '我知道了',
                confirmColor:'#fe9728',
                success: function (res) {

                    if (res.confirm) {

                    }

                    else if (res.cancel) {


                    }

                    else {




                    }

                }
            });



        }

        else {


                wx.navigateTo({

                    url: '../add_card/add_card'

                })



        }

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


    },

    detCardFn:function (e) {

        var thisDetBankUrl = app.globalData.URL+detBankUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        that.setData({

            bankCardId:e.target.dataset.card,

            bankNo:e.target.dataset.num,


        })


        //取后银行卡四位
        var str= that.data.bankNo;

        var _thisBankNo = str.substr(str.length-4)

        //console.log(that.data.bankCardId)


       wx.showModal({
            title: '提示',
            content: '确认删除尾号是'+ _thisBankNo +'的银行卡',
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
             * 接口：删除银行卡信息
             * 请求方式：GET
             * 接口：/user/bank/deletebankcardinfo
             * 入参：bankCardId
             * */

            wx.request({

                url: thisDetBankUrl,

                method: 'GET',

                data:{

                    bankCardId:that.data.bankCardId

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

    chooseCardFn:function (e) {


        var pages = getCurrentPages();

        var prevPage = pages[pages.length - 2];//当前页面的上一个页面


        //在提现显示银行卡页面

        wx.setStorageSync('chooseCard','0');

        if(prevPage){


            prevPage.setData({

                bankCardId:e.currentTarget.dataset.card,

                bankNo:e.currentTarget.dataset.num,

                bankName:e.currentTarget.dataset.name,

                cardType:e.currentTarget.dataset.type,

                bankIcon:e.currentTarget.dataset.img,



            })


             wx.navigateBack({
               delta: 1
             })



        }


    }




})

