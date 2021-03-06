<h1> zkits JS功能/工具集 </h1>

<div>tips: 继承自 tlfns npm模块(本人已不再维护tlfns模块)</div>

<br/>
安装&引入: 

``` 
$ npm i -S zkits 

// 引入指定功能 
import xxx from "zkits/src/xx/xxx.js";
// 引入无变量导出的某些功能 
import 'zkits/src/xx/xxx.js';  
```
<!--  

<h1> 功能列表文档: </h1>

◆无变量导出的预设功能: 
```
import 'zkits/src/dom/EventTarget-noexport.js';  
EventTarget
  .addListener(evtName,listener,immediateWay)  // 绑定事件监听 
    evtName       str,事件名称 
    listener      fn,事件回调 
    immediateWay  bol,可选,立即响应的方式,默认:不立即响应,0:原生触发方式,1:仅执行回调 
  .offListeners(evtName,listener)             // 移除事件监听 
    evtName?   str,可选,不存在则移除所有监听  
    listener?  fn,可选,存在则只移除当前事件,否则移除所有该类事件 
  .emitListeners(evtName,data,emitWay)        // 触发事件 
    evt?      Event/str,可选,事件名称,不存在则触发所有事件的所有监听 
    data?     any,可选,传递的数据,在 evt.msg 中获取  
    emitWay?  0/1,触发方式,默认:0 原生触发方式 
    
import 'zkits/src/es/Object-noexport.js';  
Object
  .forEach((val,key)=>{})        // 对象遍历 
  .map((val,key)=>{})            // 返回一新对象,键的值由回调返回值确定 
    let obj = { key1: 1, key2: 2 }
    let obj1 = obj.map((val,key)=>{
      if(val===1){ return 100; }
      return val;
    })
    console.log(obj1); // {key1: 100, key2: 2}
  .filter((val,key)=>{})         // 返回一新对象,根据返回调回值来过滤原对象的键值对 
  .reduce((val,key)=>{},initVal) // 返回最后一次回调的返回值 
  .some((val,key)=>{})           // 当返回值返回true时,则立即返回true,否则最终返回 false 
  .every((val,key)=>{})          // 当返回值返回false时,则立即返回false,否则最终返回 true 
```

◆ES相关: 
```
import {getThisFnName,throttle} from './src/es/functions.js';  
getThisFnName()    // str,函数内获取当前函数的名称 [函数内执行当前函数] [严格模式下可用] 
throttle(fn,context,time=600)   // 函数节流: 限制函数执行频率 
  fn       // [高频]执行的函数 
  context  // 函数执行的上下文 
  time=600 // num,限制的频率,单位:ms  

import {roundFloat,preciseAdd,preciseMul} from './src/es/Number.js';  
roundFloat(num,decimals=0)       // 取舍小数位 
preciseAdd(num1,num2)            // 浮点数精确相加 
preciseMul(num1,num2,decimals)   // 浮点数精确相乘 

```

◆DOM相关: 
```
import copyText from './src/dom/copyText.js';  
copyText(text)    // 文本复制,返回是否复制成功的 Promise, 

import multiRowsEllipsis from './src/dom/multiRowsEllipsis.js';  
multiRowsEllipsis(elem,rows=2,sym='...',autoMode=true)   // 多行省略号,返回最终的字符串  
  elem      显示文本的且需设置多行省略的元素 
  rows      行数 
  sym       省略号字符串 
  autoMode  是否自动改变 [vue中需交给vue来维护,将返回最终的字符串重新赋值到文本显示区] 

import onResize from './src/dom/onResize.js';  
onResize(elem,callback,immediate=true)   // 监听元素的尺寸变化 
  elem       监听的元素 [目前仅支持可插入子元素的元素监听] 
  callback   元素尺寸变化时的回调 
  immediate  是否立即触发响应 

```

◆BOM相关: 
```
import {getOSName,getBrowserInfo,isIE,isLowerIE,webPAble} from './src/bom/env.js';  
getOSName()       // str,获取操作系统名称 
  如: 'windows' 'mac' 'linux' 'android' 'ios' 'unkonwn' 
getBrowserInfo()  // str,获取浏览器名称&版本 
isIE()            // bol,是否为IE 
isLowerIE()       // bol,是否为低版本IE [IE7、8、9 之一] 
webPAble()        // bol,浏览器是否支持webP格式图片 

import onConsoleOpen from './src/bom/onConsoleOpen.js';  
onConsoleOpen(callback)                  // 监听控制台打开 

```

