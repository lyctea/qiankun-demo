import { handleRouter } from "./handle-router.ts"
import { rewriteRouter } from "./rewrite-router.ts"

let _apps = []

export const getApps = () => _apps

/**
 * 注册微应用
 */
export const registerMicroApps = (apps) => {
    // 保存注册的微应用
    _apps = apps
}

export const start = () => {
    // 微前端的运营原理

    // 1、监视路由变化
    rewriteRouter()
    // 初始化执行匹配
    handleRouter()


    // 2、匹配子应用 


    // 3、加载子应用 

    // 4、渲染子应用
}


