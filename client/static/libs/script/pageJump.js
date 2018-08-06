/**
 * Created by ZHUANGYI on 2018/7/31.
 */
var controlNum = false//控制重复点击

function pageJump(url) {

    console.log('刚进来'+controlNum)

    if(!controlNum){

        console.log('等于几'+controlNum);

        wx.navigateTo({

         url:url

         });

        controlNum = true;

        setTimeout(function () {

            controlNum = false;

        },1000)



        console.log('最后应该是'+controlNum)




    }


}

module.exports = {

    pageJump:pageJump

};




