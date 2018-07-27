const app = getApp();

const payeeUrl = '/record/selecthistoricalpayee';//查询历史收款人


Page({

    data:{

        balance:''

    },
    onShow:function () {

        var _money = wx.getStorageSync('transferBalance');

        //存取是从账单进入（在转账详情里面取出）
        wx.setStorageSync('billHref','6');

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

        wx.navigateTo({

            url:'../transfer_details/transfer_details'

        });


    },

    //关闭之前的页面 直接退回我的页面
    onUnload:function () {

        var _whichTransfer = wx.getStorageSync('whichTransfer');

        if(_whichTransfer=='1'){

            console.log('点击其他转账')

            wx.navigateBack({
                delta: 2
            })


        }

        else if(_whichTransfer=='2'){

            console.log('点击历史人')

            wx.navigateBack({
                delta: 1
            })

        }

        else if(_whichTransfer=='3'){

            console.log('点击转账手机');

            wx.navigateBack({
                delta: 4
            })

        }

        else if(_whichTransfer=='4'){

            console.log('点击全部收款人');

            wx.navigateBack({
                delta: 2
            })

        }

        else {

            wx.navigateBack({
                delta: 1
            })

        }




    },




});