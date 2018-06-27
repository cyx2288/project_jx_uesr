
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const radixPointFn = require('../../../static/libs/script/radixPoint');//ajax请求

const billUrl ='/user/withdraw/getsimplerecord';//我的账单的url




Page({

    data:{

        billList:[],

        orderId:'',

        pageNum: 1,//初始值为2

        pageSize: 10,//一页的数量

        noData: true,//是否显示暂无数据 true为隐藏 false为显示

    },



    onLoad:function () {

        var that=this;

        that.loadList()


    },

    loadList:function () {

        var thisBillUrl = app.globalData.URL + billUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        if(that.data.noData) {//如果数据没有见底

            /**
             * 接口：获取账户提现记录
             * 请求方式：GET
             * 接口：/user/withdraw/getsimplerecord
             * 入参：null
             **/
            wx.request({

                url: thisBillUrl,

                method: 'GET',

                data: {

                    pageNum: that.data.pageNum,

                    pageSize: that.data.pageSize

                },

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    //console.log(that.data.pageNum);


                    app.globalData.repeat(res.data.code,res.data.msg);

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)

              /*          wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1500,
                            success:function () {



                            }

                        })*/

                        return false


                    }

                    else {


                        var _billList = res.data.data.list;

                        //console.log(_billList.length)

                        //onsole.log(_billList)


                        //转换数据
                        function addDList() {


                            for (var j = 0; j < _billList.length; j++) {

                                _billList[j].orderAmount = radixPointFn.splitK(_billList[j].orderAmount)

                            }

                        }

                        //console.log(res.data.data.list)
                        //如果没有数据
                        if (!that.data.noData) {


                        }

                        else if (!res.data.data.list || res.data.data.list.length == 0) {//这一组为空

                            that.setData({

                                noData: false,

                            })

                        }


                        else if (res.data.data.list.length < 10) {//这一组小于十个

                            addDList()

                            //增加数组内容
                            that.setData({

                                noData: false,

                                billList: that.data.billList.concat(_billList),

                            })


                        }

                        else {

                            addDList()
                            //增加数组内容
                            that.setData({

                                billList: that.data.billList.concat(_billList),

                                pageNum: that.data.pageNum + 1//加一页

                            })


                        }

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

        //console.log('到底了')

    },

    clickBill:function (e) {

        var that = this;

        that.setData({

            orderId:e.currentTarget.dataset.no,
        })

        console.log(e.currentTarget.dataset.no)

        wx.setStorageSync('orderId',that.data.orderId)

        //console.log(wx.getStorageSync('orderId'))

        wx.navigateTo({

            url: '../give_details/give_details'

        })





    }




});