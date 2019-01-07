const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userVerify ='/user/center/verifyuserinfo';//实名认证

const mineUrl ='/user/center/usercenter';//用户中心

const payeeUrl = '/record/selecthistoricalpayee';//查询历史收款人


Page({


    data: {


        userName:'',//姓名

        idNumber:'',//身份证

        sex:'',//性别

        sexArray:["男","女"],

        nation:'',//国籍

        birth:'',//出生年月

        address:'',//地址

        urls: '',//身份证链接

        issuingTime: '',//签发时间

        expiryTime: '',//有效日期

        riskType: '',//身份类型

        extTradeNoB: '',//交易号（反面流水交易号）

        extTradeNo: '',//交易号

        issuingAuthority: '', //签发机关

        changeBirthForm:'',//YY-MM—DD


    },

    onShow:function () {


        var that = this;

        var personInformation = wx.getStorageSync('personInformation')

        console.log(personInformation)

        that.setData({

            userName:personInformation.name,//姓名

            idNumber:personInformation.idNumber,//身份证

            sex:personInformation.sex,//性别

            nation:personInformation.nation,//国籍

            birth:that.birthChange(personInformation.birth),//出生年月

            address:personInformation.address,//地址

            changeBirthForm:that.timeDefaultChange(personInformation.birth)//YY-MM—DD


        });

        console.log(that.data.changeBirthForm)


    },

    submitVerifyFn:function () {

        var thisUserVerify = app.globalData.URL + userVerify;

        var thisMineurl = app.globalData.URL+ mineUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');


        var Authorization = wx.getStorageSync('Authorization');

        console.log(Authorization)

        //存指定的页面
        var thisPayPwd =  wx.getStorageSync('isPayPwd');


        var check = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;


        //港澳
        var checkMainLandHK = /^[a-z0-9A-Z]{11}$/;

        //台湾
        var checkMainLandTW =/^[a-z0-9A-Z]{8}$/;

        //护照
        var checkPassPort = /^[a-zA-Z0-9]{6,20}$/;



            if(!that.data.userName){

            wx.showToast({

                title: '请输入姓名',
                icon: 'none',
                mask:true,

            })



        }

            else if(!that.data.idNumber){

            wx.showToast({

                title: '请输入证件号码',
                icon: 'none',
                mask:true,

            })


        }

            else if(that.data.idType=='1'&&!check.test(that.data.idNumber)){


                wx.showToast({

                    title: '身份证号格式错误',
                    icon: 'none',
                    mask:true,

                })



            }

             else {


            if(that.data.cardChoose=='身份证'){


                wx.showToast({

                    title: '认证中',
                    icon: 'loading',
                    mask:true,

                })



                /**
                 * 接口：实名认证
                 * 请求方式：POST
                 * 接口：/user/center/userverify
                 * 入参：userName,idNumber,idType,nationality,urls
                 **/
                wx.request({

                    url:thisUserVerify,

                    method: 'POST',

                    data: json2FormFn.json2Form({

                        userName:that.data.userName,

                        idNumber:that.data.idNumber,

                        idType:that.data.idType,

                        nationality:that.data.city,


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

                            var _code = res.data.code;

                            //看是不是从支付设置的未认证页面过来
                            var _paySettingAuthentication = wx.getStorageSync('paySettingAuthentication');

                            var _personCenter = wx.getStorageSync('personCenter');

                            var _hrefId = wx.getStorageSync('hrefId');

                            var jx_sid = wx.getStorageSync('jxsid');

                            var Authorization = wx.getStorageSync('Authorization');

                            console.log('8是转账'+_hrefId)

                            console.log('1是个人中心'+_personCenter)


                            if (_code == '0000') {

                                //存储实名认证状态
                                wx.setStorageSync('isVerify', '1');

                                //存储有没有认证操作成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
                                wx.setStorageSync('successVerify','true');

                                //认证成功后调用个人中心接口

                                /**
                                 * 接口：用户中心
                                 * 请求方式：POST
                                 * 接口：/user/center/usercenter
                                 * 入参：mobile
                                 **/
                                wx.request({

                                    url: thisMineurl,

                                    method: 'POST',

                                    header: {
                                        'content-type': 'application/x-www-form-urlencoded', // post请求

                                        'jxsid': jx_sid,

                                        'Authorization': Authorization

                                    },

                                    success: function (res) {

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

                                            console.log(res.data);

                                            wx.setStorageSync('userName', res.data.data.userName);

                                        }


                                    },

                                    fail: function (res) {

                                        console.log(res)
                                    }

                                })


                                setTimeout(function () {

                                    wx.showToast({

                                        title: '认证成功',
                                        icon: 'success',
                                        mask:true,

                                    })

                                }, 500)


                                if(_hrefId=='1'){

                                    console.log('从个人中心');

                                    setTimeout(function () {

                                        wx.navigateBack({

                                            delta: 1,

                                        })

                                        that.onLoad();


                                    },1000)


                                }

                                else if(_hrefId=='4'||_hrefId=='8'){

                                    setTimeout(function () {

                                        wx.navigateBack({

                                            delta: 1,

                                        })

                                    },1000)

                                }

                                else if(_hrefId=='10'){

                                    console.log('从转账');

                                    setTimeout(function () {

                                        wx.redirectTo({

                                            url:'../girokonto/girokonto'

                                        })

                                    },1000)



                                }

                                else if(_hrefId=='6'){

                                    console.log('从京东');


                                    setTimeout(function () {

                                        wx.switchTab({

                                            url:'../../discovery/discovery/discovery'
                                        })

                                    },1000)




                                }


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
            else if(that.data.cardChoose=='港澳居民来往内地通行证'){

                //存身份证号
                wx.setStorageSync('NextIdNumber',that.data.idNumber);

                //存姓名
                wx.setStorageSync('NextUserName',that.data.userName);

                //存idType
                wx.setStorageSync('NextIdType',that.data.idType);

                //存国籍
                wx.setStorageSync('NextNationality',that.data.city);

                console.log(checkMainLandHK.test(that.data.idNumber))

                if(!checkMainLandHK.test(that.data.idNumber)){


                    wx.showToast({

                        title: '港澳通行证号格式错误',
                        icon: 'none',
                        mask:true,

                    })


                }

                else {


                    wx.navigateTo({

                        url: '../mainland_certification/mainland'

                    })


                }




            }

            else if(that.data.cardChoose=='台湾居民来往内地通行证'){

                //存身份证号
                wx.setStorageSync('NextIdNumber',that.data.idNumber);

                //存姓名
                wx.setStorageSync('NextUserName',that.data.userName);

                //存idType
                wx.setStorageSync('NextIdType',that.data.idType);

                //存国籍
                wx.setStorageSync('NextNationality',that.data.city);

                console.log(checkMainLandTW.test(that.data.idNumber));


                if(!checkMainLandTW.test(that.data.idNumber)){

                    wx.showToast({

                        title: '台湾通行证号格式错误',
                        icon: 'none',
                        mask:true,

                    })


                }

                else {


                    wx.navigateTo({

                        url: '../mainland_certification/mainland'

                    })


                }


            }

            else {

                //存身份证号
                wx.setStorageSync('NextIdNumber',that.data.idNumber);

                //存姓名
                wx.setStorageSync('NextUserName',that.data.userName);

                //存idType
                wx.setStorageSync('NextIdType',that.data.idType);

                //存国籍
                wx.setStorageSync('NextNationality',that.data.city);

                if(!checkPassPort.test(that.data.idNumber)){

                    wx.showToast({

                        title: '护照号格式错误',
                        icon: 'none',
                        mask:true,

                    })


                }

                else {

                    wx.navigateTo({

                        url: '../passport_certification/passport'

                    })

                }













            }






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

    nationFn:function (e) {

        var that = this;

        that.setData({

            nation: e.detail.value
        });

    },

    addressFn:function (e) {

        var that = this;

        that.setData({

            address: e.detail.value
        });
    },

    sexChange: function(e) {

        var that = this;

        //console.log('picker发送选择改变，携带值为', e.detail.value)

        //console.log(that.data.idStyle[e.detail.value]);

        that.setData({

            sex:that.data.sexArray[e.detail.value]


        });






    },

    bindDateChange:function (e) {

        var that= this

        that.setData({
            birth:e.detail.value
        })

    },

    //更改生日格式
    birthChange: function (oldBirth) {

        var birth = oldBirth.split('');

        birth = '' + birth[0] + birth[1]+birth[2]+birth[3]+'年'+birth[4]+birth[5]+'月'+birth[6]+birth[7]+'日';

        return birth;

    },

    timeDefaultChange: function (oldTime) {

        var time = oldTime.split('');

        time = '' + time[0] + time[1]+time[2]+time[3]+'-'+time[4]+time[5]+'-'+time[6]+time[7];

        return time;

    },


    //日期格式更改
    dateChange: function (date) {

        var newDate = new Date(date);

        var year = newDate.getFullYear();

        var month = newDate.getMonth() + 1;

        var day = newDate.getDate();

        (month < 10) && (month = '0' + month);

        (day < 10) && (day = '0' + day);

        return '' + year + '-' + month + '-' + day;

    },


})