/**
 * Created by ZHUANGYI on 2018/5/9.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const dentityUrl = '/salary/home/selectidnumber';


Page({

    data:{

        idCard:'',

        userName:'',

        mobile:'',

    },

    onLoad:function () {

        var thisUserName = wx.getStorageSync('userName');

        var thisMobile = wx.getStorageSync('mobile');

        //console.log('姓名'+userName)

        this.setData({

            userName:thisUserName,

            mobile:thisMobile


        })

    },
    identity:function () {

        var thisDentityUrl = app.globalData.URL+dentityUrl;


        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisEntId = wx.getStorageSync('entId');

        //console.log(thisEntId)


        /**
         * 接口：身份验证
         * 请求方式：GET
         * 接口：/salary/home/selectidnumber
         * 入参：idCard
         * */
        wx.request({

            url: thisDentityUrl,

            method: 'GET',

            data: {

                idCard: this.data.idCard,

                entId:thisEntId,

            },

            header:{

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                var thisCode = res.data.code;

                console.log(res.data);

                //console.log(res.data.data[0].entId)

                app.globalData.repeat(res.data.code,res.data.msg);

                //存储有没有加入成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                wx.setStorageSync('successVerify','true');


                //要刷新首页
                wx.setStorageSync('successRefresh','true');



                if(res.data.code=='3001') {

                    //console.log('登录');


                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500);


                    return false


                }

                else {


                    //判断验证码
                    if (thisCode == '-1') {

                        wx.showToast({

                            title: res.data.msg,
                            icon: 'none'

                        });

                    }

                    else if (thisCode == '-2') {

                        wx.redirectTo({

                            url: '../../user/locked/locked'

                        })


                    }

                    //验证成功后显示工资
                    else if (thisCode == '0000') {

                        //console.log('跳转')

                        //关闭当前页面


                         wx.navigateBack({
                             delta: 1
                         })

                    /*    wx.redirectTo({

                            url: '../company/company'

                        })*/

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


