const app = getApp();


Page({

    data:{

        balance:''

    },
    onShow:function () {

        var _money = wx.getStorageSync('money')


        function returnFloat(value){

            var value=Math.round(parseFloat(value)*100)/100;

            var xsd=value.toString().split(".");

            if(xsd.length==1){

                value=value.toString()+".00";

                return value;
            }
            if(xsd.length>1){

                if(xsd[1].length<2){

                    value=value.toString()+"0";
                }
                return value;
            }
        }

        var that = this;

        that.setData({

            balance:returnFloat(_money)
        })


    },

    lookDetails:function () {

        wx.redirectTo({

            url:'../cash_give_details/give_details'

        });


    },

    //关闭之前的页面 直接退回我的页面
/*
    onUnload:function () {

        wx.switchTab({


            url:'../../user/mine/mine'
        })

    }
*/




});