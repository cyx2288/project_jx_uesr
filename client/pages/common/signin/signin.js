/**
 * Created by ZHUANGYI on 2018/5/7.
 */

const app = getApp();

const md5 = require( '../../../static/libs/script/md5.js' );//md5加密

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

        var that=this;

        var empty = /[@#\$%\^&\*]+/g;

        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;


        if(that.data.mobile==''||that.data.mobile.length<11){

          wx.showToast({

              title: '请输入正确手机号',
              icon: 'none'

          });

      }

        else if(empty.test(that.data.password)){

            wx.showToast({

                title: '密码包含非法字符',
                icon: 'none'

            });

        }


      else if(that.data.password==''||that.data.password.length<6){

          wx.showToast({

              title: '请输入6位到20位密码',
              icon: 'none'

          });


       }

      else if(!reg.test(that.data.password)){

            wx.showToast({

                title: '密码需包含数字和字母',
                icon: 'none'

            });

        }

      else {


          /**
           * 接口：登录
           * 请求方式：POST
           * 接口：/jx/action/login
           * 入参：mobile，password
           **/

          wx.request({

              url:  url,

              method:'POST',

              data: json2FormFn.json2Form({

                  mobile:that.data.mobile,

                  password:md5.hexMD5(that.data.password),

              }),

              header: {

                  'content-type': 'application/x-www-form-urlencoded' // post请求

              },

              success: function(res) {

                  var code = res.data.code;

                  console.log(res.data);

                  if(code == '-1'){

                      wx.showToast({

                          title: res.data.msg,
                          icon: 'none'

                      });

                      return false;


                  }

                  else if(code == '0000'){

                      var Authorization = res.data.token.access_token;//Authorization数据

                      var jx_sid = res.header.jxsid;//jx_sid数据

                      //存储数据
                      wx.setStorageSync('jxsid', jx_sid);

                      wx.setStorageSync('Authorization', Authorization);

                      wx.setStorageSync('idNumber', res.data.data.idNumber);

                      wx.setStorageSync('userName', res.data.data.userName);

                      wx.setStorageSync('isVerify',res.data.data.isVerify);

                      console.log('用户姓名：'+ wx.getStorageSync('userName'));

                      console.log('用户身份证：'+ wx.getStorageSync('idNumber'));

                      console.log('是否已注册：'+ wx.getStorageSync('isVerify'));

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

      }



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