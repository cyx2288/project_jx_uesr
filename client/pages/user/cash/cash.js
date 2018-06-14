const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const cashUrl = '/user/withdraw/dowithdraw';// 用户发起提现操作

const checkcashUrl = '/user/work/checkwithdraw';//检测用户发起提现操作

const getpaymode =  '/user/set/getpaymode';//查询支付验证方式


Page({

    data: {


        bizId: '',//订单id

        bankCardId: '',//银行卡id

        //balance: '',//提取现金

        inputBalance:'',//输入框里value的值

        canCashBalance:'',//可以提现的金额

        payPassword: '',//支付密码

        code: '',//短信验证

        /*bankList: [],//银行卡列表数组*/

        bankName: '',//银行名称

        bankNo: '',//银行卡号

        chooseBank: [],//picker中银行卡的数组

        amountMax: '',//单笔最大限额

        amountMin: '',//单笔最小限额

        dayMaxAmount: '',//日最大额度

        monthMaxAmount: '',//月最大额度

        rate: '',//费率

        userBankCardDTOList:[],//显示用的字符串

        bankList: [],//传给后台的数组

        userName:'',

        mobile:'',


    },


    onShow: function () {

        var that = this;

        var thisCheckcashUrl = app.globalData.URL + checkcashUrl;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _isVerify = wx.getStorageSync('isVerify');


        that.setData({


            userName:wx.getStorageSync('userName'),

            mobile:wx.getStorageSync('mobile'),


        })



        wx.showLoading({

            title: '加载中',
            mask:true,

        })

        setTimeout(function(){

            wx.hideLoading()

        },1000)

        //console.log(_isVerify)

        //没认证的去认证
        if (_isVerify == '0') {

            //存指定的页面
            wx.setStorageSync('hrefId','4');

            wx.showModal({
                title: '提示',
                content: ' 未完成实名认证的用户，需先完成实名认证才可添加银行卡',
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

                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            });



        }

        else {


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

                    //console.log(that.data.userBankCardDTOList);
                    that.setData({

                        userBankCardDTOList:res.data.data.userBankCardDTOList

                    })

                    //console.log(that.data.userBankCardDTOList)


                    if(res.data.code=='-7'){


                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            cancelText: '取消',
                            confirmText: '去添加',
                            confirmColor:'#fe9728',
                            success: function (res) {

                                if (res.confirm) {

                                    wx.navigateTo({

                                        url: '../add_card/add_card'

                                    })

                                }

                                else if (res.cancel) {

                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }
                            }
                        });
                    }

                    else {

                        var thisBankList = that.data.userBankCardDTOList;


                        that.setData({

                           //balance: res.data.data.balance,//提取现金

                            amountMax: res.data.data.amountMax,//单笔最大限额

                            amountMin: res.data.data.amountMin,//单笔最小限额

                            dayMaxAmount: res.data.data.dayMaxAmount,//日最大额度

                            monthMaxAmount: res.data.data.monthMaxAmount,//月最大额度

                            rate: res.data.data.rate,//费率

                            canCashBalance:res.data.data.balance,

                            userBankCardDTOList:res.data.data.userBankCardDTOList,

                        })


                        //默认显示第一个银行卡
                        that.setData({

                            bankName: that.data.userBankCardDTOList[0].bankName,//银行名称

                            bankNo: that.data.userBankCardDTOList[0].bankNo,//银行卡号

                            bankCardId: that.data.userBankCardDTOList[0].bankCardId//银行卡id

                        });


                        //获取银行卡的
                        var pickChooseBank = [];

                        //循环银行卡、银行名称及银行id
                        for (var i = 0; i < thisBankList.length; i++) {

                            var pickBankName = thisBankList[i].bankName;

                            var pickBankNo = thisBankList[i].bankNo;

                            var pickBankId = thisBankList[i].bankCardId;

                            var _pickChooseBank = pickBankName + '储蓄卡' + '('+ pickBankNo.substr(pickBankNo.length-4)+')';

                            //组成数组
                            pickChooseBank.push(_pickChooseBank);

                        }


                        that.setData({

                            bankList: pickChooseBank

                        })



                    }

                },


                fail: function (res) {

                    console.log(res)

                }

            });

