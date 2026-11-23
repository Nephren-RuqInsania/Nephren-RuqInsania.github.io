# NephrenRuqInsania 的博客

一个用 Markdown 写作的个人静态博客。Next.js App Router 在构建时读取 `markdown-blog/`，生成首页、专栏、文章和导航目录；页面使用 Tailwind CSS 排版。站点发布到 GitHub Pages，不需要运行 Next.js 服务。

## 本地构建与预览

需要 **Node.js 24**，静态预览另需 **Python 3**。可以使用仓库的 [Dev Container](.devcontainer/devcontainer.json)，其中配置了 `4173` 端口转发。

**构建前确认当前工作区同时包含站点源码和 `markdown-blog/home.md`。** 在首次发布前，站点代码和初始内容分别维护在 `dev/site` 和 `markdown-blog`。如果手头是仅有源码且整个 `markdown-blog/` 目录都不存在的检出，可以从本地 `markdown-blog` 分支临时取出内容，不切换分支、不暂存文件：

```sh
git restore --source=markdown-blog --worktree -- markdown-blog/
```

在仓库根目录运行：

```sh
npm ci
npm run build
npm run preview
```

打开 <http://localhost:4173/>。预览直接提供 `out/` 中的静态文件，不会热更新；修改文章、附件或样式后，重新运行 `npm run build` 再刷新。请使用 `npm run build` 而不是直接执行 `next build`，否则不会运行附件复制步骤。

页面布局参考 [Starlight](https://starlight.astro.build/)：顶部固定站点标题与外观设置，桌面左侧显示博客目录。宽屏文章右侧显示由二、三级标题生成的「本页目录」；屏幕较窄时，博客目录和本页目录可分别展开。

顶栏直接提供「主题偏好跟随」开关和主题选择下拉框。[VitePress Light](https://vitepress.dev/zh/guide/what-is-vitepress) 和 [Rust Book](https://doc.rust-lang.org/book/) 是浅色主题，[Starlight Dark](https://starlight.astro.build/guides/css-and-tailwind/) 是深色主题。没有独立的明暗设置，每个主题只需提供一套配色。

全站共用一套带中文回退的系统无衬线字体，代码使用等宽字体。切换主题不改变字体，也不会下载网络字体。

## 写作

| 文件路径（`markdown-blog/` 下） | 页面地址 |
| --- | --- |
| `home.md` | `/` |
| `<专栏>/index.md` | `/<专栏>/` |
| `<专栏>/posts/<文章>.md` | `/<专栏>/<文章>/` |
| `<专栏>/posts/<文章>/index.md` | `/<专栏>/<文章>/` |

首页、专栏和文章都需要带 `title` 的 YAML 文件头；文章可以另填 `date` 和 `summary`。专栏和文章的 URL 由目录名和文件名决定，而不是由标题决定。同一专栏下，单文件和目录式文章不能使用同一个名称。

专栏和文章可以用 `theme: rust` 推荐全站配色。「主题偏好跟随」默认开启：有推荐时优先使用文章推荐，其次是专栏推荐；都不推荐时使用访客所选主题，初始为 VitePress Light。关闭跟随后，所有页面都使用所选主题。跟随开关和主题选择会保存在同一浏览器中，页面推荐不会覆盖它们。

带图片或附件的文章使用目录式写法，将文件放在文章的 `assets/` 下，正文用 `./assets/文件名` 引用。缺失附件会导致构建失败；即使没有被引用，`assets/` 内的非隐藏文件也会公开。完整格式见[博客写作指南](markdown-blog/README.md)。

正文支持 GFM 表格、任务列表和脚注，原始 HTML 按文本显示。文章代码块按源码行编号；长行折行时不新增行号，复制代码不带行号。

## 项目结构

| 路径 | 用途 |
| --- | --- |
| [`src/app/`](src/app/) | 页面路由、公共布局和全局样式 |
| [`src/components/`](src/components/) | 响应式博客目录、Markdown 正文和带行号的代码块 |
| [`src/lib/`](src/lib/) | Markdown 内容读取、文章标题锚点、专栏与文章索引、附件引用校验 |
| [`src/themes/`](src/themes/) | 主题注册表、色板和访客偏好 |
| [`markdown-blog/`](markdown-blog/) | 首页、专栏、文章及随文章维护的附件 |
| [`scripts/export-post-assets.mjs`](scripts/export-post-assets.mjs) | 构建后将附件复制到 `out/` 中对应的文章目录 |
| [`.github/workflows/pages.yml`](.github/workflows/pages.yml) | 构建、检查并发布静态站点 |

## 分支与发布

- `main` 是发布分支。首次发布时，确保 `main` 同时包含站点源码、部署工作流和初始博客内容。
- `dev/site` 用于站点基础功能；后续个性化样式可从最新的 `main` 创建 `dev/style`，单独提交和审查。
- `markdown-blog` 用于维护文章和附件，通过 PR 合入 `main` 后发布；仅推送内容分支不会更新站点。

首次发布前，在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中将 **Source** 设为 **GitHub Actions**。推送到 `main` 后，工作流会安装依赖、构建并将 `out/` 部署到 Pages，也可以在 **Actions** 中从 `main` 手动运行。部署完成后，在 [站点](https://stwtp890.github.io/) 检查首页、文章直达链接和附件。

仓库只提交源码、内容、配置和 `package-lock.json`，不提交 `node_modules/`、`.next/` 或 `out/`。
