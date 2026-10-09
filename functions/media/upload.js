import { cosPut } from '../_cos.js';

// POST /media/upload?name=video_xxx.mp4
export async function onRequestPost(context) {
  const { env, request } = context;
  const auth = request.headers.get('X-Admin-Password');
  if (auth !== (env.ADMIN_PWD || 'hs2026admin')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const url = new URL(request.url);
  const name = url.searchParams.get('name');
  if (!name || !/^[\w.-]+\.(mp4|mov|jpg|jpeg|png|webp)$/i.test(name)) {
    return new Response('Bad filename', { status: 400 });
  }
  const body = await request.arrayBuffer();
  const ct = request.headers.get('Content-Type') || 'application/octet-stream';
  try {
    await cosPut(env, 'media/' + name, body, ct);
    return new Response(JSON.stringify({ ok: true, url: '/media/' + name, size: body.byteLength }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response('Upload error: ' + e.message, { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    },
  });
}
