# 构建脚本

在仓库根目录运行 `npm run build`，分两步生成可发布的 `out/`：

1. **生成页面**：`next build` 读取 `markdown-blog/`，校验文章内 `./assets/` 或 `assets/` 引用，并把 Markdown 与[代码高亮](../src/README.md#文章代码高亮)渲染为静态页面。
2. **复制附件**：`next build` 成功后，npm 通过 `postbuild` 运行 [`export-post-assets.mjs`](export-post-assets.mjs)。单独运行 `next build` 会跳过这一步。

## 附件导出

脚本复用 [`src/lib/content.js`](../src/lib/content.js) 的内容索引，将目录式文章的附件复制到对应 HTML 旁边：

```text
markdown-blog/<专栏>/posts/<文章>/assets/<文件>
→ out/<专栏>/<文章>/assets/<文件>
```

导出保留相对路径，递归复制 `assets/` 中的非隐藏文件，即使正文没有引用也会公开。脚本会先确认 `out/index.html` 存在，并在复制某篇文章的附件前确认该文章的 `index.html` 已生成。

正文引用由 [`src/lib/post-assets.js`](../src/lib/post-assets.js) 在页面渲染时校验；附件脚本只复制文件，不会把 `.proto` 或其他源文件转换为高亮页面。`npm run preview` 和 GitHub Pages 使用的是同一结构的 `out/`；需要同时验证正文和附件时，请使用完整的 `npm run build`。
