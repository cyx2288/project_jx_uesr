const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const payeeAllUrl = '/record/selectallhistoricalpayee';//查询所有历史收款人

const delPayeeUrl='/record/deletehistoricalpayee';//删除历史收款人


Page({

    data:{

        accountsList:[],//历史收款人

        recordId:'',//历史收款人id

        pageNum: 1,//第几页

        pageSize: 10,//一页的数量

        moreText:'没有更多数据啦~',//无数据显示暂无数据

        noData: true,//是否显示暂无数据 true为隐藏 false为显示

    },

    onShow:function () {

        var that = this;

        that.setData({

                accountsList:[],//历史收款人

                recordId:'',//历史收款人id

                pageNum: 1,//第几页

                pageSize: 10,//一页的数量

                moreText:'没有更多数据啦~',//无数据显示暂无数据

                noData: true,//是否显示暂无数据 true为隐藏 false为显示

        })

        that.loadList()


    },

    loadList:function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        if(that.data.noData){

            /**
             * 接口：查询所有历史收款人
             * 请求方式：post
             * 接口：/record/selectallhistoricalpayee
             * 入参：null
             **/
            wx.request({

                url: app.globalData.URL + payeeAllUrl,

                method: 'POST',

                header: {

                    'content-type': 'application/x-www-form-urlencoded',// post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                data:json2FormFn.json2Form({

                    pageNum: that.data.pageNum,//初始值为2

                    pageSize: that.data.pageSize,//一页的数量
                }),

                success: function (res) {

                    console.log(res.data);

                    var thisList = res.data.data.list;


                    if(!that.data.noData){




                    }


                    //没数据的时候
                    else if(!res.data.data.list || res.data.data.list.length == 0){

                            console.log('后面没有')

                            that.setData({

                                moreText:'没有更多数据啦~',//无数据显示暂无数据

                                noData: false,//是否显示暂无数据 true为隐藏 false为显示

                            })



                    }

                    else if(thisList.length < that.data.pageSize){


                        console.log('小于10')
                        //数量小于10的时候
                        //增加数组内容
                        that.setData({

                            accountsList: that.data.accountsList.concat(thisList),

                            noData: false,

                        })



                    }

                    else {

                        console.log('增加')


                        //增加数组内容
                        that.setData({

                            accountsList: that.data.accountsList.concat(thisList),

                            pageNum: that.data.pageNum + 1,//加一页


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


    },

    transferFn:function (e) {


        wx.setStorageSync('transferMobile',e.currentTarget.dataset.mobile);

        wx.setStorageSync('transferName',e.currentTarget.dataset.name)

        wx.navigateTo({

            url: '../account_cash/account_cash'

        })




    },

    delFn:function (e) {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        that.setData({

            recordId:e.currentTarget.dataset.user,


        })


        wx.showModal({
            title: '提示',
            content: '确认删除？',
            cancelText: '取消',
            confirmText: '确定',
            confirmColor:'#fe9728',
            success: function (res) {

                if (res.confirm) {

                    delAccount()

                    setTimeout(function () {

                        that.onShow();

                    },1000)





                }

                else if (res.cancel) {


                }


            }
        });


        function delAccount() {


            /**
             * 接口：删除历史收款人
             * 请求方式：GET
             * 接口：/record/deletehistoricalpayee
             * 入参：recordId
             **/
            wx.request({

                url: app.globalData.URL + delPayeeUrl,

                method: 'GET',

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                data:{

                    recordId:that.data.recordId


                },

                success: function (res) {

                    console.log(res.data);

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })


                },


                fail: function (res) {

                    console.log(res)

                }

            })




        }

    }


});