/*
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
            */


        }





    },

    //赋值
    bindPickerChange: function (e) {

        var that = this;

        //console.log('picker发送选择改变，携带值为', e.detail.value)

        //console.log(that.data.userBankCardDTOList)

        //选择银行卡的
        //console.log(that.data.userBankCardDTOList[e.detail.value].bankName);

        that.setData({

            bankName: that.data.userBankCardDTOList[e.detail.value].bankName,//银行名称

            bankNo: that.data.userBankCardDTOList[e.detail.value].bankNo,//银行卡号

            bankCardId: that.data.userBankCardDTOList[e.detail.value].bankCardId//银行卡id

        });


    },

    //全部提现
    cashAllFn: function () {

        var that = this;

            that.setData({

                inputBalance: that.data.canCashBalance,

            })


        console.log(that.data.inputBalance)


    },

    //提现
    cashFn: function () {

        var that = this;

        var thisCashUrl = app.globalData.URL + cashUrl;

        var getpaymodeUrl = app.globalData.URL + getpaymode;


        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：查询支付验证方式
         * 请求方式：POST
         * 接口：/user/work/checkwithdraw
         * 入参：null
         * */

        wx.request({

            url: getpaymodeUrl,

            method: 'POST',

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jx_sid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success:function () {

                            setTimeout(function () {

                                wx.reLaunch({

                                    url:'../../common/signin/signin'
                                })

                            },1500)

                        }

                    })

                    return false


                }


                else {

                    wx.setStorageSync('isSecurity',res.data.data.isSecurity);

                }


            },


            fail: function (res) {

                console.log(res)

            }

        });


        //缓存jx_sid&&Authorization数据