◆其他功能: 
```
import LocalFiles from 'zkits/src/utils/LocalFiles.js';  
LocalFiles  本地文件上传 
  let localFiles = new LocalFiles({
    // 配置项可选,默认值如下:  
    multiple=true,  // 是否多选 
    accept='*',             // 可选文件类型,可自定义,如: '.pdf,.doc' 
    limitNum=99,            // 一次最多可选数量 
    limitSize=10*1024*1024, // 最大文件体积10M,unit:B 
    base64=false, // 是否返回base64 
    
    url='',              // 上传地址 
    uploadField='',      // 文件上传字段
  });
  button1.addEventListener("click",function(evt){
    localFiles.pick()
    .then(list=>{
      console.log(list);
    });
  })
  // 使用拖放功能上传 
  localFiles.onDrop(div1,function(list){
    console.log(list);
  })


```



◆解决方案:
```
import adapt from './src/design/adapt.js';  
adapt(sizeList,root,outMinHandle,outMaxHandle)  // 用于移动端页面布局 
  Example: 
    adapt(
      [200,375,600],  // 最小屏幕宽度 200, 最大 600, 默认按照 375 宽度布局 
      window, 
      ()=>{
        // 当屏幕宽度超过了最小值时的回调 
        console.log('超过了最小值 200px');
      }, 
      ()=>{
        // 当屏幕宽度超过了最大值时的回调 
        console.log('超过了最大值 600px');
      } 
    )
    
    // 在按照 375 宽度布局时, 
    // CSS样式中, 0.2rem 即表示 20px 
    // 使用less时: 
    // 在less中定义变量 @w: 1rem/ratio; 来表示1px 
    // 后续使用,如 width: 20 *@w 来表示20px在iPhone8中的大小 
    // 而当屏幕尺寸变化时,将按比例进行缩放,始终保持同 375 屏宽时,相同的比例大小 


import StateManager from './src/design/StateManager.js';  
StateManager: 状态<=>控制 条件配置化 
解决方案: 
  将需要组合的条件配置化,集中管理,
  通过一函数传入条件来进行判断, 

StateManager 使用例子:  
  // 初始化 传入 将会用到的所有条件的list
  let stMg = new StateManager([ 
    'aa', // 条件a
    'bb', // 条件b
    'cc', // 条件c
    'dd', // 条件d
    'ee', // 条件e
    'ff', // 条件f
  ]);
  // 定义 功能 和 条件的对应关系 
  stMg.setConfigs([
    [
      // 表示 条件aa为'01'&条件bb为'01'&条件cc为'03', 对应的 hd1: '001', hd2: true 
      { aa: '01', bb: '01', cc: '03' },
      { hd1: '001', hd2: true, },
    ],
    [
      // 表示 aa条件为'02'时[其他条件任意],对应的 hd1: '222' 
      { aa: '02', },
      { hd1: '222', },
    ],
    [
      // 表示 cc 条件不为'02'时,对应的 hd1: '非02' 
      { cc: '!02', },
      { hd1: '非02', },
    ],
    // ...  定义若干个,根据自己业务需求而定 
  ])
  stMg.setter(
    { aa: '01', bb: '02', },
    { hd1: true, hd2: '01', },
  )


  // 后续在需要使用的地方进行查询
  // 可将 stMg.getter 导出, 在需要的地方引入使用 
  let val1 = stMg.getter('hd1',{ aa: '01', bb: '01', }); 
  console.log( val1 ); // '222'  
  let val2 = stMg.getter('hd2',{ aa: '01' }); 
  console.log( val2 ); // undefined  
  let val3 = stMg.getter('hd1',{ aa: '01', bb: '01', cc: '03' }); 
  console.log( val3 ); // '001'  
  let val4 = stMg.getter('hd1',{ cc: '01' }); 
  console.log( val4 ); // '非02'  

针对于使用vue的项目,若使用了vuex,则可将该功能集成到 store 中 
  // 注册到store中 
  stMg.install(store,'stateManager');  
  // 后续在需要使用的地方进行查询 
  vm.$store.getters['stateManager/query']('hd2',{
    aa: '01',
    bb: '02',
  })

``` 

-->


<h1>持续更新中....</h1>
PS: 若有需要的功能 或好的建议, 请留言 








