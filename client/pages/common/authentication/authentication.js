/**
 * Created by ZHUANGYI on 2018/5/9.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const dentityUrl = '/salary/home/selectidnumber';//查看工资条身份验证

const mineUrl = '/user/center/usercenter';//用户中心


Page({

    data:{

        idCard:'',

        entId:'',

        userName:'',

        mobile:'',

        placeholderValue:''




    },

    onShow:function () {

        var that = this;

        var thisUserName = wx.getStorageSync('userName');

        var thisEntId = wx.getStorageSync('entId');

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：mobile
         **/
        wx.request({

            url: app.globalData.URL + mineUrl,

            method: 'POST',

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                app.globalData.repeat(res.data.code, res.data.msg);

                app.globalData.token(res.header.Authorization)

                if (res.data.code == '3001') {

                    setTimeout(function () {

                        wx.reLaunch({

                            url: '../../common/signin/signin'
                        })

                    }, 1500)


                    return false


                }

                else {


                    if(res.data.data.idType=='1'){


                        that.setData({

                            placeholderValue:'请输入身份证后六位'

                        })


                    }
                    else if(res.data.data.idType=='2'){


                        that.setData({

                            placeholderValue:'请输入护照后六位'

                        })


                    }

                    else if(res.data.data.idType=='3'){


                        that.setData({

                            placeholderValue:'请输入回乡证后六位'

                        })


                    }

                    else if(res.data.data.idType=='4'){


                        that.setData({

                            placeholderValue:'请输入台胞证后六位'

                        })


                    }






                }

            },

            fail: function (res) {

                console.log(res)
            }

        })


        //console.log('姓名'+userName)

        this.setData({

            userName:thisUserName,

            entId:thisEntId,

            mobile:wx.getStorageSync('mobile')


        })

    },
    identity:function () {

        var that = this;

        //有几个ajax请求
        var ajaxCount = 1;

        var thisDentityUrl = app.globalData.URL+dentityUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisType = wx.getStorageSync('thisType');

        /**
         * 接口：身份验证
         * 请求方式：GET
         * 接口：/salary/home/salaryselectidnumber
         * 入参：idCard，entId，salaryDetailId
         * */
        wx.request({

            url: thisDentityUrl,

            method: 'GET',

            data: {

                idCard: that.data.idCard,

                entId:that.data.entId,


            },

            header:{

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)

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

                    var thisCode = res.data.code;

                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();


                    //判断验证码
                    if (thisCode == '-1') {

                        wx.showToast({

                            title: res.data.msg,
                            icon: 'none',
                            mask:true,

                        });

                    }

                    else if (thisCode == '-2') {


                        wx.redirectTo({

                            url: '../../user/locked/locked'

                        })


                    }

                    //验证成功后显示工资
                    else if (thisCode == '0000') {

                        //跳转首页

                        if (thisType == '2') {

                            console.log('跳转')

                            wx.switchTab({

                                url: '../../wages/index/index'
                            })


                        }

                        //跳转工资明细

                        else if (thisType == '1') {

                            //关闭当前页面
                            wx.redirectTo({

                                url: '../../wages/payroll/payroll'

                            });


                        }


                    }

                }


            },


            fail: function (res) {
                console.log(res)
            }

        })


    },

    idCardFn:function (e) {

        var that = this;
        that.setData({
            idCard: e.detail.value,
        });

    },




})


