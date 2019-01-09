
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

        orderTypes:'',//订单类型 01提现 02 03转入转出 全部订单不用传

        moreText:'没有更多数据啦~',//无数据显示暂无数据

        noData: true,//是否显示暂无数据 true为隐藏 false为显示

    },

    onShow:function () {

        var that=this;

        var _whichBill = wx.getStorageSync('whichBill');


        //存储从哪个页面跳到我的账单 来判断导航名称（在我的账单取到 1为提现记录 2为转账记录）

        //1为
        if(_whichBill=='1'){


            console.log('提现')

            that.setData({

                orderTypes:'01',

            })

            //判断导航

            wx.setNavigationBarTitle({

                title:'提现账单'
            });

            that.loadList();

        }

        else if(_whichBill=='2'){

            console.log('转账')

            that.setData({

                orderTypes:'02,03',

            })
            wx.setNavigationBarTitle({

                title:'转账账单'
            });

            that.loadList();

        }

        else if(_whichBill=='3'){

            console.log('我的');

            wx.setNavigationBarTitle({

                title:'我的账单'
            });

            that.loadList();

        }


    },

    loadList:function () {

        var thisBillUrl = app.globalData.URL + billUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //存取是从账单进入（在转账详情里面取出）
        wx.setStorageSync('billHref','4');


        //存储从哪个页面跳到我的账单 来判断导航名称（在我的账单取到 1为提现记录 2为转账记录）
        var _whichBill = wx.getStorageSync('whichBill');


        console.log('传的是几：'+that.data.orderTypes);

        if(_whichBill=='1'||_whichBill=='2'){

            var dataList = {

                pageNum: that.data.pageNum,

                pageSize: that.data.pageSize,

                orderTypes:that.data.orderTypes,

            }

        }

        else if(_whichBill=='3'){

            var dataList = {

                pageNum: that.data.pageNum,

                pageSize: that.data.pageSize,


            }


        }


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

                data: dataList,

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

                                url:'../../../pages/common/signin/signin'
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


                        var _billList = res.data.data.list;

                        //console.log(_billList.length)

                        //onsole.log(_billList)


                        //转换数据
                        function addDList() {

                            function comma(num) {

                                var source = String(num).split(".");//按小数点分成2部分

                                source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");//只将整数部分进行都好分割

                                return source.join(".");//再将小数部分合并进来

                            }

                            for (var j = 0; j < _billList.length; j++) {

                                _billList[j].orderAmount = comma(_billList[j].orderAmount)

                            }

                        }

                        //console.log(res.data.data.list)
                        //如果没有数据
                        if (!that.data.noData) {


                        }

                        else if (!res.data.data.list || res.data.data.list.length == 0) {//这一组为空

                            if(that.data.pageNum == '1'){

                                that.setData({

                                    moreText:'暂无数据',//无数据显示暂无数据

                                    noData: false,

                                })



                            }

                            else {

                                that.setData({

                                    noData: false,

                                    moreText:'没有更多数据啦~',//无数据显示暂无数据


                                })
                            }



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

             orderType:e.currentTarget.dataset.type,
        })


        wx.setStorageSync('orderId',that.data.orderId);

        wx.setStorageSync('orderType',e.currentTarget.dataset.type)

        //console.log(wx.getStorageSync('orderId'))


 /*       wx.navigateTo({

            url: '../give_details/give_details'

        })
*/




    }




});