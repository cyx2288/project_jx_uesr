/**
 * Created by ZHUANGYI on 2018/5/14.
 */
var addBankList = {

    addBankArray: [

        ['中国银行', '农业银行','建设银行', '交通银行','中国邮政储蓄银行','广发银行','浦发银行','浙江泰隆商业银行'],

        ['储蓄卡', '信用卡'],

    ],



}
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const addBankUrl = '/user/bank/addbankcardinfo';

const getBankName = '/user/bank/getbankname';

Page({

    data:{

        bankNo:'',//银行卡号

        openBank:'',//开户行

        bankName:'',//银行名称&所属银行

        bankBranch:'',//卡户支行

        province:'',//开户省份

        city:'',//开户城市

        userName:'',//用户姓名

        thisBankSort:'',//卡类

        multiArray: [

            ['中国银行', '农业银行','建设银行', '交通银行','中国邮政储蓄银行','广发银行','浦发银行','浙江泰隆商业银行'],

            ['储蓄卡', '信用卡']

        ]


    },

    onLoad:function () {

        var that = this;

        var _userName = wx.getStorageSync('userName');

        that.setData({

            userName:_userName,

        })




    },

    //点击添加银行卡号
    addBankFn:function () {

        var thisAddBankUrl = app.globalData.URL+addBankUrl;

        var that = this;


        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        var regNeg = /^([1-9]{1})(\d{15}|\d{18})$/;

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

                bankNo:that.data.bankNo,//银行卡号

                //openBank:that.data.openBank,//开户行

                bankName:that.data.bankName,//银行名称&所属银行

                //bankBranch:that.data.bankBranch,//卡户支行

                //province:that.data.province,//开户省份

                //city:that.data.city//开户城市

            }),

            header:{

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jx_sid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                console.log(that.data.bankNo)

                //银行卡添加成功 toast提示成功

                if(res.data.code=='0000'){

                    wx.showToast({

                        title: res.data.msg,
                        icon: 'none',

                    })

                    wx.redirectTo({

                        url:'../card/card'

                    })


                }


                else {

                    //判断银行卡是否为空
                    if(!that.data.bankNo){

                        wx.showToast({

                            title: '请填写银行卡号',
                            icon: 'none',

                        })


                    }

                    //如果有值的话 判断是否是数字、15位或者18位
                    else if(that.data.bankNo){

                        //判断卡号是否有误
                        if(!regNeg.test(that.data.bankNo)){

                            wx.showToast({

                                title: '卡号填写错误',

                                icon: 'none',

                            })

                        }

                        //判断是否写了所属银行
                        else if(!that.data.bankName){

                            wx.showToast({

                                title: '请选择所属银行',
                                icon: 'none',

                            })
                        }

                    }



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

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        that.setData({

            bankNo:e.detail.value,

        });


    },

    //判断卡号
    getBankNoFn:function (e) {

        var thisGetBankName = app.globalData.URL+getBankName;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：卡号识别所属银行
         * 请求方式：POST
         * 接口：/user/bank/getbankname
         * 入参：null
         * */

        wx.request({

         url: thisGetBankName,

         method: 'POST',

         data:{

         bankNo:e.detail.value,

         },

         header:{

         'content-type': 'application/x-www-form-urlencoded', // post请求

         'jx_sid':jx_sid,

         'Authorization':Authorization

         },

         success: function (res) {

         console.log(res.data);

         console.log(res.data.data.bankName)

             that.setData({

                 bankName:res.data.data.bankName,

             })


         },


         fail: function (res) {
         console.log(res)
         }

         })




    },

    //监听开户行

    bindMultiPickerChange: function(e) {

        var that = this;

        console.log(e.detail.value[0])

        console.log(e.detail.value[1])

        console.log(that.data.multiArray[0])

        console.log(that.data.multiArray[1])

        console.log(that.data.multiArray[0][e.detail.value[0]])

        console.log(that.data.multiArray[1][e.detail.value[1]])

        that.setData({

            thisBank:that.data.multiArray[0][e.detail.value[0]],

            thisBankSort:that.data.multiArray[1][e.detail.value[1]]


        })






    },

    bindMultiPickerColumnChange: function (e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

    }


    //银行名称

    //监听卡户支行

    //监听开户省份

    //监听开户城市








})
