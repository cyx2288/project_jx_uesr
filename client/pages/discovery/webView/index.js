const app = getApp();

Page({

    data:{

        isIpx: app.globalData.isIpx?true:false,

        GoUrl:'',

    },
    onShow: function () {

        var that =this;

        var _goUrl = wx.getStorageSync('GoUrl');

        var _goNav = wx.getStorageSync('GoNav');

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 2000
        })

        wx.setNavigationBarTitle({

            title: _goNav
        });

        that.setData({

            GoUrl:_goUrl

        })

        console.log(that.data.GoUrl)


    },






});