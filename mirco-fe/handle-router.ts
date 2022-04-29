import { getPrevRoute, getNextRoute } from "./rewrite-router";
import { importHTML } from "./import-html";
import { getApps } from "./index.js";

/**
 * 处理路由变化
 */
export const handleRouter = async () => {
  const apps = getApps();

  //获取上一个子应用
  const prevApp = apps.find((item) => {
    return getPrevRoute().startsWith(item.activeRule);
  });

  // 获取下一个子应用
  const app = apps.find((item) => {
    return getNextRoute().startsWith(item.activeRule);
  });

  // 如果有上一个应用，则先销毁
  if (prevApp) {
    await unmount(prevApp);
  }

  if (!app) return;

  // 3. 请求子应用
  const { template, getExternalScripts, execScripts } = await importHTML(
    app.entry
  );

  const container = document.querySelector(app.container);
  container.appendChild(template);

  // 配置全局变量
  window.__POWERED_BY_QIANKUN__ = true;
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + "/";

  const appExports = await execScripts();
  console.log("appExports", appExports);

  app.bootstrap = appExports.bootstrap;
  app.mount = appExports.mount;
  app.unmount = appExports.unmount;

  await bootstrap(app);
  await mount(app);

  // 请求子应用资源，js、css
  //   const html = await fetch(app.entry).then((res) => res.text());
  //   const container = document.querySelector(app.container);

  // 直接复制页面不会加载子应用，原因：
  // 1. 客户端渲染需要通过执行js来生成内容
  // 2. 浏览器处于安全考虑，innerhtml中的js不会自动加载执行
  //   container.innerHTML = html;

  // 手动加载子应用的 script，执行script 中代码(eval、new Function)
};

async function bootstrap(app) {
  app.bootstrap && (await app.bootstrap());
}

async function mount(app) {
  app.mount &&
    (await app.mount({
      container: document.querySelector(app.container),
    }));
}

async function unmount(app) {
  app.unmount &&
    (await app.unmount({
      container: document.querySelector(app.container),
    }));
}
