const app = getApp();


Page({

    data:{

        num:0,

    },
    onShow: function () {


        wx.showLoading({

            title: '加载中',
        })
        

        var goWhere = wx.getStorageSync('goHtml');

        this.data.num++;

        if (this.data.num % 2 == 0) {

            if(goWhere=='4'){


                wx.switchTab({

                    url: '../../../pages/wages/index/index'

                });

            }

            else {


                wx.switchTab({

                    url: '../../../pages/user/mine/mine'

                });

            }


        } else {


            wx.navigateTo({

                url: '../jdshop/jdshop'

            })
        }



    },



});