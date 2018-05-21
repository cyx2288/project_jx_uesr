/**
 * Created by ZHUANGYI on 2018/5/14.
 */
Page({
    
    data:{

        isPayPwd:''
        
        
    },
    
    onLoad:function () {

        var that = this;

        var _isPayPwd = wx.getStorageSync('isPayPwd')

        that.setData({

            isPayPwd:_isPayPwd

        })

        console.log(that.data.isPayPwd)

        
    }


})
