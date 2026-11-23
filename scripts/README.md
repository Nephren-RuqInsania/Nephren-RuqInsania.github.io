# 构建脚本

[`export-post-assets.mjs`](export-post-assets.mjs) 是静态构建的附件导出脚本。运行 `npm run build` 时，npm 在 `next build` 成功后通过 `postbuild` 执行它；单独运行 `next build` 不会复制附件。

脚本从仓库根目录运行，复用 [`src/lib/content.js`](../src/lib/content.js) 的内容索引，将目录式文章的附件复制到对应 HTML 旁边：

```text
markdown-blog/<专栏>/posts/<文章>/assets/<文件>
→ out/<专栏>/<文章>/assets/<文件>
```

导出保留附件目录内的相对路径，并在复制前确认首页和对应文章页已生成。正文引用是否有效由 [`src/lib/post-assets.js`](../src/lib/post-assets.js) 在页面渲染时检查；脚本只负责复制。预览和 GitHub Pages 都使用同一份 `out/`。
