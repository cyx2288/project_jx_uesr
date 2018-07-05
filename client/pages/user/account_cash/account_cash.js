Page({

    data:{

        inputBalance:'',//输入框中的值

        tips:'',//备注

        canTransferBalance:'',//可转余额

        disabled: true,




    },

    onShow:function () {




    },



    transferAllFn:function () {

        var that = this;



        that.setData({

            inputBalance: that.data.canTransferBalance,

        })


    },

    //输入
    bindKeyInput:function (e) {

        var that = this;

        var reg = /^\d+\.?(\d{1,2})?$/;

        //上一次的金额
        var lastInputBalace = that.data.inputBalance;

        //这一次的金额
        var thisInputBalance = e.detail.value;


        if(thisInputBalance){



                that.setData({

                    disabled:false

                });






            //默认输入小数点后两位
            if(!reg.test(thisInputBalance)) {


                wx.showToast({
                    title: '输入金额有误',
                    icon: 'none',
                    duration: 1000

                });

                e.detail.value = lastInputBalace


            }

        }


        that.setData({

            inputBalance:e.detail.value

        })

        console.log(that.data.inputBalance)

    },

    tipsFn:function (e) {

        var that = this;

        var reg = /^\d+\.?(\d{1,2})?$/;



        that.setData({

            tips:e.detail.value

        })



    },


    cashFn:function (e) {



    }





})