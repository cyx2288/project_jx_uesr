const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const radixPointFn = require('../../../static/libs/script/radixPoint');//ajax请求

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

                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

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

                        var _balanceList = res.data.data.list;

                        console.log(res.data.data.list);

                        console.log(res.data.data.totalCount)

                        function addList() {

                            function comma(num) {

                                var source = String(num).split(".");//按小数点分成2部分
                                source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");//只将整数部分进行都好分割
                                return source.join(".");//再将小数部分合并进来

                            }



                            for (var j = 0; j < _balanceList.length; j++) {

                                _balanceList[j].transAmt = comma(_balanceList[j].transAmt)


                            }



                        }

                        //如果没有数据
                        if (!that.data.noData) {


                        }

                        else if (!res.data.data.list || res.data.data.list.length == 0) {//这一组为空

                            //增加数组内容
                            that.setData({

                                noData: false,

                            })

                        }


                        else if (res.data.data.totalCount <= 10) {//这一组小于十个

                            console.log('小于10')

                            addList()

                            //增加数组内容
                            that.setData({

                                noData: false,

                                balanceList: that.data.balanceList.concat(_balanceList),


                            })



                        }

                        else {




                                console.log('增加成功')

                                addList()

                                //增加数组内容
                                that.setData({

                                    balanceList: that.data.balanceList.concat(_balanceList),

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

        console.log('到底了')

    },

});