/**
 * Created by ZHUANGYI on 2018/5/31.
 */
function repeat(code,msg) {

        if(code=='3003') {

            console.log('登录');

            wx.showToast({
                title: msg,
                icon: 'none',
                duration: 4000,

                success:function () {

                    setTimeout(function () {

                        wx.reLaunch({

                            url:'../../common/signin/signin'
                        })

                    },4000)

                }

            })

            return false

        }


}

module.exports = {

    repeat:repeat

};
