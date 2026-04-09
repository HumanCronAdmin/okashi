# サービス仕様書: Okashi

---

## 基本情報
- **サービス名:** Okashi
- **一言で:** 海外の日本お菓子ファンが、フレーバー・食感で日本のお菓子を検索し、ティアリスト作成・タイプ診断・コレクション記録で楽しめるキュレーションDB
- **対象ニーズ:** Reddit/TikTokで実証済みの「日本のお菓子を探す・比較する・記録する」需要
- **種類:** 静的サイト
- **デプロイ先:** GitHub Pages

---

## Problem
- 「チーズ味の日本のお菓子でおすすめは？」「カリカリした食感のは？」「Gluten-freeは？」→ 答えてくれるサイトがない
- もぐナビは日本語のみ・フレーバー/食感フィルターなし
- サブスクボックス（Bokksu等）はDB/検索機能なし
- SNSに情報は散在しているが構造化された検索不可能
- Untappd/Vivinoのお菓子版は世界に存在しない

## Solution
フレーバー×食感のフィルターDB + バイラル機能（ティアリスト・診断）+ リテンション機能（コレクション記録）

## Tech Stack
- HTML/CSS/JavaScript（静的サイト）
- JSONデータファイル（お菓子DB）
- localStorage（ユーザー記録、Phase 1は認証なし）
- GitHub Pages（ホスティング、コストゼロ）

## GitHub Repos
- **spec.md内で直接参照せず、buildが自作する方針**
- 理由: 候補リポ（Tierlist-maker, CosmosPersona等）はスター数が低く、ライセンス不明のものが多い。TinyFitと同じアーキテクチャで自作した方が統一性・品質が高い

## Revenue Model
- **初期:** 無料公開（ユーザー獲得優先）
- **収益化:**
  - Amazonアフィリエイト（お菓子ページからAmazon購入リンク）
  - Bokksu/TokyoTreatアフィリエイト（サブスクボックスCTA）
  - SEO記事群からのアフィリエイト流入
- **具体的な収益ポイント:** 各お菓子ページの「Buy Online」ボタン + 記事内の商品リンク

---

## MVP Scope

### MVP機能（Phase 1 ローンチ時）

**核機能: フィルタブルお菓子データベース**
- 30-50品目の厳選データ
- フィルター: フレーバー / 食感 / カテゴリ / 甘さレベル
- 各お菓子ページ: 実物写真 + 基本情報 + 購入リンク
- 英語ファースト

**バイラル機能1: ティアリストメーカー**
- DBのお菓子をドラッグ&ドロップでS/A/B/C/Dにランク付け
- 完成したティアリストを画像として書き出し（PNG）
- SNSシェアボタン（X, Reddit）

**バイラル機能2: お菓子タイプ診断**
- 5-7問の選択式クイズ
- 結果: 8タイプのお菓子パーソナリティ（例: "Matcha Mystic", "Cheese Champion"）
- 結果画像をSNSシェア

**リテンション機能: マイ図鑑**
- 「食べた」ボタンで記録（localStorage保存）
- 食べたお菓子の一覧・カウント表示
- 進捗バー（「30品中15品制覇！」）

### MVPで除外（Phase 2以降）
- ユーザー認証・アカウント
- お菓子ガチャ（ランダム推薦）
- 対決投票（どっちが好き？）
- 47都道府県コレクションマップ
- お菓子Wrapped（年間まとめ）
- バッジシステム
- 季節限定カレンダー
- ユーザーレビュー投稿
- SEO記事パイプライン（MVP検証後に着手）

### MVP形式
- HTML + CSS + JavaScript の静的サイト
- JSONデータファイル（snacks.json）
- 全ページ共通のヘッダー/フッター

### MVP検証方法
- r/JapaneseSnacks, r/AsianSnacks に投稿
- r/snackexchange に紹介
- X で #JapaneseSnacks ハッシュタグ付き投稿

