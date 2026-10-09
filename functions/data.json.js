import { cosGet, cosPut } from './_cos.js';

// GET: 拉 COS 上的 data.json，no-cache 确保实时
export async function onRequestGet(context) {
  const { env } = context;
  const r = await cosGet(env, 'data.json');
  const body = await r.arrayBuffer();
  return new Response(body, {
    status: r.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// PUT: 更新 COS 上的 data.json
export async function onRequestPut(context) {
  const { env, request } = context;
  const auth = request.headers.get('X-Admin-Password');
  if (auth !== (env.ADMIN_PWD || 'hs2026admin')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const body = await request.arrayBuffer();
  try {
    await cosPut(env, 'data.json', body, 'application/json; charset=utf-8');
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response('COS_ERROR_V2: ' + e.message, { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    },
  });
}
