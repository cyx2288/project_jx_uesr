/**
 * Created by ZHUANGYI on 2018/8/13.
 */

(function(){

    if (!document.getElementById("wxScript")) {
        var a = document.createElement("script");
        a.id = "wxScript";
        a.src = "https://res.wx.qq.com/open/js/jweixin-1.3.2.js";
        document.body.appendChild(a)
    }

    function beforeUnloadHandler(){


        wx.miniProgram.switchTab({

            url:'/pages/discovery/discovery/discovery'

        });


    }

    window.addEventListener('beforeunload',beforeUnloadHandler,true);


})();

