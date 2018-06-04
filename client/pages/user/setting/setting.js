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

                         that.setData({

                             isPayPwd:res.data.data.isPayPwd

                         })

                         //console.log(that.data.isPayPwd)


                     },

                     fail:function (res) {

                         console.log(res)
                     }

                 })

    },

    onClickFn:function () {

        var _isVerify = wx.getStorageSync('isVerify');

        //判断是否认证
        if(_isVerify=='0'){


            //存指定的页面
            wx.setStorageSync('hrefId','1');

            wx.showModal({
                title: '提示',
                content: '当前账户尚未进行实名认证，完成实名认证后即可设置支付密码',
                cancelText: '取消',
                confirmText: '去认证',
                success: function (res) {

                    if (res.confirm) {

                        wx.navigateTo({

                            url: '../no_certification/certification'

                        })


                    }

                    else if (res.cancel) {


                    }
                }
            });


        }

        else {

            wx.navigateTo({

                url: '../code/code'

            })


        }


    }





})
