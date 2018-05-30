const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const clearingUrl = '/user/account/clearing';//登录的url


Page({

    data: {

        balanceList: [],//工资明细

        pageNum:1,//第几页

        pageSize:10,//一页几个

        noData:true//调整提示文案 true正在加载 false暂无数据

    },

    onLoad: function () {

        var that=this;

        that.loadList()

    },

    loadList:function () {

        var thisClearingurl = app.globalData.URL + clearingUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisUserClearId = wx.getStorageSync('userClearId');


        if(that.data.noData) {//如果数据没有见底

            /**
             * 接口：
             * 请求方式：GET
             * 接口：/user/account/clearing
             * 入参：userClearId
             **/
            wx.request({

                url: thisClearingurl,

                method: 'GET',

                data: {

                    userClearId: thisUserClearId,

                    pageNum: that.data.pageNum,

                    pageSize: that.data.pageSize

                },

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    var _balanceList = res.data.data.list;

                    console.log(res.data.data.list)

                    //如果没有数据
                    if (!that.data.noData) {


                    }

                    else if (!res.data.data.list||res.data.data.list.length == 0) {//这一组为空

                        //增加数组内容
                        that.setData({

                            noData: false,

                        })

                    }


                    else if (res.data.data.list.length < 10) {//这一组小于十个

                        //增加数组内容
                        that.setData({

                            noData: false,

                            balanceList: that.data.balanceList.concat(_balanceList),


                        })

                    }

                    else {

                        console.log('增加成功')

                        //增加数组内容
                        that.setData({

                            balanceList: that.data.balanceList.concat(_balanceList),

                            pageNum: that.data.pageNum + 1//加一页

                        })

                    }


                },

                fail: function (res) {

                    console.log(res)

                }

            })

        }


    },

    onReachBottom: function () {

        var that = this;

        that.loadList()

        console.log('到底了')

    },

});