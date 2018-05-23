const app = getApp();
Page({

    data:{

        balance:''

    },
    onLoad:function () {

        var _balance = wx.getStorageSync('balance');

        var that = this;

        that.setData({

            balance:_balance
        })


    },


});