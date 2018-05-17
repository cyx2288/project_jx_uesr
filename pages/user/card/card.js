/**
 * Created by ZHUANGYI on 2018/5/14.
 */

var bankList = {

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





}

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const bankUrl = '/user/bank/getbankcardinfo';

Page({

    data:{

        bankList:[],

    },

    onLoad:function () {

        var thisBankUrl = app.globalData.URL+bankUrl;

        var that = this;


        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');


        /**
         * 接口：身份验证
         * 请求方式：GET
         * 接口：/salary/home/selectidnumber
         * 入参：null
         * */

        wx.request({

            url: thisBankUrl,

            method: 'GET',

            header:{

                'jx_sid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);


                that.setData({

                    bankList:res.data.data,

                })




            },


            fail: function (res) {
                console.log(res)
            }

        })


    },

    addCardFn:function () {

        wx.navigateTo({

            url: '../add_card/add_card'

        })
    }


})
