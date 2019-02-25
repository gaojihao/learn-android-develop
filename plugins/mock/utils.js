export default {
    success(obj) {
        let data = {
            "http_status_code":0,
            "status": 200,
            "message": 'success',
            "isMore":null
        }
        for(let o in obj){
            data[o] = obj[o];
        }

        return data;
    }
}
