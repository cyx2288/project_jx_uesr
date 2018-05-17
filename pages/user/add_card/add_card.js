/**
 * Created by ZHUANGYI on 2018/5/14.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const addBankUrl = '/user/bank/addbankcardinfo';

Page({

    data:{

        bankNo:'6259000000000000000',

        openBank:'11',

        bankName:'11',

        bankBranch:'11',

        province:'11',

        city:'11',

        userName:''



    },

    onLoad:function () {

        var that = this;

        var _userName = wx.getStorageSync('userName');

        that.setData({
            userName:_userName,

        })




    },

    addBankFn:function () {

        var thisAddBankUrl = app.globalData.URL+addBankUrl;

        var that = this;


        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');




        /**
         * 接口：添加用户银行卡信息
         * 请求方式：POST
         * 接口：/user/bank/addbankcardinfo
         * 入参：bankNo，openBank，bankName，bankBranch，province，city
         * */

        wx.request({

            url: thisAddBankUrl,

            method: 'POST',

            data:json2FormFn.json2Form({

                bankNo:that.data.bankNo,

                openBank:that.data.openBank,

                bankName:that.data.bankName,

                bankBranch:that.data.bankBranch,

                province:that.data.province,

                city:that.data.city

            }),

            header:{

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jx_sid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                if(res.data.code=='-1'){

                    wx.showToast({

                        title: res.data.msg,
                        icon: 'none',

                    })



                }


            },


            fail: function (res) {
                console.log(res)
            }

        })


    },
    //监听银行卡号

    bankNoFn:function (e) {

        var that = this;

        that.setData({

            bankNo:e.detail.value,

        })

    },

    //监听开户行

    //银行名称

    //监听卡户支行

    //监听开户省份

    //监听开户城市








})
