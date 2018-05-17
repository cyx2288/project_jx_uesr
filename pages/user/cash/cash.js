
/*提现*/
/*Page({
    open: function(){
        wx.showActionSheet({
            itemList: ['提现记录', '常见问题'],
            success: function(res) {
                if (!res.cancel) {
                    console.log(res.tapIndex)
                }
            }
        });
    }
});*/

/*未实名认证提现*/

/*
page({

data:{
    mHidden:true
},
})*/


Page({

    data: {
        array: ['工商银行（储蓄卡）', '中国银行（储蓄卡）', '建设银行（储蓄卡）', '华夏银行（储蓄卡）'],
        index: 0,
        date: '2016-09-01',
        time: '12:01'
    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function(e) {
        this.setData({
            time: e.detail.value
        })
    }

});