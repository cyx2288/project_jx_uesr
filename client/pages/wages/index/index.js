const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const radixPointFn = require('../../../static/libs/script/radixPoint');//ajax请求

const repeat=require('../../../static/libs/script/bankCardJson.js');//3003

const salaryUrl = '/salary/home/getselectent';//发薪企业

const balanceUrl = '/user/account/getbalance';//获取用户余额

const remindUrl = '/salary/home/selecttiptype';//工资提醒

const infoUrl = '/salary/home/salaryinfo';//工资条发放列表

const noSeeUrl = '/salary/home/updateselectsalary';//暂不查看工资单

const noJoinUrl = '/salary/home/updatejoinentstatus';//暂不加入企业

const companyUrl = '/salary/home/selectlockstatus';//锁定状态查询

const statusUrl = '/user/bank/getsalarystatus';//获取用户工资金额状况

const salarystateUrl = '/user/account/addsalarystate';//设置用户金额显示

const getsalarystateUrl='/user/account/getsalarystate';//查询用户金额显示

const mineUrl = '/user/center/usercenter';//用户中心

const joinEntURL = '/user/workunit/selectisjoinent';//有带加入企业

const contractRemindUrl = '/user/contract/get/contract/remind';//签约弹框提醒

const lookContractUrl = '/user/contract/update/contract/remind';//查看签约提醒

const logOutUrl = '/logout';//退出登录url

