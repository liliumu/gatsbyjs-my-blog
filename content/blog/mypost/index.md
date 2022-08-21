---
title: MyPost
date: "2022-05-06T23:46:37.121Z"
---

### 事前準備

- Node.js をインストールしてあること。
- Vercel CLI は `vercel login` で Vercel アカウントとリンクされていること。
- AWS アカウントを持っておりアクセスキー ID と シークレットアクセスキーをもつ IAM ユーザーがあること。
    - 念の為 IAM ユーザーのもつアクセス許可が、やりたいことに対して適切な権限になっていることを確認すること。

### Vercel プロジェクトを開始

npx create-next-app して vercel deploy まで確認する。 ESLint の設定などは省略。

```
> npx create-next-app@latest --typescript --use-npm vercel-with-boto3-2
> cd vercel-with-boto3-2
> npm run dev   
# チェックポイント -> http://localhost:3002 が開けるか確認
> vercel
> vercel deploy 
# チェックポイント -> https://***.vercel.app/ が開けるか確認
```

### 環境変数をセットする

AWS のアクセスキーが必要である。 Vercel には Vercel Environment Variables という機能があるため、ブラウザで Vercel のプロジェクトを開いて Settings よりポチポチすると、環境変数をセットできる。

なお Vercel Environment Variables では AWS_ACCESS_KEY_ID は予約語で使えないため、ここではかわりに AWS_ACCESS_KEY_ID_ を用いた。

```
AWS_ACCESS_KEY_ID_="xxxx"
AWS_SECRET_ACCESS_KEY_="xxxx"
REGION_=""
```

### Python で書かれた API を作成する

API のリクエストを処理するには、 BaseHTTPRequestHandler として記述する。

Vercel の Function として使うコードは api ディレクトリに置く (pages/ 以下ではない)。また直下に requirements.txt を置く。あとはいい感じに Vercel がやってくれる。

```
requirements.txt
api/getbucketinfo.py
api/test.py
```

requirements.txt

```
boto3
```

api/getbucketinfo.py

```python
import boto3
import json
import os

session = boto3.session.Session(
    aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID_"],
    aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY_"],
    region_name=os.environ["REGION_"],
)

s3_client   = session.client('s3')
s3_resource = session.resource('s3')
bucket      = s3_resource.Bucket("***")

def getbucketinfo():
    r = s3_client.list_buckets(Bucket=bucket.name)
    r = json.loads(json.dumps(r, default=str))
    return r

if __name__ == "__main__":
    from pprint import pprint
    pprint(getbucketinfo())
```

api/test.py

```python
from http.server import BaseHTTPRequestHandler
from .getbucketinfo import getbucketinfo
import json

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        body = json.dumps(getbucketinfo(), indent=4, ensure_ascii=False)
        self.wfile.write(body.encode())
        return

```
