/**
 * Created by ZHUANGYI on 2018/5/21.
 */

const app = getApp();

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const setpaypwdUrl = '/user/set/setpaypwd';// 设置支付密码

const updatepaymode = '/user/set/updatepaymodesecond';//设置支付方式

Page({

    data:{

        password:'',

        confirmPassword:'',
        

    },

    onShow:function () {

        var _forgetTab =  wx.getStorageSync('isPayPwd');

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

    },
    changePwdFn:function () {

        var that = this;

        var thisSetpaypwdUrl = app.globalData.URL + setpaypwdUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _tokenMsg = wx.getStorageSync('tokenMsg');


        //连续
        var reg='1234567890_0987654321';


        var a = /[@#\$%\^&\*]+/g;

        //重负
        var regText = /^(?=.*\d+)(?!.*?([\d])\1{5})[\d]{6}$/;


        if(that.data.password==''||that.data.password.length<6){

            wx.showToast({

                title: '请输入正确的6位支付密码',
                icon: 'none'

            });

        }

        else if(that.data.confirmPassword==''||that.data.confirmPassword.length<6){

            wx.showToast({

                title: '请输入正确的6位支付密码',
                icon: 'none'

            });

        }

        else if(a.test(that.data.password)||a.test(that.data.confirmPassword)){

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none'

            });

        }

        //连续
        else if(reg.indexOf(that.data.password)>=0){

            wx.showToast({

                title: '请输入非连续、重复的6位密码',
                icon: 'none'

            });

        }

        //重复
        else if(!regText.test(that.data.password)){

      /*      console.log(that.data.password)

            console.log(!regText.test(that.data.password))*/

            wx.showToast({

                title: '请输入非连续、重复的6位密码',
                icon: 'none'

            });

        }

        else if(that.data.password!=that.data.confirmPassword){
            wx.showToast({

                title: '请两次输入相同的验证码',
                icon: 'none'

            });

        }

        else {

            /**
             * 接口：设置支付密码
             * 请求方式：POST
             * 接口：/user/set/setpaypwd
             * 入参：payPassword，confirmPassword，tokenMsg
             * */

            wx.request({

                url: thisSetpaypwdUrl,

                method: 'POST',

                data:json2FormFn.json2Form({

                    password: md5.hexMD5(that.data.password),

                    confirmPassword:md5.hexMD5(that.data.confirmPassword),

                    //tokenMsg:_tokenMsg,


                }),
                header: {

                    'content-type':'application/x-www-form-urlencoded', // post请求

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

/*                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1500,
                            success:function () {


                            }

                        })*/

                        return false


                    }

                    else {

                        if (res.data.code == '0000') {


                            wx.showToast({

                                title: res.data.msg,

                                icon: 'none',

                                success: function () {

                                    var _payHref = wx.getStorageSync('payHtml');

                                    var _paySettingAuthentication = wx.getStorageSync('paySettingAuthentication');

                                    var _paySetting = wx.getStorageSync('paySetting');


                                    //如果是从提现页面的忘记支付密码来的

                                    if(_payHref=='-4'||_payHref=='-3'){


                                        setTimeout(function () {

                                            wx.navigateBack({

                                                delta: 1

                                            })

                                        }, 2000)


                                    }

                                    //如果是从设置支付方式来的 后退页面并且调用设置支付方式

                                    else if(_paySettingAuthentication=='1'||_paySetting=='1'){

                                        setTimeout(function () {

                                            wx.navigateBack({

                                                delta: 1

                                            })

                                        }, 2000)


                                        //判断要不要修改支付方式
                                        //var _paySettingHref = wx.getStorageSync('paySettingHref');

                                            /**
                                             * 接口：设置支付方式
                                             * 请求方式：POST
                                             * 接口：/user/set/getpaymode
                                             **/
                                            wx.request({

                                                url: app.globalData.URL + updatepaymode,

                                                method: 'POST',

                                                header: {

                                                    'content-type': 'application/x-www-form-urlencoded', // post请求

                                                    'jxsid': jx_sid,

                                                    'Authorization': Authorization

                                                },

                                                data: json2FormFn.json2Form({

                                                    msgMode: 0,

                                                    pwdMode: 1

                                                }),

                                                success: function (res) {

                                                    console.log(res);


                                                },

                                                fail: function (res) {

                                                    console.log(res)
                                                }

                                            })




                                    }


/*                                    else {


                                        setTimeout(function () {

                                            wx.switchTab({

                                                url: '../../user/mine/mine'
                                            })

                                        }, 2000)

                                    }*/




                                }

                            });






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
    
    payPassWordFn:function (e) {

        var that = this;

        that.setData({

            password:e.detail.value,


        })
        
    },

    confirmPasswordFn:function (e) {

        var that = this;

        that.setData({

            confirmPassword:e.detail.value,


        })

    },
  onUnload:function () {

      /*      var _payHref = wx.getStorageSync('payHtml')

       if(_payHref=='-4'||_payHref=='-3'){


       wx.redirectTo({

       url: '../../user/cash/cash'
       })

       }

       else {



       wx.switchTab({

       url:'../../user/mine/mine'
       })


       }




       }


       */

  }



})
