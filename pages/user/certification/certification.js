const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userVerify ='/user/center/userverify';//实名认证

Page({


    data: {

        code:'',//是否已认证

        userName:'',//姓名

        idNumber:'',//身份证

        //hasUserName:true,//



    },


    onLoad:function () {

        var thisUserVerify = app.globalData.URL + userVerify;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisUserName = wx.getStorageSync('userName');

        var thisIdNumber = wx.getStorageSync('idNumber');

        console.log(thisIdNumber)

        console.log(thisUserName)


        /**
         * 接口：
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：userName,idNumber
         **/
        wx.request({

            url:thisUserVerify,

            method: 'POST',

            data: json2FormFn.json2Form({

                userName:thisUserName,

                idNumber:thisIdNumber

            }),

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jx_sid': jx_sid,

                'Authorization': Authorization

            },



            success: function (res) {

                console.log(res.data);


                //console.log(this.data.userName)

                //console.log(this.data.idNumber)

                var _code = res.data.code;



                if(_code=='0000'){


                    that.setData({

                        userName:thisUserName,

                        idNumber:thisIdNumber,

                        code:_code,
                    })

                }

                else {


                    //登录页有返回身份证号码 显示名称
                    if(thisIdNumber){


                        that.setData({

                            userName:thisUserName,

                            idNumber:thisIdNumber,


                        })



                    }

                    else {


                        console.log('没有身份证')
                    }


                }




            },

            fail: function (res) {

                console.log(res)

            }

        })




    }
})