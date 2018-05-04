
Page({

    data:{

        mobile:'',//手机号

        password:''//密码

    },

    telFn:function (e) {

        var that = this;
        that.setData({
            mobile: e.detail.value
        });

    },

    passwordFn:function (e) {

        var that = this;
        that.setData({
            password: e.detail.value
        });

    }

});