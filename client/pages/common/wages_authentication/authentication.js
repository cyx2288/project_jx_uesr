/**
 * Created by ZHUANGYI on 2018/5/9.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const dentityUrl = '/salary/home/salaryselectidnumber';//查看工资条身份验证


Page({

    data:{

        idCard:'',

        entId:'',

        userName:'',

        salaryDetailId:'',

        mobile:''




    },

    onLoad:function () {

        var thisUserName = wx.getStorageSync('userName');

        var thisSalaryDetailId = wx.getStorageSync('salaryDetailId');

        var thisEntId = wx.getStorageSync('entId');

        //console.log('企业'+thisEntId)

        //console.log('姓名'+userName)

        this.setData({

            userName:thisUserName,

            salaryDetailId:thisSalaryDetailId,

            entId:thisEntId,

            mobile:wx.getStorageSync('mobile')


        })
/*
        console.log(this.data.salaryDetailId);

        console.log(this.data.entId);

        console.log(this.data.userName);*/

    },
    identity:function () {

        var that = this;

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

                salaryDetailId:that.data.salaryDetailId,

            },

            header:{

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)

        /*            wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success:function () {



                        }

                    })*/

                    return false


                }

                else {

                    var thisCode = res.data.code;

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


