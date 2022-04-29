import { handleRouter } from "./handle-router";

let prevRoute = ""; // 上一个路由
let nextRoute = window.location.pathname; // 下一个路由

export const getPrevRoute = () => prevRoute;
export const getNextRoute = () => nextRoute;

export const rewriteRouter = () => {
  // hash 路由： window.onhashchange

  // history 路由：
  // history.go、history.back history.forward 使用 popstate事件：window.onpopstate
  window.addEventListener("popstate", () => {
    prevRoute = nextRoute;
    nextRoute = window.location.pathname;
    handleRouter();
  });

  // pushState、replaceState 需要通过函数重写的方式进行劫持
  const rawPushState = window.history.pushState; //保存一个备份
  window.history.pushState = (...args) => {
    prevRoute = window.location.pathname;
    rawPushState.apply(window.history, args);
    nextRoute = window.location.pathname;
    handleRouter();
  };

  const rawReplaceState = window.history.replaceState; //保存一个备份
  window.history.replaceState = (...args) => {
    prevRoute = window.location.pathname;
    rawReplaceState.apply(window.history, args);
    nextRoute = window.location.pathname;
    handleRouter();
  };
};
