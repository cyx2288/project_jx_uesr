
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const cashUrl = '/user/withdraw/dowithdraw';


Page({

    data:{

        bizId:'',//订单id

        bankCardId:'',//银行卡id

        balance:'',//提取现金

        payPassword:'',//支付密码

        code:'',//短信验证

        bankList:[],//银行卡列表数组

        bankName:'',//银行名称

        bankNo:'',//银行卡号

        chooseBank:[],//picker中银行卡的数组

        limit:'800.00'//可用额度






    },

    onLoad:function () {

        var that = this;

        //获取银行卡页面的银行卡
        var thisBankList = wx.getStorageSync('bankList');

        var _isVerify = wx.getStorageSync('isVerify');

        //没认证的去认证
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
       //没银行卡的去添加银行卡
        else if(that.data.bankList.length==0){


            wx.showModal({
                title: '提示',
                content: ' 您还没有可用于提现的银行卡，请先添加一张储蓄卡',
                cancelText: '取消',
                confirmText: '去添加',
                success: function (res) {

                    if (res.confirm) {

                        wx.navigateTo({

                            url: '../add_card/add_card'

                        })

                    }

                    else if (res.cancel) {



                    }
                }
            });


        }


        //存储银行卡页面的数据
        that.setData({

            bankList:thisBankList,

        });

        //默认显示第一个银行卡
        that.setData({

            bankName:that.data.bankList[0].bankName,//银行名称

            bankNo:that.data.bankList[0].bankNo,//银行卡号

            bankCardId:that.data.bankList[0].bankCardId//银行卡id

        });


        //获取银行卡的
        var pickChooseBank=[];

        //循环银行卡、银行名称及银行id
        for(var i=0;i<thisBankList.length;i++){

            var pickBankName = thisBankList[i].bankName;

            var pickBankNo = thisBankList[i].bankNo;

            var pickBankId = thisBankList[i].bankCardId;

            var _pickChooseBank =pickBankName+'（储蓄卡） '+pickBankNo;

            //组成数组
            pickChooseBank.push(_pickChooseBank);

        }

        console.log(pickChooseBank);

        that.setData({

            chooseBank:pickChooseBank

        })

    },

    //赋值
    bindPickerChange:function (e) {

        var that = this;

        //选择银行卡的
        console.log(that.data.chooseBank[e.detail.value]);

        that.setData({

            bankName:that.data.bankList[e.detail.value].bankName,//银行名称

            bankNo:that.data.bankList[e.detail.value].bankNo,//银行卡号

            bankCardId:that.data.bankList[e.detail.value].bankCardId//银行卡id

        });



    },

    //全部提现
    cashAllFn:function () {

        var that=this;

        that.setData({

            balance:that.data.limit,

        })



    },

    //提现
    cashFn:function () {

        var thisCashUrl = app.globalData.URL+cashUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');


        wx.showModal({
            title: '确认付款',
            content: '支付金额'+ that.data.balance+',提现金额￥100.00,手续费￥0.00',
            confirmText: '确认付款',
            success: function (res) {

                if (res.confirm) {



                }

                else if (res.cancel) {



                }
            }
        });


        
        function confirmation() {
            /**
             * 接口：获取用户银行卡信息
             * 请求方式：GET
             * 接口：/user/withdraw/dowithdraw
             * 入参：bizId,bankCardId,balance,payPassword,code
             * */

            wx.request({

                url: thisCashUrl,

                method: 'GET',

                data:{


                    bizId:that.data.bizId,//订单id

                    bankCardId:that.data.bankCardId,//银行卡id

                    balance:that.data.balance,//提取现金

                    payPassword:that.data.payPassword,//支付密码

                    code:that.data.code,//短信验证



                },
                header:{

                    'jx_sid':jx_sid,

                    'Authorization':Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    if(res.data.code=='0000'){


                    }

                    //如果

                    else {

                        if(!that.data.balance){

                            wx.showToast({

                                title: '请输入金额',
                                icon: 'none',

                            })

                        }

                    }




                },


                fail: function (res) {

                    console.log(res)

                }

            })
        }









    },

    hasTipsFn:function () {

        wx.showModal({
            title: '提示限额说明',
            content: '单卡单笔50000.00,当日10000000.00,当月3000000.00元',
            confirmText: '确认',
            showCancel:false,
            success: function (res) {

                if (res.confirm) {



                }

                else if (res.cancel) {

                }
            }
        });


    },

    moreFn:function () {

        wx.showActionSheet({
            itemList: ['提现记录', '常见问题'],
            success: function(res) {

                console.log(res.tapIndex)

                if(res.tapIndex=='0'){

                    wx.navigateTo({

                     url:'../bill/bill'
                     })

                }

                else if(res.tapIndex=='1'){

                    wx.navigateTo({

                        url:'../help_service/help_service'
                    })

                }

            },
            fail: function(res) {

            }
        })

    },

    bindKeyInput:function (e) {

        var that = this;

        that.setData({

            balance: e.detail.value

        });

        
    }

});