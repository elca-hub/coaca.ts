# Coaca.ts:<br>Convert and Calculate by RPN for typescript

## 注意点
まずそもそも、typescriptはサーバサイドで使用されるべき言語です。一応typescript4.5以降の機能を用いていますが、**typescriptの本来の使い方を超越**してます。ご注意ください。

詳しくは<a href="https://zenn.dev/teppeis/articles/2021-10-typescript-45-esm">こちら</a>の記事をご覧ください。

また、**Coaca.jsとの互換性は一切ありません**。好きな書き方を選んでください（）

## Coaca.js (English)
<div align="center">
  <a href="https://github.com/poyuaki/CoaCa.js">Coaca.js</a>
</div>

## Todo
[-] Coaca.jsと同じようにする
[-] sin(...)やln(...)、!(...)のような数式を実装

## 使い方
1. distフォルダ内のjavascriptファイルをダウンロードします
2. その中のcoaca.jsファイルを実行したいjavascriptファイル内にてimportします
3. インスタンス化をします

## 機能一覧
### インポート
```js
import {Coaca} from './coaca/coaca.js'
```

### インスタンス化
```js
const coaca = new Coaca()
```

### 数式代入
```js
coaca.setFormula('1+9')
```

### RPN配列へ変換
```js
const rpnArr = coaca.convert()
console.log(rpnArr.join(' ')) // 1 9 +
```

### 計算
```js
coaca.calc(rpnArr)
```
calcメソッドを使用する場合、引数にはconvertメソッドで取得した配列を指定する必要があります。
もしも引数を指定しなかった場合、自動的に現在代入されている数式をRPN配列へ変換、その値を計算に用います。

### 変数機能
**注意** : この機能は近い将来別クラスに分類される可能性があります

#### 追加
```js
coaca.createVariable('x', 3)
```

#### 変更
```js
coaca.changeVariable('x', 5)
```

#### 削除
```js
coaca.removeVariable('x')
```