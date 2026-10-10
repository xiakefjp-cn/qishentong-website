# 契审通产品展示站

在线访问：https://xiakefjp-cn.github.io/qishentong-website/

独立、无外部运行依赖的企业合同智能审核展示网站。视觉语言参考 eBrevia 官网，产品内容来自工作区内的契审通架构材料。

## 本地运行

```powershell
npm run build
npm run serve
```

然后打开 `http://127.0.0.1:4173/`。

## 目录

- `src/`：网站源文件
- `dist/`：构建产物
- `docs/research/`：页面拓扑、行为说明与组件规格

网站不加载远程字体、图片或脚本，也没有对外提交表单。工作流标签、审核步骤、滚动显隐和 FAQ 均为本地交互。
