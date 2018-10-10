
/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const upLoadImgUrl = '/jx/uploadimg/oss';//上传图片

const userVerify ='/user/center/verifyuserinfo';//实名认证


Page({

    data: {

        idNumber:'',

    file:'',

    userName:'',

    idType:'',

    nationality:'',

    faceImg:'../../../static/icon/wages/jx_passport_face.png',
    },
    onShow: function () {

        var that = this;

        //存身份证号
        var thisNextIdNumber = wx.getStorageSync('NextIdNumber');

        //存姓名
        var thisNextUserName = wx.getStorageSync('NextUserName');

        //存idType
        var thisNextIdType = wx.getStorageSync('NextIdType');

        //存国籍
        var thisNextNationality = wx.getStorageSync('NextNationality');

        that.setData({

            idNumber:thisNextIdNumber,

            userName:thisNextUserName,

            idType:thisNextIdType,

            nationality:thisNextNationality,

        });

    },

    uploadPhotoFn: function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        console.log('张照片')

        wx.showActionSheet({
            itemList: ['拍摄', '从相册选择照片'],
            itemColor: "#ee6934",
            success: function (res) {

                if(res.tapIndex=='0'){

                    wx.chooseImage({
                        count: 1, // 默认9
                        sizeType:  ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                            var tempFilePaths = res.tempFilePaths;

                            console.log('都可以');


                            wx.uploadFile({


                                url: app.globalData.URL + upLoadImgUrl, //仅为示例，非真实的接口地址

                                header:{

                                    'content-type': 'multipart/form-data', // post请求

                                    'jxsid': jx_sid,

                                    'Authorization': Authorization

                                },

                                filePath: tempFilePaths[0],

                                name: 'File',

                                success: function(res){

                                    console.log('成功~')

                                    //code3003返回方法
                                    app.globalData.repeat(res.data.code, res.data.msg);

                                    if (res.data.code == '3001') {

                                        //console.log('登录');

                                        setTimeout(function () {

                                            wx.reLaunch({

                                                url: '../../common/signin/signin'
                                            })

                                        }, 1500);


                                        return false


                                    }

                                    else {

                                        console.log(res)


                                        if(JSON.parse(res.data).code=='0000'){

                                            wx.showToast({
                                                title: '上传成功',
                                                icon:'none',
                                                mask: true,
                                            })

                                        }

                                        that.setData({

                                            faceImg:JSON.parse(res.data).data.url

                                        })


                                    }


                                }
                            })

                        }
                    })

                }

                else {

                    wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                            var tempFilePaths = res.tempFilePaths;

                            console.log(res.tempFilePaths[0])

                            wx.uploadFile({


                                url: app.globalData.URL + upLoadImgUrl, //仅为示例，非真实的接口地址

                                header:{

                                    'content-type': 'multipart/form-data', // post请求

                                    'jxsid': jx_sid,

                                    'Authorization': Authorization

                                },

                                filePath: tempFilePaths[0],

                                name: 'File',

                                success: function(res){

                                    //code3003返回方法
                                    app.globalData.repeat(res.data.code, res.data.msg);

                                    if (res.data.code == '3001') {

                                        //console.log('登录');

                                        setTimeout(function () {

                                            wx.reLaunch({

                                                url: '../../common/signin/signin'
                                            })

                                        }, 1500);


                                        return false


                                    }

                                    else {

                                        console.log(res)


                                        console.log(JSON.parse(res.data).code);

                                        if(JSON.parse(res.data).code=='0000'){

                                            wx.showToast({
                                                title: '上传成功',
                                                icon:'none',
                                                mask: true,
                                            })

                                        }

                                        that.setData({

                                            faceImg:JSON.parse(res.data).data.url

                                        })


                                    }


                                }
                            })


                        }
                    })

                }
                //console.log (res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    submitVerifyFn:function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        if(that.data.faceImg=='../../../static/icon/wages/jx_passport_face.png'){

            wx.showToast({
                title: '请上传证件照正面',
                icon: 'none',
                mask:true,

            })

        }


        else {

            /**
             * 接口：实名认证
             * 请求方式：POST
             * 接口：/user/center/userverify
             * 入参：userName,idNumber,idType,nationality,urls
             **/
            wx.request({

                url:app.globalData.URL + userVerify,

                method: 'POST',

                data: json2FormFn.json2Form({

                    userName:that.data.userName,

                    idNumber:that.data.idNumber,

                    idType:that.data.idType,

                    nationality:that.data.nationality,

                    urls:that.data.faceImg,


                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded',// post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },



                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code,res.data.msg);

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500);

                        return false


                    }
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        return false
                    }

                    else {


                        if(res.data.code=='0000'){

                            wx.showToast({
                                title:res.data.msg,
                                icon: 'none',
                                mask:true,
                            })


                            wx.navigateTo({
                                url: '../upload_success/upload_success'
                            })





                        }

                        else if(res.data.code=='-1'){

                            wx.showToast({
                                title:res.data.msg,
                                icon: 'none',
                                mask:true,
                            })
                        }



                    }




                },

                fail: function (res) {

                    console.log(res)

                }

            })




        }













    },

    showFaceTipFn:function () {

        var that = this;


        that.setData({

            modal: {

                isShow: true,// 图文弹框是否显示

                title:'证件示例',// 标题

                src:'../../../static/icon/wages/jx_example_password.jpg',// 图片地址，必填，如果没有图片，请直接使用wx.showModal

                ok:'确定',// 确定按钮文本

            }

        })


    },

    modalClick:function () {

        var that = this;

        that.setData({

            modal: {

                isShow: false,// 图文弹框是否显示

            }

        })


    },

})
