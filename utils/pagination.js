let mergeList = function(list, addList, process) {
    if(!list){
        list = [];
    }

    if(!addList){
        return list;
    }

    addList.map(function (item, index) {
        if(process && typeof process === 'function'){
            let resultItem = process(item, index);
            if(typeof resultItem !== 'undefined'){
                list.push(resultItem);
            }else{
                list.push(item);
            }
        }else{
            list.push(item)
        }
    })

    return list;
};

export default {
    getPagination: function (params, response) {
        let page = params.page || 1;
        let size = params.size || 10;
        if(!response || !response.total){
            return {
                total: 0,
                size: size,
                currentPage: page,
                lastPage: page,
                pages: page,
                hasMore: false,
                allLoaded: true,
            }
        }
        return {
            total: response.total,
            size: size,
            currentPage: page,
            lastPage: response.pages,
            pages: response.pages,
            hasMore: response.pageNum < response.pages,
            allLoaded: response.pageNum >= response.pages
        }
    },

    getPaginationByMoreSign(params, response){
        let page = params.page || 1;
        let size = params.size || 10;
        if(!response || !response.isMore){
            return {
                total: 0,
                size: size,
                currentPage: page,
                lastPage: page,
                pages: page,
                hasMore: false,
                allLoaded: true,
            }
        }
        return {
            total: 0,
            size: size,
            currentPage: page,
            lastPage: 9999999,
            pages: 9999999,
            hasMore: response.isMore,
            allLoaded: !response.isMore
        }
    },

    mergePaginationData: function (currentPage = 1, list, addList, process) {
        if(currentPage === 1){
            return mergeList([], addList, process);
        }else{
            return mergeList(list, addList, process);
        }
    },

    isByPassResponse(statePagination, responsePagination){
        return statePagination.currentPage &&
            responsePagination.currentPage > 1 &&
            responsePagination.currentPage <= statePagination.currentPage;
    },

    createPaginationStateData({ data, params , serverKey, stateKey}){

    },
}
