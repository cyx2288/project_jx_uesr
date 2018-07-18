
/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const upLoadImgUrl = '/jx/uploadimg/oss';//上传图片



Page({

    data: {

        file:'',

        faceImg:'../../../static/icon/wages/jx_passport_face.png',

        backImg:'../../../static/icon/wages/jx_passport_opposite.png',

        modal: {

            isShow:false,// 图文弹框是否显示




        },


    },
    onLoad: function () {


    },


    uploadPhotoFn: function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


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

                            wx.uploadFile({


                                url: app.globalData.URL + upLoadImgUrl, //仅为示例，非真实的接口地址

                                header:{

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


                                        //console.log(JSON.parse(res.data).data.url);

                                        if(res.data.code=='0000'){


                                            wx.showToast({
                                                title: '上传成功',
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

                            wx.uploadFile({


                                url: app.globalData.URL + upLoadImgUrl, //仅为示例，非真实的接口地址

                                header:{

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


                                        //console.log(JSON.parse(res.data).data.url);

                                        if(res.data.code=='0000'){


                                            wx.showToast({
                                                title: '上传成功',
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
                console.log(res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    uploadPhotoBackFn: function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


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

                            wx.uploadFile({


                                url: app.globalData.URL + upLoadImgUrl, //仅为示例，非真实的接口地址

                                header:{

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


                                        //console.log(JSON.parse(res.data).data.url);

                                        if(res.data.code=='0000'){


                                            wx.showToast({
                                                title: '上传成功',
                                                mask: true,
                                            })
                                        }

                                        that.setData({

                                            backImg:JSON.parse(res.data).data.url

                                        })


                                    }


                                }
                            })

                        }
                    })

                }

                else {

                    wx.chooseImage({
                        count: 1, // 默认9 一张图
                        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                            var tempFilePaths = res.tempFilePaths;

                            wx.uploadFile({


                                url: app.globalData.URL + upLoadImgUrl, //仅为示例，非真实的接口地址

                                header:{

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


                                        //console.log(JSON.parse(res.data).data.url);

                                        if(res.data.code=='0000'){


                                            wx.showToast({
                                                title: '上传成功',
                                                mask: true,
                                            })
                                        }

                                        that.setData({

                                            backImg:JSON.parse(res.data).data.url

                                        })


                                    }


                                }
                            })


                        }
                    })

                }

            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    preventTouchMove: function () {


    },

    showFaceTipFn:function () {

        var that = this;

        console.log(1);

        that.setData({

           modal: {

               isShow: true,// 图文弹框是否显示

               title:'证件示例',// 标题

               src:'../../../static/icon/wages/jx_passport_face.png',// 图片地址，必填，如果没有图片，请直接使用wx.showModal

               ok:'确定',// 确定按钮文本

           }

        })


    },

    modalClick:function () {

        var that = this;

        that.setData({

            modal: {

                isShow: false,// 图文弹框是否显示

                title:'证件示例',// 标题

                src:'../../../static/icon/wages/jx_example_paper.png',// 图片地址，必填，如果没有图片，请直接使用wx.showModal

                ok:'确定',// 确定按钮文本



            }

        })


    }



})
