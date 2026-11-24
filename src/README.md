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
- 阅读布局参考 [Starlight](https://starlight.astro.build/)，按钮和开关参考 [Vercel Geist](https://vercel.com/geist/introduction)，主题下拉参考 [shadcn/ui Native Select](https://ui.shadcn.com/docs/components/native-select)。不引入组件库，保留原生下拉、开关和折叠面板的键盘交互。
- 顶栏的「外观」面板集中放置主题选项。左侧是博客目录，宽屏文章右侧是本页目录；窄屏时两个目录可分别展开。控件圆角、面板和焦点样式在 [`app/globals.css`](app/globals.css) 统一维护。
- [`lib/article-headings.js`](lib/article-headings.js) 从文章正文的二、三级标题生成目录和唯一锚点。目录和 Markdown 渲染使用同一套规则。
- [`components/MarkdownBody.jsx`](components/MarkdownBody.jsx) 处理 GFM 和正文渲染，原始 HTML 按文本显示。全站字体在 [`app/globals.css`](app/globals.css) 统一设置；正文使用带中文回退的系统无衬线字体，代码和行号使用等宽字体，不下载网络字体。
- 文章的围栏代码块可用 `rust`、`js` 或 `bash` 等语言标记启用构建时语法高亮。[`lib/code-highlight.js`](lib/code-highlight.js) 用 Shiki 生成 GitHub Light 和 GitHub Dark 两套颜色；Starlight Dark 使用深色，其余主题使用浅色。未标注或不支持的语言保留纯文本和行号。行内代码不受影响，高亮引擎不会发送到浏览器。
- 在文章中展示 `.proto` 内容时，代码围栏使用 `proto` 或 `protobuf`。直接链接 `.proto` 附件不会在文章中内嵌高亮预览。

## 主题与测试

- [`themes/theme-registry.js`](themes/theme-registry.js) 定义主题 ID、显示名称和浅色／深色分组。[`themes/palettes.css`](themes/palettes.css) 定义全站配色；每个主题是一套独立配色，不需要明暗变体。
- [`themes/theme-metadata.js`](themes/theme-metadata.js) 校验 `theme`，并优先采用文章推荐、其次采用专栏推荐。页面只声明推荐，不改写访客偏好。
- [`themes/appearance.js`](themes/appearance.js) 提供默认偏好和首屏恢复脚本。跟随默认开启；没有推荐时使用访客所选主题，初始为 VitePress Light。关闭跟随后，所有页面都使用访客所选主题。

在仓库根目录运行 `npm test`，检查标题锚点、代码高亮、主题元数据和偏好恢复。布局与配色仍需在浏览器中查看。