/*        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');*/


        //缓存账户余额
        var _wages = wx.getStorageSync('wages');

        //console.log(_wages);
        //缓存余额和银行卡id
        wx.setStorageSync('balance',that.data.inputBalance);//提现金额

        wx.setStorageSync('rate',that.data.rate);//汇率

        wx.setStorageSync('bankCardId',that.data.bankCardId);//银行卡id

        var reg = /^\d+\.?(\d{1,2})?$/

        var dot = /([1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?)/

        var _isSecurity = wx.getStorageSync('isSecurity');


        //时候没有值输入
        if(!that.data.inputBalance){

            wx.showToast({
                title: '请输入金额',
                icon: 'none',
                duration: 1000
            })


        }

         //小于最小额度
         else if(parseFloat(that.data.inputBalance)<parseFloat(that.data.amountMin)){

             wx.showToast({
                 title: '单笔提现金额须大于'+that.data.amountMin+'元',
                 icon: 'none',
                 duration: 1000
             })



         }
         //大于最大额度
         else if(parseFloat(that.data.inputBalance)>parseFloat(that.data.amountMax)){


             wx.showToast({
                 title: '单笔提现金额须小于'+that.data.amountMax+'元',
                 icon: 'none',
                 duration: 1000
             })

         }

         else if (parseFloat(that.data.inputBalance)>parseFloat(that.data.dayMaxAmount)){



             wx.showToast({
                 title: '提现金额超出当日最大限额',
                 icon: 'none',
                 duration: 1000
             })


         }

         else if(parseFloat(that.data.inputBalance)>parseFloat(that.data.monthMaxAmount)){



             wx.showToast({
                 title: '提现金额超出当月最大限额',
                 icon: 'none',
                 duration: 1000
             })

         }

        else if(parseFloat(that.data.inputBalance)>parseFloat(that.data.canCashBalance)){



            wx.showToast({
                title: '金额已超过可提余额',
                icon: 'none',
                duration: 1000
            })
        }

        //判断有几个小数点
        else if(!dot.test(that.data.inputBalance)){
            wx.showToast({
                title: '输入金额格式有误',
                icon: 'none',
                duration: 1000
            })

        }

        //默认输入小数点后两位
        else if(!reg.test(that.data.inputBalance)) {

            wx.showToast({
                title: '输入金额限小数点后两位',
                icon: 'none',
                duration: 1000
            })


        }


        else if(parseFloat(that.data.monthMaxAmount)==0&&parseFloat(that.data.dayMaxAmount)==0){

            wx.showToast({
                title: '账户余额不足',
                icon: 'none',
                duration: 1000
            })

        }

        else if(parseFloat(that.data.monthMaxAmount)==0&&parseFloat(that.data.dayMaxAmount)==0){

                wx.showToast({
                    title: '当月金额超限',
                    icon: 'none',
                    duration: 1000
                })

        }

        else {

            var inputValue = that.data.inputBalance;

            function returnFloat(value){

                var value=Math.round(parseFloat(value)*100)/100;

                var xsd=value.toString().split(".");

                if(xsd.length==1){

                    value=value.toString()+".00";

                    return value;
                }
                if(xsd.length>1){

                    if(xsd[1].length<2){

                        value=value.toString()+"0";
                    }
                    return value;
                }
            }


            //console.log('支付金额'+returnFloat(inputValue));

            //console.log('费率'+returnFloat(parseInt(that.data.inputBalance * (that.data.rate / 100 ))));

            var a = returnFloat(inputValue)

            var b = returnFloat(parseInt(that.data.inputBalance * (that.data.rate / 100 )));

            var money = returnFloat(parseFloat(a)+parseFloat(b))

            //缓存支付金额
            wx.setStorageSync('money',money);

            //console.log(returnFloat(parseFloat(a)+parseFloat(b)))

            wx.showModal({

                title: '确认提现',
                content: '支付金额￥' + (returnFloat(parseFloat(a)+parseFloat(b)))+ ',提现金额￥'+returnFloat(inputValue)+',手续费￥'+ b,
                confirmText: '确认',
                confirmColor:'#fe9728',

                success: function (res) {

                    if (res.confirm) {

                        if(_isSecurity=='1'){

                            //console.log('开启短信验证');

                            wx.navigateTo({

                                url: '../sms_verification/sms_verification'
                            })



                        }

                        else if(_isSecurity=='2'){

                            //console.log('开启支付密码');

                            wx.navigateTo({

                                url: '../pws_verification/pws_verification'
                            })


                        }

                        else if(_isSecurity=='3'){

                            //console.log('啥都没开启');

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


            console.log('提现金额'+that.data.inputBalance);

            wx.request({

                url: thisCashUrl,

                method: 'GET',

                data: {


                    bizId: that.data.bizId,//订单id

                    bankCardId: that.data.bankCardId,//银行卡id

                    balance: that.data.inputBalance,//提取现金

                },
                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },


                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code,res.data.msg);

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1500,
                            success:function () {

                                setTimeout(function () {

                                    wx.reLaunch({

                                        url:'../../common/signin/signin'
                                    })

                                },1500)

                            }

                        })

                        return false


                    }

                    else {

                        //缓存点单号
                        wx.setStorageSync('cashOrderId', res.data.data);

                        if (res.data.code == '0000') {

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 1000
                            })

                            wx.redirectTo({

                                url: '../pay_success/pay_success'
                            })

                        }

                        else {

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 1000
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

    hasTipsFn: function () {

        wx.showModal({
            title: '提现限额说明',
            content: '单卡单笔50,000.00元，当日100,000.00元，当月100,000.00元',
            /*content: '单卡单笔'+this.data.amountMin+'元,当日'+this.data.dayMaxAmount+',当月'+this.data.monthMaxAmount+'元',*/
            confirmText: '确认',
            showCancel: false,
            confirmColor:'#fe9728',
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

        var reg = /^\d+\.?(\d{1,2})?$/;


        //上一次的金额
        var lastInputBalace = that.data.inputBalance;

        //这一次的金额
        var thisInputBalance = e.detail.value;



        if(thisInputBalance){

            //默认输入小数点后两位
            if(!reg.test(thisInputBalance)) {


                wx.showToast({
                    title: '输入金额有误',
                    icon: 'none',
                    duration: 1000

                });

                e.detail.value = lastInputBalace


            }

        }



        that.setData({

            //balance: e.detail.value,

            inputBalance:e.detail.value,




        });







    },

});