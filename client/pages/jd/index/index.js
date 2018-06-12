const app = getApp();


Page({

    data:{

        num:0,

    },
    onShow: function () {


        this.data.num++;

        if (this.data.num % 2 == 0) {

            wx.switchTab({

                url: '../../../pages/wages/index/index'

            });

        } else {


            wx.navigateTo({

                url: '../jdshop/jdshop'

            })
        }



    },



});