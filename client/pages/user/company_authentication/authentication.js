/**
 * Created by ZHUANGYI on 2018/5/9.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const dentityUrl = '/salary/home/selectidnumber';

const mineUrl = '/user/center/usercenter';//用户中心


Page({

    data:{

        idCard:'',

        userName:'',

        mobile:'',

        goFrozenValue:'',

        placeholderValue:''

    },

    onShow:function () {

        var that = this;

        var thisUserName = wx.getStorageSync('userName');

        var thisMobile = wx.getStorageSync('mobile');

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

                if (res.data.code == '3001') {

                    setTimeout(function () {

                        wx.reLaunch({

                            url: '../../common/signin/signin'
                        })

                    }, 1500)


                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

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




        //console.log('1是去解冻，2是正常 这次是：'+wx.getStorageSync('goFrozen'));

        //console.log(this.data.goFrozenValue)

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

        var goFrozenValue = wx.getStorageSync('goFrozen');

        //console.log(thisEntId)

        console.log('点击')


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


                console.log(res.data)

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
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

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


                        if(goFrozenValue=='1'){

                            console.log('解冻回工资余额')

                            wx.navigateBack({
                                delta: 2
                            })

                        }
                        else if(goFrozenValue=='2'){


                            wx.navigateBack({
                                delta: 1
                            })

                        }

                        else {

                            wx.navigateBack({
                                delta: 1
                            })

                        }


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


