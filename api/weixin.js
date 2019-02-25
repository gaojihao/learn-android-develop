import {post, get} from '../utils/service';

export default {
    async ticketSign(params) {
        return get('http://api.harbourhome.com.cn:28082/v1/wechat/ticketSign', params);

    },
}