Page({

    data: {

        firstOptions: '筛选',//默认选项

        selectSalary: true,//选择企业 true为隐藏 false为显示

        selectArea: false,

        wages: '--.--',//获取用户余额信息

        moreText:'没有更多数据啦~',//加载更多数据

        salaryDetailId: '',//发薪企业明细id

        wagesList: [],//发薪企业列表

        thisWagesListLength: 0,//获取当前发薪企业列表的长度

        selectSalaryOptions: [],//获取企业列表

        isAllCom: true,//判断是不是全部企业

        entId: '',//发薪企业id

        pageNum: 1,//初始值为2

        pageSize: 10,//一页的数量

        hasMoreData: true,//是否可以加载更多

        noData: true,//是否显示暂无数据 true为隐藏 false为显示

        userName: '',//姓名

        idNumber: '',//身份证号码

        dataText: true,//true为隐藏 false为显示

        hasCompany: false,//有没有企业

        lookWages: true,//看不看余额

        type:'',//是否认证锁定

        num:'',//选择全部&单个企业 1为单个企业 2为全部

        needRefresh: true,//刷新的开关 false为不刷新 true为刷新

        frozenSalary:'--.--',//冻结资金

        totalSalary:'--.--',//工资余额

        hasJoinEnt: '',//默认不显示有新的邀请 true为不显示 false为显示

        hasNewMsg: '',//默认不显示有新消息 true为不显示 false为显示

        showModal: false,//弹框

        imgalist:['http://wechat.fbwin.cn/images/qrcode_jx.jpg'],

        isPrivacy: false,//判断是否同意隐私协议


    },

    onLoad:function () {

        var _update = wx.getStorageSync('update');

        console.log('存'+wx.getStorageSync('update'));

        if(_update!='1'){

            if (wx.canIUse('getUpdateManager')) {

                const updateManager = wx.getUpdateManager();

                updateManager.onCheckForUpdate(function (res) {


                    console.log(res.hasUpdate)

                    // 请求完新版本信息的回调
                    if (res.hasUpdate) {

                        updateManager.onUpdateReady(function () {

                            wx.showModal({
                                title: '更新提示',
                                content: '新版本已经准备好，是否重启应用？',
                                confirmColor: '#fe9728',

                                success: function (res) {
                                    if (res.confirm) {
                                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                        updateManager.applyUpdate()
                                    }
                                }



                            })

                        })
                        updateManager.onUpdateFailed(function () {
                            // 新的版本下载失败
                            wx.showModal({
                                title: '已经有新版本了哟~',
                                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                                confirmColor: '#fe9728',
                            })
                        })
                    }
                })
            }

            else {
                // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
                    confirmColor: '#fe9728',

                })
            }


        }


    },

    onShow: function () {

        // 页面显示
        //console.log('返回更新数据');

        var that = this;





        //显示原点
        that.showDot();


    },

    init: function () {

        var that = this;

        //实名认证 & 工资余额 & 是否加入新企业 & 新消息 & 支付认证 & 是否设置支付密码 - 存储有没有认证操作成功 如果操作成功则个人中心刷新 没成功或者没操作则不用刷新
        var _successRefresh = wx.getStorageSync('successRefresh');

        console.log('首页刷新'+_successRefresh);


        //如果操作了某个需要变动的数据 赋值

        if (_successRefresh) {

            that.setData({

                needRefresh: _successRefresh

            })

        }


        else {

            that.setData({

                needRefresh: 'true'

            })

        }

        //时间戳
        function timestamp() {

            //获取当前时间戳
            var timestamp = Date.parse(new Date());

            return timestamp / 1000

        }


        function ajax() {


            ajaxShow();

            //ajax 加载后存储变量值改变 - 认证成功
            wx.setStorageSync('successRefresh', 'true');

            var _time = timestamp();

            wx.setStorageSync('mineTimer', _time);

        }

        if (that.data.needRefresh == 'true') {

            console.log('变量控制刷新');

            ajax()

        }

        else {

            var _mineTimer = wx.getStorageSync('mineTimer');

            /*  if (timestamp() - _mineTimer >= 120) {

                  console.log('超时刷新 超时：' + (timestamp() - _mineTimer))

                  ajax()

              }

              else {
                  console.log(timestamp())

                  console.log(_mineTimer)

                  console.log('超时刷新 超时：' + (timestamp() - _mineTimer))

                  console.log('不刷新')

              }*/


        }


        //ajaxShow();



        function ajaxShow(){


            that.setData({

                firstOptions: '筛选',//默认选项

                selectSalary: true,//选择企业 true为隐藏 false为显示

                selectArea: false,

                wages: '--.--',//获取用户余额信息

                moreText:'没有更多数据啦~',//加载更多数据

                salaryDetailId: '',//发薪企业明细id

                wagesList: [],//发薪企业列表

                thisWagesListLength: 0,//获取当前发薪企业列表的长度

                selectSalaryOptions: [],//获取企业列表

                isAllCom: true,//判断是不是全部企业

                entId: '',//发薪企业id

                pageNum: 1,//初始值为2

                pageSize: 10,//一页的数量

                hasMoreData: true,//是否可以加载更多

                noData: true,//是否显示暂无数据 true为隐藏 false为显示

                userName: '',//姓名

                idNumber: '',//身份证号码

                dataText: true,//true为隐藏 false为显示

                hasCompany: false,//有没有企业

                //lookWages: true,//看不看余额

                type:'',//是否认证锁定

                num:'',//选择全部&单个企业 1为单个企业 2为全部

                needRefresh: true,//刷新的开关 false为不刷新 true为刷新

                frozenSalary:'--.--',//冻结资金

                totalSalary:'--.--',//工资余额

                hasJoinEnt: '',//默认不显示有新的邀请 true为不显示 false为显示

                hasNewMsg: '',//默认不显示有新消息 true为不显示 false为显示

                showModal: false,//弹框

                imgalist:['http://wechat.fbwin.cn/images/qrcode_jx.jpg'],



            })
            //存储从哪儿过来
            wx.setStorageSync('goHtml','4');


            //工资提醒
            var thisRemaidUrl = app.globalData.URL + remindUrl;

            //获取用户余额
            var thisBalanceUrl = app.globalData.URL + balanceUrl;

            //暂不查看工资单
            var thisNoSeeUrl = app.globalData.URL + noSeeUrl;

            //暂不加入工资条
            var thisNoJoinUrl = app.globalData.URL + noJoinUrl;

            //发薪企业
            var thisSalaryUrl = app.globalData.URL + salaryUrl;

            //是否锁定状态
            var thisUrl = app.globalData.URL + companyUrl;

            //获取用户数据
            var jx_sid = wx.getStorageSync('jxsid');

            var Authorization = wx.getStorageSync('Authorization');

            console.log('首页传的token'+Authorization)


            /**
             * 接口：工资提醒
             * 请求方式：GET
             * 接口：/salary/home/selecttiptype
             * 入参：null
             **/

            wx.request({

                url: thisRemaidUrl,

                method: 'GET',

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    //code3003返回方法
                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)

                        return false


                    }
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        that.onShow()

                        return false
                    }

                    else {


                        var thisType = res.data.data[0].type;


                        //存储entId
                        wx.setStorageSync('entId', res.data.data[0].entId);


                        //存储salaryId
                        wx.setStorageSync('salaryDetailId', res.data.data[0].salaryDetailId);

                        //存储type
                        wx.setStorageSync('thisType', res.data.data[0].type);

                        //console.log('发薪'+wx.getStorageSync('salaryDetailId'))


                        //是否查看工资条
                        if (thisType == 1) {


                            wx.showLoading({

                                mask:true,
                                title: '加载中',

                            });



                            var thisEnName = res.data.data[0].entName;

                            var thisSalaryMonth = res.data.data[0].salaryMonth;

                            /*console.log('发薪企业id'+that.data.salaryDetailId);*/


                            setTimeout(function () {


                                setTimeout(function () {

                                    wx.hideLoading()

                                },500);


                                wx.showModal({
                                    title: '提示',
                                    content: thisEnName + '邀请您查看' + thisSalaryMonth + '收入',
                                    cancelText: '暂不查看',
                                    confirmText: '查看',
                                    confirmColor:'#fe9728',
                                    success: function (res) {

                                        if (res.confirm) {

                                            wx.setStorageSync('successRefresh','true');
                                            /**
                                             * 接口：锁定状态查询
                                             * 请求方式：POST
                                             * 接口：/salary/home/selectlockstatus
                                             * 入参：null
                                             **/
                                            wx.request({

                                                url: thisUrl,

                                                method: 'GET',

                                                header: {

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

                                                                url:'../../common/signin/signin'
                                                            })

                                                        },1500)

                                                        return false


                                                    }
                                                    else if(res.data.code=='3004'){

                                                        var Authorization = res.data.token.access_token;//Authorization数据

                                                        wx.setStorageSync('Authorization', Authorization);

                                                        return false
                                                    }

                                                    else {

                                                        that.setData({

                                                            type: res.data.data.type

                                                        });


                                                        if (that.data.type == '1') {

                                                            wx.navigateTo({

                                                                url: '../../common/wages_authentication/authentication'

                                                            })

                                                        }

                                                        else if (res.data.data.type == '0') {

                                                            wx.navigateTo({

                                                                url: '../../../packageA/pages/locked/locked'
                                                            })

                                                        }

                                                    }


                                                },

                                                fail: function (res) {

                                                    console.log(res)

                                                }

                                            })



                                        }

                                        else if (res.cancel) {


                                            //调用暂不查看工资条
                                            noSeeSalary();

                                            wx.showModal({
                                                title: '提示',
                                                content: '首次查看需进行身份验证，在“我的”-“发薪企业”中同意企业邀请，验证通过后即可查看',
                                                showCancel:false,
                                                confirmText: '我知道了',
                                                confirmColor:'#fe9728',
                                                success: function (res) {

                                                    if (res.confirm) {

                                                    }

                                                    else if (res.cancel) {


                                                    }
                                                }
                                            });




                                        }
                                    }
                                });

                            },1000)





                        }

                        //是否加入企业
                        else if (thisType == 2) {


                            wx.showLoading({

                                mask:true,
                                title: '加载中',

                            });



                            var thisEnName = res.data.data[0].entName;

                            setTimeout(function () {


                                setTimeout(function () {

                                    wx.hideLoading()

                                },500);


                                wx.showModal({
                                    title: '提示',
                                    content: thisEnName + '邀请您加入企业，便捷查看工资和工资条',
                                    cancelText: '暂不加入',
                                    confirmText: '加入',
                                    confirmColor:'#fe9728',
                                    success: function (res) {

                                        if (res.confirm) {

                                            wx.setStorageSync('successRefresh','true');

                                            /**
                                             * 接口：锁定状态查询
                                             * 请求方式：POST
                                             * 接口：/salary/home/selectlockstatus
                                             * 入参：null
                                             **/
                                            wx.request({

                                                url: thisUrl,

                                                method: 'GET',

                                                header: {

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

                                                                url:'../../common/signin/signin'
                                                            })

                                                        },1500)



                                                        return false


                                                    }
                                                    else if(res.data.code=='3004'){

                                                        var Authorization = res.data.token.access_token;//Authorization数据

                                                        wx.setStorageSync('Authorization', Authorization);

                                                        that.onShow()

                                                        return false
                                                    }


                                                    else {


                                                        that.setData({

                                                            type: res.data.data.type

                                                        })


                                                        if (that.data.type == '1') {

                                                            wx.navigateTo({

                                                                url: '../../common/authentication/authentication'

                                                            })

                                                        }

                                                        else if (res.data.data.type == '0') {

                                                            wx.navigateTo({

                                                                url: '../../../packageA/pages/locked/locked'
                                                            })

                                                        }



                                                    }


                                                },

                                                fail: function (res) {

                                                    console.log(res)

                                                }

                                            })



                                        }

                                        else if (res.cancel) {

                                            //调用暂不加入企业
                                            noJoinSalary();

                                            wx.showToast({

                                                title: '必须加入企业才可查看工资条哦~关闭后可在“发薪企业”中查看',
                                                icon: 'none',
                                                mask:true,

                                            })


                                        }
                                    }
                                });


                            },1000)


                        }

                        //是否查看个人综合所得
                        else if (thisType == 3) {


                            wx.showLoading({

                                mask:true,
                                title: '加载中',

                            });



                            var thisEnName = res.data.data[0].entName;

                            var thisSalaryMonth = res.data.data[0].salaryMonth;

                            setTimeout(function () {


                                setTimeout(function () {

                                    wx.hideLoading()

                                },500);


                                wx.showModal({
                                    title: '提示',
                                    content: '请查看【'+thisEnName + '】众包任务'+thisSalaryMonth+'便捷查看工资和工资条',
                                    cancelText: '暂不查看',
                                    confirmText: '查看',
                                    confirmColor:'#fe9728',
                                    success: function (res) {

                                        if (res.confirm) {

                                            wx.setStorageSync('successRefresh','true');
                                            /**
                                             * 接口：锁定状态查询
                                             * 请求方式：POST
                                             * 接口：/salary/home/selectlockstatus
                                             * 入参：null
                                             **/
                                            wx.request({

                                                url: thisUrl,

                                                method: 'GET',

                                                header: {

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

                                                                url:'../../common/signin/signin'
                                                            })

                                                        },1500)



                                                        return false


                                                    }
                                                    else if(res.data.code=='3004'){

                                                        var Authorization = res.data.token.access_token;//Authorization数据

                                                        wx.setStorageSync('Authorization', Authorization);

                                                        that.onShow()

                                                        return false
                                                    }


                                                    else {

                                                        that.setData({

                                                            type: res.data.data.type

                                                        })


                                                        if (that.data.type == '1') {

                                                            wx.navigateTo({

                                                                url: '../../common/wages_authentication/authentication'

                                                            })

                                                        }

                                                        else if (res.data.data.type == '0') {

                                                            wx.navigateTo({

                                                                url: '../../../packageA/pages/locked/locked'
                                                            })

                                                        }

                                                    }


                                                },

                                                fail: function (res) {

                                                    console.log(res)

                                                }

                                            })



                                        }

                                        else if (res.cancel) {


                                            //调用暂不查看工资条
                                            noSeeSalary();


                                            wx.showModal({
                                                title: '提示',
                                                content: '首次查看需进行身份验证，在“我的”-“发薪企业”中同意企业邀请，验证通过后即可查看',
                                                showCancel:false,
                                                confirmText: '我知道了',
                                                confirmColor:'#fe9728',
                                                success: function (res) {

                                                    if (res.confirm) {

                                                    }

                                                    else if (res.cancel) {


                                                    }
                                                }
                                            });



                                        }
                                    }
                                });


                            },1000)


                        }

                        //未收到任何邀请
                        else if (thisType == 0) {

                            setTimeout(function () {

                                wx.hideLoading()

                            },500);


                            //调用发薪企业
                            //that.getSelectEnt();

                            //调用工资条发放列表
                            //that.salaryInfo();

                        }

                        //获取entId
                        var thisEntId = wx.getStorageSync('entId');

                        //获取发薪企业id
                        var thisSalaryDetailId = wx.getStorageSync('salaryDetailId');



                        //暂不加入企业
                        function noJoinSalary() {

                            /**
                             * 接口：暂不加入企业
                             * 请求方式：POST
                             * 接口：/salary/home/updatejoinentstatus
                             * 入参：entId
                             **/
                            wx.request({

                                url: thisNoJoinUrl,

                                method: 'POST',

                                data: json2FormFn.json2Form({

                                    entId: thisEntId

                                }),

                                header: {

                                    'content-type': 'application/x-www-form-urlencoded',// post请求

                                    'jxsid': jx_sid,

                                    'Authorization': Authorization

                                },

                                success: function (res) {

                                    console.log(res.data);





                                },


                                fail: function (res) {
                                    console.log(res)
                                }

                            });

                        }

                        //暂不看工资单
                        function noSeeSalary() {

                            /**
                             * 接口：暂不查看工资条
                             * 请求方式：POST
                             * 接口：salary/home/updateselectsalary
                             * 入参：salaryDetailId
                             **/
                            wx.request({

                                url: thisNoSeeUrl,

                                method: 'POST',

                                data: json2FormFn.json2Form({

                                    salaryDetailId: thisSalaryDetailId

                                }),

                                header: {

                                    'content-type': 'application/x-www-form-urlencoded',// post请求

                                    'jxsid': jx_sid,

                                    'Authorization': Authorization

                                },

                                success: function (res) {

                                    console.log(res.data);





                                },


                                fail: function (res) {
                                    console.log(res)
                                }

                            })


                        }

                        //发薪企业
                        function getSelectEnt() {


                            var Authorization = wx.getStorageSync('Authorization');
                            /**
                             * 接口：发薪企业
                             * 请求方式：GET
                             * 接口：/user/account/getbalance
                             * 入参：null
                             **/
                            wx.request({

                                url: thisSalaryUrl,

                                method: 'GET',

                                header: {

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

                                                url:'../../common/signin/signin'
                                            })

                                        },1500)

                                        /*                          wx.showToast({
                                         title: res.data.msg,
                                         icon: 'none',
                                         duration: 1500,
                                         success:function () {



                                         }

                                         })*/

                                        return false


                                    }
                                    else if(res.data.code=='3004'){

                                        var Authorization = res.data.token.access_token;//Authorization数据

                                        wx.setStorageSync('Authorization', Authorization);

                                        that.onShow()

                                        return false
                                    }
                                    else {

                                        var thisEntName = res.data.data;

                                        //console.log(res.data.data)

                                        that.setData({

                                            selectSalaryOptions: thisEntName,

                                        });




                                    }



                                },


                                fail: function (res) {

                                    console.log(res)

                                }

                            })


                        }

                        //分页
                        that.chooseEntId();

                        //发薪企业
                        getSelectEnt();

                        var Authorization = wx.getStorageSync('Authorization');

                        /**
                         * 接口：获取用户余额
                         * 请求方式：GET
                         * 接口：/user/account/getbalance
                         * 入参：null
                         **/
                        wx.request({

                            url: thisBalanceUrl,

                            method: 'GET',

                            header: {

                                'jxsid': jx_sid,

                                'Authorization': Authorization

                            },

                            success: function (res) {



                                //wx.setStorageSync('wages', res.data.data);

                                app.globalData.repeat(res.data.code,res.data.msg);

                                app.globalData.token(res.header.Authorization)

                                if(res.data.code=='3001') {

                                    //console.log('登录');

                                    setTimeout(function () {

                                        wx.reLaunch({

                                            url:'../../common/signin/signin'
                                        })

                                    },1500)



                                    return false


                                }
                                else if(res.data.code=='3004'){

                                    var Authorization = res.data.token.access_token;//Authorization数据

                                    wx.setStorageSync('Authorization', Authorization);

                                    that.onShow()

                                    return false
                                }

                                else {

                                    console.log(res.data)

                                    that.setData({

                                        wages: radixPointFn.splitK(res.data.data)//用户余额

                                    });




                                }

                            },


                            fail: function (res) {

                                console.log(res)

                            }

                        })

                        var Authorization = wx.getStorageSync('Authorization');

                        /**
                         * 接口：获取用户工资金额状况
                         * 请求方式：GET
                         * 接口：/user/bank/getsalarystatus
                         * 入参：null
                         **/
                        wx.request({

                            url: app.globalData.URL + statusUrl,

                            method: 'GET',

                            header: {

                                'jxsid': jx_sid,

                                'Authorization': Authorization

                            },

                            success: function (res) {

                                //wx.setStorageSync('wages', res.data.data);

                                app.globalData.repeat(res.data.code,res.data.msg);

                                app.globalData.token(res.header.Authorization)

                                if(res.data.code=='3001') {

                                    //console.log('登录');

                                    setTimeout(function () {

                                        wx.reLaunch({

                                            url:'../../common/signin/signin'
                                        })

                                    },1500)



                                    return false


                                }
                                else if(res.data.code=='3004'){

                                    var Authorization = res.data.token.access_token;//Authorization数据

                                    wx.setStorageSync('Authorization', Authorization);

                                    that.onShow()

                                    return false
                                }

                                else {

                                    console.log(res.data)

                                    console.log('总资产'+res.data.data)

                                    if(!res.data.data.totalSalary){


                                        that.setData({

                                            totalSalary:'--.--'

                                        })



                                    }

                                    else {

                                        that.setData({

                                            frozenSalary:radixPointFn.splitK(res.data.data.frozenSalary),

                                            enableSalary:radixPointFn.splitK(res.data.data.enableSalary),

                                            totalSalary:radixPointFn.splitK(res.data.data.totalSalary),


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


                fail: function (res) {

                    console.log(res)

                }

            });


            /**
             * 接口：查询用户金额显示
             * 请求方式：GET
             * 接口：/user/account/getsalarystate
             * 入参：null
             **/
            wx.request({

                url: app.globalData.URL + getsalarystateUrl,

                method: 'GET',

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    //code3003返回方法
                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)

                        return false


                    }
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        that.onShow()

                        return false
                    }

                    else {


                        that.setData({

                            lookWages:res.data.data

                        })

                    }




                },


                fail: function (res) {

                    console.log(res)

                }

            });

            /**
             * 接口：签约弹框提醒
             * 请求方式：POST
             * 接口：/user/account/getsalarystate
             * 入参：null
             **/
            wx.request({

                url: app.globalData.URL + contractRemindUrl,

                method: 'POST',

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    //code3003返回方法
                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

                    if(res.data.code=='3001') {

                        //console.log('登录');

                        setTimeout(function () {

                            wx.reLaunch({

                                url:'../../common/signin/signin'
                            })

                        },1500)

                        return false


                    }
                    else if(res.data.code=='3004'){

                        var Authorization = res.data.token.access_token;//Authorization数据

                        wx.setStorageSync('Authorization', Authorization);

                        that.onShow()

                        return false
                    }

                    else {


                        if(res.data.data.type=='1'){

                            that.setData({
                                showModal: true
                            });
                        }




                    }




                },


                fail: function (res) {

                    console.log(res)

                }

            });



        }







    },

    //工资条发放列表 入参数企业id,分页数，
    salaryInfo: function (thisSalaryEntId, thisPageSize, thisPageNum, fn) {

        var that = this;

        //工资发放列表
        var thisInfoUrl = app.globalData.URL + infoUrl;

        //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        //修改入参
        var thisIdData = {};

        if (thisSalaryEntId) {

            thisIdData = {

                entId: thisSalaryEntId,

                pageNum: thisPageNum,

                pageSize: thisPageSize

            }

        }

        else {

            thisIdData = {

                pageNum: thisPageNum,

                pageSize: thisPageSize
            }

        }


        /**
         * 接口：工资条发放列表
         * 请求方式：GET
         * 接口：/salary/home/salaryinfo
         * 入参：entId,pageNum,pageSize
         **/
        wx.request({

            url: thisInfoUrl,

            method: 'GET',

            data: thisIdData,

            header: {

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

                            url:'../../common/signin/signin'
                        })

                    },1500)
