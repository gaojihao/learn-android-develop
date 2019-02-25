// helper
function parseKey(key) {
  key = key.replace(/\//g, '');
  key = key.replace(/[:]/g, '');
  key = key.replace(/[.]/g, '');
  return  'sd_' + key;
}
  
class localStore {
  constructor() {
    this.storage = global.localStorage;

    let self = this;

    this.isValid = !!global.localStorage && (function() {
      // in mobile safari if safe browsing is enabled, window.storage
      // is defined but setItem calls throw exceptions.
      let success = true;
      let value = Math.random() + '';
      try {
        self.storage.setItem(value, value);
      } catch (e) {
        success = false;
      }
      self.storage.removeItem(value);
      return success;
    })();

    // if(!this.isValid) {
    //   throw 'No window.localStorage support in here: ' + navigator.userAgent;
    // }
    // if(!global.JSON) {
    //   throw 'No window.JSON support in here: ' + navigator.userAgent;
    // }
  }
  /**
   * Get data by key
   *
   * @param {string} key  The key to get the data for
   * @return {array|object} The JSON.parse()`d data
   */
  get(key) {
    key = parseKey(key);
    if(this.storage.getItem(key) !== 'undefined'){
      return JSON.parse(
        this.storage.getItem(key)
      );
    }
  }

  /**
   * Store data to localStorage
   *
   * @param {string} key  The key
   * @param {array|object}  data The value, will be stringify'ed
   */
  set(key, data) {
    key = parseKey(key);
    this.storage.setItem(key, JSON.stringify(data));
  }

  // setSearchHistory(key,data){
  //   key = parseKey(key);
  //   let searchHistory = this.get(key)
  //   searchHistory.unshif
    

  // }
  setSearchHistory(key,data) { 
    let _self = this 
    let keyword = data.trim(); 
    let searchHistory = _self.get(key);  
    if(data ==='') return
    if (searchHistory === undefined||searchHistory === null) {  
        _self.set(key,keyword)
    } else {  
      const onlyItem = searchHistory.split('|').filter(e => e != keyword);  
      if (onlyItem.length > 0) searchHistory = keyword + '|' + onlyItem.join('|');  
      _self.set(key,searchHistory) 
    }  
  } 

   getSearchHistory(key){
    let searchHistory = this.get(key);
    if (searchHistory == null){
      return []
    }
    let res=searchHistory.split('|')
    res.length >=10?res.length =10:''
    return res
   }

  /**
   * Delete the data stored by 'key' if it exists.
   *
   * @param {string} key  The key
   */
  remove(key) {
    key = parseKey(key);

    this.storage.removeItem(key);
  }

  /**
   * Clear all data from localStorage
   */
  clear() {
    this.storage.clear();
  }
}
  
export default new localStore()
  