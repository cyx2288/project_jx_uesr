const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const userVerify ='/user/center/verifyuserinfo';//实名认证

const mineUrl ='/user/center/usercenter';//用户中心

const payeeUrl = '/record/selecthistoricalpayee';//查询历史收款人


Page({


    data: {


        userName:'',//姓名

        idNumber:'',//身份证

        isVerify:'',//是否认证

        hasUserName:true,//有没有用户姓名

        city:'',//国籍

        cardChoose:'',//证件类型

        index:0,

        idType:'1',//证件类型 1-身份证 2-护照 3-港澳通行证 4-台湾通行证

        idStyle:['身份证','港澳居民来往内地通行证','台湾居民来往内地通行证','护照']

    },


    onLoad:function () {


        console.log('加载')

        var that = this;

        var thisUserName = wx.getStorageSync('userName');

        var thisIdNumber = wx.getStorageSync('idNumber');

        var  _isVerify= wx.getStorageSync('isVerify');

        var _nationality =  wx.getStorageSync('nationality');

        var _source = wx.getStorageSync('source');





        wx.removeStorageSync('chooseCity');




        console.log(thisUserName);

        console.log('显示0和1'+_source);

        console.log('身份证'+thisIdNumber)


        //console.log(thisIdNumber)

        //console.log('国家'+wx.getStorageSync('nationality'))


        /*console.log('国家'+that.data.city)*/

        /* console.log('是否认证'+_isVerify);

        console.log('名字'+thisUserName)

        console.log('身份证'+thisIdNumber)*/

        //console.log('证件类型：'+wx.getStorageSync('idType'));

        //console.log('国籍：'+_nationality);

        //console.log('选择国籍：'+_city);


        //有姓名的就是后台添加的

        if(_source=='0'){

            console.log('123');

            that.setData({

                userName:thisUserName,

                idNumber:thisIdNumber,

                hasUserName:true,

                city:wx.getStorageSync('nationality'),

                idType:wx.getStorageSync('idType')

            });


        }

        else if(_source=='1'){

            console.log('自助注册');

            //自助注册
            that.setData({

                userName:thisUserName,

                idNumber:thisIdNumber,

                hasUserName:false,

                city:wx.getStorageSync('nationality'),

                idType:wx.getStorageSync('idType')

            });



        }

        if(that.data.idType=='1'){


            that.setData({

                cardChoose:'身份证'

            })
        }

        else if(that.data.idType=='2'){

            that.setData({

                cardChoose:'护照'

            })

        }

        else if(that.data.idType=='3'){

            that.setData({

                cardChoose:'港澳居民来往内地通行证'

            })

        }

        else if(that.data.idType=='4'){

            that.setData({

                cardChoose:'台湾居民来往内地通行证'

            })

        }

        that.setData({

            isVerify:_isVerify,


        });








    },

    onShow:function () {

        console.log('显示')

        var that = this;

        var _source = wx.getStorageSync('source');

        var _city = wx.getStorageSync('chooseCity');

        console.log('国家'+wx.getStorageSync('nationality'))

        console.log('选择后的国家'+ _city)

        if(_source=='0'){


            that.setData({

                city:wx.getStorageSync('nationality'),



            });


        }

        else if(_source=='1') {


            //自助注册
            that.setData({

                city: wx.getStorageSync('nationality'),


            });

        }

        //城市存储
        if (_city) {


            that.setData({

                city: _city


            });
        }

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

    idFn:function (e) {

        var that = this;

        that.setData({

            idNumber: e.detail.value.replace(/\s+/g, '')


        });



    },

    bindPickerChange: function(e) {

        var that = this;

        //console.log('picker发送选择改变，携带值为', e.detail.value)

        //console.log(that.data.idStyle[e.detail.value]);

        that.setData({

            cardChoose:that.data.idStyle[e.detail.value]


        });


        //根据选的证件类型返回对应的参数

        if(e.detail.value=='0'){

            //身份证 idType：1
            that.setData({

                idType:'1'


            });
            //console.log('pick的身份证：'+that.data.idType)


        }

        else if(e.detail.value=='1'){

            //港澳通行证 idType：3
            that.setData({

                idType:'3'


            });
            console.log('pick的港澳：'+that.data.idType)

        }

        else if(e.detail.value=='2'){

            //台湾通行证 idType：4
            that.setData({

                idType:'4'


            });
            //console.log('pick的台湾：'+that.data.idType)

        }

        else if(e.detail.value=='3'){

            //护照 idType：2
            that.setData({

                idType:'2'


            });
            //console.log('pick的护照：'+that.data.idType)


        }




    },




})