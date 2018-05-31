const app = getApp();


Page({

    data:{

        balance:''

    },
    onLoad:function () {

        var _money = wx.getStorageSync('money')

        var that = this;

        that.setData({

            balance:_money
        })


    },

    lookDetails:function () {

        wx.redirectTo({

            url:'../cash_give_details/give_details'

        });


    },

    //关闭之前的页面 直接退回我的页面
/*
    onUnload:function () {

        wx.switchTab({


            url:'../../user/mine/mine'
        })

    }
*/




});