/**
 * Created by ZHUANGYI on 2018/5/14.
 */


const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const bankCardJson = require('../../../static/libs/script/bankCardJson.js');//银行卡

const addBankUrl = '/user/bank/addbankcardinfo';

const getBankName = '/user/bank/getbankname';

const getCity = '/user/bank/citys';

const getProvinces = '/user/bank/provinces';

Page({

    data: {

        zfbNo: '',//银行卡号

        userName: '',//用户姓名


    },

    onShow: function () {

        var that = this;


        var _userName = wx.getStorageSync('userName');


        wx.showNavigationBarLoading();

        setTimeout(function () {

            wx.hideNavigationBarLoading()

        },500);



        that.setData({

            userName: _userName,

        });



    },


    //点击添加银行卡号
    addZfbFn: function () {


        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var regNum=/^[0-9]+$/

        var regMobile=/^1\d{10}$/;

        var regMail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/



        //判断银行卡是否为空
        if (!that.data.zfbNo) {


            wx.showToast({

                title: '请填写正确的支付宝账号',
                icon: 'none',
                mask:true,

            })

            return

        }
        //判断卡号是否有误
        if ((regNum.test(that.data.zfbNo))) {

            if(!regMobile.test(that.data.zfbNo)){

                wx.showToast({

                    title: '请填写正确的支付宝账号',

                    icon: 'none',
                    mask:true,

                })


            }

            else {

                addZfb()


            }



        }

        else if(!regMail.test(that.data.zfbNo)){

            wx.showToast({

                title: '请填写正确的支付宝账号',

                icon: 'none',
                mask:true,

            })




        }

        else {

            addZfb()
        }


        function addZfb() {



            /**
             * 接口：添加用户支付宝信息
             * 请求方式：POST
             * 接口：/user/alipay/addalipayinfo
             * 入参：alipayNo
             * */


            wx.request({

                url: app.globalData.URL + '/user/alipay/addalipayinfo',

                method: 'POST',

                data: json2FormFn.json2Form({

                    alipayNo: that.data.zfbNo,//zfb账号

                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    //code3003返回方法
                    app.globalData.repeat(res.data.code, res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if (res.data.code == '3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../../pages/common/signin/signin'
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


                        if (res.data.code == '0000') {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask:true,

                            })

                            setTimeout(function () {


                                wx.navigateBack({

                                    delta: 2

                                })

                            }, 2000)


                        }


                        else {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask:true,

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


    //监听银行卡号
    zfbNoFn: function (e) {

        var that = this;

        var vm  = e.detail.value;


        that.setData({

            zfbNo: vm.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,'') ,

        });


    },


})
