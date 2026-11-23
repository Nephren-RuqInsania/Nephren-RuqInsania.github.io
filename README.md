# NephrenRuqInsania 的博客

一个用 Markdown 写作的个人静态博客。站点使用 Next.js App Router 和 Tailwind CSS，在构建时生成首页、专栏和文章，通过 GitHub Pages 提供静态页面。

当前站点提供响应式阅读布局和三套可切换的全站主题：VitePress Light、Rust Book 和 Starlight Dark。访客可以跟随页面推荐，也可以固定使用自己的主题。

## 本地构建与预览

使用 **Node.js 24**；静态预览另需 **Python 3**。仓库提供 [Dev Container](.devcontainer/devcontainer.json)，已配置预览端口 `4173`。

### 首次运行

在仓库根目录执行以下命令。当前分支需同时包含站点源码和 `markdown-blog/home.md`，例如 `main` 或基于它创建的开发分支。

```sh
npm ci
npm test
npm run build
npm run preview
```

### 每条命令的作用

| 命令 | 做什么、何时运行 |
| --- | --- |
| `npm ci` | 按 `package-lock.json` 安装锁定版本的依赖，不更新锁文件。首次检出、换环境或锁文件变更后运行；只改文章或样式时不必重复安装。 |
| `npm test` | 用 Node.js 内置测试运行器检查目录锚点、主题元数据和偏好恢复。适合修改相关逻辑后或提交前运行；它不生成页面，也不检查浏览器中的布局和配色。 |
| `npm run build` | 先运行 `next build`，将站点静态导出到 `out/`，再通过 `postbuild` 复制文章附件。修改文章、附件、页面或样式后重新运行。直接执行 `next build` 会跳过[附件导出步骤](scripts/README.md)。 |
| `npm run preview` | 确认 `out/index.html` 存在且非空，然后用 Python 启动静态文件服务器。它只读取 `out/`，不会重新构建，也没有热更新。 |

### 浏览器预览

预览启动后打开 <http://localhost:4173/>。在 Dev Container 中，可从 VS Code 的 **端口** 面板打开转发地址。服务会持续运行，按 `Ctrl+C` 停止。

改完文章或样式后，如果预览还在运行，在另一个终端执行 `npm run build`，成功后刷新浏览器即可。若预览启动即退出，先确认上次构建成功且已生成 `out/index.html`。

预览默认监听 `127.0.0.1:4173`。如果使用独立 Docker 容器且需要端口映射，可在容器内运行 `PREVIEW_HOST=0.0.0.0 npm run preview`，在宿主机用 `-p 127.0.0.1:4173:4173` 将访问限制在本机。`PREVIEW_HOST` 只改变监听地址，不改变端口。

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
