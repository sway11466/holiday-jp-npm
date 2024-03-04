# CICDドキュメント
HolidayJPのCICD関連の説明です。

## test

   1. ローカルでのテスト
      - npm test

   2. 自動テスト
      - GitHub Acitonsで構築したテストをプッシュトリガーで実行する

## publish

   1. publishの準備
      - アクセストークンが有効な間は不要
      - NPMでアクセストークンを作成する
         - Granular Access Token
         - Permissions: Read and write 
         - Only select packages and scopes: @sway11466/holiday-jp-npm
      - GitHubにトークンを追加する
         - https://github.com/sway11466/holiday-jp-npm/settings/secrets/actions
         - Repository secrets
         - NPM_TOKEN

   2. mainブランチをリリース可能な状態にする

   3. publish acitonを実行する
      - https://github.com/sway11466/holiday-jp-npm/actions/workflows/publish.yml
