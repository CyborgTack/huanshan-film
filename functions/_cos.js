// COS 签名工具（从环境变量取密钥，不硬编码）
// Cloudflare Pages → Settings → Environment Variables 里配：
//   COS_ID, COS_KEY, COS_BUCKET, COS_REGION

export async function hmacSha1(key, msg) {
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(msg));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function cosSign(env, method, keyPath, contentType) {
  const now = Math.floor(Date.now() / 1000);
  const keyTime = `${now};${now + 7200}`;
  const signKey = await hmacSha1(env.COS_KEY, keyTime);
  const httpString = `${method.toLowerCase()}\n${keyPath}\n\n\n`;
  const stringToSign = `sha1\n${keyTime}\n${await hmacSha1(signKey, httpString)}\n`;
  const signature = await hmacSha1(signKey, stringToSign);
  return `q-sign-algorithm=sha1&q-ak=${env.COS_ID}&q-sign-time=${keyTime}&q-key-time=${keyTime}&q-header-list=&q-url-param-list=&q-signature=${signature}`;
}

export async function cosPut(env, key, body, contentType) {
  const host = `${env.COS_BUCKET}.cos.${env.COS_REGION}.myqcloud.com`;
  const url = `https://${host}/${key}`;
  const auth = await cosSign(env, 'put', '/' + key, contentType);
  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': auth,
      'Content-Type': contentType || 'application/octet-stream',
    },
    body,
  });
  if (!r.ok) throw new Error('COS PUT ' + r.status + ' ' + await r.text());
  return r;
}

export async function cosGet(env, key) {
  const host = `${env.COS_BUCKET}.cos.${env.COS_REGION}.myqcloud.com`;
  return fetch(`https://${host}/${key}`, {
    headers: { 'User-Agent': 'CF-Pages' },
  });
}
