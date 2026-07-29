# じすい日和

「じすい日和」は、自炊を習慣化するための記録アプリです。ごはんの写真と
メモを残し、カレンダーやアルバムで振り返れます。お気に入りレシピ、食材の
期限管理、公開を選んだ投稿のコミュニティ表示といいねにも対応しています。

公開アプリ: https://dependable-dedication-production.up.railway.app

## 技術構成

| 層 | 技術 |
|---|---|
| フロントエンド | React 19、React Router 7、Axios、Create React App |
| バックエンド | FastAPI、SQLAlchemy、Pydantic v2 |
| 認証 | JWT（python-jose）、bcrypt（passlib） |
| データベース | SQLite（ローカル）、PostgreSQL（本番） |
| マイグレーション | Alembic |
| デプロイ | Railway（frontend / backend別サービス） |

## 必要な環境変数

### バックエンド

| 変数名 | 必須 | 説明 |
|---|---|---|
| `JWT_SECRET_KEY` | 必須 | JWTの署名・検証に使う秘密鍵 |
| `CORS_ORIGINS` | 任意 | 許可するフロントエンドのオリジン。複数の場合はカンマ区切り |
| `DATABASE_URL` | 任意 | SQLAlchemyの接続URL。未設定時はローカルSQLite |

### フロントエンド

| 変数名 | 必須 | 説明 |
|---|---|---|
| `REACT_APP_API_BASE_URL` | 必須 | バックエンドAPIのベースURL |

実際の `.env` はコミットしません。設定例は `backend/.env.example` と
`frontend/.env.example` を参照してください。

## ローカル起動

### バックエンド

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

`.env` の `JWT_SECRET_KEY` を十分に長いランダム値へ変更したあと、
マイグレーションを適用して起動します。

```powershell
alembic upgrade head
uvicorn app.main:app --reload
```

- API: http://127.0.0.1:8000
- APIドキュメント: http://127.0.0.1:8000/docs

### フロントエンド

別のターミナルで実行します。

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm start
```

フロントエンドは http://localhost:3000 で起動します。

## ディレクトリ構成

```text
backend/
  alembic/             # DBマイグレーション
  app/
    main.py            # FastAPIエントリポイント
    config.py          # 環境変数の読み込み
    database.py        # DBエンジンとセッション
    models/            # SQLAlchemyモデル
    schemas/           # Pydanticスキーマ
    routers/           # APIルーター
  Dockerfile
  requirements.txt
frontend/
  src/
    api/               # Axios共通設定
    components/        # 共通コンポーネント
    pages/             # 画面コンポーネント
    utils/             # 共通処理
```

## デプロイ時の注意

バックエンドのDockerfileは起動前に `alembic upgrade head` を実行します。
Railwayでは `JWT_SECRET_KEY`、`CORS_ORIGINS`、`DATABASE_URL` を環境変数として
設定してください。

`uploads/` は通常のRailwayファイルシステムでは永続化されません。投稿画像を
保持するには、Railway VolumeまたはS3・Cloudflare R2などの外部ストレージが
別途必要です。

バックエンド固有のDB切り替えとマイグレーション手順は
`backend/README.md` に記載しています。
