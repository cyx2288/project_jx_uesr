const app = getApp();
Page({

    data:{

        balance:''

    },
    onLoad:function () {

        var _balance = wx.getStorageSync('balance');

        var _rate = wx.getStorageSync('rate')

        var that = this;

        that.setData({

            balance:parseInt(_balance)+parseInt(_rate)
        })


    },

    lookDetails:function () {


        wx.redirectTo({

            url:'../give_details/give_details'

        });

    }




});