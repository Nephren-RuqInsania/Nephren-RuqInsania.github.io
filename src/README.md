# 站点源码

`src/` 是 Next.js 应用代码。跨目录导入可用 `@/`，由根目录的 [`jsconfig.json`](../jsconfig.json) 映射到 `src/`。

| 目录 | 职责 |
| --- | --- |
| [`app/`](app/) | App Router 路由、公共布局、404 页面和全局样式 |
| [`components/`](components/) | 顶栏、博客目录、外观设置、Markdown 正文和带行号的代码块 |
| [`lib/`](lib/) | 内容读取、文章标题锚点、代码高亮和附件引用校验 |
| [`themes/`](themes/) | 主题注册、配色、元数据解析和访客偏好 |

## 内容与路由

- [`lib/content.js`](lib/content.js) 从仓库根目录读取 `markdown-blog/`，解析 YAML 文件头。`home.md` 对应 `/`，`<专栏>/index.md` 对应 `/<专栏>/`，专栏 `posts/` 下的 `<文章>.md` 或 `<文章>/index.md` 都对应 `/<专栏>/<文章>/`。
- `app/[[...segments]]/page.jsx` 在构建时生成这些路径。只要 `home.md` 有效，即使没有专栏或文章也能导出。各页面的展示组件在同目录的 `_components/` 下。
- 文章正文中的 `./assets/` 或 `assets/` 引用在渲染时校验，附件随后由[构建脚本](../scripts/README.md)复制到文章页旁边。

## 阅读布局与 Markdown

- 阅读布局参考 [Starlight](https://starlight.astro.build/)，按钮和开关参考 [Vercel Geist](https://vercel.com/geist/introduction)，主题下拉参考 [shadcn/ui Native Select](https://ui.shadcn.com/docs/components/native-select)。不引入组件库，保留原生下拉、开关和折叠面板的键盘交互。
- 顶栏右侧的「外观」面板集中放置主题选项。宽屏在左侧显示博客目录、文章右侧显示本页目录；窄屏时可从顶栏左侧打开博客目录，从文章内展开本页目录。控件圆角、面板和焦点样式在 [`app/globals.css`](app/globals.css) 统一维护。
- [`lib/article-headings.js`](lib/article-headings.js) 从文章正文的顶层二、三级标题生成目录和唯一锚点。目录和 Markdown 渲染使用同一套规则。
- [`components/MarkdownBody.jsx`](components/MarkdownBody.jsx) 处理 GFM 和正文渲染，原始 HTML 按文本显示。全站字体在 [`app/globals.css`](app/globals.css) 统一设置；正文使用带中文回退的系统无衬线字体，代码和行号使用等宽字体，不下载网络字体。

## 文章代码高亮

在文章的 Markdown 代码围栏后标注语言，例如 `rust`、`js`、`bash`。`.proto` 内容可以使用 `proto` 或 `protobuf`：

````markdown
```proto
syntax = "proto3";

message Greeting {
  string text = 1;
}
```
````

[`lib/code-highlight.js`](lib/code-highlight.js) 在构建时用 Shiki 生成 GitHub Light / Dark 两套颜色。[`NumberedCodeBlock.jsx`](components/NumberedCodeBlock.jsx) 保留行号、缩进和空行；未标注或不支持的语言以纯文本显示，行号仍保留。两套配色支持相同的 [Shiki 语言和别名](https://shiki.style/languages)。

VitePress Light 和 Rust Book 使用 GitHub Light，Starlight Dark 使用 GitHub Dark。代码块跟随当前生效的站点主题，不单独设置。切换配色只需要 CSS，高亮引擎不会发送到浏览器。

高亮仅用于文章代码块，不影响行内代码，也不会读取 `.proto` 等附件并将其嵌入正文。

## 主题与偏好

- [`themes/theme-registry.js`](themes/theme-registry.js) 定义主题 ID、显示名称和下拉分组。[`themes/palettes.css`](themes/palettes.css) 定义各主题的全站配色、`color-scheme` 和代码块背景等变量。代码高亮的深浅由 CSS `color-scheme` 决定，而不是下拉分组或系统设置。
- 专栏和文章可在文件头设置 `theme`，例如 `theme: starlight-dark`。[`themes/theme-metadata.js`](themes/theme-metadata.js) 校验 ID；`default` 代表 `vitepress-light`。开启跟随时，文章推荐优先于专栏推荐，没有推荐的页面（包括首页）使用访客所选主题。
- [`themes/appearance.js`](themes/appearance.js) 提供默认偏好和首屏恢复脚本。初始开启跟随，备用主题为 VitePress Light；关闭跟随后，全站使用访客所选主题。访客的设置保存在浏览器中，页面推荐不会改写它。

## 测试

在仓库根目录运行 `npm test`，检查文章元数据、标题锚点、代码高亮（包括 `proto` / `protobuf`）、主题元数据和偏好恢复。单元测试不需要博客内容；检查布局与配色时，请在包含有效 `markdown-blog/home.md` 的分支上[构建并预览](../docs/maintenance.md#本地构建与预览)。
