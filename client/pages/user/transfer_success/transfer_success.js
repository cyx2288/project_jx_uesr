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

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：查询历史收款人
         * 请求方式：post
         * 接口：/record/selecthistoricalpayee
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + payeeUrl,

            method: 'POST',

            header: {

                'content-type': 'application/x-www-form-urlencoded',// post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                console.log(res.data.data)

                if(res.data.data.length !=0){

                    //console.log('有历史')

                    wx.navigateBack({
                     delta: 1
                     })

                }

                else {

                    //console.log('没历史')
                    wx.navigateBack({
                        delta: 1
                    })


                }

            },


            fail: function (res) {

                console.log(res)

            }

        })





    },

    onHide:function () {




    },




});