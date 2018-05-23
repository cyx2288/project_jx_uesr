/**
 * Created by ZHUANGYI on 2018/5/12.
 */
const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const workUnitUrl = '/user/workunit/selectworkunit';//查看工作单位








Page({

    data: {

        workUnitList: [],//应发明细

        state:'',//加入企业状态

        entId:'',

    },

    onShow: function () {

        var thisWorkUnitUrl = app.globalData.URL + workUnitUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');



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

                var thisState = res.data.data[0].state;


                that.setData({

                    workUnitList: res.data.data,

                    state:thisState,




                })




            },

            fail: function (res) {
                console.log(res)
            }

        })

    },

    isJoinEntFn:function (e) {

        var that = this;

        //console.log(e.currentTarget.dataset.ent);

        that.setData({

            entId:e.currentTarget.dataset.ent

        })


        wx.setStorageSync('entId',that.data.entId);




    }








})