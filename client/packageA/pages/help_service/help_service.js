Page({

    data:{

        userName:'',

        mobile:'',


    },

    onShow:function () {


        var thisUserName = wx.getStorageSync('userName');

        var thisMobile = wx.getStorageSync('mobile');


        this.setData({

            userName:thisUserName,

            mobile:thisMobile


        })

    },
    openConfirm: function () {

        wx.makePhoneCall({
            phoneNumber: '4009217052' //仅为示例，并非真实的电话号码
        })

    },

});