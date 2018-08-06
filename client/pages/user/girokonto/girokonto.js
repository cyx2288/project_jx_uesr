
const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const checkTransferUrl = '/user/work/checktransfer';//检测用户发起转账操作



Page({
    
    data:{

        mobile:'',

        disabled:true,//置灰

        showModal: false,

        titleMsg:'',//弹框标题

        titleContent:'',//弹框内容

    },

    onShow:function () {

        var that = this;

        wx.setStorageSync('hrefNum','3');


        //手机号初始化
        that.setData({

            mobile:'',

        })

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


                        wx.setStorageSync('transferHideMobile',res.data.data.hideMobile);

                        wx.setStorageSync('transferName',res.data.data.userName);


                        wx.setStorageSync('transferMobile',that.data.mobile);
                        // wx.setStorageSync('transferHideName',res.data.data.hideMobile);



                    }

                    else if(res.data.code=='-8'){

                        that.setData({

                            showModal: true,

                            titleMsg:res.data.msg,

                            titleContent:'分享微信小程序，邀请好友注册‘嘉薪’并实名认证，通过后即可给该好友转账',//弹框内容



                        })


                    }

                    else if(res.data.code=='-9'){

                        that.setData({

                            showModal: true,

                            titleMsg:res.data.msg,

                            titleContent:'分享微信小程序，提醒好友完成实名认证，通过后即可给该好友转账',//弹框内容


                        })


                    }

                    else{

                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            mask:true
                        })


                    }

                },


                fail: function (res) {

                    console.log(res)

                }

            })






        }



    },

    transferListFn:function () {

        console.log(1)

        //存储从哪个页面跳到我的账单 来判断导航名称（在我的账单取到 1为提现记录 2为转账记录）
        wx.setStorageSync('whichBill','2');

        wx.navigateTo({

            url: '../../../packageA/pages/bill/bill'
        })


    },

    telFn:function (e) {

        var that = this;

        var reg = /[0-9]/ig

        that.setData({

            mobile:e.detail.value

        });

        regMobile();
        
        function regMobile() {

            var _test=that.data.mobile;

            if(that.data.mobile.length>11){

                //判断是否有空格
                if(reg.test(that.data.mobile)){

                    //替换字符串中的非数字
                    _test = that.data.mobile.replace(/[^0-9]/ig,"");


                }

                //如果有86的话
                if(_test.substr(0,2)=='86'){

                     _test = that.data.mobile.substr(2);


                }

                if(_test.length>11){

                    _test = _test.substr(0,11);

                }

                that.setData({

                    mobile:_test

                })


            }

            
        }


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

    seeHistoryFn:function () {

        //存储从哪个页面 在转账成功后获取 返回哪个页面
       wx.setStorageSync('whichTransfer','3');
        
    }





});