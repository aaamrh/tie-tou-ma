# Tony Ma

使用 Astro、Markdown/MDX 和 GitHub Pages 的个人博客。文章列表按年份排列，英文字体为 Bree Serif 和 Bungee Shade，中文使用系统 sans-serif 字体。字体文件由网站提供。

## 本地运行

需要 Node.js 24 或以上版本。本地验证使用 24.14.1，GitHub Actions 使用 Node.js 24。使用 fnm 时，在项目目录执行 `fnm use` 选择 `.node-version` 指定的版本。

```powershell
npm ci
npm run dev
```

打开终端输出的网址。

```powershell
npm run check
npm run build
npm test
```

## 修改名称

编辑 `src/site.ts` 中的 `title`、`subtitle` 和 `description`。当前名称为 Tony Ma。

## 编写文章

文章放在 `src/content/posts/`。文件名决定网址，例如 `my-day.md` 对应 `/posts/my-day/`。正文使用 Markdown。

```markdown
---
title: 我的文章
description: 文章简介
date: '2026-10-13'
category: 随笔
draft: false
---

这里开始编写正文。
```

日期必须使用 `YYYY-MM-DD` 格式。分类名称不能使用 `.`、`..` 或包含斜线。`draft: true` 的文章不生成页面，也不进入文章列表或分类页面；公开仓库中的草稿源码仍然能够被阅读。

项目包含三篇示例文章和一篇草稿。可以编辑或删除它们，再添加自己的文章。检查脚本会根据当前文章检查排序、发布数量、草稿排除、内部链接和正文结构。

## 图片

图片放在 `src/assets/`，文章内使用相对路径：

```markdown
![图片说明](../../assets/my-photo.jpg)
```

Astro 在构建时优化图片并生成尺寸信息。读者点击文章图片可以放大，按 Escape 或点击关闭按钮返回正文。

MDX 可以使用 Astro 的 `Image` 组件；完整写法见 `src/content/posts/attention.mdx`。选择适当的图片尺寸，可以减少网站容量和访问流量。

## 代码块

使用三个反引号，并在开头注明语言，例如 `typescript`、`javascript`、`python`、`json`。构建时使用 Shiki 高亮。代码块右上角提供复制按钮。

## 划线与圈注

需要标记的文章使用 `.mdx` 扩展名，在文章顶部的元数据之后导入：

```mdx
import Mark from '../../components/Mark.astro';

<Mark>手绘下划线</Mark>

<Mark type="circle">圈注</Mark>

<Mark type="highlight">荧光标记</Mark>

<Mark type="box">手绘方框</Mark>

<Mark type="strike-through">手绘删除线</Mark>

<Mark type="crossed-off">交叉划除</Mark>

<Mark type="bracket">右侧括号</Mark>

<Mark type="wavy">波浪线</Mark>

<Mark type="straight">普通下划线</Mark>
```

默认颜色按标注含义分组：下划线、圈注、波浪线和普通下划线用于强调重点，统一使用琥珀色；荧光标记使用浅黄色；方框用于信息范围，使用蓝色；括号用于内容分组，使用青绿色；删除线和交叉划除表示删除或取消，统一使用中性灰色。

`color` 接受 CSS 颜色值，显式设置时优先于默认颜色，例如 `<Mark type="circle" color="#3979bd">蓝色圈注</Mark>`。默认配色在 `src/components/Mark.astro` 的 `defaultColors` 中设置。文字换行和浏览器宽度变化时，手绘标记重新计算位置。

## 发布到 GitHub Pages

1. 创建公开 GitHub 仓库，把本目录中的文件提交到仓库根目录，包含 `.github/` 和 `package-lock.json`。
2. 使用 `main` 作为发布分支。
3. 在仓库 `Settings → Pages → Build and deployment → Source` 选择 `GitHub Actions`。
4. 提交更新，或在 `Actions → Deploy Blog → Run workflow` 手动发布。

发布工作流先运行类型检查、构建和检查脚本，全部通过以后发布。网址与路径从 GitHub Pages 配置读取，同时支持个人主页仓库和普通项目仓库。

发布后的网站包含文章、图片、字体和脚本，总容量需要小于 GitHub Pages 的 1 GB 限制。`node_modules/`、`.astro/` 和源码不会加入发布文件。

## 图片来源

示例图片来自 [Unsplash](https://unsplash.com/)，下载地址为 `https://images.unsplash.com/photo-1441974231531-c6227db76b6e`，仅用于示例文章。替换为自己的图片即可。
