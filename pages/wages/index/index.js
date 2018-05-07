
const app = getApp();

const salaryUrl = '/salary/home/getSelectEnt';//获取企业


/*下拉选择*/
Page({
    data:{
        selectPerson:true,
        firstPerson:'筛选',
        selectArea:false,
    },
    //点击选择类型
    clickPerson:function(){
        var selectPerson = this.data.selectPerson;
        if(selectPerson == true){
            this.setData({
                selectArea:true,
                selectPerson:false,
            })
        }else{
            this.setData({
                selectArea:false,
                selectPerson:true,
            })
        }
    } ,
    //点击切换
    mySelect:function(e){
        this.setData({
            firstPerson:e.target.dataset.me,
            selectPerson:true,
            selectArea:false,
        })
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数

        var url = app.globalData.URL + salaryUrl;

        wx.request({//注册

            url: url,

            method: 'POST',

            header: {
                'content-type': 'application/x-www-form-urlencoded' // post请求
            },

            success: function (res) {

                console.log(res.data)


            },

            fail: function (res) {
                console.log(res)
            }

        })

    },
    onReady:function(){
        // 页面渲染完成



    },
    onShow:function(){
        // 页面显示
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    }
})