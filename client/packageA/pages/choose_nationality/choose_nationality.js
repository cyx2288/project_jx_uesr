const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const countryUrl ='/user/country/getcountry';//查询国籍

Page({


    data: {

        countryCityList:[{

            initial:'',

            list:[]

        }],

        inputShowed: false,

        inputVal: '',

        searchInitial:'',//首字母

        noCity:true,//不显示





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

            data:json2FormFn.json2Form({

                countryName:that.data.searchInitial

            }),

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data.data);

                console.log(res.data.data.firstLetter.length==0)

              if(res.data.data.firstLetter.length==0){

                    that.setData({

                        noCity:false,//不显示
                    })

                }

                else {

                  that.setData({

                      noCity:true,//不显示
                  })
              }



                //code3003返回方法
                app.globalData.repeat(res.data.code, res.data.msg);

                app.globalData.token(res.header.Authorization)

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

                    var _list = res.data.data;//得到的数据

                    //console.log(_list)

                    var countryListData=[];//导进去的对象



                    //对数组的属性进行循环
                    for(var x in _list){


                        //字母和热门城市进行渲染 其他不要渲染

                        if(x.length==1 || (x=='hotCountry'&&!that.data.searchInitial)){


                            //单个小数据
                            var aDataList = {

                                initial: '',//首字母

                                list: []//城市名字

                            };


                            //首字母是hotCountry的改成热门城市 不然还是按abcd渲染

                            if(x=='hotCountry'){

                                aDataList.initial='热门城市';

                            }

                            else {

                                aDataList.initial=x;

                            }

                            //循环每个数组的value

                            for(var z=0;z<_list[x].length;z++){

                                //中文名和英文名建立数组
                                var _nameList={

                                    name:'',

                                    enName:'',

                                }

                                //吧每个value代进去
                                   _nameList.name = _list[x][z].shortName;

                                    _nameList.enName = _list[x][z].englishName;


                                //把中文名和英文的放到新的数组
                                aDataList.list.push(_nameList)

                            }

                            //把小数组放到大的模型里面
                            countryListData.push(aDataList)

                        }


                    }

                    that.setData({

                        countryCityList:countryListData

                    })

                    //console.log(that.data.countryCityList)


                }


            },


            fail: function (res) {

                console.log(res)

            }

        })




    },

    chooseCityFn:function (e) {

        console.log(e.currentTarget.dataset.name)

        wx.setStorageSync('chooseCity',e.currentTarget.dataset.name);

        wx.navigateBack({

            delta: 1

        })


    },

    showInput: function () {

        this.setData({


            inputShowed: true
        });


    },

    hideInput: function () {

        var that = this;

        console.log('取消')

        that.setData({

            inputVal: '',
            searchInitial:'',//首字母
            inputShowed: false

        });

        that.onShow();

        setTimeout(function () {

            wx.navigateBack({
                delta: 1
            })

        },500)





    },

    clearInput: function () {
        this.setData({
            inputVal: '',
            searchInitial:'',//首字母
        });
        this.onShow();
    },

    inputTyping: function (e) {

        this.setData({
            inputVal: e.detail.value
        });

    },

    inputValueGain:function (e) {

        var that = this;

        var reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;


        var regCh = /[\u4e00-\u9fa5]/g;

        //console.log(e.detail.value.match(regCh))

        that.setData({

            searchInitial:e.detail.value

        })



        that.onShow()

    },



})