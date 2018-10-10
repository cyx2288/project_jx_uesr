/**
 * Created by ZHUANGYI on 2018/5/14.
 */


const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const bankCardJson = require('../../../static/libs/script/bankCardJson.js');//银行卡

const addBankUrl = '/user/bank/addbankcardinfo';

const getBankName = '/user/bank/getbankname';

const getCity = '/user/bank/citys';

const getProvinces = '/user/bank/provinces';

Page({

    data: {

        bankNo: '',//银行卡号

        bankName: '',//银行名称&所属银行

        bankBranch: '',//卡户支行

        province: '请选择开户地区',//开户省份

        city: '',//开户城市

        userName: '',//用户姓名

        thisBankSort: '',//卡类

        provinceId: '',//省唯一id

        cityArr: [],//城市数组

        provinceArr: [],//区域数组

        countries: [[], []],//城市数组

        cityData: [],//存储ajax后得到的数组

        provinceData: [],//存储ajax后得到的数组

        /*multiArray: [

            ['中国银行', '农业银行', '工商银行', '建设银行', '交通银行', '邮政储蓄银行', '广发银行', '浦东发展银行', '浙江泰隆商业银行', '招商银行', '招商银行', '民生银行', '兴业银行', '中信银行', '华夏银行', '光大银行', '北京银行', '上海银行', '天津银行', '大连银行', '杭州银行', '宁波银行', '厦门银行', '广州银行', '平安银行', '浙商银行', '上海农商银行', '重庆银行', '江苏银行', '北京农村商业银行', '济宁银行', '台州银行', '深圳发展银行', '成都商业银行', '徽商银行'],

            ['储蓄卡']

            //['储蓄卡', '信用卡']

        ],*///银行卡

        cardType: '',//卡类型

        cardTypeNum: '',

        bankIcon: '../../../static/icon/wages/bank_orc.png'


    },

    onShow: function () {

        var that = this;

        var _isVerify = wx.getStorageSync('isVerify');

        var _userName = wx.getStorageSync('userName');


        wx.showNavigationBarLoading();

        setTimeout(function () {

            wx.hideNavigationBarLoading()

        },500);



        that.setData({

            userName: _userName,

        });


        //获取省的方法
        that.loadCity();

        //获取市的方法
        that.loadProvince(1);


    },

    //获取省
    loadCity: function () {

        var that = this;


        var thatGetProvince = app.globalData.URL + getProvinces;


        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：获取省地址
         * 请求方式：GET
         * 接口：/user/bank/provinces
         * 入参：null
         * */
        wx.request({

            url: thatGetProvince,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code, res.data.msg);

                if (res.data.code == '3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url: '../../common/signin/signin'
                        })

                    }, 1500)

/*                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success: function () {



                        }

                    })*/

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else {


                    var list = res.data.data;

                    that.setData({

                        cityData: res.data.data,

                    });

                    var citylistArr = [];

                    //遍历数组 将城市名遍历出来组成新的数组

                    for (var i = 0; i < list.length; i++) {


                        var cityList = res.data.data[i].addrName;

                        //组成数组
                        citylistArr.push(cityList)

                    }

                    //储存城市
                    that.setData({

                        cityArr: citylistArr

                    });


                    that.setData({

                        countries: [

                            that.data.cityArr,

                            that.data.provinceArr

                        ]

                    })

                }


            },


            fail: function (res) {

                console.log(res)

            }

        })


    },

    //获取市
    loadProvince: function (thisProvinceId) {

        var that = this;


        var thisGetCity = app.globalData.URL + getCity;


        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：获取市地址
         * 请求方式：GET
         * 接口：/user/bank/citys
         * 入参：provinceId
         * */
        wx.request({

            url: thisGetCity,

            method: 'GET',

            data: {

                provinceId: thisProvinceId//省市唯一地址

            },

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code, res.data.msg);

                if (res.data.code == '3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url: '../../common/signin/signin'
                        })

                    }, 1500)

                    /*                    wx.showToast({
                     title: res.data.msg,
                     icon: 'none',
                     duration: 1500,
                     success: function () {



                     }

                     })*/

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }
                else {

                    var list = res.data.data;

                    var provincelistArr = [];

                    for (var i = 0; i < list.length; i++) {

                        var provinceList = res.data.data[i].addrName;

                        provincelistArr.push(provinceList)

                    }


                    //储存省份
                    that.setData({

                        provinceArr: provincelistArr

                    });

                    that.setData({

                        countries: [

                            that.data.cityArr,

                            that.data.provinceArr

                        ]

                    });


                }


            },


            fail: function (res) {

                console.log(res)

            }

        })


    },

    //点击添加银行卡号
    addBankFn: function () {

        var thisAddBankUrl = app.globalData.URL + addBankUrl;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var regNeg = /^([1-9]\d{14,18})$/;


        /**
         * 接口：添加用户银行卡信息
         * 请求方式：POST
         * 接口：/user/bank/addbankcardinfo
         * 入参：bankNo，openBank，bankName，bankBranch，province，city
         * */

        //判断银行卡是否为空
        if (!that.data.bankNo || that.data.bankNo.length < 14) {


            wx.showToast({

                title: '请填写正确的银行卡号',
                icon: 'none',
                mask:true,

            })


        }
        //判断卡号是否有误
        else if (!regNeg.test(that.data.bankNo)) {

            wx.showToast({

                title: '请填写正确的银行卡号',

                icon: 'none',
                mask:true,

            })

        }

        //判断是否写了所属银行
        else if (!that.data.bankName || that.data.bankName == '不支持该银行') {

            wx.showToast({

                title: '不支持该银行卡',
                icon: 'none',
                mask:true,

            })
        }

        //判断是否写了开户地区

        else if (!that.data.city || !that.data.province) {


            wx.showToast({

                title: '请选择开户地区',
                icon: 'none',
                mask:true,

            })


        }


        else {


            wx.request({

                url: thisAddBankUrl,

                method: 'POST',

                data: json2FormFn.json2Form({

                    bankNo: that.data.bankNo,//银行卡号

                    bankName: that.data.bankName,//银行名称&所属银行

                    bankBranch: that.data.bankBranch,//卡户支行

                    province: that.data.city,//开户省份

                    city: that.data.province,//开户城市

                    cardType: that.data.cardTypeNum,//卡类型

                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    //银行卡添加成功 toast提示成功



                    //code3003返回方法
                    app.globalData.repeat(res.data.code, res.data.msg);

                    if (res.data.code == '3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url: '../../common/signin/signin'
                            })

                        }, 1500)


                        return false


                    }
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        return false
                    }

                    else {


                        if (res.data.code == '0000') {

                            wx.showToast({

                                title: res.data.msg,
                                icon: 'none',
                                mask:true,

                            })

                            setTimeout(function () {


                                wx.navigateBack({

                                    delta: 1

                                })

                            }, 2000)


                        }


                        else {

                            wx.showToast({

                                title: res.data.msg,
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


    //监听银行卡号
    bankNoFn: function (e) {

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        that.setData({

            bankNo: e.detail.value,

        });


        //银行卡输入十位后并且黏贴后执行方法

        if (that.data.bankNo.length == 10 || that.data.bankNo.length >= 15) {

            that.getBankNoFn(e)

        }

        //不满足10位的话数据初始化

        else if (that.data.bankNo.length < 10) {

            that.setData({

                bankName: '',

                cardType: '',

                bankIcon: '../../../static/icon/wages/bank_orc.png'
            })

        }


    },

    //判断卡号
    getBankNoFn: function (e) {

        var thisGetBankName = app.globalData.URL + getBankName;

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        /**
         * 接口：卡号识别所属银行
         * 请求方式：POST
         * 接口：/user/bank/getbankname
         * 入参：null
         * */

        wx.request({

            url: thisGetBankName,

            method: 'POST',

            data: {

                bankNo: e.detail.value,

            },

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

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
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    return false
                }

                else {

                    that.setData({

                        bankName: res.data.data.bankName,

                        cardTypeNum: res.data.data.type,


                    })


                    if (JSON.stringify(res.data.data) == '{}') {

                        that.setData({

                            bankName: '不支持该银行',

                            cardTypeNum: '',

                            bankIcon: '../../../static/icon/wages/bank_no.png'


                        })


                    }

                    else {

                        if (res.data.data.type == '1') {

                            that.setData({

                                cardType: '储蓄卡'

                            })


                        }

                        else if (res.data.data.type == '2') {

                            that.setData({

                                cardType: '信用卡'

                            })
                        }

                        var bankImgList = bankCardJson.bankCardJson


                        //var bankImgList = that.data.addBankArray;

                        //遍历json中的银行卡名称找到对应的银行卡图标

                        for (var x in bankImgList) {

                            if (bankImgList[x].name == that.data.bankName) {


                                that.setData({

                                    bankIcon: bankImgList[x].img

                                })

                            }

                        }


                    }

                }


            },


            fail: function (res) {
                console.log(res)
            }

        })


    },

    //通过卡号监听开户行
    bindMultiPickerChange: function (e) {

        var that = this;

        // console.log(e.detail.value[0])
        //
        //  console.log(e.detail.value[1])
        //
        //  console.log(that.data.multiArray[0])
        //
        //  console.log(that.data.multiArray[1])
        /*
         console.log(that.data.multiArray[0][e.detail.value[0]])*/

        console.log(that.data.multiArray[1][e.detail.value[1]])

        that.setData({

            bankName: that.data.multiArray[0][e.detail.value[0]],

            cardType: that.data.multiArray[1][e.detail.value[1]]


        })


    },

    bindMultiPickerColumnChange: function (e) {

        //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

    },

    bindRegionColumnChange: function (e) {

        var that = this;

        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

        //判断是否选择的是第一列

        if (e.detail.column == 0) {

            //获取选中的城市的uniqueId

            var whichCityId = that.data.cityData[e.detail.value].uniqueId;

            that.loadProvince(whichCityId)

        }


    },

    //确定后值的回显
    bindRegionChange: function (e) {

        console.log('picker发送选择改变，携带值为', e.detail.value)

        var that = this;

        /*   console.log(e.detail.value[0]);

         console.log(e.detail.value[1])

         console.log(that.data.cityArr);

         console.log(that.data.provinceArr)

         console.log(that.data.cityArr[e.detail.value[0]]);

         console.log(that.data.provinceArr[e.detail.value[1]])*/


        that.setData({

            city: that.data.cityArr[e.detail.value[0]],//开户城市

            province: that.data.provinceArr[e.detail.value[1]],//开户省份


        })


    },

    //获取开户支行
    getBankBranchFn: function (e) {

        var that = this;

        that.setData({

            openBank: e.detail.value,

            bankBranch: e.detail.value,


        })

    }


})
