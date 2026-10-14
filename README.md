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

## 主题切换

站名右侧的太阳/月亮开关用于切换浅色和深色主题，可见尺寸为 `54 × 24px`，点击区域高度为 `44px`，支持 Tab 聚焦和空格切换。

首次访问跟随系统主题，手动选择保存在浏览器的 `tony-ma-theme` localStorage 项目中。刷新、页面跳转和同源标签页之间保持选择一致；尚未手动选择时，跟随系统主题的实时变化。主题在页面头部初始化。

深色背景为炭黑 `#18191b`，正文为灰白 `#e7e8ea`，代码区为 `#222427`。代码高亮随主题切换；深色模式下默认波浪线提高明度，荧光区域使用深色文字。文章显式设置的标记颜色优先于默认配色。

按钮封装在 `src/components/ThemeSwitch.astro`，样式在 `src/styles/theme-switch.css`，主题状态逻辑在 `src/scripts/theme.js`。系统开启减少动画时，开关停止动画。

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

默认配色分为七组，同组使用同一种颜色：

| 标记分组 | 类型 | 颜色 |
| --- | --- | --- |
| 方框：信息范围 | `box` | 蓝色 `#2787e5` |
| 画圈：关键词 | `circle` | 珊瑚红 `#e9435a` |
| 括号：内容分组 | `bracket` | 粉色 `#e879b5` |
| 删除或取消 | `strike-through`、`crossed-off` | 中性灰 `#858585` |
| 横线：重要观点 | `underline`、`straight` | 绿色 `#2b9e68` |
| 波浪线：精彩表达 | `wavy` | 电光紫 `#7f00ff` |
| 背景：荧光标记 | `highlight` | 柠檬黄 `#ffe66d` |

`color` 接受 CSS 颜色值，显式设置时优先于默认颜色，例如 `<Mark type="circle" color="#2787e5">蓝色圈注</Mark>`。默认配色在 `src/components/Mark.astro` 的 `defaultColors` 中设置。文字换行和浏览器宽度变化时，手绘标记重新计算位置。

## 发布到 GitHub Pages

1. 创建公开 GitHub 仓库，把本目录中的文件提交到仓库根目录，包含 `.github/` 和 `package-lock.json`。
2. 使用 `main` 作为发布分支。
3. 在仓库 `Settings → Pages → Build and deployment → Source` 选择 `GitHub Actions`。
4. 提交更新，或在 `Actions → Deploy Blog → Run workflow` 手动发布。

发布工作流先运行类型检查、构建和检查脚本，全部通过以后发布。网址与路径从 GitHub Pages 配置读取，同时支持个人主页仓库和普通项目仓库。

发布后的网站包含文章、图片、字体和脚本，总容量需要小于 GitHub Pages 的 1 GB 限制。`node_modules/`、`.astro/` 和源码不会加入发布文件。

## 图片来源

示例图片来自 [Unsplash](https://unsplash.com/)，下载地址为 `https://images.unsplash.com/photo-1441974231531-c6227db76b6e`，仅用于示例文章。替换为自己的图片即可。
