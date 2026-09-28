# -*- coding: utf-8 -*-
"""讙山图 · 云端自动搬运（GitHub Actions 版）
读取飞书多维表格「待入库」记录 → 下载附件 → ffmpeg 压缩视频 →
写入本地仓库 media/ + data.json（新增卷自动立卷/普通卷入待归卷）→ 由 workflow commit+push。
失败不阻塞，逐条处理，最后输出摘要。
"""
import os, sys, json, time, base64, subprocess, urllib.request, urllib.error

APP_ID = os.environ["FEISHU_APP_ID"]
APP_SECRET = os.environ["FEISHU_APP_SECRET"]
BASE_TOKEN = "QpMEb90ava8EzmsTskhccuBEnTh"
TABLE_ID = "tbldAGuLQos6R1W6"
REPO_DIR = os.environ.get("REPO_DIR", os.getcwd())
MEDIA_DIR = os.path.join(REPO_DIR, "media")
DEFAULT_IMG = "assets/brand/logo-totem.png"
FS = "https://open.feishu.cn/open-apis"

def http_json(url, method="GET", data=None, headers=None, raw=False):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            b = r.read()
            return b if raw else json.loads(b)
    except urllib.error.HTTPError as e:
        return {"_http": e.code, "_body": e.read().decode("utf-8", "ignore")[:400]}

def fs_token():
    r = http_json(FS + "/auth/v3/tenant_access_token/internal", method="POST",
                  data=json.dumps({"app_id": APP_ID, "app_secret": APP_SECRET}).encode(),
                  headers={"Content-Type": "application/json"})
    return r.get("tenant_access_token") or ""

def fs(path, method="GET", data=None, token=None):
    headers = {"Authorization": "Bearer " + (token or fs_token())}
    if data is not None:
        headers["Content-Type"] = "application/json"
    return http_json(FS + path, method=method, data=(json.dumps(data).encode() if data is not None else None), headers=headers)

def fs_download(ft, token):
    """取附件真实下载地址（tmp_url 接口带 token）→ 下载。
    注意：tmp_url 接口返回 data.tmp_download_urls[].tmp_download_url 才是真实地址。"""
    req_url = ft.get("tmp_url") or ft.get("url")
    if not req_url:
        raise RuntimeError("附件无下载地址")
    r = http_json(req_url, method="GET", headers={"Authorization": "Bearer " + token})
    if isinstance(r, dict) and "_http" in r:
        raise RuntimeError("取下载地址失败：HTTP {0} {1}".format(r["_http"], r["_body"]))
    urls = (r.get("data", {}).get("tmp_download_urls") or [])
    if not urls:
        raise RuntimeError("下载地址为空：{0}".format(str(r)[:200]))
    real = urls[0].get("tmp_download_url") or urls[0].get("tmp_url")
    return http_json(real, method="GET", raw=True)

def pick_text(v):
    """select/text 单元格取可读文本"""
    if v is None:
        return ""
    if isinstance(v, list):
        return "".join(str(x.get("text", x if isinstance(x, str) else "")) for x in v if isinstance(x, dict)) or (v[0] if v and isinstance(v[0], str) else "")
    return str(v)

def pick_files(v):
    """attachment 单元格取 [{"file_token","name","tmp_url"}]"""
    if not v:
        return []
    return [x for x in v if isinstance(x, dict) and x.get("file_token")]

def norm_vol(name):
    return name.strip().strip("《》").strip()

def load_data():
    p = os.path.join(REPO_DIR, "data.json")
    if os.path.exists(p):
        return json.load(open(p, encoding="utf-8"))
    return {"projects": [], "videos": [], "inbox": [], "updatedAt": ""}

