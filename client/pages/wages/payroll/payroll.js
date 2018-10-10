const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const radixPointFn = require('../../../static/libs/script/radixPoint');//转换千位逗号

const listUrl = '/salary/home/salarydetailALL';//工资发放明细

const confirmUrl = '/salary/home/confirmsalary';//确认工资条


Page({


    data: {


        //addAmount: [],//应发明细

        //subtractAmount: [],//代扣明细

        salaryDetails:[],//发放明细

        payableAmount: '',//应发金额

        realAmount:'',//实发金额

        salaryDetailId: '',//发薪企业

        salaryMonth: '',//发薪企业年月

        comfrimBtn:0,//其中0是待确认、1是确认中、其他为已确认

        isHiddenBtn:true,//是否显示确认按钮

        state:'',//工资确认状态 1是已确认 0是未确认

        hiddenDot:true,//默认不显示有新消息 true为不显示 false为显示

        salaryType:''//默认不显示有新消息 true为不显示 false为显示

    },

    onShow: function () {

        var thisListurl = app.globalData.URL + listUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var thisSalaryDetailId = wx.getStorageSync('salaryDetailId');

        console.log(thisSalaryDetailId)

        //有几个ajax请求
        var ajaxCount = 1;


        /**
         * 接口：工资发放明细
         * 请求方式：GET
         * 接口：/salary/home/salarydetail
         * 入参： salaryDetailId
         **/
        wx.request({

            url: thisListurl,

            method: 'GET',

            data: {

                salaryDetailId: thisSalaryDetailId,

            },


            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {


                console.log(res.data.data);

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
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


                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();

                    //缓存salaryId - 反馈页面
                    wx.setStorageSync('salaryId',res.data.data.salaryId);

                    var _state = res.data.data.state;

                    var ishasNewMsg = res.data.data.isHaveNewMsg;

                    //type为6不显示应发金额 3显示应发金额
                    that.setData({

                        salaryType:res.data.data.salaryType

                    });

                    //console.log(ishasNewMsg)

                    var _salaryDetails = JSON.parse(res.data.data.salaryDetails)

                    var _salaryDetailsArray = [], x

                    var re = /^[0-9]+.?[0-9]*$/

                    for(x in _salaryDetails){

                        if(_salaryDetails[x].length>12||!re.test(_salaryDetails[x])){
                            /*添加数组*/
                            _salaryDetailsArray.push({

                                name: x,

                                record: _salaryDetails[x]

                            })

                        }

                        else {

                            /*添加数组*/
                            _salaryDetailsArray.push({

                                name: x,

                                record: radixPointFn.splitK(_salaryDetails[x])

                            })


                        }



                    }





                    // //将给的数据转成字符串
                    // var _addAmount = JSON.parse(res.data.data.addAmount);
                    //
                    // console.log(_addAmount)
                    //
                    // var _addAmountArray = [], x;
                    //
                    // /*遍历json，产生可以渲染的data*/
                    //
                    // for (x in _addAmount) {
                    //
                    //     /*添加数组*/
                    //     _addAmountArray.push({
                    //
                    //         name: x,
                    //
                    //         record: radixPointFn.splitK(_addAmount[x])
                    //
                    //     })
                    //
                    // }
                    //
                    // //将给的数据转成字符串
                    // var _subtractAmount = JSON.parse(res.data.data.subtractAmount);
                    //
                    // var _subtractAmountArray = [], y;
                    //
                    //
                    // for (y in _subtractAmount) {
                    //
                    //     /*添加数组*/
                    //     _subtractAmountArray.push({
                    //
                    //         name: y,
                    //
                    //         record: radixPointFn.splitK(_subtractAmount[y])
                    //
                    //     })
                    //
                    //
                    // }


                    //获取entName数据
                    that.setData({

                        entName: res.data.data.entName,//企业名称

                        salaryDetails:_salaryDetailsArray,//工资

                        //addAmount: _addAmountArray,//基本工资

                        salaryMonth: res.data.data.salaryMonth,//发薪企业年月

                        payableAmount: radixPointFn.splitK(res.data.data.payableAmount),//实发金额

                        //subtractAmount: _subtractAmountArray,//代扣明细

                        realAmount: radixPointFn.splitK(res.data.data.realAmount)//实发金额

                    });

                    //判断是否有新消息

                 if (ishasNewMsg == '1') {

                        that.setData({

                            hiddenDot: false,

                        })

                    }

                    else {



                        that.setData({

                            hiddenDot: true

                        })

                    }


                    if (_state == '1') {

                        that.setData({

                            comfrimBtn: 2,

                            isHiddenBtn: false

                        })

                    }

                    else if (_state == '0') {

                        that.setData({

                            comfrimBtn: 0,

                            isHiddenBtn: false

                        })

                    }


                }



            },

            fail: function (res) {
                console.log(res)
            }

        })

    },


    confirmFn:function () {

        var thisConfirmUrl = app.globalData.URL + confirmUrl;

        var thisSalaryDetailId = wx.getStorageSync('salaryDetailId');

        console.log(thisSalaryDetailId)

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        that.setData({

            comfrimBtn:1
        })


        /**
         * 接口：确认工资
         * 请求方式：POST
         * 接口：/salary/home/confirmsalary
         * 入参：salaryDetailId
         **/
        wx.request({

            url: thisConfirmUrl,

            method: 'POST',

            data: json2FormFn.json2Form({

                salaryDetailId: thisSalaryDetailId,

            }),


            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                app.globalData.repeat(res.data.code,res.data.msg);



                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
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



                    var thisCode = res.data.code;

                    if (thisCode == '0000') {

                        wx.setStorageSync('successRefresh','true');

                        console.log('工资条确认'+wx.getStorageSync('successRefresh'))

                        that.setData({

                            comfrimBtn: 2
                        })

                        setTimeout(function () {

                            wx.navigateBack({
                                delta: 1
                            })

                        }, 500)


                    }

                }


            },

            fail: function (res) {
                console.log(res)
            }

        })


    },

    feedbackFn:function () {

        wx.navigateTo({
            url: '../../user/feedback/feedback'
        })

    }


});