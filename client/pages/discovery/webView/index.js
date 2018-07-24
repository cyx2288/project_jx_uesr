const app = getApp();

Page({

    data:{

        isIpx: app.globalData.isIpx?true:false,

        GoUrl:'',

    },
    onShow: function () {

        var that =this;

        var _goUrl = wx.getStorageSync('GoUrl');

        wx.setNavigationBarColor({

            frontColor: '#000000',
            backgroundColor: '#eeeeee',

        });

        console.log(_goUrl)

        var _goNav = wx.getStorageSync('GoNav');

            wx.setNavigationBarTitle({

                title: _goNav
            });



        that.setData({

            GoUrl:_goUrl

        })

        console.log(that.data.GoUrl)


    },






});