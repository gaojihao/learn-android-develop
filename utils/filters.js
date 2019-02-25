import date from './data'
//import { WEB_ROOT, IMAGE_ROOT, IMAGE_ROOT_TIMG, LazySrc } from '@/constants'
import {isNumber1} from '@/utils/utils'
import {sizeofName} from '@/utils/size'
import Vue from 'vue'
//import {isIOS, isApp} from '@/api/native'

export default {
  formatDate: date,
  viewNumber (num) {
    if (!isNumber(num)) return ''
    if (num < 10000) return num
    return (num / 10000).toLocaleString(undefined, {maximumFractionDigits: 1}) + 'W'
  },
  fromNow (time, now) {
    const between = Math.floor(((now || Date.now()) - Number(time)) / 1000)
    if (between < 60) {
      return '刚刚'
    } else if (between < 3600) {
      return ~~(between / 60) + '分钟前'
    } else if (between < 86400) {
      return ~~(between / 3600) + '小时前'
    } else if (between < 604800) {
      return ~~(between / 86400) + '天前'
    } else {
      return date(time, '%y-%m-%d %I:%M')
    }
  },
  // imgHost (key, size) {
  //   if (!key) return ''

  //   // support full img url
  //   const rFullUrl = /https?:\/\/img([1-9]|(1[0-2])).ffan.com/
  //   if (rFullUrl.test(key)) {
  //     return key
  //   }

  //   let resize = size ? `norm_m_${size}/` : ''
  //   const mark = key.charCodeAt(0) % 12 + 1
  //   return `${IMAGE_ROOT(mark)}/${resize + key}`
  // },
  imgHostSquare (key, size) {
    return this.imgHost(key, size + '!!')
  },
  // imgHostPlus (key) {
  //   if (!key) return ''

  //   if (key.indexOf('//') >= 0) {
  //     return key
  //   }

  //   return `${IMAGE_ROOT}/${key}`
  // },
  imgHash (key) {
    if (!key) return ''
    let i = key.lastIndexOf('/')
    return i > -1 ? key.slice(i + 1) : key
  },
  // urlHost (path) {
  //   if (!path) return ''

  //   return `${WEB_ROOT}/aperture/index.html${path}`
  // },
  queryStringify (queries) {
    let legalQueryIndex = 0
    return Object.keys(queries).reduce((str, query) => {
      if (!queries[query]) return str
      const prefix = legalQueryIndex ? '&' : '?'
      str += prefix + query + '=' + queries[query]
      legalQueryIndex++
      return str
    }, '')
  },
  timg (key, opt) {
    return _timg(key, opt)
  },
  timg_w (key, opt, isGif) {
    return _timg(key, {width: Vue.prototype.$widthes.img}, isGif)
  },
  timg_m (key, opt) {
    return _timg(key, {width: 300})
  },
  timg_s (key, opt) {
    return _timg(key, {width: 50})
  },
  leftpad (str, len, ch) {
    if (!str || !len || len <= 0 || !ch) return str

    str = str + ''
    len = len - str.length
    if (len <= 0) return str
    ch = ch + ''
    var pad = ''
    while (true) {
      if (len & 1) pad += ch
      len >>= 1
      if (len) ch += ch
      else break
    }
    return pad + str
  },
  username (name) {
    if (sizeofName(name) <= 20) return name
    return '***' + name.slice(-4)
  },

//
// function parseImg (html) {
//   // var imgreg = /(<img.*>)/g
//   // var srcreg = /\s+(src="[^"]+")/g
//   var srcreg = /\s+(src=")/g
//   // var srcs = html.match(srcreg)
//   html = html.replace(srcreg, function (match, p1) {
//     // console.log('replace: ', arguments)
//     // return `data-lazy="loading" data-img-${p1}`
//     return 'data-lazy="loading" data-normal='
//   })
//   // console.log('html: ', html)
//   // console.log('src: ', srcs)
//   // var result1 = imgreg.exec(html)
//   // var result2 = srcreg.exec(html)
//   // console.log('reg.result.1: ', result1)
//   // console.log('reg.result.2: ', result2)
//   return html
// }

  // parseimg2 (html) {
  //   try {
  //     // var srcreg = /\s+(src=")/g
  //     // html = html.replace(srcreg, function (match, p1) {
  //     //   return ` ${LazySrc}="`
  //     // })
  //     // only replace img src
  //     var srcreg = /(<img.*?)\s+src="/g
  //     html = html.replace(srcreg, function (match, p1) {
  //       return `${p1} ${LazySrc}="`
  //     })
  //     return html
  //   } catch (err) {
  //     console.log('err-filters-parseimg2:', err)
  //   }
  // },

  parseimg (html) {
    // var imgreg = /(<img.*?data-ratio="([0-9.]+)".*?data-type="(.+?)".*?data-w="(\d+)".*?)src="(http:\/\/img\d{1,2}\.ffan\.com\/(?:orig\/)?([^?]*?)\??.*?)"/g
    var imgreg = /(<img.*?data-ratio="([0-9.]+)".*?data-type="(.+?)".*?data-w="(\d+)".*?)src="(http:\/\/img\d{1,2}\.ffan\.com\/(?:orig\/)?([^?"]+).*?)"/g

    // 1.0.30730337078651687
    // 2.gif
    // 3.1780
    // 4.http://img1.ffan.com/orig/T1sAVvBCd_1RCvBVdK?wx_fmt=gif
    // 5.T1sAVvBCd_1RCvBVdK
    html = html.replace(imgreg, function (match, imgbefore, ratio, type, width, src, img) {
      if (match && imgbefore && type && img && type.toLowerCase() !== 'gif') {
        return `${imgbefore}src="${_timg(img)}"`
      } else {
        return match
      }
    })

    return html
  },

  // parseimgsrc (src, type, width, ratio) {
  //   // <img data-fail="0" data-ratio="0.75" data-src="http://img1.ffan.com/orig/T1YKCvBCVX1RCvBVdK?wx_fmt=jpeg" data-type="jpeg" data-w="500" data-ilazy-src="http://img1.ffan.com/orig/T1YKCvBCVX1RCvBVdK?wx_fmt=jpeg">
  //   // src:   http://img1.ffan.com/orig/T1YKCvBCVX1RCvBVdK?wx_fmt=jpeg
  //   // width: 500
  //   // ratio: 0.75
  //   // type:  jpeg

  //   var reg = /http(?:s?):\/\/img\d{1,2}\.ffan\.com\/(?:orig\/)?([^?]+)/
  //   var matches = reg.exec(src)

  //   if (!matches || matches.length === 0) return src

  //   var key = matches[1]

  //   if (!type) {
  //     var mark = key.charCodeAt(0) % 12 + 1
  //     return `${IMAGE_ROOT(mark)}/${key}`
  //   }

  //   // key = 'xd-' + key
  //   var isGIF = type.toLowerCase() === 'gif'

  //   var w = isGIF ? Vue.prototype.$widthes.gif : Vue.prototype.$widthes.img
  //   return !width ? _timg(key, null, isGIF) : _timg(key, {width: (width < w ? width : w)}, isGIF)
  //   // return !width || width < w ? _timg(key, null, isGIF) : _timg(key, {width: w}, isGIF)
  // },

  rem2px (rem) {
    return Math.round(Vue.prototype.$widthes.screen * rem / Vue.prototype.$widthes.ued)
  }
}

// function _timg (key, opt, isGIF) {
//   // console.log('pixelWidth: ', Vue.prototype.$pixelWidth)
//   if (!key) return ''

//   let arr = []
//   if (opt) {
//     for (let i in opt) {
//       arr.push(`${i}_${opt[i]}/`)
//     }
//   }

//   let imgPostfix = 'auto'
//   if (window.supportWebp && !(isGIF && isIOS() && isApp())) {
//     imgPostfix = 'webp'
//   }

//   return `${IMAGE_ROOT_TIMG}/convert/resize/${arr.join('')}quality_60/url_${key}/tfs/${key}.${imgPostfix}`
// }
