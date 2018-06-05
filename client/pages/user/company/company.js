/**
 * Created by ZHUANGYI on 2018/5/12.
 */
const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const workUnitUrl = '/user/workunit/selectworkunit';//查看工作单位

const companyUrl = '/salary/home/selectlockstatus';//锁定状态查询

Page({

    data: {

        workUnitList: [],//应发明细

        state:'',//加入企业状态

        entId:'',

        type:'',//是否锁定

        noData: true,//是否显示暂无数据 true为隐藏 false为显示


    },

    onShow: function () {

        var thisWorkUnitUrl = app.globalData.URL + workUnitUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //有几个ajax请求
        var ajaxCount = 1;


        /**
         * 接口：查看工作单位
         * 请求方式：GET
         * 接口：/user/workunit/selectworkunit
         * 入参：null
         **/
        wx.request({

            url: thisWorkUnitUrl,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                (function countDownAjax() {

                    ajaxCount--;

                    app.globalData.ajaxFinish(ajaxCount)

                })();




                //console.log(res.data.data)

                //var thisState = res.data.data[0].state;

                that.setData({

                    workUnitList: res.data.data,

                    /*state:thisState,*/

                })

                //没有企业的话显示暂无数据

                if(that.data.workUnitList.length==0){

                    that.setData({

                        noData: false

                    })


                }







            },

            fail: function (res) {
                console.log(res)
            }

        })

    },

    isJoinEntFn:function (e) {

        var that = this;

        var thisUrl = app.globalData.URL + companyUrl;


        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        //console.log(e.currentTarget.dataset.ent);

        that.setData({

            entId:e.currentTarget.dataset.ent,

            state:e.currentTarget.dataset.state,




        })


        wx.setStorageSync('entId',that.data.entId);




        /**
         * 接口：锁定状态查询
         * 请求方式：POST
         * 接口：/salary/home/selectlockstatus
         * 入参：null
         **/
        wx.request({

            url: thisUrl,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                that.setData({

                   type:res.data.data.type

                })

                //console.log('锁住'+that.data.type);

               //console.log('带加入'+that.data.state);

                if(that.data.state=='0'&&that.data.type=='1'){

                    wx.redirectTo({

                        url:'../company_authentication/authentication'

                    })

                }

                else if(res.data.data.type=='0'){

                    wx.navigateTo({

                        url:'../locked/locked'
                    })

                }


            },

            fail: function (res) {

                console.log(res)

            }

        })

    }

})