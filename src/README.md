# 站点源码

`src/` 是 Next.js 应用代码。跨目录导入可用 `@/`，由根目录的 [`jsconfig.json`](../jsconfig.json) 映射到 `src/`。

| 目录 | 职责 |
| --- | --- |
| [`app/`](app/) | App Router 路由、公共布局、404 页面和全局样式 |
| [`components/`](components/) | 顶栏、博客目录、外观设置、Markdown 正文和带行号的代码块 |
| [`lib/`](lib/) | 内容读取、文章标题锚点和附件引用校验 |
| [`themes/`](themes/) | 主题注册、配色、元数据解析和访客偏好 |

## 路由与排版

- `app/[[...segments]]/page.jsx` 在构建时列出首页、专栏和文章路径。首页始终列出，所以没有专栏或文章时也能导出。各页面的展示组件放在同目录的 `_components/` 下。
- 布局参考 [Starlight](https://starlight.astro.build/)。顶栏提供全站外观设置，左侧是博客目录，宽屏文章右侧是本页目录；窄屏时两个目录可分别展开。
- [`lib/article-headings.js`](lib/article-headings.js) 从文章正文的二、三级标题生成目录和唯一锚点。目录和 Markdown 渲染使用同一套规则。
- [`components/MarkdownBody.jsx`](components/MarkdownBody.jsx) 处理 GFM 和正文渲染，原始 HTML 按文本显示。全站字体在 [`app/globals.css`](app/globals.css) 统一设置；正文使用带中文回退的系统无衬线字体，代码和行号使用等宽字体，不下载网络字体。

## 主题与测试

- [`themes/theme-registry.js`](themes/theme-registry.js) 定义主题 ID、显示名称和浅色／深色分组。[`themes/palettes.css`](themes/palettes.css) 定义全站配色；每个主题是一套独立配色，不需要明暗变体。
- [`themes/theme-metadata.js`](themes/theme-metadata.js) 校验 `theme`，并优先采用文章推荐、其次采用专栏推荐。页面只声明推荐，不改写访客偏好。
- [`themes/appearance.js`](themes/appearance.js) 提供默认偏好和首屏恢复脚本。跟随默认开启；没有推荐时使用访客所选主题，初始为 VitePress Light。关闭跟随后，所有页面都使用访客所选主题。

在仓库根目录运行 `npm test`，检查标题锚点、主题元数据和偏好恢复。布局与配色仍需在浏览器中查看。
