/**
 * Created by ZHUANGYI on 2018/5/21.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const checkidnumberUrl = '/user/set/checkidnumber';//3、校验身份证号


Page({

    data: {

        userName:'',

        idNumber:'',


    },

    onShow:function () {

        var that = this;

        var _userName = wx.getStorageSync('userName');

        var _forgetTab = wx.getStorageSync('isPayPwd');

        if(_forgetTab=='0'){

            wx.setNavigationBarTitle({

                title:'设置支付密码'
            })
        }

        else {
            wx.setNavigationBarTitle({

                title:'忘记支付密码'
            })

        }
        that.setData({

            userName:_userName,

        })



    },

    checkIdNumberFn:function () {

        var that = this;

        var thisCheckidnumberUrl = app.globalData.URL + checkidnumberUrl;

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _tokenMsg = wx.getStorageSync('tokenMsg');

        var check = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

        //console.log(_tokenMsg);



        if(!that.data.userName){

            wx.showToast({

                title: '请输入姓名',
                icon: 'none',

            })



        }

        else if(!that.data.idNumber){

            wx.showToast({

                title: '请输入身份证号',
                icon: 'none',

            })



        }

        else if(!check.test(that.data.idNumber)){

            wx.showToast({

                title: '身份证号格式错误',
                icon: 'none',

            })



        }

        else {

            /**
             * 接口：校验身份证号
             * 请求方式：POST
             * 接口：/user/set/checkidnumber
             * 入参：idNumber,tokenMsg
             * */

            wx.request({

                url: thisCheckidnumberUrl,

                method: 'POST',

                data:json2FormFn.json2Form({

                    idNumber: that.data.idNumber,

                    tokenMsg:_tokenMsg


                }),

                header: {

                    'content-type':'application/x-www-form-urlencoded', // post请求

                    'jxsid':jx_sid,

                    'Authorization':Authorization

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

       /*                 wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1500,
                            success:function () {



                            }

                        })
*/
                        return false


                    }
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        return false
                    }

                    else {

                        if (res.data.code == '0000') {

                            wx.setStorageSync('tokenMsg', res.data.data.tokenMsg);

                            wx.showToast({

                                title: res.data.msg,

                                icon: 'none',

                            })

                            setTimeout(function () {

                                //跳转身份认证
                                wx.redirectTo({

                                    url: '../set_payment_psw/set_payment_psw'
                                })


                            }, 500)


                        }
                        else {

                            wx.showToast({

                                title: res.data.msg,

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

    idNumberFn:function (e) {

        var that=this;

        that.setData({

            idNumber:e.detail.value

        })

    },

    onUnload:function () {

    /*        wx.switchTab({

                url:'../../user/mine/mine'
            })

*/

    }





})