### MVP判定基準
- Reddit投稿で10 upvote以上
- ティアリスト or 診断結果のSNSシェアが5件以上
- サイト訪問者が初週100人以上（GA4計測）

---

## サイト構成

### ページ構成
```
/index.html          — トップ（注目のお菓子 + フィルター入口 + 診断CTA）
/explore.html        — お菓子一覧（フィルターUI付き）
/snack/[id].html     — 個別お菓子ページ（写真・情報・購入リンク）
/tierlist.html       — ティアリストメーカー
/quiz.html           — お菓子タイプ診断
/collection.html     — マイ図鑑（食べた記録一覧）
/about.html          — About（運営者紹介・サイトの目的）
```

### データ構造（snacks.json）
```json
{
  "snacks": [
    {
      "id": "kitkat-matcha",
      "name_en": "KitKat Mini Matcha",
      "name_ja": "キットカット ミニ 抹茶",
      "maker": "Nestle Japan",
      "category": "chocolate",
      "flavors": ["matcha", "green-tea"],
      "texture": "crispy",
      "sweetness": 3,
      "calories_per_piece": 64,
      "availability": "convenience-store",
      "seasonal": false,
      "price_range": "budget",
      "image": "images/kitkat-matcha.jpg",
      "description": "Rich matcha flavor with crispy wafer layers.",
      "buy_links": {
        "amazon_us": "",
        "amazon_jp": ""
      },
      "pairs_with": ["green-tea", "black-coffee"],
      "good_for": ["gift", "office-snack", "travel"],
      "similar": ["kitkat-strawberry", "matcha-pocky"]
    }
  ]
}
```

### フィルター軸
| フィルター | 値の例 | UI |
|---|---|---|
| フレーバー | matcha, cheese, chocolate, strawberry, melon, yuzu, sakura, salty, spicy | タグボタン（複数選択可） |
| 食感 | crispy, crunchy, chewy, soft, mochi, melty, fluffy, crumbly | タグボタン |
| カテゴリ | chocolate, cookie, rice-cracker, gummy, candy, mochi, chips | タグボタン |
| 甘さレベル | 1-5（スライダー） | レンジスライダー |
| 入手性 | convenience-store, supermarket, online-only, regional-limited | ドロップダウン |
| 定番/限定 | regular, seasonal, limited | トグル |

### タイプ診断の8タイプ
| タイプ名 | 特徴 | 代表お菓子 |
|---|---|---|
| Matcha Mystic | 渋め好き・大人の味覚 | 抹茶系 |
| Cheese Champion | セイボリー派・チーズ命 | チーズ系 |
| Strawberry Sweetheart | 甘党・かわいいもの好き | いちご系 |
| Crunchy Commander | 食感重視・サクサク派 | せんべい・チップス系 |
| Mochi Master | もちもち派・和菓子好き | 餅菓子系 |
| Chocolate Connoisseur | チョコレート至上主義 | チョコ系 |
| Adventure Seeker | 珍しい味に挑戦したい | 限定フレーバー系 |
| Konbini King | コンビニスイーツ通 | コンビニ限定品 |

---

## SEO記事パイプライン（Phase 2）

MVP検証後に着手。設計概要:

### 構造
- メインDB（explore.html）+ 記事群（/articles/）
- 記事 → DBの関連お菓子ページにリンク
- DB → 関連記事にリンク

### キーワードカテゴリ
1. フレーバー別: "best matcha japanese snacks", "japanese cheese snacks ranked"
2. 食感別: "crunchy japanese snacks", "chewy japanese candy"
3. シーン別: "japanese snacks for road trip", "japanese office snacks"
4. 比較: "pocky vs koala no march", "best kit kat flavors ranked"
5. ガイド: "complete guide to japanese convenience store snacks"
6. リスト: "50 japanese snacks you must try"
7. 季節: "best japanese snacks for spring", "sakura flavored snacks"

