/* 
状态<=>控制 条件配置化 
场景: 
  当业务复杂,一个功能是否可用或一个UI元素的显示控制或逻辑操作,需要多个状态/条件值来确定,
  而大量存在该场景时,若每次都条件来组合判断,冗余且逻辑散落未集中管理,导致开发、维护困难 
  
  场景需求: 多对多, 多个条件对多个操作 
  对象存储: 一对多, 多个条件合并为一个对应多个操作 
  对象查询: 多对一, 多个条件合并为一个查询指定一个操作 
解决方案: 
  将需要组合的条件配置化,集中管理,
  通过一函数传入条件来进行判断, 
*/


class StateManager {
  constructor(conditionList,handlesMap) {
    
    // 配置表,用于存储条件对应的操作 
    this._conditionHandleMap = {
      // 'aa02,bb03,cc--,dd--,ee01,': {
      //   hd1: true, 
      //   hd2(arg){}, 
      // },
    },
    
    // 所有可能的判断条件,未枚举的将被忽略  
    this._conditionList = conditionList;
    // 所有可能的操作,未枚举的将被忽略
    this._handlesMap = handlesMap;
    
    // 针对于使用vue的项目,若使用了vuex,则可将该功能集成到 store 中 
    let that = this;
    this._store = {
      state: {
        conditionHandleMap: that._conditionHandleMap,
      },
      getters: {
        // 通过可传参的getters来获取 条件对应的操作 
        query({conditionHandleMap},getters){
          return function(handle,conditions){
            let key = conditionList.reduce((retVal,itm,idx)=>{ 
              let cdt = conditions[itm]?conditions[itm]:'--'; 
              return  retVal+itm+cdt+','
            },'') 
            
            if (!conditionHandleMap[key]) { return ; }
            
            return conditionHandleMap[key][handle];
          }
        },
      },
      namespaced: true,
    }
  }
  
  // 定义 key,使用同一的字符长度 
  getKey(conditions){
    return this._conditionList.reduce((retVal,itm)=>{ 
      let c = conditions[itm]?conditions[itm]:'--'; 
      return  retVal+itm+c+','
    },'') 
  }
  
  
  /* 初始化操作条件配置: 
  当情况过于复杂,如判断的条件可能个数不同,导致手动定义不便,而采用函数来简化 
  */
  setter(handleList,conditions){
    let key = this.getKey(conditions);
    let val = {}
    handleList.forEach(handle=>{ val[handle] = this._handlesMap[handle]; })
    this._conditionHandleMap[key] = val;
  }
  // 用于写入条件对应的操作 
  getter(handle,conditions){
    let key = this.getKey(conditions);
    
    if (!this._conditionHandleMap[key]) { return ; }
    
    return this._conditionHandleMap[key][handle];
  }
  
  
  install(store,mdName='stateManager'){
    store.registerModule(mdName,this._store)
  }
}


export default StateManager;