def save_data(d):
    json.dump(d, open(os.path.join(REPO_DIR, "data.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    d2 = json.load(open(os.path.join(REPO_DIR, "data.json"), encoding="utf-8"))
    assert d2 == d, "data.json 写回校验失败"
    return d2

def compress(src, dst):
    """ffmpeg 1080p H.264 CRF26 aac128k faststart；失败返回 False"""
    try:
        r = subprocess.run(["ffmpeg", "-y", "-i", src, "-vf", "scale='min(1080,iw)':-2",
                            "-c:v", "libx264", "-crf", "26", "-preset", "medium",
                            "-profile:v", "main", "-movflags", "+faststart",
                            "-c:a", "aac", "-b:a", "128k", "-ac", "2", dst],
                           capture_output=True, timeout=1800)
        return r.returncode == 0 and os.path.exists(dst) and os.path.getsize(dst) > 0
    except Exception:
        return False

def main():
    token = fs_token()
    if not token:
        print("FAIL 获取飞书访问令牌失败")
        return
    # 1) 查询待入库
    q = {"filter": {"conjunction": "and", "conditions": [{"field_name": "入库状态", "operator": "is", "value": ["待入库"]}]},
         "field_names": ["作品标题", "作品文件", "备注", "入库状态", "作者", "所属卷", "封面图", "新增卷名称", "归卷板块"]}
    r = fs("/bitable/v1/apps/{0}/tables/{1}/records/search".format(BASE_TOKEN, TABLE_ID), method="POST", data=q, token=token)
    if "_http" in r:
        print("FAIL 查询待入库记录：HTTP {0} {1}".format(r["_http"], r["_body"]))
        return
    items = r.get("data", {}).get("items", [])
    print("查询到待入库记录：{0} 条".format(len(items)))
    if not items:
        return
    d = load_data()
    media_repo = os.environ.get("MEDIA_REPO", "CyborgTack/huanshan-film")
    media_prefix = os.environ.get("MEDIA_PREFIX", "https://raw.githubusercontent.com/CyborgTack/huanshan-film/main/media/")
    os.makedirs(MEDIA_DIR, exist_ok=True)
    ok, fail = [], []
    for rec in items:
        rid = rec.get("record_id")
        try:
            f = rec.get("fields", {})
            title = pick_text(f.get("作品标题")) or "未命名"
            author = pick_text(f.get("作者")) or "佚名"
            vol = pick_text(f.get("所属卷")) or "其他"
            newvol = pick_text(f.get("新增卷名称"))
            files = pick_files(f.get("作品文件"))
            covers = pick_files(f.get("封面图"))
            is_video = bool(files) and any(x.get("name", "").lower().endswith((".mp4", ".mov", ".m4v", ".avi")) for x in files)
            board = pick_text(f.get("归卷板块")) or "新作待归卷"
            # 2) 下载 + 压缩 + 放 media/
            urls = []
            for ft in (files + covers)[:2]:
                name = ft.get("name", "file")
                safe = "".join(c for c in name if c.isalnum() or c in "._-") or "file"
                local = os.path.join(MEDIA_DIR, "carry_{0}_{1}".format(rid[-6:], safe))
                raw = fs_download(ft, token)
                with open(local, "wb") as fh:
                    fh.write(raw if isinstance(raw, bytes) else b"")
                if not os.path.getsize(local):
                    raise RuntimeError("附件内容为空")
                # 视频压缩
                if name.lower().endswith((".mp4", ".mov", ".m4v", ".avi")):
                    comp = local + ".mp4"
                    if compress(local, comp):
                        os.remove(local)
                        local = comp
                urls.append(media_prefix + os.path.basename(local))
            u = urls[0] if (is_video and urls) else ""
            img = ""
            if covers:
                img = urls[-1] if len(urls) > 1 else urls[0]
            elif not is_video and urls:
                img = urls[0]
            img = img or DEFAULT_IMG
            # 3) 归部与立卷
            is_new = vol == "新增卷"
            vol_name = norm_vol(newvol) if (is_new and newvol) else ("" if is_new else vol)
            if is_new and not vol_name:
                vol_name = "其他"
            k = ""
            msg = "普通卷"
            if board == "影像长卷":
                if is_new:
                    target_name = "《{0}》".format(vol_name)
                    hit = next((p for p in d["projects"] if p.get("n") == target_name), None)
                    if hit:
                        k = hit["k"]; msg = "并入现有卷"
                    else:
                        k = "p" + str(int(time.time() * 1000))
                        d["projects"].append({"k": k, "n": target_name, "d": "新卷 · 待编修归卷"})
                        msg = "新建卷"
                else:
                    hit = next((p for p in d["projects"] if p.get("n") == "《{0}》".format(vol)), None)
                    k = hit["k"] if hit else ""
            entry = {"pk": k, "p": ("《{0}》".format(vol_name) if is_new else vol),
                     "m": author, "t": title, "img": img, "u": u}
            if board == "影像长卷":
                d["videos"].append(entry); where = "videos/影像长卷"
            elif board == "幻境卷":
                d.setdefault("concepts", []).append(
                    {"img": img, "t": title,
                     "k": ("《{0}》".format(vol_name) if is_new else vol)})
                where = "concepts/幻境卷"
            elif board == "藏卷四部 · 精选":
                d.setdefault("featuredQueue", []).append(entry); where = "featuredQueue/精选待审"
            else:
                d.setdefault("inbox", []).append(entry); where = "inbox/新作待归卷"
            d["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime())
            # 4) 更新入库状态
            up = fs("/bitable/v1/apps/{0}/tables/{1}/records/{2}".format(BASE_TOKEN, TABLE_ID, rid),
                    method="PUT", data={"fields": {"入库状态": "已入库"}}, token=token)
            if "_http" in up:
                raise RuntimeError("状态更新失败：HTTP {0}".format(up["_http"]))
            ok.append("《{0}》/{1}/卷={2}({3})/归部={4}/视频={5}".format(title, author, entry["p"], msg, where, "Y" if u else "N"))
        except Exception as e:
            fail.append("{0}：{1}".format(rid, e))
            continue
    save_data(d)
    print("=== 搬运摘要 ===")
    print("成功 {0} 条：".format(len(ok)))
    for x in ok:
        print("  " + x)
    if fail:
        print("失败 {0} 条：".format(len(fail)))
        for x in fail:
            print("  " + x)
    print("媒体仓：{0}；媒体前缀：{1}".format(media_repo, media_prefix))

if __name__ == "__main__":
    main()
