# じすい日和 バックエンド

FastAPI、SQLAlchemy、Alembicで構成されたAPIです。ローカルではSQLite、
本番ではPostgreSQLを使用します。

## ローカル環境の準備

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.example .env
```

`.env` の `JWT_SECRET_KEY` は、次のコマンドで生成した値へ置き換えてください。

```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

ローカルでSQLiteを使う場合の設定例です。

```dotenv
JWT_SECRET_KEY=生成した秘密鍵
CORS_ORIGINS=http://localhost:3000
DATABASE_URL=sqlite:///./jisui_biyori.db
```

テーブルを作成してAPIを起動します。

```powershell
alembic upgrade head
uvicorn app.main:app --reload
```

APIドキュメントは `http://127.0.0.1:8000/docs` で確認できます。

## PostgreSQLへの切り替え

`DATABASE_URL` をPostgreSQLの接続URLへ変更します。

```dotenv
DATABASE_URL=postgresql://ユーザー名:パスワード@ホスト名:5432/データベース名
```

Railwayが `postgres://` 形式で渡した場合は、アプリ側でSQLAlchemy用の
`postgresql://` 形式へ自動変換します。接続URLやパスワードはソースコードへ
書かず、Railwayの環境変数で管理してください。

本番デプロイ時も、アプリを起動する前に次を実行します。

```powershell
alembic upgrade head
```

## マイグレーション

モデル変更後はマイグレーションを生成し、内容を確認してから適用します。

```powershell
alembic revision --autogenerate -m "変更内容"
alembic upgrade head
```

直前のマイグレーションを戻す場合は次を実行します。

```powershell
alembic downgrade -1
```

アプリ起動時の `Base.metadata.create_all()` は使用していません。新しい環境では、
起動前に必ず `alembic upgrade head` を実行してください。

既存のローカルSQLite DBは、今回追加したカラムを持っていません。必要なデータを
バックアップしたうえで `jisui_biyori.db` を作り直し、初期マイグレーションを
適用してください。

## 画像の永続化

PostgreSQLへ移行しても、`uploads/` はRailwayの通常ファイルシステム上では
永続化されません。Railway Volume、S3、Cloudflare R2などの永続ストレージを
別途設定する必要があります。
