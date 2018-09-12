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

        pswSetSucess:'',


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

                title: '请输入6位支付密码',
                icon: 'none',
                mask:true,

            });

        }

        else if(that.data.confirmPassword==''||that.data.confirmPassword.length<6){

            wx.showToast({

                title: '请再次输入6位支付密码',
                icon: 'none',
                mask:true,


            });

        }

        else if(a.test(that.data.password)||a.test(that.data.confirmPassword)){

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none',
                mask:true,


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

                title: '请两次输入相同的密码',
                icon: 'none'

            });

        }

        else {


            //储存清除支付密码的变量 当设置密码成功后input清空 没有成功则不成功（在支付密码中取出）

            wx.setStorageSync('clearPsw','6');


            //判断要不要修改支付方式
            var _paySettingHref = wx.getStorageSync('paySettingHref');


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
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        return false
                    }

                    else {

                        if (res.data.code == '0000') {


                            //修改成功之后存储的值 用于区别是否有修改成功页面卸载的时候提示开启成功 （在该页面卸载的时候取出）
                            wx.setStorageSync('successPsw','6');

                            wx.showToast({

                                title: res.data.msg,

                                icon: 'none',

                                success: function () {

                                    setTimeout(function () {

                                        wx.navigateBack({

                                            delta: 1

                                        })

                                    }, 2000)



                                }

                            });

                            //设置支付密码之后
                            if(_paySettingHref=='4'){

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

                                        console.log('变成0和1')

                                        //设置成功之后 储存一个值显示Toast'开启成功'（在支付设置页面取出）

                                        that.setData({

                                            pswSetSucess:'5',
                                        })


                                    },

                                    fail: function (res) {

                                        console.log(res)
                                    }

                                })




                            }


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

        //判断要不要修改支付方式
        var _paySettingHref = wx.getStorageSync('paySettingHref');

        var _successPsw = wx.getStorageSync('successPsw');

        if(_paySettingHref=='4'&&_successPsw=='6'){

            setTimeout(function () {

                /*提示信息*/
                wx.showToast({
                    title: '开启成功',
                    icon: 'none',
                    mask:true,
                });

            },800)

        }

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