/*
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success:function () {



                        }

                    })*/

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    that.onShow()

                    return false
                }

                else {

                    //获取现在的list
                    var thislist = res.data.data.list;

                    var wagesListLength;

                    //var _dataText = res.data.data.hasOwnProperty('list')

                    var pickThisList = [];

                    //判断有没有列表数据

                    if (thislist) {


                        //获取现在list的长度
                        wagesListLength = thislist.length;

                        //上一次获取到的list

                        var lastList = that.data.wagesList;


                        //把获取到的list合并成一个数组
                        var nowList = lastList.concat(thislist);


                        that.setData({

                            thisWagesListLength: wagesListLength

                        });

                        //判空
                        if (fn) {
                            //数据加载之后使用的方法
                            fn();
                        }


                        //获取的data的list加上千分位

                        for (var j = 0; j < thislist.length; j++) {

                            thislist[j].realAmount = radixPointFn.splitK(thislist[j].realAmount)


                        }


                        that.setData({

                            wagesList: nowList,

                        });


                    }

                    else {


                        if (that.data.pageNum == '1') {


                            that.setData({

                                moreText: '还未收到工资哦~',//加载更多数据

                            })


                        }

                        else {

                            that.setData({

                                moreText: '没有更多数据啦~',//加载更多数据

                            })

                        }

                        that.setData({

                            hasMoreData: false,

                            noData: false,


                        });


                    }

                }



            },


            fail: function (res) {
                console.log(res)
            }

        })

    },

    //点击选择企业
    clickSalary: function () {

        var thisSelectSalary = this.data.selectSalary;

        if (thisSelectSalary == true) {

            this.setData({

                selectArea: true,

                selectSalary: false
            })
        } else {

            this.setData({

                selectArea: false,

                selectSalary: true
            })
        }

    },

    //点击切换
    mySelect: function (e) {


        var that = this;




        that.setData({

            //选择的企业名称回显
            firstOptions: e.target.dataset.salary,

            //存取企业id
            entId: e.target.dataset.id,

            selectSalary: true,

            selectArea: false,

            num:2,


        });

        //分页数据初始化
        that.setData({

            isAllCom: false,//不是全部企业

            pageNum: 1,//初始值为2

            hasMoreData: true,//是否可以加载更多

            noData: true,//是否显示暂无数据 true为隐藏 false为显示

            wagesList: [],//发薪企业列表





        });

        //在渲染数据
        //that.salaryInfo(that.data.entId,that.data.pageSize,1);

        that.chooseEntId();


    },

    //点击选择全部
    mySelectAll: function () {


        var that = this;

        that.setData({

            firstOptions: '全部',

            selectSalary: true,

            selectArea: false,

            isAllCom: true,//是全部企业

            pageNum: 1,//初始值为2

            hasMoreData: true,//是否可以加载更多

            noData: true,//是否显示暂无数据 true为隐藏 false为显示

            wagesList: [],//发薪企业列表

            num:1,

            needRefresh: true,//刷新的开关 false为不刷新 true为刷新





        });


        that.chooseEntId();


    },

    //点击查看工资条跳转链接
    clickSeeList: function (e) {

        wx.setStorageSync('salaryDetailId', e.currentTarget.dataset.detail);

        wx.navigateTo({

            url: '../../wages/payroll/payroll'

        });


    },

    //下拉刷新
    onPullDownRefresh: function () {

        this.setData({

            firstOptions: '筛选',//默认选项

            selectSalary: true,//选择企业 true为隐藏 false为显示

            selectArea: false,

            wages: '--.--',//获取用户余额信息

            moreText:'没有更多数据啦~',//加载更多数据

            salaryDetailId: '',//发薪企业明细id

            wagesList: [],//发薪企业列表

            thisWagesListLength: 0,//获取当前发薪企业列表的长度

            selectSalaryOptions: [],//获取企业列表

            isAllCom: true,//判断是不是全部企业

            entId: '',//发薪企业id

            pageNum: 1,//初始值为2

            pageSize: 10,//一页的数量

            hasMoreData: true,//是否可以加载更多

            noData: true,//是否显示暂无数据 true为隐藏 false为显示

            userName: '',//姓名

            idNumber: '',//身份证号码

            dataText: true,//true为隐藏 false为显示

            hasCompany: false,//有没有企业

            type:'',//是否锁定

            num:'',//选择全部&单个企业 1为单个企业 2为全部

            needRefresh: true,//刷新的开关 false为不刷新 true为刷新

            //lookWages:true,//看不看余额

            frozenSalary:'--.--',//冻结资金

            totalSalary:'--.--',//工资余额

            hasJoinEnt: '',//默认不显示有新的邀请 true为不显示 false为显示

            hasNewMsg: '',//默认不显示有新消息 true为不显示 false为显示

            showModal: false,//弹框

            imgalist:['http://wechat.fbwin.cn/images/qrcode_jx.jpg'],





        });

        wx.setStorageSync('successRefresh', 'true');


        this.onShow();


        wx.stopPullDownRefresh();

    },

    //上拉加载分页
    onReachBottom: function () {

        var that = this;

        that.chooseEntId();

    },

    //分页方法
    chooseEntId: function () {

        var that = this;

        //console.log('到底');

        console.log('是否有更多数据'+that.data.hasMoreData);


        if (that.data.hasMoreData) {

            that.setData({

                hasMoreData: false,

            });


            //判断后面是否要加载分页
            var useFn = function () {


                //如果现在列表页的长度小于一页数量
                if (that.data.thisWagesListLength < that.data.pageSize) {

                    that.setData({

                        hasMoreData: false,

                        noData: false

                    });


                }

                else {


                    //页数加1
                    that.setData({

                        pageNum: that.data.pageNum + 1

                    });

                    //可以加载
                    setTimeout(function () {

                        that.setData({

                            hasMoreData: true


                        });


                    }, 500)


                }


            };

            //如果查看全部企业
            if (that.data.isAllCom) {

                that.salaryInfo('', that.data.pageSize, that.data.pageNum, useFn);

            }

            //如果看单独企业
            else {

                that.salaryInfo(that.data.entId, that.data.pageSize, that.data.pageNum, useFn);

            }


        }
    },

    //点击看不看金额
    lookWagesFn: function () {

        var that = this;


        //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        that.setData({

            lookWages: !that.data.lookWages

        })

        console.log('时候看金额'+that.data.lookWages);

        /**
         * 接口：设置用户金额显示
         * 请求方式：GET
         * 接口：/user/account/addsalarystate
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + salarystateUrl,

            method: 'GET',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            data:{


                salaryState:that.data.lookWages


            },

            success: function (res) {

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)

                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    that.onShow()

                    return false
                }

                else {

                    console.log(res.data);


                }




            },


            fail: function (res) {

                console.log(res)

            }

        });



    },

    frozenFn:function () {

        wx.showModal({
            title: '冻结工资只可消费，不可提现',
            content: '在’发薪企业’中同意企业邀请，身份验证通过后即可解冻资金',
            cancelText: '取消',
            confirmText: '去解冻',
            confirmColor:'#fe9728',
            success: function (res) {

                if (res.confirm) {

                    wx.navigateTo({

                        url: '../../user/company/company'
                    })

                }

                else if (res.cancel) {



                }
            }
        });

    },

    //显示小圆点
    showDot:function () {

        var that = this;


        //获取用户数据
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


                    //wx.setStorageSync('ishasNewMsg',res.data.data.isHaveNewMsg)

                    var isPrivacy;

                    if(res.data.data.isPrivacy == 1){

                        isPrivacy = false;

                        that.init();

                    }else{

                        isPrivacy = true;

                    }

                    that.setData({

                        hasNewMsg:res.data.data.isHaveNewMsg,

                        isPrivacy: isPrivacy
                    })


                }

            },

            fail: function (res) {

                console.log(res)
            }

        })


        /**
         * 接口：有待加入企业
         * 请求方式：GET
         * 接口：/user/workunit/selectisjoinent
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + joinEntURL,

            method: 'GET',

            header: {

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

                        hasJoinEnt:res.data.data.type
                    })


                }


            },

            fail: function (res) {

                console.log(res)
            }

        });


        setTimeout(function () {

            console.log('取值消息'+that.data.hasNewMsg);

            console.log('取值企业'+that.data.hasJoinEnt);

            if(that.data.hasNewMsg=='1'|| that.data.hasJoinEnt=='1'){

                setTimeout(function () {

                    wx.showTabBarRedDot({

                        index:1

                    })


                },10)


            }else {

                setTimeout(function () {

                    wx.hideTabBarRedDot({

                        index:1

                    })

                },10)

            }


        },500)








    },
    //转发
    onShareAppMessage: function () {
        return {
            title: '嘉薪平台',
            path: '/pages/common/signin/signin',
            imageUrl:'/static/icon/logo/share.jpg'

        }
    },

    showDialogBtn: function() {

        var that = this;


    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {


    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {

        var that = this

        that.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        var that = this;

        that.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {

        var that = this;

        //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：查看弹框提醒
         * 请求方式：POST
         * 接口：/user/contract/update/contract/remind
         * 入参：null
         **/
        wx.request({

            url: app.globalData.URL + lookContractUrl,

            method: 'POST',

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                //code3003返回方法
                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)

                if(res.data.code=='3001') {

                    //console.log('登录');

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)

                    return false


                }
                else if(res.data.code=='3004'){

                    var Authorization = res.data.token.access_token;//Authorization数据

                    wx.setStorageSync('Authorization', Authorization);

                    that.onShow()

                    return false
                }

                else {


                    that.hideModal()



                }




            },


            fail: function (res) {

                console.log(res)

            }

        });




    },

    previewImage: function (e) {
        wx.previewImage({
            current: this.data.imgalist, // 当前显示图片的http链接
            urls: this.data.imgalist // 需要预览的图片http链接列表
        })
    },


    logOutFn:function () {

        var thisLogOutUrl = app.globalData.URL + logOutUrl;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        wx.removeStorageSync('jxsid');

        wx.removeStorageSync('Authorization');

        wx.clearStorageSync();


        logOut();


        function logOut() {

            /**
             * 接口：
             * 请求方式：POST
             * 接口：/logout
             * 入参：null
             **/
            wx.request({

                url:thisLogOutUrl,

                method: 'GET',

                header: {

                    'jxsid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    var thisCode = res.data.code;

                    app.globalData.repeat(res.data.code,res.data.msg);

                    app.globalData.token(res.header.Authorization)

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


                        if (thisCode == '0000') {


                            //跳回登录页
                            wx.reLaunch({

                                url: '../../common/signin/signin'
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

    agree: function () {

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        /**
         * 接口：
         * 请求方式：POST
         * 接口：/logout
         * 入参：null
         **/
        wx.request({

            url:app.globalData.URL + '/user/set/updateisprovicystate',

            method: 'GET',

            data: {
                isPrivacy: 1
            },

            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);

                var thisCode = res.data.code;

                app.globalData.repeat(res.data.code,res.data.msg);

                app.globalData.token(res.header.Authorization)

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


                    if (thisCode == '0000') {

                        that.setData({

                            isPrivacy: false

                        });

                        that.init();

                    }

                }

            },

            fail: function (res) {

                console.log(res)

            }

        })

    }

});