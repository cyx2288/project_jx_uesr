/**
 * Created by ZHUANGYI on 2018/6/4.
 */

function ajaxFinish(ajaxCount) {

    wx.showLoading({

        title: '加载中',

    });

    if(ajaxCount==0) {

        setTimeout(function () {

            wx.hideLoading();

        },1000);


    }


}

module.exports = {

    ajaxFinish:ajaxFinish

};

