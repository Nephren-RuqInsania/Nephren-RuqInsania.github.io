# 站点维护文档

站点由 Next.js App Router 和 Tailwind CSS 构建，从 `markdown-blog/` 读取内容并静态发布到 GitHub Pages。代码结构见[站点源码](../src/README.md)，附件处理见[构建脚本](../scripts/README.md)。

## 本地构建与预览

使用 **Node.js 24**；静态预览还需要 **Python 3**。[Dev Container](../.devcontainer/devcontainer.json) 配置了预览端口 `4173`。完整构建需要同时包含站点源码和 `markdown-blog/home.md`，例如 `main` 或基于它创建的开发分支。`dev/site` 不含博客内容，单独检出时可以运行测试，但不能构建整站。

在仓库根目录运行：

```sh
npm ci
npm test
npm run build
npm run preview
```

| 命令 | 作用 |
| --- | --- |
| `npm ci` | 按锁文件安装依赖，不更新锁文件。首次检出、换环境或锁文件变更后运行。 |
| `npm test` | 检查标题锚点、代码高亮、主题元数据和偏好恢复，不检查浏览器布局和配色。 |
| `npm run build` | 生成静态页面和代码高亮，再通过 `postbuild` 把文章附件复制到 `out/`。直接运行 `next build` 会跳过附件导出。 |
| `npm run preview` | 检查 `out/index.html` 后启动静态服务，不会重新构建或热更新。 |

打开 <http://localhost:4173/>，或在 VS Code 的 **端口** 面板打开转发地址。修改内容或样式后重新构建，再刷新浏览器。按 `Ctrl+C` 停止预览。

预览默认监听 `127.0.0.1:4173`。独立 Docker 容器需要端口映射时，在容器内运行 `PREVIEW_HOST=0.0.0.0 npm run preview`，宿主机使用 `-p 127.0.0.1:4173:4173` 将访问限制在本机。

仓库提交源码、内容、配置和 `package-lock.json`，不提交 `node_modules/`、`.next/` 或 `out/`。

## 分支与内容发布

- `main` 是发布分支，包含站点源码、内容与部署配置。
- 站点改动在 `dev/site` 或独立开发分支上完成，通过 PR 合入 `main`。
- 首页、专栏、文章和附件先汇入 `markdown-blog`。写作前先同步该分支；如果需要审阅，从它创建内容分支，PR 目标仍选 `markdown-blog`。内容汇总完成后，再从 `markdown-blog` 向 `main` 创建发布 PR。

推送内容分支或将 PR 合入 `markdown-blog` 不会直接上线。

## GitHub Pages

在仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。[部署工作流](../.github/workflows/pages.yml) 在推送到 `main` 后安装依赖、构建并检查 `out/`，再发布到[博客](https://nephren-ruqinsania.github.io/)。也可在 **Actions → Deploy blog to GitHub Pages → Run workflow** 中选择 `main` 手动部署。工作流不运行 `npm test`，可在提交前本地执行。

如果线上显示仓库根 README，或 Actions 中的 `pages build and deployment` 包含 `Build with Jekyll`，请先检查发布来源是否仍为 **Deploy from a branch**。切换为 **GitHub Actions** 后重新运行仓库自己的部署工作流。根目录的 `.nojekyll` 只能跳过分支发布中的 Jekyll 步骤，不会构建或发布 `out/`。

部署成功后，确认线上首页显示 `markdown-blog/home.md` 的正文，目录列出已合入 `main` 的专栏和文章。
