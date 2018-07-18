
/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const  paymsgUrl = '/jx/action/paymsg';//1、设置支付密码 onload调用

const checkpaypwdcodeUrl = '/user/set/checkpaypwdcode';//2、校验支付密码验证码



Page({

    data: {},
    onLoad: function () {

    },


    uploadPhotoFn: function () {

        wx.showActionSheet({
            itemList: ['拍摄', '从相册选择照片'],
            itemColor: "#ee6934",
            success: function (res) {
                console.log(res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    }

})
