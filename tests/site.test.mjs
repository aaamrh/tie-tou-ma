import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { load } from 'cheerio';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';

const root = resolve('dist');
const base = `${(process.env.BASE_PATH || '').replace(/\/$/, '')}/`;
const origin = 'http://localhost';

async function filesWithExtensions(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesWithExtensions(path, extensions));
    else if (extensions.some((extension) => entry.name.endsWith(extension))) files.push(path);
  }
  return files;
}

test('生成的页面、内部链接和本地资源完整', async () => {
  const files = await filesWithExtensions(root, ['.html']);
  assert.ok(files.length >= 2);
  for (const file of files) {
    const $ = load(await readFile(file, 'utf8'));
    assert.equal($('html').attr('lang'), 'zh-CN');
    assert.equal($('h1').length, 1, file);
    assert.ok($('title').text().trim(), file);
    assert.ok($('meta[name="description"]').attr('content'), file);
    const pagePath = file.slice(root.length).replaceAll('\\', '/').replace(/index\.html$/, '');
    const pageUrl = new URL(`${base}${pagePath.replace(/^\//, '')}`, origin);
    for (const element of $('a[href], img[src], script[src], link[rel="stylesheet"][href], link[rel="icon"][href]').toArray()) {
      const target = $(element).attr('href') ?? $(element).attr('src');
      const url = new URL(target, pageUrl);
      if (url.origin !== origin) continue;
      assert.ok(url.pathname.startsWith(base), `地址缺少发布路径：${target}`);
      const relative = decodeURIComponent(url.pathname.slice(base.length));
      let path = resolve(root, relative);
      assert.ok(path === root || path.startsWith(`${root}\\`) || path.startsWith(`${root}/`));
      if (url.pathname.endsWith('/')) path = join(path, 'index.html');
      assert.ok((await stat(path)).isFile(), `${file}: ${target}`);
      if (url.hash) {
        const destination = load(await readFile(path, 'utf8'));
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(destination('[id]').toArray().some((node) => destination(node).attr('id') === id), `${target}: 目标不存在`);
      }
    }
  }
});

test('文章列表按日期排列，草稿不进入任何发布页面', async () => {
  const sourceFiles = await filesWithExtensions(resolve('src/content/posts'), ['.md', '.mdx']);
  const sources = [];
  for (const file of sourceFiles) {
    const document = new VFile(await readFile(file, 'utf8'));
    matter(document);
    sources.push(document.data.matter);
  }
  const published = sources.filter((data) => !data.draft).sort((a, b) => new Date(b.date) - new Date(a.date));
  const home = load(await readFile(join(root, 'index.html'), 'utf8'));
  const listed = home('.post-link').toArray().map((node) => home(node).text());
  assert.equal(listed.length, published.length);
  assert.deepEqual([...listed].sort(), published.map((post) => post.title).sort());
  const dates = home('.post-row time').toArray().map((node) => new Date(home(node).attr('datetime')).getTime());
  assert.deepEqual(dates, published.map((post) => new Date(post.date).getTime()));
  const publishedUrls = new Set(home('.post-link').toArray().map((node) => home(node).attr('href')));
  const titles = [];
  for (const file of await filesWithExtensions(root, ['.html'])) {
    const $ = load(await readFile(file, 'utf8'));
    for (const node of $('.post-link, .post-navigation a').toArray()) {
      assert.ok(publishedUrls.has($(node).attr('href')), `${file}: 文章链接不属于公开文章`);
    }
    if ($('.post-title').length) titles.push($('.post-title').text());
  }
  assert.deepEqual(titles.sort(), published.map((post) => post.title).sort());
});

test('正文图片、代码块和文字标记结构完整', async () => {
  const types = ['underline', 'circle', 'highlight', 'box', 'strike-through', 'crossed-off', 'bracket', 'wavy', 'straight'];
  for (const file of await filesWithExtensions(root, ['.html'])) {
    const $ = load(await readFile(file, 'utf8'));
    for (const image of $('.prose img').toArray()) {
      assert.notEqual($(image).attr('alt'), undefined, file);
      assert.ok($(image).attr('src'), file);
    }
    for (const pre of $('.prose pre').toArray()) {
      assert.equal($(pre).children('code').length, 1, file);
      if ($(pre).hasClass('astro-code')) assert.ok($(pre).attr('style').includes('color:'), file);
    }
    for (const mark of $('.mark').toArray()) {
      const type = types.find((name) => $(mark).hasClass(`mark--${name}`));
      assert.ok(type, file);
      const handDrawn = ['underline', 'circle', 'highlight', 'box', 'strike-through', 'crossed-off', 'bracket'].includes(type);
      assert.equal($(mark).attr('data-annotation'), handDrawn ? type : undefined, file);
    }
  }
});
