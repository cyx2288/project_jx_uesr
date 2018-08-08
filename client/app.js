//app.js
App({

    globalData: {

        userInfo: null,

        /*URL: 'https://user.99payroll.cn/jx-user',*///生产环境

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

                }, 500);


            }

        },

        repeat: function (code, msg) {

            if (code == '3003') {


                wx.showToast({
                    title: msg,
                    icon: 'none',
                    mask: true,
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

        isIpx: function () {

            wx.getSystemInfo({

                success: function (res) {

                    if (res.model == "iPhone X") {

                        this.globalData.isIPX = 1;

                    }
                }
            })
        },

        loadingFn: function () {


            wx.showLoading({

                mask: true,
                title: '加载中',

            });


            setTimeout(function () {

                wx.hideLoading();

            }, 500);


        },



    },

    onLaunch: function () {

        if (wx.canIUse('getUpdateManager')) {

            const updateManager = wx.getUpdateManager();

            updateManager.onCheckForUpdate(function (res) {


                console.log(res.hasUpdate)

                // 请求完新版本信息的回调
                if (res.hasUpdate) {

                    updateManager.onUpdateReady(function () {

                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',

                            success: function (res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }



                        })

                    })
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                }
            })
        }

        else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',

            })
        }



    }


})