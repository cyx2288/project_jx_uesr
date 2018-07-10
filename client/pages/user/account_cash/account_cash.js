const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const balanceUrl = '/user/account/getbalance';//获取用户余额

const getpaymode =  '/user/set/getpaymode';//查询支付验证方式

const checkTransferUrl = '/user/work/checktransfer';//检测用户发起转账操作



Page({

    data:{

        userName:'',//姓名

        mobile:'',//手机号

        mobileNum:'',//正常手机号

        inputBalance:'',//输入框中的值

        tips:'',//备注

        canTransferBalance:'',//可转余额

        disabled: true,//true为按钮置灰 false为高亮

        security:'',//支付状态


    },

    onShow:function () {

        var that = this;

        //页面初始化
        that.setData({

            inputBalance:'',//输入框中的值

            tips:'',//备注

            disabled: true,//true为按钮置灰 false为高亮
        })

        //有几个ajax请求
        var ajaxCount = 1;

        //存储转账页面（在短信验证和支付密码页面中获取）来判断调用用户发起转账接口
        wx.setStorageSync('transferCash','5');

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _mobile = wx.getStorageSync('transferMobile');


        /**
         * 接口：获取用户余额
         * 请求方式：GET
         * 接口：/user/account/getbalance
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + balanceUrl,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {


                console.log(res.data);

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)


                    return false


                }

                else {

                    that.setData({

                        canTransferBalance: res.data.data//用户余额

                    });


                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();

                }

            },


            fail: function (res) {

                console.log(res)

            }

        })

        /**
         * 接口：检测用户发起转账操作
         * 请求方式：post
         * 接口：/user/work/checktransfer
         * 入参：mobile
         **/
        wx.request({

            url: app.globalData.URL + checkTransferUrl,

            method: 'POST',

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            data:json2FormFn.json2Form({

                mobile: _mobile,

            }),

            success: function (res) {


                if(res.data.code=='0000'){


                    that.setData({

                        hideMobile:res.data.data.hideMobile,

                        userName:res.data.data.userName,

                    })

                }


            },


            fail: function (res) {

                console.log(res)

            }

        })



        //存储手机号
        that.setData({

            mobile:_mobile,

            userName:wx.getStorageSync('transferName'),


        })



    },

    transferFn:function () {

        var that =this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        wx.setStorageSync('transferBalance',that.data.inputBalance);//提现金额

        //如果有备注的话存一下~

        wx.setStorageSync('transferTips',that.data.tips);//备注

        console.log('备注：'+ wx.getStorageSync('transferTips'))

        //console.log(that.data.mobileNum)

        if(parseFloat(that.data.inputBalance)>parseFloat(that.data.canTransferBalance)){

            wx.showToast({
                title: ' 可转余额不足',
                icon: 'none',
                duration: 1000,
                mask:true,

            });

        }

        else {

            /**
             * 接口：查询支付验证方式
             * 请求方式：POST
             * 接口：/user/work/checkwithdraw
             * 入参：null
             * */

            wx.request({

                url: app.globalData.URL + getpaymode,

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

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)

                        return false


                    }


                    else {

                        that.setData({

                            security:res.data.data.isSecurity

                        })


                    }


                },


                fail: function (res) {

                    console.log(res)

                }

            });

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


            wx.showModal({

                title: '确认转账',
                content: '转账金额￥' + returnFloat(inputValue)+ ',对方姓名：'+ wx.getStorageSync('transferName') + ',对方账号：'+ that.data.mobileNum ,
                confirmText: '确认',
                confirmColor:'#fe9728',

                success: function (res) {

                    if (res.confirm) {

                        if(that.data.security=='1'){

                            wx.navigateTo({

                                url: '../sms_verification/sms_verification'
                            })



                        }

                        else if(that.data.security=='2'){

                            //console.log('开启支付密码');

                            wx.navigateTo({

                                url: '../pws_verification/pws_verification'
                            })


                        }



                    }

                    else if (res.cancel) {


                    }
                }
            });


        }

    },

    transferAllFn:function () {

        var that = this;

        that.setData({

            inputBalance: that.data.canTransferBalance,

        })

        if(that.data.canTransferBalance){

            that.setData({

                disabled:false

            });

        }


    },

    //输入
    bindKeyInput:function (e) {

        var that = this;

        var reg = /^\d+\.?(\d{1,2})?$/;

        //上一次的金额
        var lastInputBalace = that.data.inputBalance;

        //这一次的金额
        var thisInputBalance = e.detail.value;
        //第一位
        var len1 = thisInputBalance.substr(0,1);
        //第二位
        var len2 = thisInputBalance.substr(1,1);

        console.log(len2 == '.')

            if(thisInputBalance){

                //第一位是0的话 按钮不亮
                if(len1==0){

                    if(len2 == '.'){

                        that.setData({

                            disabled:false

                        });

                    }

                    else {


                        that.setData({

                            disabled:true

                        });


                    }



                }
             else {


                    that.setData({

                        disabled:false

                    });
                }

                //默认输入小数点后两位
                if(!reg.test(thisInputBalance)) {


                    wx.showToast({
                        title: '输入金额有误',
                        icon: 'none',
                        duration: 1000

                    });

                    e.detail.value = lastInputBalace


                }

                //如果第一位是0，第二位不是点
                else if(thisInputBalance.length > 1 && len1==0 && len2 != '.'){

                    wx.showToast({
                        title: '输入金额有误',
                        icon: 'none',
                        duration: 1000,
                        mask:true,

                    });

                    e.detail.value = lastInputBalace



                }

                //第一位不能是点
                else if(len1=='.'){

                    wx.showToast({
                        title: '输入金额有误',
                        icon: 'none',
                        duration: 1000

                    });


                    that.setData({

                        thisInputBalance:''

                    })
                }




        }

        else {

            that.setData({

                disabled:true

            });


        }


        that.setData({

            inputBalance:e.detail.value

        })


    },

    tipsFn:function (e) {

        var that = this;

        that.setData({

            tips:e.detail.value

        });









    },







})