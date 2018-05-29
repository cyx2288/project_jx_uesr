Page({

    data:{

        wages:''//工资余额

    },

    onShow:function () {

        //获取余额
        var thisWages = wx.getStorageSync('wages');

        this.setData({

            wages:thisWages,

        })

    }

});