/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const  paymsgUrl = '/user/set/updatepaymode';//修改支付验证方式








Page({

    data:{



    },
    onLoad:function () {

        
        var payMode = wx.getStorageSync('jxPayMode');

        console.log(payMode)


    }



})

