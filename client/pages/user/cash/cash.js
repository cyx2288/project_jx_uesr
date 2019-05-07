const app = getApp();



const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const cashUrl = '/user/withdraw/dowithdraw';// 用户发起提现操作

const checkcashUrl = '/user/work/checkwithdraw';//检测用户发起提现操作

const getpaymode = '/user/set/getpaymode';//查询支付验证方式

const bankCardJson = require('../../../static/libs/script/bankCardJson.js');//银行卡图标

const mineUrl = '/user/center/usercenter';//用户中心

var animationShowHeight = 300;


Page({

    data: {


        bizId: '',//订单id

        bankCardId: '',//银行卡id

        inputBalance: '',//输入框里value的值

        canCashBalance: '',//可以提现的金额

        payPassword: '',//支付密码

        code: '',//短信验证

        bankIcon: '',


        bankName: '',//银行名称

        bankNo: '',//银行卡号

        chooseBank: [],//picker中银行卡的数组

        amountMax: '',//单笔最大限额

        amountMin: '',//单笔最小限额

        dayMaxAmount: '',//日最大额度

        monthMaxAmount: '',//月最大额度

        rate: '',//费率

        userBankCardDTOList: [],//显示用的字符串

        bankList: [],//传给后台的数组

        userName: '',//客服-用户姓名

        mobile: '',//客服-用户电话

        cardType: '',//银行卡类型

        autoFocus: true,//是否弹出键盘

        thisIsVerify: '',//时候认证

        //弹框参数
        animationData: "",

        showModalStatus: false,

        sum: '',//支付金额

        list: '',//信息

        showModal: false,//二维码弹框

        imgalist:['http://wechat.fbwin.cn/images/qrcode_jx.jpg'],

        navbarActiveIndex: 0,

        navbarTitle: ['提现到银行卡', '提现到支付宝'],

        alipayList:[],

        zfbName:'',

        alipayNo:'',//支付宝账号

        alipayId:'',//支付宝id

    },


    onShow: function () {

    var that = this;

    var thisCheckcashUrl = app.globalData.URL + checkcashUrl;

    //获取银行卡页面的银行卡
    var jx_sid = wx.getStorageSync('jxsid');

    var Authorization = wx.getStorageSync('Authorization');

    var _isVerify = wx.getStorageSync('isVerify');

    //存储转账页面（在短信验证和支付密码页面中获取）来判断调用用户发起转账接口
    wx.setStorageSync('transferCash', '6');

    //存储提现到支付宝还是提现到银行卡（在短信验证和支付密码页面中获取）来判断短信

    wx.setStorageSync('chooseActive',that.data.navbarActiveIndex);


    console.log('页面进来选的是银行卡还是支付宝'+wx.getStorageSync('chooseActive'))

        console.log('触发onshow')


    if(wx.getStorageSync('chooseActive')=='1'){

        wx.setStorageSync('orderType','09')



    }
    else {

        wx.setStorageSync('orderType','08')


    }

    wx.getSystemInfo({

        success: function (res) {

            animationShowHeight = res.windowHeight;


        }
    })


    that.setData({

        userName: wx.getStorageSync('userName'),

        mobile: wx.getStorageSync('mobile'),

        inputBalance: '',//输入框里value的值


    })

    wx.showNavigationBarLoading();

    setTimeout(function () {

        wx.hideNavigationBarLoading()

    }, 500);



        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + mineUrl,

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

                    return false
                }

                else {

                    that.setData({

                        thisIsVerify: res.data.data.isVerify

                    })


                    showVerify();


                }

            },

            fail: function (res) {

                console.log(res)
            }

        });


        function showVerify() {

            if (that.data.thisIsVerify == '0' || that.data.thisIsVerify == '3') {

                console.log('没认证1')

                //存指定的页面  （在实名认证中取值）
                wx.setStorageSync('hrefId', '4');


                //未认证情况下不弹出键盘
                that.setData({

                    autoFocus: false//是否弹出键盘


                })

                wx.showModal({
                    title: '提示',
                    content: ' 当前账户尚未进行实名认证，完成认证后方可提现',
                    cancelText: '取消',
                    confirmText: '去认证',
                    confirmColor: '#fe9728',
                    success: function (res) {

                        if (res.confirm) {

                            wx.navigateTo({

                                url: '../../../packageA/pages/choose_certification/choose_certification'

                            })

                        }

                        else if (res.cancel) {

                            wx.navigateBack({
                                delta: 1
                            })
                        }

                        else {

                            wx.navigateBack({
                                delta: 1
                            })


                        }

                    }
                });


            }
            else if (that.data.thisIsVerify == '2') {

                console.log('没认证2')

                //存指定的页面  （在实名认证中取值）
                wx.setStorageSync('hrefId', '4');


                //未认证情况下不弹出键盘
                that.setData({

                    autoFocus: false//是否弹出键盘


                })

                wx.showModal({
                    title: '提示',
                    content: '实名认证审核中，审核通过后方可提现',
                    showCancel: false,
                    confirmText: '我知道了',
                    confirmColor: '#fe9728',
                    success: function (res) {

                        if (res.confirm) {

                            wx.navigateBack({
                                delta: 1
                            })

                        }

                        else if (res.cancel) {

                        }

                        else {

                            wx.navigateBack({
                                delta: 1
                            })


                        }

                    }
                });


            }
            else {

                that.checkwithdraw();


            }

        }



        //支付宝限额加载
        that.checkwithdrawAlipay();







},

    onLoad:function () {

        var that = this;

        var thisCheckcashUrl = app.globalData.URL + checkcashUrl;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        console.log('触发onload事件')



        that.withdrawRate();


        that.alipayRate();





    },

    preventTouchMove: function () {


    },

    //赋值
    bindPickerChange: function (e) {

        var that = this;

        //console.log('picker发送选择改变，携带值为', e.detail.value)

        //console.log(that.data.userBankCardDTOList)

        //选择银行卡的
        /*        console.log(that.data.userBankCardDTOList[e.detail.value].bankName);

         console.log(that.data.userBankCardDTOList[e.detail.value].cardType);*/

        that.setData({

            bankName: that.data.userBankCardDTOList[e.detail.value].bankName,//银行名称

            bankNo: that.data.userBankCardDTOList[e.detail.value].bankNo,//银行卡号

            bankCardId: that.data.userBankCardDTOList[e.detail.value].bankCardId,//银行卡id

            cardType: that.data.userBankCardDTOList[e.detail.value].cardType,//银行卡id

            bankIcon: that.data.userBankCardDTOList[e.detail.value].bankImg//银行卡id
        });



    },

    //全部提现
    cashAllFn: function () {

        var that = this;

        if(that.data.userBankCardDTOList.length==0&&that.data.navbarActiveIndex==0){

            wx.showToast({
                title: '请先绑定银行卡',
                icon: 'none',
                duration: 1000
            })

        }

        else if(that.data.alipayList.length==0&&that.data.navbarActiveIndex==1){


            wx.showToast({
                title: '请先绑定支付宝账号',
                icon: 'none',
                duration: 1000
            })


        }

        else {

            that.setData({

                inputBalance: that.data.canCashBalance,

            })


        }



        //console.log(that.data.inputBalance)


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

                    /*                wx.showToast({
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

                    wx.setStorageSync('isSecurity', res.data.data.isSecurity);

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
        wx.setStorageSync('balance', that.data.inputBalance);//提现金额

        wx.setStorageSync('rate', that.data.rate);//汇率

        wx.setStorageSync('bankCardId', that.data.bankCardId);//银行卡id

        wx.setStorageSync('alipayId',that.data.alipayId);//支付宝id


        var reg = /^\d+\.?(\d{1,2})?$/

        var dot = /([1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?)/

        var _isSecurity = wx.getStorageSync('isSecurity');

        //判断有没有银行卡
        if(that.data.userBankCardDTOList.length==0&&that.data.navbarActiveIndex==0){


            wx.showToast({
                title: '请先绑定银行卡',
                icon: 'none',
                duration: 1000
            })


            return

        }

        if(that.data.alipayList.length==0&&that.data.navbarActiveIndex==1){


            wx.showToast({
                title: '请先绑定支付宝账号',
                icon: 'none',
                duration: 1000
            })


        }

        //时候没有值输入
        else if (!that.data.inputBalance) {

            wx.showToast({
                title: '请输入提现金额',
                icon: 'none',
                duration: 1000
            })


        }

        //小于最小额度
        else if (parseFloat(that.data.inputBalance) < parseFloat(that.data.amountMin)) {

            wx.showToast({
                title: '单笔提现金额需大于' + that.data.amountMin + '元',
                icon: 'none',
                duration: 1000
            })


        }
        //大于最大额度
        else if (parseFloat(that.data.inputBalance) > parseFloat(that.data.amountMax)) {


            wx.showToast({
                title: '单笔提现金额需小于' + that.data.amountMax + '元',
                icon: 'none',
                duration: 1000
            })

        }

        else if (parseFloat(that.data.inputBalance) > parseFloat(that.data.dayMaxAmount)) {


            wx.showToast({
                title: '提现金额超出当日最大限额',
                icon: 'none',
                duration: 1000
            })


        }

        else if (parseFloat(that.data.inputBalance) > parseFloat(that.data.monthMaxAmount)) {


            wx.showToast({
                title: '提现金额超出当月最大限额',
                icon: 'none',
                duration: 1000
            })

        }

        else if (parseFloat(that.data.inputBalance) > parseFloat(that.data.canCashBalance)) {


            wx.showToast({
                title: '金额已超过可提余额',
                icon: 'none',
                duration: 1000
            })
        }

        //判断有几个小数点
        else if (!dot.test(that.data.inputBalance)) {
            wx.showToast({
                title: '输入金额格式有误',
                icon: 'none',
                duration: 1000
            })

        }

        //默认输入小数点后两位
        else if (!reg.test(that.data.inputBalance)) {

            wx.showToast({
                title: '输入金额限小数点后两位',
                icon: 'none',
                duration: 1000
            })


        }


        else if (parseFloat(that.data.monthMaxAmount) == 0 && parseFloat(that.data.dayMaxAmount) == 0) {

            wx.showToast({
                title: '账户余额不足',
                icon: 'none',
                duration: 1000
            })

        }

        else if (parseFloat(that.data.monthMaxAmount) == 0 && parseFloat(that.data.dayMaxAmount) == 0) {

            wx.showToast({
                title: '当月金额超限',
                icon: 'none',
                duration: 1000
            })

        }

        else {

            var inputValue = that.data.inputBalance;

            function returnFloat(value) {

                var value = Math.round(parseFloat(value) * 100) / 100;

                var xsd = value.toString().split(".");

                if (xsd.length == 1) {

                    value = value.toString() + ".00";

                    return value;
                }
                if (xsd.length > 1) {

                    if (xsd[1].length < 2) {

                        value = value.toString() + "0";
                    }
                    return value;
                }
            }


            //console.log('支付金额'+returnFloat(inputValue));

            //console.log('费率'+returnFloat(parseInt(that.data.inputBalance * (that.data.rate / 100 ))));

            var a = returnFloat(inputValue)

            var b = returnFloat(parseInt(that.data.inputBalance * (that.data.rate / 100 )));

            var money = returnFloat(parseFloat(a) + parseFloat(b))

            //缓存支付金额
            wx.setStorageSync('money', money);

            //console.log(returnFloat(parseFloat(a)+parseFloat(b)))

            that.setData({

                sum: returnFloat(parseFloat(a) + parseFloat(b)),

                list: [

                    {
                    key: '提现金额',
                    value: '￥' + returnFloat(inputValue)

                },
                    {
                        key: '手续费',
                        value: '￥' + b

                    }

                    ]


            });


            this.showModal();




        }


    },

    trueCashFn: function () {

        var that = this;

        var thisCashUrl = app.globalData.URL + cashUrl;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        var _isSecurity = wx.getStorageSync('isSecurity');

        if (_isSecurity == '1') {

            //console.log('开启短信验证');

            wx.setStorageSync('operation','cash');

            wx.navigateTo({

                url: '../sms_verification/sms_verification'
            })


        }

        else if (_isSecurity == '2') {

            //console.log('开启支付密码');

            wx.navigateTo({

                url: '../pws_verification/pws_verification'
            })


        }

        else if (_isSecurity == '3') {

            //console.log('啥都没开启');

            confirmation()

        }

        function confirmation() {

            /**
             * 接口：获取账户提现记录
             * 请求方式：GET
             * 接口：/user/withdraw/dowithdraw
             * 入参：bizId,bankCardId,balance,payPassword,code
             * */


            console.log('提现金额' + that.data.inputBalance);

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

                    app.globalData.repeat(res.data.code, res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    //存储有没有提现成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                    wx.setStorageSync('successVerify', 'true');

                    //存储有没有提现成功 如果操作成功则首页刷新 没成功或者没操作则不用刷新
                    wx.setStorageSync('successRefresh', 'true');

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

        if(this.data.navbarActiveIndex==1){

            this.alipayRate()

            wx.showModal({
                title: '提现限额说明',
                /*content: '单卡单笔49,500.00元，当日99,000.00元，当月198,000.00元',*/
                content: '单笔'+this.data.amountMax+'元,当日'+this.data.dayMaxAmount+',当月'+this.data.monthMaxAmount+'元',
                confirmText: '确认',
                showCancel: false,
                confirmColor: '#fe9728',
                success: function (res) {

                    if (res.confirm) {


                    }

                    else if (res.cancel) {

                    }
                }
            });


        }

        else {


            this.withdrawRate();

            wx.showModal({
                title: '提现限额说明',
                /*content: '单卡单笔49,500.00元，当日99,000.00元，当月198,000.00元',*/
                content: '单笔'+this.data.amountMax+'元,当日'+this.data.dayMaxAmount+',当月'+this.data.monthMaxAmount+'元',
                confirmText: '确认',
                showCancel: false,
                confirmColor: '#fe9728',
                success: function (res) {

                    if (res.confirm) {


                    }

                    else if (res.cancel) {

                    }
                }
            });



        }




    },

    moreFn: function () {

        wx.showActionSheet({
            itemList: ['提现记录', '常见问题'],
            success: function (res) {

                console.log(res.tapIndex)

                if (res.tapIndex == '0') {

                    //存储从哪个页面跳到我的账单 来判断导航名称（在我的账单取到 1为提现记录 2为转账记录）
                    wx.setStorageSync('whichBill', '1');

                    wx.navigateTo({

                        url: '../../../packageA/pages/bill/bill'
                    })

                }

                else if (res.tapIndex == '1') {

                    wx.navigateTo({

                        url: '../../../packageA/pages/help_service/help_service'
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


        if (thisInputBalance) {

            if(that.data.userBankCardDTOList.length==0&&that.data.navbarActiveIndex==0){


                wx.showToast({
                    title: '请先绑定银行卡',
                    icon: 'none',
                    duration: 1000
                })

                e.detail.value = ''


            }

            if(that.data.alipayList.length==0&&that.data.navbarActiveIndex==1){


                wx.showToast({
                    title: '请先绑定支付宝账号',
                    icon: 'none',
                    duration: 1000
                })

                e.detail.value = ''


            }


             if(thisInputBalance=='00'){

                 e.detail.value = 0


            }
             //默认输入小数点后两位
             else if (isNaN(+thisInputBalance)||!reg.test(thisInputBalance)) {


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

            inputBalance: e.detail.value,


        });


    },

    showModal: function () {


        // 显示遮罩层
        var animation = wx.createAnimation({

            duration: 200,

            timingFunction: "linear",

            delay: 0

        });


        this.animation = animation;

        animation.translateY(animationShowHeight).step();

        console.log('Y轴高度' + animationShowHeight);

        this.setData({

            animationData: animation.export(),

            showModalStatus: true

        });

        console.log(this.data.animationData)

        setTimeout(function () {

            animation.translateY(0).step();

            this.setData({

                animationData: animation.export()

            })

        }.bind(this), 200)

    },

    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({

            duration: 200,

            timingFunction: "linear",

            delay: 0

        });

        this.animation = animation;

        animation.translateY(animationShowHeight).step()

        this.setData({

            animationData: animation.export(),

        })
        setTimeout(function () {

            animation.translateY(0).step()

            this.setData({

                animationData: animation.export(),

                showModalStatus: false
            })
        }.bind(this), 200)
    },

    onNavBarTap: function (event) {


        var vm = this;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');
        // 获取点击的navbar的index
        var navbarTapIndex = event.currentTarget.dataset.navbarIndex
        // 设置data属性中的navbarActiveIndex为当前点击的navbar
        vm.setData({
            navbarActiveIndex: navbarTapIndex,
            autoFocus: true,//是否弹出键盘

            inputBalance:''

        })




        console.log('点击的是几'+this.data.navbarActiveIndex)

        if(vm.data.navbarActiveIndex=='1'){

            wx.setStorageSync('chooseActive','1');

            wx.setStorageSync('orderType','09');

            vm.alipayRate()


            //vm.checkwithdrawAlipay()




        }

        else {

            wx.setStorageSync('chooseActive','0');

            wx.setStorageSync('orderType','08')

            vm.withdrawRate();


        }
    },

    checkwithdraw:function () {

        var that = this;

        var thisCheckcashUrl = app.globalData.URL + checkcashUrl;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


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

                    return false
                }

                else {


                    //二维码弹窗
                    if(res.data.code == '-10'){

                        that.setData({

                            showModal: true,

                        })

                    }


                    else {

  /*                      that.setData({

                            //balance: res.data.data.balance,//提取现金

                            amountMax: res.data.data.amountMax,//单笔最大限额

                            amountMin: res.data.data.amountMin,//单笔最小限额

                            dayMaxAmount: res.data.data.dayMaxAmount,//日最大额度

                            monthMaxAmount: res.data.data.monthMaxAmount,//月最大额度

                            rate: res.data.data.rate,//费率

                            canCashBalance: res.data.data.balance,


                        })
*/


                        var pages = getCurrentPages();

                        var currPage = pages[pages.length - 1]; // 当前页面

                        if(currPage.data.bankName&&wx.getStorageSync('chooseCard')=='0'){

                            wx.removeStorageSync('chooseCard')


                        }

                        else {


                            if(res.data.data.userBankCardDTOList){

                                that.setData({

                                    userBankCardDTOList: res.data.data.userBankCardDTOList

                                })



                                //0703 写的 不要删掉
                                var _bankList = res.data.data.userBankCardDTOList

                                //console.log(that.data.bankList)


                                for (var x in _bankList) {

                                    //console.log(that.data.bankList[x].bankName)

                                    for (var y in bankCardJson.bankCardJson) {

                                        if (bankCardJson.bankCardJson[y].name == _bankList[x].bankName) {

                                            break;

                                        }

                                    }


                                    _bankList[x].bankImg = bankCardJson.bankCardJson[y].img

                                    //console.log( _bankList[x].bankImg=bankCardJson.bankCardJson[y].img)

                                }

                                that.setData({

                                    userBankCardDTOList: _bankList

                                })


                                //如果是上一页返回并赋值 不是就默认显示第一个

                                var pages = getCurrentPages();

                                var currPage = pages[pages.length - 1]; // 当前页面

                                if(currPage.data.bankName&&wx.getStorageSync('chooseCard')=='0'){

                                    wx.removeStorageSync('chooseCard')



                                }
                                else {


                                    //默认显示第一个银行卡
                                    that.setData({

                                        bankName: that.data.userBankCardDTOList[0].bankName,//银行名称

                                        bankNo: that.data.userBankCardDTOList[0].bankNo,//银行卡号

                                        bankCardId: that.data.userBankCardDTOList[0].bankCardId,//银行卡id

                                        cardType: that.data.userBankCardDTOList[0].cardType,//银行卡类型

                                        bankIcon: that.data.userBankCardDTOList[0].bankImg//银行卡类型



                                    })



                                }




                                /*                                    //获取银行卡的
                                 var pickChooseBank = [];


                                 //循环银行卡、银行名称及银行id
                                 for (var i = 0; i < _bankList.length; i++) {

                                 var pickBankName = _bankList[i].bankName;

                                 var pickBankNo = _bankList[i].bankNo;

                                 var pickBankId = _bankList[i].bankCardId;

                                 var pickBankType = _bankList[i].cardType;

                                 //遍历银行卡类型
                                 if (pickBankType == '1') {


                                 var _pickChooseBank = pickBankName + '储蓄卡' + '(' + pickBankNo.substr(pickBankNo.length - 4) + ')';
                                 }

                                 else if (pickBankType == '2') {

                                 var _pickChooseBank = pickBankName + '信用卡' + '(' + pickBankNo.substr(pickBankNo.length - 4) + ')';
                                 }


                                 //组成数组
                                 pickChooseBank.push(_pickChooseBank);


                                 }


                                 that.setData({

                                 bankList: pickChooseBank

                                 })*/

                            }

                            else {

                                that.setData({

                                    userBankCardDTOList: [],

                                })



                            }



                        }









                    }


                    //console.log(that.data.userBankCardDTOList);


                }

            },


            fail: function (res) {

                console.log(res)

            }

        });

    },

    checkwithdrawAlipay:function () {

        var vm = this;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        /**
         * 接口：获取用户支付宝信息
         * 请求方式：GET
         * 接口：/user/alipay/getuseralipayinfo
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


                    if(res.data.data.list) {


                        vm.setData({

                            alipayList: res.data.data.list,

                        })
                    }

                    var pages = getCurrentPages();

                    var currPage = pages[pages.length - 1]; // 当前页面

                    if(currPage.data.alipayNo&&wx.getStorageSync('chooseCard')=='1'){

                        wx.removeStorageSync('chooseCard')



                    }

                    else {

                        if(res.data.data.list){

                            //默认显示第一个银行卡
                            vm.setData({

                                alipayNo:res.data.data.list[0].alipayNo,//支付宝账号

                                alipayId:res.data.data.list[0].alipayId,//支付宝Id


                            })



                        }

                        else{

                            vm.setData({

                                alipayList:[]

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

    alipayRate:function () {

         var vm = this;

         //获取银行卡页面的银行卡
         var jx_sid = wx.getStorageSync('jxsid');

         var Authorization = wx.getStorageSync('Authorization');



         /**
          * 接口：获取支付宝限额信息
          * 请求方式：POST
          * 接口：/user/withdraw/getalipaylimit
          * 入参：null
          **/
         wx.request({

             url: app.globalData.URL + '/user/withdraw/getalipaylimit',

             method: 'GET',

             header: {

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

                     return false
                 }

                 else {

                     vm.setData({


                         amountMax: res.data.data.amountMax,//单笔最大限额

                         amountMin: res.data.data.amountMin,//单笔最小限额

                         dayMaxAmount: res.data.data.dayMaxAmount,//日最大额度

                         monthMaxAmount: res.data.data.monthMaxAmount,//月最大额度

                         rate: res.data.data.rate,//费率

                         canCashBalance: res.data.data.balance,



                     })



                 }

             },

             fail: function (res) {

                 console.log(res)
             }

         });


     },

    withdrawRate:function () {

        var that = this;

        var thisCheckcashUrl = app.globalData.URL + checkcashUrl;

        //获取银行卡页面的银行卡
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


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

                else if (res.data.code == '3004') {

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else {


                    //二维码弹窗
                    if (res.data.code == '-10') {

                        that.setData({

                            showModal: true,

                        })

                    }


                    else {

                        that.setData({

                            //balance: res.data.data.balance,//提取现金

                            amountMax: res.data.data.amountMax,//单笔最大限额

                            amountMin: res.data.data.amountMin,//单笔最小限额

                            dayMaxAmount: res.data.data.dayMaxAmount,//日最大额度

                            monthMaxAmount: res.data.data.monthMaxAmount,//月最大额度

                            rate: res.data.data.rate,//费率

                            canCashBalance: res.data.data.balance,


                        })

                    }

                }

            }

        })


                    },


    addBankCard:function () {

        //跳转为添加银行卡
        wx.setStorageSync('addCard','1');

        wx.navigateTo({

            url: '../../../packageA/pages/add_card/add_card'
        })


    },

    addZfb:function () {

        //跳转为添加银行卡
        wx.setStorageSync('addZfb','1');

        wx.navigateTo({

            url: '../../../packageA/pages/add_zfb/add_zfb'
        })

    }




});