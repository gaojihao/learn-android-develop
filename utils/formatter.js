import moment from 'moment'
moment.locale('zh-cn')

let formatPublishTime = function(time, baseLineTime = Date.now(), formatText = 'YYYY-MM-DD HH:mm') {
    let timestamp;
    if(!isNaN(Number(time))){
        timestamp = Number(time);
    }else{
        timestamp = moment(time).format('YYYY-MM-DD HH:mm:ss').valueOf();
    }

    const between = Math.floor((baseLineTime - timestamp) / 1000)
    if (between < 60) {
        return '刚刚'
    } else if (between < 3600) {
        return ~~(between / 60) + '分钟前'
    } else if (between < 86400) {
        return ~~(between / 3600) + '小时前'
    } else if (between < 604800) {
        return ~~(between / 86400) + '天前'
    } else {
        return moment(new Date(timestamp)).format(formatText);
    }
};

export {formatPublishTime}

export default {

    formatTime(date, format) {
        if (date !== undefined) {
            format = format || 'YYYY-MM-DD HH:mm:ss'
            return moment(date).format(format)
        }
        return ''
    },

    formatTimeChinese(date) {
        if (date !== undefined) {
            return moment(date).format('YYYY年MM月DD日 HH:mm:ss')
        }
        return ''
    },

    formatPublishTime
}
