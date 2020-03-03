
/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const upLoadImgUrl = '/jx/uploadimg/oss';//上传图片

const userVerify ='/user/center/verifyuserinfo';//实名认证

const ocrVerify ='/user/center/orc/userverify';//保存用户证件URL

const mineUrl ='/user/center/usercenter';//用户中心

Page({

    data: {

        idNumber:'',

        idNumberAll:'',//身份证号码

        file:'',

        userName:'',

        idType:'',

        nationality:'',

        faceImg:'../../../static/icon/wages/jx_passport_face.png',

        backImg:'../../../static/icon/wages/jx_passport_opposite.png',

        modal: {

            isShow:false,// 图文弹框是否显示


        },

        isHaveUserVerifyImg:'',//时候上传了图片

        isVerify:'',//是否认证

        btnName:'',//按钮名称

        src: '',

        width: 300,

        height: 190,

        cropperShow: false,

        imgType: '',

        errorShow: false,

        limitMove: true,

        disableRotate: true




    },

    onLoad: function () {

        this.cropper = this.selectComponent("#image-cropper");

        this.setData({

            src:"https://raw.githubusercontent.com/1977474741/image-cropper/dev/image/code.jpg"

        });

    },


    onShow: function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');
        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：mobile
         **/
        wx.request({

            url: app.globalData.URL + mineUrl,

            method: 'POST',

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                app.globalData.repeat(res.data.code, res.data.msg);

                app.globalData.token(res.header.Authorization)


                if (res.data.code == '3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../../pages/common/signin/signin'
                        })

                    }, 1500)


                    return false


                }

                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                }

                else {

                    //存储手机号码
                    that.setData({

                        isVerify: res.data.data.isVerify,

                        isHaveUserVerifyImg : res.data.data.isHaveUserVerifyImg,

                        idNumberAll : res.data.data.idNumberAll,

                        userName:res.data.data.userName


                    });


                    if(that.data.isVerify=='1'&&that.data.isHaveUserVerifyImg=='0'){

                        wx.setNavigationBarTitle({

                            title:'补充证件照片'
                        })

                        that.setData({


                            btnName:'提交',//按钮名称
                        })
                    }

                    else {
                        wx.setNavigationBarTitle({

                            title:'实名认证'
                        })

                        that.setData({


                            btnName:'下一步',//按钮名称
                        })

                    }


                }

            },

            fail: function (res) {

                console.log(res)
            }

        })

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

                            if(res.tempFiles[0].size > 204800){

                                that.setData({

                                    src: tempFilePaths[0],

                                    cropperShow: true,

                                    imgType: 'face'

                                });

                                return false;

                            }

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

                                        //app.globalData.token(res.header.Authorization)

                                        if (res.data.code == '3001') {

                                            //console.log('登录');

                                            setTimeout(function () {

                                                wx.reLaunch({

                                                    url:'../../../pages/common/signin/signin'
                                                })

                                            }, 1500);


                                            return false


                                        }
                                        else if(res.data.code=='3004'){

                                            var Authorization = res.data.token.access_token;//Authorization数据

                                            wx.setStorageSync('Authorization', Authorization);

                                            return false
                                        }


                                        else {

                                            console.log(res)

                                            wx.hideLoading()


                                            if(JSON.parse(res.data).code=='0000'){


                                                that.setData({

                                                    faceImg:JSON.parse(res.data).data.url

                                                })

                                            }

                                            setTimeout(function () {


                                                wx.showToast({
                                                    title: '上传成功',
                                                    icon: 'none',
                                                    mask: true,
                                                })

                                            },10)




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

                            console.log(tempFilePaths);

                            if(res.tempFiles[0].size > 204800){

                                that.setData({

                                    src: tempFilePaths[0],

                                    cropperShow: true,

                                    imgType: 'face'

                                });

                                return false;

                            }

                                wx.showLoading({
                                    title:'图片上传中',
                                    mask:true,

                                });

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

                                        //app.globalData.token(res.header.Authorization)

                                        if (res.data.code == '3001') {

                                            //console.log('登录');

                                            setTimeout(function () {

                                                wx.reLaunch({

                                                    url:'../../../pages/common/signin/signin'
                                                })

                                            }, 1500);


                                            return false


                                        }
                                        else if(res.data.code=='3004'){

                                            var Authorization = res.data.token.access_token;//Authorization数据

                                            wx.setStorageSync('Authorization', Authorization);

                                            return false
                                        }

                                        else {

                                            console.log(res)


                                            console.log(JSON.parse(res.data).code);

                                            if(JSON.parse(res.data).code=='0000'){

                                                that.setData({

                                                    faceImg:JSON.parse(res.data).data.url

                                                })


                                            }



                                            setTimeout(function () {


                                                wx.showToast({
                                                    title: '上传成功',
                                                    icon: 'none',
                                                    mask: true,
                                                })

                                            },10)




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


                            if(res.tempFiles[0].size > 204800){

                                that.setData({

                                    src: tempFilePaths[0],

                                    cropperShow: true,

                                    imgType: 'back'

                                });

                                return false;

                            }

                                wx.showLoading({

                                    title:'图片上传中',
                                    mask:true,

                                });

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

                                        //app.globalData.token(res.header.Authorization)

                                        if (res.data.code == '3001') {

                                            //console.log('登录');

                                            setTimeout(function () {

                                                wx.reLaunch({

                                                    url:'../../../pages/common/signin/signin'
                                                })

                                            }, 1500);


                                            return false


                                        }
                                        else if(res.data.code=='3004'){

                                            var Authorization = res.data.token.access_token;//Authorization数据

                                            wx.setStorageSync('Authorization', Authorization);

                                            return false
                                        }

                                        else {

                                            console.log(res)

                                            wx.hideLoading();


                                            //console.log(JSON.parse(res.data).data.url);

                                            if (JSON.parse(res.data).code == '0000') {

                                                that.setData({

                                                    backImg: JSON.parse(res.data).data.url

                                                })


                                            }



                                            setTimeout(function () {


                                                wx.showToast({
                                                    title: '上传成功',
                                                    icon: 'none',
                                                    mask: true,
                                                })

                                            }, 100)

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

                            if(res.tempFiles[0].size > 204800){

                                that.setData({

                                    src: tempFilePaths[0],

                                    cropperShow: true,

                                    imgType: 'back'

                                });

                                return false;

                            }

                                wx.showLoading({

                                    title: '图片上传中',
                                    mask: true,

                                })

                                wx.uploadFile({


                                    url: app.globalData.URL + upLoadImgUrl, //仅为示例，非真实的接口地址

                                    header: {

                                        'content-type': 'multipart/form-data', // post请求

                                        'jxsid': jx_sid,

                                        'Authorization': Authorization

                                    },

                                    filePath: tempFilePaths[0],

                                    name: 'File',

                                    success: function (res) {

                                        //code3003返回方法
                                        app.globalData.repeat(res.data.code, res.data.msg);


                                        if (res.data.code == '3001') {

                                            //console.log('登录');

                                            setTimeout(function () {

                                                wx.reLaunch({

                                                    url: '../../../pages/common/signin/signin'
                                                })

                                            }, 1500);


                                            return false


                                        }

                                        else if (res.data.code == '3004') {

                                            var Authorization = res.data.token.access_token;//Authorization数据

                                            wx.setStorageSync('Authorization', Authorization);

                                            return false
                                        }

                                        else {

                                            console.log(res)


                                            //console.log(JSON.parse(res.data).data.url);

                                            if (JSON.parse(res.data).code == '0000') {


                                            that.setData({

                                                backImg: JSON.parse(res.data).data.url

                                            })


                                            }


                                            setTimeout(function () {


                                                wx.showToast({
                                                    title: '上传成功',
                                                    icon: 'none',
                                                    mask: true,
                                                })

                                            },10)




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

                src:'../../../static/icon/wages/jx_idCard_face_example.jpg',// 图片地址，必填，如果没有图片，请直接使用wx.showModal

                ok:'确定',// 确定按钮文本

            }

        })


    },

    showBackTipFn:function () {

        var that = this;

        console.log(1);

        that.setData({

            modal: {

                isShow: true,// 图文弹框是否显示

                title:'证件示例',// 标题

                src:'../../../static/icon/wages/jx_idCard_back_example.jpg',// 图片地址，必填，如果没有图片，请直接使用wx.showModal

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

        else if(that.data.backImg=='../../../static/icon/wages/jx_passport_opposite.png'){

            wx.showToast({
                title: '请上传证件照反面',
                icon: 'none',
                mask:true,
            })

        }

        else {

            if(that.data.isVerify=='1'&&that.data.isHaveUserVerifyImg=='0'){

                wx.showLoading({

                    mask: true,
                    title: '证件信息核对中...',

                });


            }

            else {

                wx.showLoading({

                    mask: true,
                    title: '图片信息读取中...',

                });

            }


            wx.setStorageSync('urls',[that.data.faceImg,that.data.backImg]);

            /**
             * 接口：保存用户证件URL
             * 请求方式：POST
             * 接口：/user/center/orc/userverify
             * 入参：urls
             **/

            wx.request({

                url:app.globalData.URL + ocrVerify,

                method: 'POST',

                data: json2FormFn.json2Form({

                    idType:1,

                    urls:[that.data.faceImg,that.data.backImg],


                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded',// post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },



                success: function (res) {

                    console.log(res.data);

                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../../pages/common/signin/signin'
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

                        if(res.data.code=='-1'){

                            wx.hideLoading()

                            wx.showToast({
                                title:res.data.msg,
                                icon: 'none',
                                mask:true,
                                duration: 3000
                            })




                        }

                        else if(res.data.code == -7){

                            wx.hideLoading();

                            that.setData({

                                errorShow: true

                            });

                        }


                        else if(res.data.code=='0000'){

                            wx.hideLoading()

                            //存识别出来的信息

                            wx.setStorageSync('personInformation',res.data.data)


                            if(that.data.isVerify=='1'&&that.data.isHaveUserVerifyImg=='0'){

                                wx.navigateBack({

                                    delta: 1,

                                })

                                wx.showToast({
                                    title:'身份证照片上传成功',
                                    icon: 'none',
                                    mask:true,
                                    duration: 3500,
                                })

                            }

                            else {

                                wx.navigateTo({

                                    url: '../IDCard_information/IDCard_information'
                                })

                            }











                        }

                        /*else if(res.data.code=='-1'){




                            wx.showToast({
                                title:res.data.msg,
                                icon: 'none',
                                mask:true,
                                duration: 5000

                            })
                        }*/



                    }




                },

                fail: function (res) {

                    console.log(res)

                }

            })




        }













    },


    cropperload(e){
        console.log("cropper初始化完成");
    },
    loadimage(e){
        console.log("图片加载完成",e.detail);
        wx.hideLoading();
    },
    clickcut(e) {
        console.log(e.detail);
        //点击裁剪框阅览图片
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },

    cancelFn: function () {

        this.setData({

            cropperShow: false,

            src: ''

        });

    },


    confirmFn: function (e) {

        var that = this;

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        wx.showLoading({
            title:'图片上传中',
            mask:true,

        });

        console.log(e.detail);

        wx.uploadFile({


                                    url: app.globalData.URL + upLoadImgUrl, //仅为示例，非真实的接口地址

                                    header:{

                                        'content-type': 'multipart/form-data', // post请求

                                        'jxsid': jx_sid,

                                        'Authorization': Authorization

                                    },

                                    filePath: e.detail.url,

                                    name: 'File',

                                    success: function(res){

                                        //code3003返回方法
                                        app.globalData.repeat(res.data.code, res.data.msg);

                                        //app.globalData.token(res.header.Authorization)

                                        if (res.data.code == '3001') {

                                            //console.log('登录');

                                            setTimeout(function () {

                                                wx.reLaunch({

                                                    url:'../../../pages/common/signin/signin'
                                                })

                                            }, 1500);


                                            return false


                                        }
                                        else if(res.data.code=='3004'){

                                            var Authorization = res.data.token.access_token;//Authorization数据

                                            wx.setStorageSync('Authorization', Authorization);

                                            return false
                                        }


                                        else {

                                            console.log(res)

                                            wx.hideLoading()


                                            if(JSON.parse(res.data).code=='0000'){


                                                if(that.data.imgType == 'face'){

                                                    that.setData({

                                                        faceImg:JSON.parse(res.data).data.url,

                                                        url: '',

                                                        cropperShow: false

                                                    })

                                                }else if(that.data.imgType == 'back'){

                                                    that.setData({

                                                        backImg:JSON.parse(res.data).data.url,

                                                        url: '',

                                                        cropperShow: false

                                                    })

                                                }

                                            }

                                            setTimeout(function () {


                                                wx.showToast({
                                                    title: '上传成功',
                                                    icon: 'none',
                                                    mask: true,
                                                })

                                            },10)




                                        }


                                    }
                                })

    },


    closeError: function () {

        this.setData({

            errorShow: false

        })

    }



})
