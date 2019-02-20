const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userVerify ='/user/center/orc/commit/userverify';//实名认证

const mineUrl ='/user/center/usercenter';//用户中心



Page({


    data: {


        userName:'',//姓名

        idNumber:'',//身份证

        sex:'',//性别

        sexIndex:'',//性别0/1

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

            changeBirthForm:that.timeDefaultChange(personInformation.birth),//YY-MM—DD

            issuingTime : that.dateChange(personInformation.issuingDate),

            expiryTime : that.dateChange(personInformation.expiryDate),

            riskType : personInformation.riskType,

            extTradeNo : personInformation.extTradeNo,

            extTradeNoB : personInformation.extTradeNoB,

            issuingAuthority :personInformation.issuingAuthority,

            urls : wx.getStorageSync('urls')


        });

        console.log(that.data.changeBirthForm)


    },

    submitVerifyFn:function () {

        var that = this;

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        if(!that.data.userName){

            wx.showToast({
                title: '请输入姓名',
                icon:'none',
                mask: true
            })

        }else if(!that.data.nation){

            wx.showToast({
                title: '请输入民族',
                icon:'none',
                mask: true
            })

        }else if(!that.data.address){

            wx.showToast({
                title: '请输入地址',
                icon:'none',
                mask: true
            })

        }

        else {

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

                    else if(res.data.code=='0000'){

                        if(res.data.data.source == 0 && res.data.data.userName != that.data.userName){

                            wx.showToast({

                                title: '请使用姓名为' + res.data.data.userName + '的证件认证，核对一致再进行实名认证',
                                icon:'none',
                                mask: true

                            });

                        }else {

                            wx.showLoading({
                                title: '实名认证中',
                                mask: true

                            })

                            var jx_sid = wx.getStorageSync('jxsid');

                            var Authorization = wx.getStorageSync('Authorization');

                            /**
                             * 接口：提交认证
                             * 请求方式：POST
                             * 接口：/user/center/orc/commit/userverify
                             * 入参：urls
                             **/

                            wx.request({

                                url: app.globalData.URL + userVerify,

                                method: 'POST',

                                header: {
                                    'content-type': 'application/x-www-form-urlencoded', // post请求

                                    'jxsid': jx_sid,

                                    'Authorization': Authorization

                                },

                                data:json2FormFn.json2Form({

                                    name: that.data.userName,

                                    idNumber: that.data.idNumber,

                                    idType: 1,

                                    urls: that.data.urls,

                                    sex: that.data.sex,

                                    nation: that.data.nation,

                                    birth: that.data.birth,

                                    address: that.data.address,

                                    issuingTime: that.data.issuingTime,

                                    expiryTime: that.data.expiryTime,

                                    riskType: that.data.riskType,

                                    extTradeNo: that.data.extTradeNo,

                                    extTradeNoB: that.data.extTradeNoB,

                                    issuingAuthority: that.data.issuingAuthority

                                }),

                                success: function (res) {

                                    console.log(res.data);

                                    wx.hideLoading()

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

                                    else if (res.data.code == '3004') {

                                        var Authorization = res.data.token.access_token;//Authorization数据

                                        wx.setStorageSync('Authorization', Authorization);

                                    }

                                    else if (res.data.code == '0000') {

                                        wx.showToast({
                                            title: '实名认证成功',
                                            icon:'none',
                                            mask: true
                                        })

                                        wx.navigateBack({

                                            delta: 3,

                                        })

                                    }

                                    else if(res.data.code == '-1'){

                                        wx.showToast({

                                            title: res.data.msg,
                                            icon:'none',
                                            mask: true

                                        });

                                    }else{

                                        wx.showToast({

                                            title: '实名认证失败',
                                            icon:'none',
                                            mask: true

                                        });

                                    }

                                }

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

        console.log(that.data.address)
    },

    sexChange: function(e) {

        var that = this;

        //console.log('picker发送选择改变，携带值为', e.detail.value)

        //console.log(that.data.idStyle[e.detail.value]);

        that.setData({

            sex:that.data.sexArray[e.detail.value],

            sexIndex:e.detail.value


        });






    },

    bindDateChange:function (e) {

        var that= this

        that.setData({
            birth:that.showPickerDate(e.detail.value)
        })

        console.log(e.detail.value)

    },

    /**
     * 时间过滤1
     * 列如19920218为1992年02月18日
     */
    birthChange: function (oldBirth) {

        var birth = oldBirth.split('');

        birth = '' + birth[0] + birth[1]+birth[2]+birth[3]+'年'+birth[4]+birth[5]+'月'+birth[6]+birth[7]+'日';

        return birth;

    },
    /**
     * 时间过滤2
     * 列如19920218为1992-02-18
     */
    timeDefaultChange: function (oldTime) {

        var time = oldTime.split('');

        time = '' + time[0] + time[1]+time[2]+time[3]+'-'+time[4]+time[5]+'-'+time[6]+time[7];

        return time;

    },
    /**
     * 时间过滤3
     * 列如19920218为1992-02-18
     */
    dateChange: function (date) {

        var newDate = new Date(date);

        var year = newDate.getFullYear();

        var month = newDate.getMonth() + 1;

        var day = newDate.getDate();

        (month < 10) && (month = '0' + month);

        (day < 10) && (day = '0' + day);

        return '' + year + '-' + month + '-' + day;

    },
    /**
     * 时间过滤4
     * 列如1992-02-18为1992年02月18日
     */
    showPickerDate:function (pickerDate) {
        var year = pickerDate.split('-')[0];
        var month = pickerDate.split('-')[1];
        var date = pickerDate.split('-')[2];
        var newDate = year+'年'+month+'月'+date+'日';
        return newDate

    }

})