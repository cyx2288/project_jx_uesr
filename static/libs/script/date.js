/**
 * Created by ZHUANGYI on 2018/5/15.
 */
var DateFr = {

    getDate: function (time, splitStr) {

        if (!time) return '';

        var date =getDate(time);
        var M = date.getMonth() + 1;
        var y = date.getFullYear();
        var d = date.getDate();

        if (M < 10) M = "0" + M;
        if (d < 10) d = "0" + d;

        if (splitStr)
            return y +splitStr + M +splitStr+d;
        else
            return {
                y: y,
                M: M,
                d: d
            };
    }
}

module.exports = {
    getDate: DateFr.getDate
}
