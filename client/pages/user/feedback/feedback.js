const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const feedbackUrl = '/salary/home/feedbacklist';//获取工资条反馈详情的url

const sendFeedbackUrl = '/salary/home/feedback';//工资条反馈的url

const feedbackDetailUrl = '/salary/home/feedbackdetail';//工资条反馈的url

Page({

    data: {

        isIpx: false,//是不是ipx

        fixedInput: false,//输入框input时候获得焦点

        feedBackList: [],//反馈消息列表

        contentTitle: '',//反馈内容

        feedBackId: '',//反馈消息Id

        userFeedBackList: '',

        scrollHeight: '',//scroll-view的高度

        repeatSend: 1,//防止重复提交


    },

    onShow: function () {

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var that = this;

        //有几个ajax请求
        var ajaxCount = 1;

        setTimeout(function () {

            wx.pageScrollTo({

                scrollTop: 9999
            })

        }, 500)

        wx.getSystemInfo({

            success: function success(res) {

                var viewHigt = res.windowHeight;

                if (res.model == "iPhone X") {


                    that.setData({

                        isIpx: true
                    })

                }


            }
        })


        /**
         * 接口：获取工资条反馈详情
         * 请求方式：POST
         * 接口：/salary/home/feedbackdetail
         * 入参：pageNum,pageSize
         **/

        wx.request({

            url: app.globalData.URL + feedbackDetailUrl,

            method: 'POST',

            data: json2FormFn.json2Form({

                salaryDetailId: wx.getStorageSync('salaryDetailId'),

            }),

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },


            success: function (res) {

                console.log(res.data);

                app.globalData.repeat(res.data.code, res.data.msg);

                if (res.data.code == '3001') {

                    //console.log('登录');

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

                    //存储有没有点击进入反馈详情 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                    wx.setStorageSync('successVerify', 'true');


                    var list = res.data.data;

                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();

                    if (!list) {


                        that.setData({

                            feedBackList: [],//反馈消息列表

                        });


                    }

                    else {

                        that.setData({

                            feedBackList: list,//反馈消息列表

                        });


                    }


                }

            },

            fail: function (res) {

                console.log(res)
            }

        })

    },
    //工资条反馈
    sendMsgFn: function () {

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var that = this;

        //判断输入内容
        if (!that.data.contentTitle) {

            wx.showToast({

                title: '请输入反馈内容',
                icon: 'none',
                mask: true,

            })

        }


        //控制不重复发送
        else if (that.data.repeatSend) {

            //控制ajax加载 加载成功之后放开
            that.setData({

                repeatSend: 0

            });

            /**
             * 接口：工资条反馈
             * 请求方式：POST
             * 接口：/salary/home/getfeedback
             * 入参：salaryDetailId，salaryId，contentTitle
             *
             **/

            wx.request({

                url: app.globalData.URL + sendFeedbackUrl,

                method: 'POST',

                data: json2FormFn.json2Form({

                    salaryDetailId: wx.getStorageSync('salaryDetailId'),//工资详情Id

                    salaryId: wx.getStorageSync('salaryId'),//工资发放批次Id

                    contentTitle: that.data.contentTitle,//反馈内容


                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },


                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code, res.data.msg);

                    //成功之后解锁
                    that.setData({

                        repeatSend: 1

                    });

                    if (res.data.code == '3001') {

                        //console.log('登录');

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


                        if (res.data.code == '3001') {

                            //console.log('登录');

                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 1500,
                                success: function () {

                                    setTimeout(function () {

                                        wx.reLaunch({

                                            url: '../../common/signin/signin'
                                        })

                                    }, 1500)

                                }

                            })

                            return false


                        }
                        else if(res.data.code=='3004'){

                            var Authorization = res.data.token.access_token;//Authorization数据

                            wx.setStorageSync('Authorization', Authorization);

                            return false
                        }

                        else {


                            if (res.data.code == '0000') {

                                wx.showToast({

                                    title: res.data.msg,
                                    icon: 'none',
                                    mask: true,

                                });


                                var userImf = {
                                    feedBackDetailId: "1",
                                    feedBackId: "123",
                                    content: that.data.contentTitle,
                                    type: "1",
                                    sendDate: Date.parse(new Date())

                                };


                                var _list = that.data.feedBackList;

                                _list.push(userImf)

                                //消息清空
                                that.setData({

                                    contentTitle: '',

                                    feedBackList: _list,//反馈消息列表

                                });


                                //平滑到底部

                                setTimeout(function () {

                                    wx.pageScrollTo({

                                        scrollTop: 999999
                                    })

                                }, 200)

                            }

                            else {

                                wx.showToast({

                                    title: res.data.msg,
                                    icon: 'none',
                                    duration: 2000,
                                    mask: true,


                                });

                            }

                        }

                    }


                },

                fail: function (res) {

                    console.log(res)
                }

            })


        }


    },

    changeInput: function () {


        var that = this;

        that.setData({

            fixedInput: true,

        })


    },

    inputBlur: function () {

        var that = this;

        that.setData({

            fixedInput: false,

        })

    },

    inputChange: function (e) {

        var that = this;

        that.setData({

            contentTitle: e.detail.value,

        })


    }


});