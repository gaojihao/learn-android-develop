
export const formatDate = (tagdate, fmt) => {
    var vdate = new Date(tagdate);
  // console.log(vdate)
    if (/(y+)/.test(fmt)) {
  // console.log(vdate.getFullYear())
      fmt = fmt.replace(RegExp.$1, (vdate.getFullYear() + '').substr(4 - RegExp.$1.length));
      let o = {
        'M+': vdate.getMonth()+1,
        'd+': vdate.getDate(),
        'h+': vdate.getHours(),
        'm+': vdate.getMinutes(),
        's+': vdate.getSeconds()
      };
  // console.log()
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
      }
    } else if (/(M+)/.test(fmt)) {
  
  
      let str = vdate.getMonth() + 1
  
  
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  
  
  
  
    return fmt;
  };
  
  function padLeftZero(str) {
    return ('00' + str).substr(str.length);
  };
  
  export const getRequestParam = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  };