/**
 * Created by ZHUANGYI on 2018/5/14.
 */

/*var bankList = {

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

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const bankUrl = '/user/bank/getbankcardinfo';

const detBankUrl = '/user/bank/deletebankcardinfo';

Page({

    data:{

        bankList:[],//银行卡列表

        bankCardId:'',//银行卡唯一id

        bankNo:'',//银行卡号


    },

    onLoad:function () {

        var thisBankUrl = app.globalData.URL+bankUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


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

                    //存储银行卡
                    wx.setStorageSync('bankList',res.data.data);

                    that.setData({

                        bankList:res.data.data,

                    })

                    console.log(that.data.bankList)


                },


                fail: function (res) {
                    console.log(res)
                }

            })


    },

    addCardFn:function () {

        var _isVerify = wx.getStorageSync('isVerify');

        //判断是否认证
        if(_isVerify=='0'){

            wx.showModal({
                title: '提示',
                content: ' 未完成实名认证的用户，需先完成实名认证才可添加银行卡',
                cancelText: '取消',
                confirmText: '去认证',
                success: function (res) {

                    if (res.confirm) {

                        wx.navigateTo({

                            url: '../certification/certification'

                        })

                    }

                    else if (res.cancel) {



                    }
                }
            });


        }

        else {

            wx.navigateTo({

                url: '../add_card/add_card'

            })


        }


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
            success: function (res) {

                if (res.confirm) {

                    delCard()

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

                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                    });

                    that.onLoad();


                },


                fail: function (res) {

                    console.log(res)

                }

            })
        }






    }


})
