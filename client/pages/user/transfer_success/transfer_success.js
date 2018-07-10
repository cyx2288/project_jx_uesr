const app = getApp();


Page({

    data:{

        balance:''

    },
    onShow:function () {

        var _money = wx.getStorageSync('transferBalance');

        //存取是从账单进入（在转账详情里面取出）
        wx.setStorageSync('billHref','6')

        var that = this;

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

        that.setData({

            balance:returnFloat(_money)
        })


    },

    lookDetails:function () {

        wx.redirectTo({

            url:'../transfer_details/transfer_details'

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