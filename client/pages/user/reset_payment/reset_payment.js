const app = getApp();

Page({


    forgetPayPwd:function () {

        //区别是在设置页面修改密码成功还是在提现中忘记密码设置成功（在设置密码成功后取值）
        wx.setStorageSync('paySettingHref','8');

    },



})
