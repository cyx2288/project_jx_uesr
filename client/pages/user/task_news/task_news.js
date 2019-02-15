const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const feedbackdetailUrl = '/salary/home/feedbackdetail';//注册的url地址



Page({

    data:{

        taskName:'',//任务名称

        taskList:[],//接口获得的数组

        showModal: false,//弹框

        imgalist:['http://wechat.fbwin.cn/images/qrcode_jx.jpg'],

    },

    onShow: function () {

        var that = this;

        that.init();

        that.setData({

            taskName:wx.getStorageSync('taskName')

        })


    },

    //初始化加载
    init:function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        /**
         * 接口：获取工资条反馈详情
         * 请求方式：POST
         * 接口：/salary/home/feedbackdetail
         * 入参：salaryDetailId
         **/


        wx.request({

            url: app.globalData.URL+feedbackdetailUrl,

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

                    var list = res.data.data;


                    if (!list) {

                        that.setData({

                            taskList : []//反馈消息列表

                        })



                    }

                    else {

                        that.setData({

                            taskList :list//反馈消息列表

                        })



                    }



                }




            },

            fail: function (res) {

                console.log(res)

            }

        })





    },


    modelFn:function () {

        var that = this

        that.setData({
            showModal: true
        });
    },

    showDialogBtn: function() {

        var that = this;


    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {


    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {

        var that = this

        that.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        var that = this;

        that.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {

        var that = this;

        that.hideModal();
    },

    previewImage: function (e) {
        wx.previewImage({
            current: this.data.imgalist, // 当前显示图片的http链接
            urls: this.data.imgalist // 需要预览的图片http链接列表
        })
    },



})