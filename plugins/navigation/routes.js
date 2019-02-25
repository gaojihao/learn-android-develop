let routes = []

if(process.browser){
    if (global.sessionStorage.VUE_NAVIGATION) {
        routes = JSON.parse(global.sessionStorage.VUE_NAVIGATION)
    }
}

export default routes
