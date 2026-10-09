export async function onRequest(context) {
  const { request, params, env } = context;
  const fileName = Array.isArray(params.path) ? params.path.join('/') : params.path;
  const host = `${env.COS_BUCKET}.cos.${env.COS_REGION}.myqcloud.com`;
  const target = `https://${host}/media/${fileName}`;

  const resp = await fetch(target, {
    headers: { 'User-Agent': 'Cloudflare-Pages-Proxy' },
    cf: { cacheTtl: 86400, cacheEverything: true },
  });

  const headers = new Headers(resp.headers);
  headers.set('Cache-Control', 'public, max-age=86400');
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(resp.body, { status: resp.status, headers });
}
