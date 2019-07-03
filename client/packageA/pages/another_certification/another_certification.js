
/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const upLoadImgUrl = '/jx/uploadimg/oss';//上传图片

const userVerify ='/user/center/verifyuserinfo';//实名认证

const mineUrl ='/user/center/usercenter';//用户中心

Page({

    data: {

        userName:'',

        isVerify:'',//是否认证

        hasUserName:true,//有没有用户姓名

        cardChoose:'港澳居民来往内地通行证',//证件类型

        index:'',//默认选择

        idType:'3',//证件类型 1-身份证 2-护照 3-港澳通行证 4-台湾通行证 5-临时身份证

        idStyle:['港澳居民来往内地通行证','台湾居民来往内地通行证','护照','临时身份证'],

        file:'',

        source:'',

        city:'',//国籍

        faceImg:'../../../static/icon/wages/jx_passport_face.png',

        backImg:'../../../static/icon/wages/jx_passport_opposite.png',

        modal: {

            isShow:false,// 图文弹框是否显示


        },

        idNumberAll:'',//身份证号

        cardName:''//文案



    },
    onLoad: function () {

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

                    that.setData({


                        isVerify : res.data.data.isVerify,

                        source:res.data.data.source,

                        userName:res.data.data.userName,

                        idNumberAll:res.data.data.idNumberAll,

                        idType:res.data.data.idType,

                        city:res.data.data.nationality,


                    })


                    if(that.data.idType=='1'){

                        that.setData({

                            idNumberAll:'',
                        })
                    }


                    if(that.data.idType == '2'){

                        that.setData({

                            cardChoose : '护照',

                            index:'2'
                        })

                    }
                    else if(that.data.idType == '3'){

                        that.setData({

                            cardChoose : '港澳居民来往内地通行证',

                            index:'0'
                        })

                    }
                    else if(that.data.idType == '4'){

                        that.setData({

                            cardChoose : '台湾居民来往大陆通行证',

                            index:'1'
                        })

                    }
                    else if(that.data.idType == '5'){

                        that.setData({

                            cardChoose : '临时身份证',

                            index:'3'
                        })

                    }


                }

            },

            fail: function (res) {

                console.log(res)
            }

        })




    },

    onShow:function () {

        var that = this;

        var _city = wx.getStorageSync('chooseCity');

        console.log('国家'+wx.getStorageSync('nationality'))

        console.log('选择后的国家'+ _city)


        that.setData({

            city: wx.getStorageSync('nationality'),


        });

        //城市存储
        if (_city) {


            that.setData({

                city: _city


            });
        }

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


                                wx.showLoading({
                                    title:'图片上传中',
                                    mask:true,

                                })


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


                                            if(JSON.parse(res.data).code=='0000'){


                                                that.setData({

                                                    faceImg:JSON.parse(res.data).data.url

                                                })

                                                setTimeout(function () {

                                                    wx.showToast({
                                                        title: '上传成功',
                                                        icon:'none',
                                                        mask: true,
                                                    })


                                                },10)


                                            }




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


                                wx.showLoading({
                                    title:'图片上传中',
                                    mask:true,

                                })

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

                                                setTimeout(function () {

                                                    wx.showToast({
                                                        title: '上传成功',
                                                        icon:'none',
                                                        mask: true,
                                                    })

                                                },10)



                                            }




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


                                                setTimeout(function () {
                                                    wx.showToast({
                                                        title: '上传成功',
                                                        icon: 'none',
                                                        mask: true,
                                                    })
                                                },100)
                                            }




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

                                                setTimeout(function () {

                                                    wx.showToast({
                                                        title: '上传成功',
                                                        icon: 'none',
                                                        mask: true,
                                                    })

                                                },100)


                                            }




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

        console.log(that.data.idType)

        if(that.data.idType=='2'){


            that.setData({

                modal: {

                    isShow: true,// 图文弹框是否显示

                    title:'证件示例',// 标题

                    ok:'确定',// 确定按钮文本

                    src:'../../../static/icon/wages/jx_example_password.jpg',// 护照

                }

            })



        }

        else if(that.data.idType=='4'){

            that.setData({

                modal: {

                    isShow: true,// 图文弹框是否显示

                    title:'证件示例',// 标题

                    ok:'确定',// 确定按钮文本

                    src:'../../../static/icon/wages/jx_example_paper.jpg',// 台湾

                }

            })





        }

        else if(that.data.idType=='1'||that.data.idType=='3'){

            that.setData({

                modal: {

                    isShow: true,// 图文弹框是否显示

                    title:'证件示例',// 标题

                    ok:'确定',// 确定按钮文本

                    src:'../../../static/icon/wages/jx_example_hk.jpg',// 香港

                }

            })


        }

        else if(that.data.idType=='5'){

            console.log('临时')

            that.setData({

                modal: {

                    isShow: true,// 图文弹框是否显示

                    title:'证件示例',// 标题

                    ok:'确定',// 确定按钮文本

                    src:'../../../static/icon/wages/jx_example_linshi_face.jpg',// 临时

                }

            })


        }

    },

    showBackTipFn:function () {

        var that = this;

        console.log(that.data.idType)



        if(that.data.idType=='1'||that.data.idType=='3'){

            that.setData({

                modal: {

                    isShow: true,// 图文弹框是否显示

                    title:'证件示例',// 标题

                    ok:'确定',// 确定按钮文本

                    src:'../../../static/icon/wages/jx_example_hk_back.jpg',// 图片地址，必填，如果没有图片，请直接使用wx.showModal

                }

            })


        }

        else if(that.data.idType=='4'){

            console.log('台湾')

            that.setData({

                modal: {

                    isShow: true,// 图文弹框是否显示

                    title:'证件示例',// 标题

                    ok:'确定',// 确定按钮文本

                    src:'../../../static/icon/wages/jx_example_back.jpg',// 台湾

                }

            })



        }




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

        console.log(that.data.idType)

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var check = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

        var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

        (that.data.idType == 1)&&(that.data.idType = 3);

        if(that.data.idType == 3){
            //港澳
            check = /^[a-z0-9A-Z]{9}$/;
        }
        else if(that.data.idType == 4){
            //台湾
            check = /^[a-z0-9A-Z]{8}$/;
        }
        else if(that.data.idType == 2){

            //护照
            check = /^[a-z0-9A-Z]{6,20}$/;
        }

        else if(that.data.idType == 5){

            check = idcardReg
        }


        if(!that.data.userName){

            wx.showToast({
                title: '请输入姓名',
                icon: 'none',
                mask:true,

            })

        }
        else if(!that.data.idNumberAll){

            wx.showToast({
                title: '请输入证件号码',
                icon: 'none',
                mask:true,

            })



        }
        else if(!check.test(that.data.idNumberAll)){

            wx.showToast({
                title: '请输入正确的证件号码',
                icon: 'none',
                mask:true,

            })


        }

        else if(that.data.faceImg=='../../../static/icon/wages/jx_passport_face.png'){

            wx.showToast({
                title: '请上传证件照正面',
                icon: 'none',
                mask:true,

            })

        }

        else if(that.data.backImg=='../../../static/icon/wages/jx_passport_opposite.png'&&(that.data.idType!='2'&&that.data.idType!='5')){

            wx.showToast({
                title: '请上传证件照反面',
                icon: 'none',
                mask:true,
            })

        }


        else {


            if(that.data.backImg=='../../../static/icon/wages/jx_passport_opposite.png'){

                var dataAll ={

                    userName:that.data.userName,

                    idNumber:that.data.idNumberAll,

                    idType:that.data.idType,

                    nationality:that.data.city,

                    urls:[that.data.faceImg],



                }

            }

            else {

                var dataAll ={

                    userName:that.data.userName,

                    idNumber:that.data.idNumberAll,

                    idType:that.data.idType,

                    nationality:that.data.city,

                    urls:[that.data.faceImg,that.data.backImg],



                }

            }



            /**
             * 接口：实名认证
             * 请求方式：POST
             * 接口：/user/center/userverify
             * 入参：userName,idNumber,idType,nationality,urls
             **/
            wx.request({

                url:app.globalData.URL + userVerify,

                method: 'POST',

                data: json2FormFn.json2Form(dataAll),

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


                        if(res.data.code=='0000'){

                            wx.showToast({
                                title:res.data.msg,
                                icon: 'none',
                                mask:true,
                            })


                            wx.navigateTo({
                                url: '../../../pages/user/upload_success/upload_success'
                            })





                        }

                        else if(res.data.code=='-1'){

                            wx.showToast({
                                title:res.data.msg,
                                icon: 'none',
                                mask:true,
                                duration:3500,

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

    chooseCityPageFn:function () {

        wx.navigateTo({

            url:'../choose_nationality/choose_nationality'

        });

    },

    nameFn:function (e) {

        var that = this;

        that.setData({

            userName: e.detail.value
        });

    },

    idFn:function (e) {

        var that = this;

        that.setData({

            idNumberAll: e.detail.value.replace(/\s+/g, '')


        });



    },

    bindPickerChange: function(e) {

        var that = this;

        that.setData({

            cardChoose:that.data.idStyle[e.detail.value]

        });


        //根据选的证件类型返回对应的参数

        if(e.detail.value=='0'){

            //港澳通行证 idType：3
            that.setData({

                idType:'3'


            });


        }

        else if(e.detail.value=='1'){

            //台湾通行证 idType：4
            that.setData({

                idType:'4'


            });
            //console.log('pick的台湾：'+that.data.idType)

        }

        else if(e.detail.value=='2'){

            //护照 idType：2
            that.setData({

                idType:'2'


            });
            //console.log('pick的护照：'+that.data.idType)


        }

        else if(e.detail.value=='3'){
            //临时身份证
            that.setData({

                idType:'5'


            });

        }


        console.log('pick的：'+that.data.idType)



    },


})
