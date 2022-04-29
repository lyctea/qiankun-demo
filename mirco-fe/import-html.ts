import { fetchResource } from "./fetch-resource";

export const importHTML = async (url) => {
  const html = await fetchResource(url);
  const template = document.createElement("div");
  template.innerHTML = html;

  /**
   * 获取所有的 script 标签的代码：[code, code, code ...]
   */
  const scripts = template.querySelectorAll("script");

  async function getExternalScripts() {
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttribute("src");
        if (!src) {
          return Promise.resolve(script.innerHTML);
        } else {
          return fetchResource(src.startsWith("http") ? src : `${url}${src}`);
        }
      })
    );
  }

  /**
   * 获取并执行所有的 script 脚本代码
   */
  async function execScripts() {
    const srcipts = await getExternalScripts();

    // 手动构造commonjs模块环境
    const module = { exports: {} };
    const exports = module.exports;

    srcipts.forEach((code) => {
      // eval 执行的代码可以访问外部变量
      eval(code);
    });

    // 返回子应用打包的umd兼容包，可访问生命周期方法
    // return window["vue-app"]; 可能有重名问题
    return module.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts,
  };
};
