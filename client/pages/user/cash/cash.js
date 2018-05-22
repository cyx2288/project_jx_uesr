const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const cashUrl = '/user/withdraw/dowithdraw';// 获取账户提现记录

const checkcashUrl = '/user/work/checkwithdraw';//检测用户发起提现操作


Page({

    data: {


        bizId: '',//订单id

        bankCardId: '',//银行卡id

        balance: '',//提取现金

        inputBalance:'',//输入框里value的值

        canCashBalance:'',//可以提现的金额

        payPassword: '',//支付密码

        code: '',//短信验证

        bankList: [],//银行卡列表数组

        bankName: '',//银行名称

        bankNo: '',//银行卡号

        chooseBank: [],//picker中银行卡的数组

        amountMax: '',//单笔最大限额

        amountMin: '',//单笔最小限额

        dayMaxCount: '',//日最大额度

        monthMaxAmount: '',//月最大额度

        rate: '',//费率


    },

    onLoad: function () {

        var that = this;

        var thisCheckcashUrl = app.globalData.URL + checkcashUrl;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisBankList = wx.getStorageSync('bankList');

        var _isVerify = wx.getStorageSync('isVerify');





        //存储银行卡页面的数据
        that.setData({

            bankList: thisBankList,

        });


        //没认证的去认证
        if (_isVerify == '0') {

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
        else if (that.data.bankList.length == 0) {


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


        /**
         * 接口：检测用户发起提现操作
         * 请求方式：GET
         * 接口：/user/work/checkwithdraw
         * 入参：null
         * */

        wx.request({

            url: thisCheckcashUrl,

            method: 'GET',

            data: {

                code: that.data.code,


            },
            header: {

                'jx_sid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                that.setData({

                    balance: res.data.data.balance,//提取现金

                    amountMax: res.data.data.amountMax,//单笔最大限额

                    amountMin: res.data.data.amountMin,//单笔最小限额

                    dayMaxCount: res.data.data.dayMaxCount,//日最大额度

                    monthMaxAmount: res.data.data.monthMaxAmount,//月最大额度

                    rate: res.data.data.rate,//费率

                    canCashBalance:res.data.data.balance,

                })


            },


            fail: function (res) {

                console.log(res)

            }

        });


        //默认显示第一个银行卡
        that.setData({

            bankName: that.data.bankList[0].bankName,//银行名称

            bankNo: that.data.bankList[0].bankNo,//银行卡号

            bankCardId: that.data.bankList[0].bankCardId//银行卡id

        });

        //获取银行卡的
        var pickChooseBank = [];

        //循环银行卡、银行名称及银行id
        for (var i = 0; i < thisBankList.length; i++) {

            var pickBankName = thisBankList[i].bankName;

            var pickBankNo = thisBankList[i].bankNo;

            var pickBankId = thisBankList[i].bankCardId;

            var _pickChooseBank = pickBankName + '（储蓄卡） ' + pickBankNo;

            //组成数组
            pickChooseBank.push(_pickChooseBank);

        }

        that.setData({

            chooseBank: pickChooseBank

        })



    },

    //赋值
    bindPickerChange: function (e) {

        var that = this;

        //选择银行卡的
        //console.log(that.data.chooseBank[e.detail.value]);

        that.setData({

            bankName: that.data.bankList[e.detail.value].bankName,//银行名称

            bankNo: that.data.bankList[e.detail.value].bankNo,//银行卡号

            bankCardId: that.data.bankList[e.detail.value].bankCardId//银行卡id

        });


    },

    //全部提现
    cashAllFn: function () {

        var that = this;

        that.setData({

            inputBalance: that.data.balance,

        })


    },

    //提现
    cashFn: function () {

        var thisCashUrl = app.globalData.URL + cashUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        //缓存账户余额
        var _wages = wx.getStorageSync('wages');

        //console.log(_wages);


        //缓存余额和银行卡id
        wx.setStorageSync('balance',that.data.balance);//余额

        wx.setStorageSync('bankCardId',that.data.bankCardId);//银行卡id

        var _isSecurity = wx.getStorageSync('isSecurity');

/*        console.log(wx.getStorageSync('balance'));

        console.log(wx.getStorageSync('bankCardId'))*/

        //时候有值输入
        if(!that.data.inputBalance){

            wx.showToast({
                title: '请输入金额',
                icon: 'none',
                duration: 1000
            })

        }

        //小于最小额度
        else if(parseInt(that.data.inputBalance)<parseInt(that.data.amountMin)){

            wx.showToast({
                title: '单笔提现金额须大于'+that.data.amountMin+'元',
                icon: 'none',
                duration: 1000
            })



        }
        //大于最大额度
        else if(parseInt(that.data.inputBalance)>parseInt(that.data.amountMax)){

            console.log(parseInt(that.data.inputBalance)+'>'+parseInt(that.data.amountMax));

            wx.showToast({
                title: '单笔提现金额须小于'+that.data.amountMax+'元',
                icon: 'none',
                duration: 1000
            })

        }

        else if (parseInt(that.data.inputBalance)>parseInt(that.data.dayMaxCount)){

            wx.showToast({
                title: '提现金额超出当日最大限额',
                icon: 'none',
                duration: 1000
            })


        }

        else if(parseInt(that.data.inputBalance)>parseInt(that.data.monthMaxAmount)){

            wx.showToast({
                title: '提现金额超出当月最大限额',
                icon: 'none',
                duration: 1000
            })

        }

        else if(parseInt(that.data.inputBalance)>parseInt(_wages)){

            wx.showToast({
                title: '账户余额不足',
                icon: 'none',
                duration: 1000
            })
        }

        else if(parseInt(_wages)==0&&parseInt(that.data.monthMaxAmount)==0&&parseInt(that.data.dayMaxCount)==0){

            wx.showToast({
                title: '账户余额不足',
                icon: 'none',
                duration: 1000
            })

        }

        else if(parseInt(that.data.monthMaxAmount)==0&&parseInt(that.data.dayMaxCount)==0){

                wx.showToast({
                    title: '当月金额超限',
                    icon: 'none',
                    duration: 1000
                })

        }

        else {

            wx.showModal({

                title: '确认付款',
                content: '支付金额￥' + that.data.balance + ',提现金额￥100.00,手续费￥0.00',
                confirmText: '确认付款',

                success: function (res) {

                    if (res.confirm) {

                        if(_isSecurity=='1'){

                            console.log('开启短信验证');

                            wx.navigateTo({

                                url: '../sms_verification/sms_verification'
                            })



                        }

                        else if(_isSecurity=='2'){

                            console.log('开启支付密码');

                            wx.navigateTo({

                                url: '../pws_verification/pws_verification'
                            })


                        }

                        else if(_isSecurity=='3'){

                            console.log('啥都没开启');

                            confirmation()

                        }



                    }

                    else if (res.cancel) {


                    }
                }
            });


        }

        function confirmation() {

            /**
             * 接口：获取账户提现记录
             * 请求方式：GET
             * 接口：/user/withdraw/dowithdraw
             * 入参：bizId,bankCardId,balance,payPassword,code
             * */

            wx.request({

                url: thisCashUrl,

                method: 'GET',

                data: {


                    bizId: that.data.bizId,//订单id

                    bankCardId: that.data.bankCardId,//银行卡id

                    balance: that.data.balance,//提取现金

                },
                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },


                success: function (res) {

                    console.log(res.data);

                    if (res.data.code == '0000') {

                        redirectTo({

                            url: '../pay_success/pay_success'
                        })

                    }

                    else {


                        wx.redirectTo({

                            url: '../pay_fail/pay_fail'
                        })
                    }

                },


                fail: function (res) {

                    console.log(res)

                }

            })


        }


    },

    hasTipsFn: function () {

        wx.showModal({
            title: '提示限额说明',
            content: '单卡单笔50000.00,当日10000000.00,当月3000000.00元',
            confirmText: '确认',
            showCancel: false,
            success: function (res) {

                if (res.confirm) {


                }

                else if (res.cancel) {

                }
            }
        });


    },

    moreFn: function () {

        wx.showActionSheet({
            itemList: ['提现记录', '常见问题'],
            success: function (res) {

                console.log(res.tapIndex)

                if (res.tapIndex == '0') {

                    wx.navigateTo({

                        url: '../bill/bill'
                    })

                }

                else if (res.tapIndex == '1') {

                    wx.navigateTo({

                        url: '../help_service/help_service'
                    })

                }

            },
            fail: function (res) {

            }
        })

    },

    bindKeyInput: function (e) {

        var that = this;

        that.setData({

            balance: e.detail.value,

            inputBalance:e.detail.value,


        });


    }

});