const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const salaryUrl = '/salary/home/getselectent';//发薪企业

const balanceUrl = '/user/account/getbalance';//获取用户余额

const remindUrl = '/salary/home/selecttiptype';//工资提醒

const infoUrl = '/salary/home/salaryinfo';//工资条发放列表

const noSeeUrl = '/salary/home/updateselectsalary';//暂不查看工资单

const noJoinUrl = '/salary/home/updatejoinentstatus';//暂不加入企业


/*下拉选择*/
Page({

    data: {

        firstOptions: '筛选',//默认选项

        selectSalary: true,//选择企业 true为隐藏 false为显示

        selectArea: false,

        wages: '',//获取用户余额信息

        salaryDetailId: '',//发薪企业明细id

        wagesList: [],//发薪企业列表

        selectSalaryOptions:[],//获取企业列表

        entId:''//发薪企业id


    },
    onLoad: function (options) {

        // 页面初始化 options为页面跳转所带来的参数
        var that = this;

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


        //获取用户数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');

        //获取entId
        var thisEntId = wx.getStorageSync('entId');

        //获取发薪企业id
        var thisSalaryDetailId = wx.getStorageSync('salaryDetailId');


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

                'jx_sid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                var thisType = res.data.data[0].type;

                console.log(res.data);

                //存储entId
                wx.setStorageSync('entId', res.data.data[0].entId);

                //存储salaryId
                wx.setStorageSync('salaryDetailId', res.data.data[0].salaryDetailId);


                //是否查看工资条
                if (thisType == 1) {

                    var thisEnName = res.data.data[0].entName;

                    var thisSalaryMonth = res.data.data[0].salaryMonth;

                    wx.showModal({
                        title: '提示',
                        content: thisEnName + '邀请您查看' + thisSalaryMonth + '工资',
                        cancelText: '暂不查看',
                        confirmText: '查看',
                        success: function (res) {

                            if (res.confirm) {

                                wx.navigateTo({

                                    url: '../../common/authentication/authentication'

                                });

                            }

                            else if (res.cancel) {

                                //调用暂不查看工资条
                                noSeeSalary();

                            }
                        }
                    });


                }

                //是否加入企业
                else if (thisType == 2) {


                    var thisEnName = res.data.data[0].entName;

                    wx.showModal({
                        title: '提示',
                        content: thisEnName + '邀请您加入企业，便捷查看工资和工资条',
                        cancelText: '暂不加入',
                        confirmText: '加入',
                        success: function (res) {

                            if (res.confirm) {

                                wx.navigateTo({

                                    url: '../../common/authentication/authentication'

                                });

                            }

                            else if (res.cancel) {

                                //调用暂不加入企业
                                noJoinSalary()


                            }
                        }
                    });


                }

                //未收到任何邀请
                else if (thisType == 0) {

                    //调用发薪企业
                    getSelectEnt();

                    //调用工资条发放列表
                    //salaryInfo();

                }


            },


            fail: function (res) {
                console.log(res)
            }

        });


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

                    'jx_sid': jx_sid,

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

                    'jx_sid': jx_sid,

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

        //工资条发放列表
        /*function salaryInfo() {

            /!**
             * 接口：工资条发放列表
             * 请求方式：GET
             * 接口：/salary/home/salaryinfo
             * 入参：entId,pageNum,pageSize
             **!/
            wx.request({

                url: thisInfoUrl,

                method: 'GET',

                data: {

                    /!*entId: thisEntId*!/

                },

                header: {

                    'jx_sid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    var thislist = res.data.data.list;

                    that.setData({

                        wagesList: thislist

                    })

                },


                fail: function (res) {
                    console.log(res)
                }

            })

        }*/

        //发薪企业
        function getSelectEnt() {

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

                    'jx_sid': jx_sid,

                    'Authorization': Authorization

                },

                success: function (res) {

                    console.log(res.data);

                    var thisEntName = res.data.data;

                    //console.log(res.data.data)

                    that.setData({

                        selectSalaryOptions: thisEntName,


                    })



                },


                fail: function (res) {
                    console.log(res)
                }

            })


        }

        that.salaryInfo();


        getSelectEnt();

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

                'jx_sid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                 wx.setStorageSync('wages',res.data.data);

                console.log(res.data);


                that.setData({

                    wages: res.data.data//用户余额

                });



            },


            fail: function (res) {

                console.log(res)

            }

        })


    },

    //工资条发放列表 入参数企业id
    salaryInfo:function (thisSalaryEntId) {

        var that = this;

        //工资发放列表
        var thisInfoUrl = app.globalData.URL + infoUrl;

        //获取用户数据
        var jx_sid = wx.getStorageSync('jx_sid');

        var Authorization = wx.getStorageSync('Authorization');


        var thisIdData = {};


        if(thisSalaryEntId){

            thisIdData={

                entId: thisSalaryEntId

            }

        }

        else {

            thisIdData={}
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

            'jx_sid': jx_sid,

            'Authorization': Authorization

        },

        success: function (res) {

            console.log(res.data);

            var thislist = res.data.data.list;

            that.setData({

                wagesList: thislist

            })

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


        this.setData({

            firstOptions: e.target.dataset.salary,

            entId:e.target.dataset.id,

            selectSalary: true,

            selectArea: false

        });

        this.salaryInfo(this.data.entId);



    },

    //点击查看工资条跳转链接
    clickSeeList:function (e) {

        wx.setStorageSync('salaryDetailId',e.currentTarget.dataset.detail);

        wx.navigateTo({

            url: '../../wages/payroll/payroll'

        });


    },

    //下拉刷新
    onPullDownRefresh:function () {

        this.onLoad();

        wx.stopPullDownRefresh();

    },

    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
});