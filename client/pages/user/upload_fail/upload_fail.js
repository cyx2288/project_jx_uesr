const app = getApp();
Page({

    data:{

        errorCause:''

    },
    onShow:function () {

        var _errorCause = wx.getStorageSync('refuseReason');

        var that = this;

        wx.setStorageSync('successVerify', 'true');

        that.setData({

            errorCause:_errorCause
        })


    },

    goAgainFn:function () {

        wx.redirectTo({

            url: '../no_certification/certification'

        })

    }

});