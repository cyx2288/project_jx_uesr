//app.js
App({

    globalData: {

        userInfo: null,

        /*URL:'https://user.99payroll.cn/jx-user',*///生产环境

        URL: 'http://jxtest.99payroll.cn/jx-user',

        /*URL:'http://172.18.1.62:8092/jx-user',*/

        ajaxFinish: function (ajaxCount) {

     /*       wx.showLoading({

                mask: true,
                title: '加载中',

            });*/

            wx.showNavigationBarLoading();

            if (ajaxCount == 0) {

/*
                setTimeout(function () {

                    wx.hideLoading();

                }, 500);
*/

                setTimeout(function () {

                    wx.hideNavigationBarLoading()

                },500);



            }

        },

        repeat: function (code, msg) {

            if (code == '3003') {


                wx.showToast({
                    title: msg,
                    icon: 'none',
                    mask:true,
                    success: function () {

                        setTimeout(function () {

                            wx.reLaunch({

                                url: '../../common/signin/signin'
                            })

                        }, 1500)

                    }

                })

                return false

            }


        },

        isIpx:function () {

            wx.getSystemInfo({

                success: function (res) {

                    if (res.model=="iPhone X") {

                        this.globalData.isIPX = 1;

                    }
                }
            })
        },

        loadingFn:function () {



            wx.showLoading({

             mask: true,
             title: '加载中',

             });


            setTimeout(function () {

                wx.hideLoading();

            }, 500);


        }

    },


})