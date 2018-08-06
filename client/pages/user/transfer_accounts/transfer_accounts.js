const app = getApp();

const payeeUrl = '/record/selecthistoricalpayee';//查询历史收款人

const delPayeeUrl='/record/deletehistoricalpayee';//删除历史收款人


Page({

    data:{

        accountsList:[],//历史收款人

        recordId:''//历史收款人id
    },

    onShow:function () {

        var that = this;


        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        wx.setStorageSync('hrefNum','2')


        /**
         * 接口：查询历史收款人
         * 请求方式：post
         * 接口：/record/selecthistoricalpayee
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + payeeUrl,

            method: 'POST',

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                that.setData({

                    accountsList:res.data.data

                })

                var thisList = that.data.accountsList;

                that.setData({

                    accountsList:thisList

                })



            },


            fail: function (res) {

                console.log(res)

            }

        })


    },

    transferFn:function (e) {

        var _hideMobile = e.currentTarget.dataset.mobile

        wx.setStorageSync('transferMobile',e.currentTarget.dataset.mobile);

        wx.setStorageSync('transferName',e.currentTarget.dataset.name);

        wx.setStorageSync('transferHideMobile',_hideMobile.substr(0, 3) + '****' + _hideMobile.substr(7));

        //存储从哪个页面 在转账成功后获取 返回哪个页面
        wx.setStorageSync('whichTransfer','2');

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

                    delAccount();

                    that.onShow();



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

    },

    transferListFn:function () {

        //存储从哪个页面跳到我的账单 来判断导航名称（在我的账单取到 1为提现记录 2为转账记录）
        wx.setStorageSync('whichBill','2');

        wx.navigateTo({

            url: '../../../packageA/pages/bill/bill'
        })


    },

    transferOtherFn:function () {

        //存储从哪个页面 在转账成功后获取 返回哪个页面
        wx.setStorageSync('whichTransfer','1');


    },

    transferAllFn:function () {

        //存储从哪个页面 在转账成功后获取 返回哪个页面
        wx.setStorageSync('whichTransfer','4');

    }




});