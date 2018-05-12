/**
 * Created by ZHUANGYI on 2018/5/7.
 */


const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const header = require( '../../../static/libs/script/header.js' );//json转换函数

const signUrl ='/jx/action/login';//登录的url



Page({


data:{

    mobile:'',

    password:''


},

    signin:function () {

      var url = app.globalData.URL+signUrl;

        /**
         * 接口：登录
         * 请求方式：POST
         * 接口：/jx/action/login
         * 入参：mobile，password
         **/

        wx.request({//注册

             url:  url,

             method:'POST',

             data: json2FormFn.json2Form({

                 mobile:this.data.mobile,

                password:this.data.password

             }),

            header: {
                 'content-type': 'application/x-www-form-urlencoded' // post请求

             },

             success: function(res) {

                 var code = res.data.code;

                 console.log(res.data)

                 /*console.log(res.data.msg)

                console.log(res.data.code);

                 console.log(Authorization)

                 console.log(jx_sid)

                 console.log(Authorization)*/




                 if(code == '-1'){

                    wx.showToast({

                         title: res.data.msg,
                         icon: 'none'

                     });

                     return false;


                }

                 else if(code == '0000'){



                     var Authorization = res.data.token.access_token;//Authorization数据

                     var jx_sid = res.header.jx_sid;//jx_sid数据

                     //存储数据
                     wx.setStorageSync('jx_sid', jx_sid);

                     wx.setStorageSync('Authorization', Authorization);

                     //console.log(header.header(Authorization,jx_sid));

                     wx.switchTab({

                         url:'../../wages/index/index'
                     })
                 }


            },

             fail:function (res) {

                 console.log(res)
             }

         })

    },

    telFn:function (e) {

        var that = this;
        that.setData({
            mobile: e.detail.value
        });

    },

    passwordFn:function (e) {

        var that = this;
        that.setData({
            password: e.detail.value
        });

    },


})