import { getCollection } from 'astro:content';

export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export function postUrl(id: string) {
  const path = id.split('/').map(encodeURIComponent).join('/');
  return `${import.meta.env.BASE_URL}posts/${path}/`;
}

export function categoryUrl(category: string) {
  return `${import.meta.env.BASE_URL}categories/${encodeURIComponent(category)}/`;
}
