/* 
状态<=>结果 配置化 
场景: 
  当业务复杂,一个功能是否可用或一个UI元素的显示控制或逻辑操作,需要多个状态值来确定, 
  而大量存在该场景时,若每次都用条件来组合判断,冗余且逻辑散落未集中管理,导致开发、维护困难 
  
解决方案: 
  定义: 多个状态值 和 多个结果值, 配置对应关系到一列表集合中 
  查询: 将当前状态值和定义的状态值匹配,返回结果值 
*/

class StateManager {
  /* 初始化,列出将会进行判断的所有状态 */
  constructor(stateList) {
    // 所有可能的状态场景,未枚举的将被忽略 
    this._stateList = stateList;  // ['st1', 'st2', ]
    
    // 状态结果数据中心: 用于判断状态对应的结果 
    this._StateResultList = [
      // {
      //   states: {
      //     st1: 'a',
      //     st2: 'b',
      //   },
      //   results: {
      //     rst1: 'A',
      //     rst2: 'B',
      //   },
      // },
    ]
    
    // 针对使用了vuex插件的vue项目,可将该功能集成到 store 中 
    let that = this;
    this._store = {
      state: { __sttrst__: that._StateResultList, },
      getters: {
        // 通过可传参的getters来获取 条件对应的操作 
        query({__sttrst__},getters){
          return function(rst,stateMap){
            return that.getter(rst,stateMap)
          }
        },
      },
      namespaced: true,
    }
  }
  
  /* 单条定义状态及结果 */
  setter(stateMap,resultMap){
    /* 
      设定状态时, 
      *   表示任意 
      !   取反 
      []  多个条件 
      Example: 
        {
          st1: '*',       // 表示任意状态值都可,默认:不填写的字段都为'*',
          st2: '!1'       // 取反,不为'1',都可以 
          st3: ['1','2'], // 状态值可为'1'、'2' 
        }
    */
    this._StateResultList.push({ states: stateMap, results: resultMap, })
  }
  /* 多条定义状态及结果 */
  setConfigs(configList){
    configList.forEach((itm,idx)=>{
      this.setter(itm[0],itm[1]);
    });
  }
  
  /* 查询 状态对应的结果 */
  getter(rst,stateMap){
    let rstMap = this._StateResultList.find(itm=>{ 
      return this._objInclude(itm.states,stateMap) 
    }) || {results:{},};
    return rstMap.results[rst];
  }
  
  /* 使用vuex时,接入store中 */
  install(store,mdName='stateManager'){
    store.registerModule(mdName,this._store)
  }
  
  // 条件集合包含关系判断: 条件少包含条件多 
  _objInclude(pObj,cObj){
    // { key1:1, } 相当于 { key1:1, key2: <*>, } 包含 { key1: 1, key2: 2, } 
    let bol = true; // 空对象{} 包含任意对象  
    
    for(var key in pObj){
      let val1 = pObj[key];
      // 查询的条件 未定义则表示为任意值 
      let val2 = cObj[key] || '*'; 
      
      // 配置的条件: * 任意 
      if (val1==='*') { continue; }  
      // 配置的条件: ! 非 
      if (val1[0]==='!') {
        val1 = val1.slice(1);
        // 无法确定包含关系,即不包含,直接跳出 
        if (val2==='*') {
          bol = false; 
          break;
        }
        if (val1===val2) { 
          bol = false; 
          break;
        }
        continue;
      }
      // 配置的条件: [] 数组 
      if (val1.includes('/')) {
        val1 = val1.split('/')
        // 无法确定包含关系,即不包含,直接跳出 
        if (val2==='*') {
          bol = false; 
          break;
        }
        
        if (!val1.includes(val2)) { 
          bol = false; 
          break;
        }
        continue;
      }
      // 配置的条件: 其他 
      if ( val2==="*" || val1!==val2 ) { 
        bol = false; 
        break;
      }
    };
    
    return bol;
  }
}


export default StateManager;