### 自動生成フロー
```
キーワードリスト + snacks.json → Gemini/Groq API → HTML記事 → GitHub Pages
```
- 目標: 月10-20記事
- 各記事にDB内部リンク3-5本
- 実物写真を必ず含める（AI生成画像禁止）

---

## 変更箇所（buildへの指示）

### ステップ1: プロジェクト新規作成
```
projects/okashi/ 配下に新規作成（リポcloneなし）
```

### ステップ2: 作成するファイル
| ファイル | 内容 |
|---|---|
| `index.html` | トップページ。注目お菓子3-5個 + フィルター入口 + 診断CTA + ティアリストCTA |
| `explore.html` | お菓子一覧。フィルターUI（タグボタン+スライダー） + グリッド表示 |
| `tierlist.html` | ティアリストメーカー。ドラッグ&ドロップ + S/A/B/C/D段 + PNG書き出し |
| `quiz.html` | タイプ診断。5-7問 + 結果表示 + シェアボタン |
| `collection.html` | マイ図鑑。食べた記録一覧 + 進捗バー |
| `about.html` | About。サイト紹介 + 運営者（日本在住） |
| `css/style.css` | 共通スタイル。モバイルファースト（480px media query） |
| `js/app.js` | フィルターロジック + localStorage管理 |
| `js/tierlist.js` | ドラッグ&ドロップ + 画像書き出し |
| `js/quiz.js` | 診断ロジック + 結果表示 |
| `data/snacks.json` | お菓子データ（初期30-50品目） |
| `images/` | お菓子の実物写真（自分で撮影） |

### ステップ2.5: データ収集（buildが実行）
- snacks.jsonの初期データは以下のソースから実在情報のみ収集:
  - 各メーカー公式サイト（Nestle Japan, Meiji, Calbee, Glico等）
  - もぐナビ（mognavi.jp）の成分・カロリー情報
  - Amazon.co.jpの商品ページ（価格帯・入手性）
- 写真は自分で撮影するまでプレースホルダー（灰色ボックス+テキスト）
- ダミーデータ禁止。実在する商品情報のみ

### ステップ3: GA4トラッキング埋め込み（必須）
GA4 ID: `G-H1N5PR9Y0H` を全ページの`<head>`直後に挿入。

### ステップ4: デプロイ手順
1. `humancronadmin/okashi` リポジトリを作成
2. GitHub Pages有効化（main branch, / root）
3. 全ファイルをpush
4. `https://humancronadmin.github.io/okashi/` で公開確認

---

## デザイン方針

### カラーパレット
- Primary: #FF6B6B（温かみのある赤・お菓子のワクワク感）
- Secondary: #4ECDC4（ティール・フレッシュ感）
- Accent: #FFE66D（黄色・楽しさ）
- Background: #FAFAFA
- Text: #2C3E50

### トーン
- 楽しい・カジュアル・親しみやすい
- 英語ファースト、日本語商品名は括弧内に併記
- お菓子の写真を大きく見せる（ビジュアル重視）

### モバイルファースト
- viewport meta必須
- 480px media query必須
- タップターゲット44px以上
- フィルターUIはモバイルで折りたたみ可能

---

## publish向け情報

- **サービスURL:** https://humancronadmin.github.io/okashi/
- **ターゲット:** 海外在住の日本お菓子ファン（Reddit/TikTokで情報収集する層）
- **刺さる訴求:**
  - "Finally, a way to find Japanese snacks by flavor and texture"
  - "Create your Japanese snack tier list and share it"
  - "What's your Japanese snack personality? Take the quiz"
- **投稿先サブレ:**
  - r/JapaneseSnacks（メイン。フィードバック求める形で）
  - r/AsianSnacks（アジアお菓子全般の文脈で）
  - r/snackexchange（お菓子交換コミュニティ）
  - r/webdev（自作ツールとして）
- **note記事の切り口:** 「日本のお菓子を世界に紹介するサイトを1人で作った話」
- **X投稿:** ティアリスト画像 or 診断結果画像 + #JapaneseSnacks
