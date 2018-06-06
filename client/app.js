//app.js
App({

    globalData: {

    userInfo: null,

      /*URL:'http://192.168.66.177:8091/jx-user'//环境*/

      /*URL:'https://user.99payroll.cn/jx-user',*///生产环境

      URL:'http://jxtest.99payroll.cn/jx-user',

      /*URL:'http://172.18.1.62:8091/jx-user'*/

     ajaxFinish:function (ajaxCount) {

        wx.showLoading({

            title: '加载中',

        });

        if(ajaxCount==0) {

            setTimeout(function () {

                wx.hideLoading();

            },500);


        }

    },

      repeat:function (code,msg) {

       if(code=='3003') {

        console.log('登录');

        wx.showToast({
            title: msg,
            icon: 'none',
            success:function () {

                setTimeout(function () {

                    wx.reLaunch({

                        url:'../../common/signin/signin'
                    })

                },1500)

            }

        })

        return false

    }


},

      signinCode:function(code,msg) {

    if(code=='3001') {

        //console.log('登录');

        wx.showToast({
            title: msg,
            icon: 'none',

            success:function () {

                setTimeout(function () {

                    wx.reLaunch({

                        url:'../../common/signin/signin'
                    })

                },1500)

            }

        })

        return false


    }


},





},



})