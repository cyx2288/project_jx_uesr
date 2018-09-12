/**
 * Created by ZHUANGYI on 2018/5/14.
 */
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const getPayPwdURL = '/user/set/getpaypwd'//查看是否设置支付密码

Page({
    
    data:{

        isPayPwd:'',

        hasUserName:true,

    },
    
    onShow:function () {

            var that = this;

            var thisUrl=app.globalData.URL+getPayPwdURL;

            //有几个ajax请求
             var ajaxCount = 1;

            //缓存jx_sid&&Authorization数据
            var jx_sid = wx.getStorageSync('jxsid');

            var Authorization = wx.getStorageSync('Authorization');

             /*var _isVerify = wx.getStorageSync('isVerify');*/

             var thisUserName = wx.getStorageSync('userName');

             var thisIdNumber = wx.getStorageSync('idNumber');





        if(thisUserName){


            that.setData({

                userName:thisUserName,

                idNumber:thisIdNumber,

                hasUserName:true


            });


        }

        else {

            that.setData({

                userName:that.data.userName,

                idNumber:that.data.idNumber,

                hasUserName:false


            });



        }


                 /**
                  * 接口：查看是否设置支付密码
                  * 请求方式：POST
                  * 接口：/user/set/getpaypwd
                  * 入参：mobile
                  **/
                 wx.request({

                     url:  thisUrl,

                     method:'POST',

                     header: {
                         'content-type': 'application/x-www-form-urlencoded', // post请求

                         'jxsid':jx_sid,

                         'Authorization':Authorization

                     },

                     success: function(res) {

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
                         else if(res.data.code=='3004'){

                             var Authorization = res.data.token.access_token;//Authorization数据

                             wx.setStorageSync('Authorization', Authorization);

                             return false
                         }

                         else {

                             (function countDownAjax() {

                                 ajaxCount--;

                                 app.globalData.ajaxFinish(ajaxCount)

                             })();



                             //存储有没有支付密码修改成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新

                             wx.setStorageSync('successVerify','true');


                             that.setData({

                                 isPayPwd: res.data.data.isPayPwd

                             })

                             //console.log(that.data.isPayPwd)

                             wx.setStorageSync('isPayPwd', res.data.data.isPayPwd)

                         }

                     },

                     fail:function (res) {

                         console.log(res)
                     }


                 })

    },

    onClickFn:function () {

        var _isVerify = wx.getStorageSync('isVerify');

        //判断是否认证
        if(_isVerify=='0'||_isVerify == '3'){

            //存指定的页面
            wx.setStorageSync('hrefId','8');

            //区别是在设置页面修改密码成功还是在提现中忘记密码设置成功（在设置密码成功后取值）
            //4为从设置支付方式按钮
            wx.setStorageSync('paySettingHref','8');

            wx.showModal({
                title: '提示',
                content: '当前账户尚未进行实名认证，完成实名认证后即可设置支付密码',
                cancelText: '取消',
                confirmText: '去认证',
                confirmColor:'#fe9728',
                success: function (res) {

                    if (res.confirm) {

                        wx.navigateTo({

                            url: '../payment_setting_certification/certification'

                        })


                    }

                    else if (res.cancel) {


                    }
                }
            });


        }

        else if(_isVerify == '2'){

            //存指定的页面
            wx.setStorageSync('hrefId','8');

            //区别是在设置页面修改密码成功还是在提现中忘记密码设置成功（在设置密码成功后取值）
            //4为从设置支付方式按钮
            wx.setStorageSync('paySettingHref','8');

            wx.showModal({
                title: '提示',
                content: '实名认证审核中，审核通过后即可设置支付密码',
                showCancel:false,
                confirmText: '我知道了',
                confirmColor:'#fe9728',
                success: function (res) {

                    if (res.confirm) {


                    }

                    else if (res.cancel) {


                    }
                }
            });

        }


        else {

            //区别是在设置页面修改密码成功还是在提现中忘记密码设置成功（在设置密码成功后取值）
            //4为从设置支付方式按钮
            wx.setStorageSync('paySettingHref','8');

            wx.navigateTo({

                url: '../code/code'

            })


        }


    },

    onclickPws:function () {


        //区别是在设置页面修改密码成功还是在提现中忘记密码设置成功（在设置密码成功后取值）
        wx.setStorageSync('paySettingHref','8');

        wx.navigateTo({

            url: '../reset_payment/reset_payment'

        })



    }





})
