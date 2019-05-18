// function dateFormat(date, fmt) {
//     if (null == date || undefined == date) return '';
//     var o = {
//         "M+": date.getMonth() + 1, //月份
//         "d+": date.getDate(), //日
//         "h+": date.getHours(), //小时
//         "m+": date.getMinutes(), //分
//         "s+": date.getSeconds(), //秒
//         "S": date.getMilliseconds() //毫秒
//     };
//     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
//     for (var k in o)
//         if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//     return fmt;
// }
// //  module.exports={
//     Date.prototype.toJSON = function () { return dateFormat(this,'yyyy-MM-dd hh:mm:ss')}
// //  }
// var utc_datetime = "2017-03-31T08:02:06Z";

function utc2beijing(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0,T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;

    // 增加8个小时，北京时间比utc时间多八个时区
    var timestamp = timestamp+8*60*60;

    // 时间戳转为时间
    var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    return beijing_datetime; // 2017-03-31 16:02:06
} 
module.exports={
    utc2beijing
}
// console.log(utc2beijing(utc_datetime));

