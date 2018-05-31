const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const repeat=require('../../../static/libs/script/account_exception.js')

const salaryUrl = '/salary/home/getselectent';//发薪企业

const balanceUrl = '/user/account/getbalance';//获取用户余额

const remindUrl = '/salary/home/selecttiptype';//工资提醒

const infoUrl = '/salary/home/salaryinfo';//工资条发放列表

const noSeeUrl = '/salary/home/updateselectsalary';//暂不查看工资单

const noJoinUrl = '/salary/home/updatejoinentstatus';//暂不加入企业

const companyUrl = '/salary/home/selectlockstatus';//锁定状态查询


Page({

    data: {

        firstOptions: '筛选',//默认选项

        selectSalary: true,//选择企业 true为隐藏 false为显示

        selectArea: false,

        wages: '暂无数据',//获取用户余额信息

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

        type:'',//是否锁定


    },

    onLoad: function (options) {

        // 页面初始化 options为页面跳转所带来的参数
    },

    onShow: function () {

        // 页面显示
        //console.log('返回更新数据');

        var that = this;


        that.setData({


            firstOptions: '筛选',//默认选项

            selectSalary: true,//选择企业 true为隐藏 false为显示

            selectArea: false,

            wages: '暂无数据',//获取用户余额信息

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

            //lookWages:true,//看不看余额

        })

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

        //时候锁定状态
        var thisUrl = app.globalData.URL + companyUrl;


        //获取用户数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');


        //获取entId
        var thisEntId = wx.getStorageSync('entId');

        //获取发薪企业id
        var thisSalaryDetailId = wx.getStorageSync('salaryDetailId');


        wx.showLoading({
            title: '加载中',
        })


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

                console.log(res.data.code);

                //code3003返回方法
                repeat.repeat(res.data.code,res.data.msg);


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


                    var thisEnName = res.data.data[0].entName;

                    var thisSalaryMonth = res.data.data[0].salaryMonth;

                    /*console.log('发薪企业id'+that.data.salaryDetailId);*/


                    setTimeout(function () {


                        setTimeout(function () {

                            wx.hideLoading()

                        },500);


                        wx.showModal({
                            title: '提示',
                            content: thisEnName + '邀请您查看' + thisSalaryMonth + '工资',
                            cancelText: '暂不查看',
                            confirmText: '查看',
                            success: function (res) {

                                if (res.confirm) {


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

                                            that.setData({

                                                type:res.data.data.type

                                            })


                                            if(that.data.type=='1'){

                                                wx.navigateTo({

                                                    url: '../../common/wages_authentication/authentication'

                                                })

                                            }

                                            else if(res.data.data.type=='0'){

                                                wx.navigateTo({

                                                    url:'../../user/locked/locked'
                                                })

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

                                    wx.showToast({

                                        title: '必须加入企业才可查看工资条哦~关闭后可在“我的工作单位”中继续加入',
                                        icon: 'none',

                                    })


                                }
                            }
                        });

                    },1000)





                }

                //是否加入企业
                else if (thisType == 2) {


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
                        success: function (res) {

                            if (res.confirm) {



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

                                        that.setData({

                                            type:res.data.data.type

                                        })


                                        if(that.data.type=='1'){

                                            wx.navigateTo({

                                                url: '../../common/authentication/authentication'

                                            })

                                        }

                                        else if(res.data.data.type=='0'){

                                            wx.navigateTo({

                                                url:'../../user/locked/locked'
                                            })

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

                                    title: '必须加入企业才可查看工资条哦~关闭后可在“我的工作单位',
                                    icon: 'none',

                                })


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

        //分页
        that.chooseEntId();

        //发薪企业
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

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                //wx.setStorageSync('wages', res.data.data);

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

                //获取现在的list
                var thislist = res.data.data.list;

                var wagesListLength;

                var _dataText = res.data.data.hasOwnProperty('list')


                //判断有没有列表数据

                if (!_dataText) {

                    that.setData({

                        dataText: _dataText,


                    })


                }

                else {

                    that.setData({

                        dataText: _dataText,


                    })

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


                        that.setData({

                            wagesList: nowList,

                        });


                    }

                    else {

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

            wages: '暂无数据',//获取用户余额信息

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

            //lookWages:true,//看不看余额


        });

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

        //console.log('是否有更多数据'+that.data.hasMoreData)

        if (that.data.hasMoreData) {

            that.setData({

                hasMoreData: false,

            });


            //判断后面是否要加载分页
            var useFn = function () {

                //console.log(that.data.thisWagesListLength +'<'+ that.data.pageSize);

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

        that.setData({

            lookWages: !that.data.lookWages
        })

    },

});