Page({

    onShow:function () {


        //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        wx.showLoading({

            mask:true,
            title: '跳转中',

        })


        if(!jx_sid||!Authorization){

            setTimeout(function () {

                wx.reLaunch({

                    url:'../../common/signin/signin'
                })

            },2000)


        }

        else {

            setTimeout(function () {

                wx.switchTab({

                    url:'../../wages/index/index'
                })

            },2000)



        }
    }


})