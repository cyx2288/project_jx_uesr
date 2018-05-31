/**
 * Created by ZHUANGYI on 2018/5/9.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const dentityUrl = '/salary/home/selectidnumber';//查看工资条身份验证


Page({

    data:{

        idCard:'',

        entId:'',

        userName:'',




    },

    onLoad:function () {

        var thisUserName = wx.getStorageSync('userName');

        var thisEntId = wx.getStorageSync('entId');


        //console.log('姓名'+userName)

        this.setData({

            userName:thisUserName,

            entId:thisEntId,


        })

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


            },

            header:{

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                var thisCode = res.data.code;

                console.log(res.data);

                //console.log(res.data.data[0].entId)


                //判断验证码
                if(thisCode == '-1'){

                    wx.showToast({

                        title: res.data.msg,
                        icon: 'none'

                    });

                }

                else if(thisCode == '-2'){



                    wx.redirectTo({

                        url:'../../user/locked/locked'

                    })



                }

                //验证成功后显示工资
                else if (thisCode == '0000'){

                    //跳转首页

                    if(thisType=='2'){

                        console.log('跳转')

                        wx.switchTab({

                             url:'../../wages/index/index'
                        })


                    }

                    //跳转工资明细

                    else if(thisType=='1'){

                        //关闭当前页面
                        wx.redirectTo({

                            url:'../../wages/payroll/payroll'

                        });



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


