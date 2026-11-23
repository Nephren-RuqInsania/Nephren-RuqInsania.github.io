# NephrenRuqInsania 的博客

一个用 Markdown 写作的个人静态博客。站点使用 Next.js App Router 和 Tailwind CSS，在构建时生成首页、专栏和文章，通过 GitHub Pages 提供静态页面。

当前站点提供响应式阅读布局和三套可切换的全站主题：VitePress Light、Rust Book 和 Starlight Dark。访客可以跟随页面推荐，也可以固定使用自己的主题。

## 本地构建与预览

使用 **Node.js 24**；静态预览另需 **Python 3**。仓库提供 [Dev Container](.devcontainer/devcontainer.json)，已配置预览端口 `4173`。

从 `main` 检出后，在仓库根目录运行：

```sh
npm ci
npm test
npm run build
npm run preview
```

打开 <http://localhost:4173/>。预览直接提供 `out/` 中的静态文件，不会热更新；改动后重新构建再刷新。请使用 `npm run build`，直接执行 `next build` 会跳过附件导出。预览默认监听 `127.0.0.1`，可通过 `PREVIEW_HOST` 修改监听地址。

## 文档

- [站点源码：`src/README.md`](src/README.md)
- [构建脚本：`scripts/README.md`](scripts/README.md)
- [博客写作指南：`markdown-blog/README.md`](markdown-blog/README.md)

博客内容的变更先汇入 `markdown-blog`，不直接提交到 `main`。见下方[内容发布流程](#内容发布流程)。

## 分支与发布

- `main` 是发布分支，包含站点源码、内容与部署配置。
- 站点功能和样式可在 `dev/site` 或独立开发分支上完成，再通过 PR 合入 `main`。
- `markdown-blog` 是博客内容的汇总分支，用于维护首页、专栏、文章和附件。

### 内容发布流程

1. **先同步 `markdown-blog`**：写作前拉取远端 `markdown-blog` 的最新提交，以它为起点。
2. **提交内容，任选一种方式**：有权限时可直接在 `markdown-blog` 提交并推送；需要隔离或审阅时，从最新的 `markdown-blog` 新建内容分支（例如 `content/rust-notes`），完成后创建 PR，**目标分支选 `markdown-blog`**，审阅通过后再合入。
3. **统一发布**：待本批内容汇总完成，从 `markdown-blog` 向 `main` 创建发布 PR。合入 `main` 后才触发 GitHub Pages 构建和部署；推送内容分支或将内容 PR 合入 `markdown-blog` 都不会直接上线。

### GitHub Pages

GitHub Pages 的发布来源为 **GitHub Actions**，在仓库的 **Settings → Pages → Build and deployment** 中配置。[发布工作流](.github/workflows/pages.yml) 在推送到 `main` 时安装依赖、构建并检查 `out/`，再部署到 [站点](https://stwtp890.github.io/)，也可从 `main` 手动触发。工作流目前不运行 `npm test`，可在提交前本地执行。

仓库只提交源码、内容、配置和 `package-lock.json`，不提交 `node_modules/`、`.next/` 或 `out/`。
