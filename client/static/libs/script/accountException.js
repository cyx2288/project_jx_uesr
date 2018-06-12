/**
 * Created by ZHUANGYI on 2018/5/31.
 */
function repeat(code,msg) {

        if(code=='3003') {

            console.log('登录');

            wx.showToast({
                title: msg,
                icon: 'none',

                success:function () {

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },1500)

                }

            })

            return false

        }


}

module.exports = {

    repeat:repeat

};
