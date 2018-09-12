const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const feedbackUrl ='/salary/home/feedbacklist';//获取工资条反馈详情的url


 Page({


     data: {

         feedBackList:[],//反馈消息列表

         pageNum: 1,//初始值为2

         pageSize: 10,//一页的数量

         moreText:'没有更多数据啦~',//无数据显示暂无数据

         noData: true,//是否显示暂无数据 true为隐藏 false为显示


     },


     onShow:function () {


         var that = this;


         that.setData({

             feedBackList:[],//反馈消息列表

             pageNum: 1,//初始值为2

             pageSize: 10,//一页的数量

             moreText:'没有更多数据啦~',//无数据显示暂无数据

             noData: true,//是否显示暂无数据 true为正在加载 false为暂无数据

         })

         that.loadList()


         },


     loadList:function () {


         var that = this;

         //获取数据
         var jx_sid = wx.getStorageSync('jxsid');

         var Authorization = wx.getStorageSync('Authorization');

         //有几个ajax请求
         var ajaxCount = 1;


         if(that.data.noData) {//如果数据没有见底

             /**
              * 接口：获取工资条反馈
              * 请求方式：POST
              * 接口：/salary/home/feedbacklist
              * 入参：pageNum,pageSize
              **/

             wx.request({

                 url: app.globalData.URL + feedbackUrl,

                 method: 'POST',

                 data: json2FormFn.json2Form({

                     pageNum: that.data.pageNum,

                     pageSize: that.data.pageSize


                 }),

                 header: {

                     'content-type': 'application/x-www-form-urlencoded', // post请求

                     'jxsid': jx_sid,

                     'Authorization': Authorization

                 },


                 success: function (res) {

                     console.log(res.data);

                     app.globalData.repeat(res.data.code, res.data.msg);

                     if (res.data.code == '3001') {

                         //console.log('登录');

                         setTimeout(function () {

                             wx.reLaunch({

                                 url: '../../common/signin/signin'
                             })

                         }, 1500)

                         /*                     wx.showToast({
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

                         (function countDownAjax() {

                             ajaxCount--;

                             app.globalData.ajaxFinish(ajaxCount)

                         })();

                         var _feedBackList = res.data.data.list;

                         //console.log(_feedBackList)


                         if (!res.data.data.list || res.data.data.list.length == 0) {//这一组为空


                             //如果第一页就没有数据显示暂无数据

                             if (that.data.pageNum == '1') {

                                 that.setData({

                                     noData: false,

                                     moreText: '暂无数据',


                                 })

                             }

                             else {

                                 that.setData({

                                     noData: false,

                                 })


                             }

                         }

                         else if(res.data.data.list.length<10){


                             if(that.data.pageNum=='1') {



                                 that.setData({

                                     noData: false,

                                     feedBackList: _feedBackList

                                 })

                             }

                             else {


                                 that.setData({

                                     noData: false,

                                     feedBackList: that.data.feedBackList.concat(_feedBackList),


                                 })


                             }



                         }

                         else {

                             console.log('刷新')

                             //console.log(that.data.feedBackList)

                             /* console.log(that.data.pageNum)

                              console.log(that.data.feedBackList)*/


                             //增加数组内容
                             that.setData({

                                 pageNum: that.data.pageNum + 1,//加一页

                                 feedBackList: that.data.feedBackList.concat(_feedBackList),

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

     onReachBottom: function () {

         var that = this;

         that.loadList()

     },


     feedBackUrlFn:function (e) {


         wx.setStorageSync('salaryDetailId',e.currentTarget.dataset.detail);

         wx.setStorageSync('salaryId',e.currentTarget.dataset.id);

         //console.log(wx.getStorageSync('salaryDetailId'))



         wx.navigateTo({

             url:'../../user/feedback/feedback'
         })




     }


 });
