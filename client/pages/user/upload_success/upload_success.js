const app = getApp();


Page({

    data:{

        isVerify:'',


    },

    onShow:function () {

        var that = this;

        var _isVerify = wx.getStorageSync('isVerify');

        wx.setStorageSync('successVerify', 'true');

        console.log(_isVerify)

        that.setData({

            isVerify:_isVerify,

        })




    },



    onUnload:function () {


        var that = this;

        if(that.data.isVerify=='2'){

            console.log('退回1层')


        }

        else {

            wx.navigateBack({
                delta: 2
            })


        }



    },



});