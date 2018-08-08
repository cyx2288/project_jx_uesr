/**
 * Created by ZHUANGYI on 2018/8/6.
 */
var animationShowHeight = 300;

var actionSheet = {

    data: {

        animationData: "",

        showModalStatus: false,

        title: '确认转出',

        operationTitle: '支付金额',

        sum: '100',

        list: [

            {
                key: '转账金额',
                value: '￥100'

            },
            {
                key: '对方姓名',
                value: '庄中煲'

            },
            {

                key: '转账金额',
                value: '￥100'

            }

        ],

        btnTitle: '确认转账'

    },

    onShow:function(){

        wx.getSystemInfo({

            success: function (res) {

                animationShowHeight = res.windowHeight;


            }
        })

    },

    preventTouchMove:function(){

        //遮罩禁止touchmove

    },



};

function showModal(obj) {

       obj = obj || {};

        obj.animationData = obj.animationData ||'';

        obj.showModalStatus = obj.showModalStatus||false;

        obj.title = obj.title||'确认转出';

        obj.sum = obj.sum||'100';

        obj.list = obj.list||[];

        obj.btnTitle = obj.btnTitle||'确认转账';


    // 显示遮罩层
    var animation = wx.createAnimation({

        duration: 200,

        timingFunction: "linear",

        delay: 0

    });


    this.animation = animation;

    animation.translateY(animationShowHeight).step();


    this.setData({

        animationData: animation.export(),

        showModalStatus: true

    });

    console.log(this.data.animationData);

    setTimeout(function () {

        animation.translateY(0).step();

        this.setData({

            animationData: animation.export()

        })

    }.bind(this), 200)

}

function hideModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({

        duration: 200,

        timingFunction: "linear",

        delay: 0

    });

    this.animation = animation;

    animation.translateY(animationShowHeight).step()

    this.setData({

        animationData: animation.export(),

    })
    setTimeout(function () {

        animation.translateY(0).step()

        this.setData({

            animationData: animation.export(),

            showModalStatus: false

        })
    }.bind(this), 200)
}

module.exports = {

    showModal:showModal,

    hideModal:hideModal,

};
