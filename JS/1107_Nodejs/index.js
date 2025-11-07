// import 自訂變數名 from 來源
// import apple from 'a.js'-->引用a.js套件
// import apple from './a.js'-->引用a.js檔案
import apple from './a.js' //引用a.js檔案的export default，命名為apple

// import *as 自訂變數 from 來源
import * as banana from './b.js' //---->一次引用所有具名匯出
// import { 指定變數 }  from 來源
// import {b1,b2,print} from 'b.js'---->單獨選擇需要引入的具名匯出
// import { b1, b2, print as printt } from 'b.js'---->將引入檔案的print改名，避免重名
console.log('index.js', apple.a1)
console.log('index.js', apple.a2)
console.log('index.js', apple.a3)

apple.a1 = 100
apple.a2 = 200
apple.a3 = [300, 400]
console.log('index.js', apple.a1) //index.js 100
console.log('index.js', apple.a2) //index.js 200
console.log('index.js', apple.a3) //index.js [ 300, 400 ]
apple.print() /* a.js 1
                 a.js 2
                 a.js [ 100, 200 ] */
