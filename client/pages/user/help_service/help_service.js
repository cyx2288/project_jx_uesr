Page({
    openConfirm: function () {

        wx.makePhoneCall({
            phoneNumber: '64031776' //仅为示例，并非真实的电话号码
        })

    },
/*    openAlert: function () {
        wx.showModal({
            content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
        });
    }*/
});