
const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const checkTransferUrl = '/user/work/checktransfer';//检测用户发起转账操作



Page({
    
    data:{

        mobile:'',

        disabled:true,//置灰

        showModal: false,

    },

    nextTransferFn:function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _mobile = wx.getStorageSync('mobile');

        if(that.data.mobile.length<11){

            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                mask:true
            })


        }

        else if(that.data.mobile == _mobile){

            wx.showToast({
                title: '不能给自己转账',
                icon: 'none',
                mask:true
            })

        }

        else {

            /**
             * 接口：检测用户发起转账操作
             * 请求方式：post
             * 接口：/user/work/checktransfer
             * 入参：mobile
             **/
            wx.request({

                url: app.globalData.URL + checkTransferUrl,

                method: 'POST',

                header: {

                    'content-type': 'application/x-www-form-urlencoded',// post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                data:json2FormFn.json2Form({

                    mobile: that.data.mobile,

                }),

                success: function (res) {

                    console.log(res.data);

                    if(res.data.code=='0000'){


                        wx.navigateTo({

                            url: '../account_cash/account_cash'

                        })


                        wx.setStorageSync('transferMobile',that.data.mobile);

                        wx.setStorageSync('transferName',res.data.data.userName);



                    }

                    else if(res.data.code=='-8'){

                        that.setData({

                            showModal: true

                        })

                        /*wx.showModal({
                            title: '提示',
                            content: '分享微信小程序，邀请好友注册【嘉薪】并实名认证，通过后即可给该好友转账',
                            cancelText: '取消',
                            confirmText: '去分享',
                            confirmColor:'#fe9728',
                            success: function (res) {

                                if (res.confirm) {

                                }

                                else if (res.cancel) {



                                }


                            }
                        });*/

                    }

                },


                fail: function (res) {

                    console.log(res)

                }

            })






        }



    },

    telFn:function (e) {

        var that = this

        that.setData({

            mobile:e.detail.value

        });


        if(that.data.mobile){

            that.setData({

                disabled:false,//置灰

            })

        }

        else{


            that.setData({

                disabled:true,//置灰

            })


        }


    },

    showDialogBtn: function() {

        var that = this;


    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {

        that.setData({

            showModal: false,

        })

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

    //转发
    onShareAppMessage: function () {
        return {
            title: '嘉薪平台',
            path: '/pages/common/signin/signin',
            imageUrl: '/static/icon/logo/share.jpg'

        }
    },



});