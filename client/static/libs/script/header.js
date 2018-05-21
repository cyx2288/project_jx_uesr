/**
 * Created by ZHUANGYI on 2018/5/9.
 */


function header(Authorization,jx_sid) {


    var header = {

        Authorization:Authorization,

        jx_sid:jx_sid

    };

    return header;

}

module.exports = {

    header:header
}
