const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const countryUrl ='/user/country/getcountry';//查询国籍

Page({


    data: {

        countryList:[{

            value:'',

            list:[{

                name:'',

                enName:''
            }]

        }],





    },


    onShow:function () {

        var that = this;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：查询国籍
         * 请求方式：POST
         * 接口：/user/country/getcountry
         * 入参：countryName
         * */
        wx.request({

            url: app.globalData.URL + countryUrl,

            method: 'POST',

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                var countryListData=[];//导进去的对象

                console.log(res.data.data);

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

                else {

                    var countryList = res.data.data

                    console.log(countryList)

                    for(var ii in countryList) {

                        var onData = {

                            value: '',

                            list: []

                        };

                        if (ii.length == 1||ii=='hotCountry') {

                            if(ii=='hotCountry'){

                                onData.value='热门城市'

                            }

                            else {

                                onData.value = ii;

                            }

                            for (var jj = 0; jj < countryList[ii].length; jj++) {

                                onData.list.push({

                                    name: countryList[ii][jj].shortName,

                                    enName: countryList[ii][jj].englishName

                                })

                            }

                            countryListData.push(onData)

                        }

                        that.setData({

                            countryList: countryListData,
                        })

                    }


                }


            },


            fail: function (res) {

                console.log(res)

            }

        })




    },

})