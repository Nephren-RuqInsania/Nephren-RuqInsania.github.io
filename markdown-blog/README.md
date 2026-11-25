# 博客写作指南

`markdown-blog/` 存放首页简介、专栏、文章和随文章维护的图片与附件。[`home.md`](home.md) 对应博客首页 `/`；本 README 只供写作时查阅，不会出现在网站或导航中。

## 创建专栏

在仓库根目录下创建 `markdown-blog/<专栏>/index.md`。例如，`markdown-blog/rust/index.md` 对应网站的 `/rust/`。用文件头的 `title` 设置导航里显示的名字，正文写专栏简介：

```markdown
---
title: Rust 学习笔记
---

记录学习 Rust 时遇到的问题和例子。
```

有文章时，在专栏目录内创建 `posts/`，例如 `markdown-blog/rust/posts/`。没有文章时可以省略 `posts/`；**没有 `index.md` 的目录不会被识别为专栏**，即使里面已有文章。

## 创建文章

文章必须放在 `markdown-blog/<专栏>/posts/` 下，二选一：

| 写法 | 相对于仓库根目录的文件路径 | 发布后的 URL | 适合 |
| --- | --- | --- | --- |
| 单文件 | `markdown-blog/rust/posts/ownership-notes.md` | `/rust/ownership-notes/` | 正文不需要本地图片或附件。 |
| 目录式 | `markdown-blog/rust/posts/ownership-notes/index.md` | `/rust/ownership-notes/` | 正文和本地图片或附件一起维护。 |

`posts/` 只用于组织源码，**不会出现在发布网址中**；`markdown-blog/`、`.md` 和 `index.md` 也不写进网址。文章里链接到其他文章时，使用发布路径，例如 `[所有权笔记](/rust/ownership-notes/)`。

如果单文件文章后来需要配图，就把 `posts/ownership-notes.md` 改为同一专栏下的 `posts/ownership-notes/index.md`，网址不变。**不要同时保留同名的 `.md` 和含 `index.md` 的目录**，否则会因地址冲突报错。

`posts/` 下只识别直接存放的非隐藏 `.md` 文件，或含 `index.md` 的非隐藏直属目录；不会递归寻找更深层的文章。专栏目录名和文章名使用小写英文字母和数字，可以用单个连字符分隔多段（如 `ownership-notes`），不能连续使用连字符，也不能放在首尾。`404` 和 `500` 不能用作专栏名。改文件名或移动到其他专栏会改变网址，只改文件头里的 `title` 不会。

### 添加配图和附件

对于目录式文章，在 `index.md` 旁建一个 `assets/`，把图片和附件放进去，再从正文用相对路径引用。例如：

```text
markdown-blog/
└── rust/
    ├── index.md
    └── posts/
        └── ownership-notes/
            ├── index.md
            └── assets/
                ├── diagram.svg
                └── example.txt
```

```markdown
![所有权移动示意图](./assets/diagram.svg)
[打开示例文本](./assets/example.txt)
```

`./assets/` 相对于当前文章页。例如 `./assets/diagram.svg` 发布后的路径是 `/rust/ownership-notes/assets/diagram.svg`。引用不存在的文件会报错。`assets/` 内的非隐藏文件都会公开，包括正文没有引用的文件，因此不要放入私密内容。

## 文件头元数据怎么解析

首页、专栏简介和文章都从文件开头的 **YAML 文件头**读取元数据。第一行写 `---`，填完字段后另起一行写 `---` 结束文件头；后面的内容才作为 Markdown 正文渲染。文件头本身不会显示在正文里。

文章示例：

```markdown
---
title: Rust 所有权笔记
author: konata
contact-us: '邮件联系：izumi@konata.com'
date: '2004-05-28'
sequence: 1
theme: rust
summary: 我并不羡慕别人的人生，这就是所谓幸福。
---

## 用引用读取字符串

这里开始写正文。
```

| 字段 | 填写规则 | 网站怎么用 |
| --- | --- | --- |
| `title` | **必填**，必须是非空文本；正文里的 `# 标题` 不能替代它。 | 用作页面标题；专栏和文章也用它作为导航里的显示名称。 |
| `author` | 文章可选，填写希望公开显示的作者名。 | 显示在文章标题下方。 |
| `contact-us` | 文章可选，填写愿意公开的联系方式。可以直接写纯文字，也可以用 `[文字](地址)` 添加链接。 | 显示在文章标题下方。只有带有效地址的显式 Markdown 链接才可点击；直接填写的邮箱、网址或说明都按纯文本显示。 |
| `date` | 文章可选。用 `YYYY-MM-DD`，建议加引号；不填时省略整行。格式不正确会报错。 | 在文章和专栏列表中显示日期，也用于同一序号下的排序。 |
| `sequence` | 文章可选。填写不加引号的非负整数，例如 `0`、`1`、`2`；不填时省略整行。 | 在同一专栏内，有序号的文章按数字从小到大排在前面，未填写的排在后面。博客目录和专栏文章列表使用同一顺序。 |
| `theme` | 专栏和文章可选。可填 `vitepress-light`、`rust`、`starlight-dark`；`default` 等同于 `vitepress-light`。 | 当读者开启「跟随页面推荐」时，文章推荐优先于专栏推荐。没有推荐时使用读者所选的主题。 |
| `summary` | 文章可选，写一段简短的文本。 | 显示在专栏列表和文章标题下方，也用作页面描述；不填就不显示，不会从正文自动截取。 |

序号相同或都未填写时，文章按日期从新到旧排列；没有日期的排在有日期的后面，日期仍相同则按文章路径名排序。无需给旧文章补序号。

`author` 和 `contact-us` 都是可选文本，省略或留空就不会显示，已有文章不需要补填。联系方式会随文章公开，请不要填入私人信息。

如果希望上面示例的邮箱可点击，可以改写为 `contact-us: '[邮件联系](mailto:izumi@konata.com)'`。只想显示文字时，直接填写文字即可，不需要加 `[]()`。

文章的**归属和 URL 由路径决定**，不是由文件头里的 `category` 或 `slug` 决定。当前也没有 `draft` 字段来隐藏文章。正文的章节建议从 `##` 开始；支持表格、任务列表、删除线和脚注等 GFM 写法，原始 HTML 按文本显示。
