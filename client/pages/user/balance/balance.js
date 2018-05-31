const app = getApp();

const balanceUrl = '/user/account/getbalance';//获取用户余额


Page({

    data:{

        wages:''//工资余额

    },

    onShow:function () {


        //获取用户余额
        var thisBalanceUrl = app.globalData.URL + balanceUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：获取用户余额
         * 请求方式：GET
         * 接口：/user/account/getbalance
         * 入参：null
         **/
        wx.request({

            url: thisBalanceUrl,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {


                console.log(res.data);

                that.setData({

                    wages: res.data.data//用户余额

                });


            },


            fail: function (res) {

                console.log(res)

            }

        })


    }

});