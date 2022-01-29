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
- [ ] Coaca.jsと同じようにする
- [ ] データ型のチェック
- [ ] sin(...)やln(...)、!(...)のような数式を実装
- [ ] オニオンアーキテクチャの実装🧅

## 用語
- RPN => 逆ポーランド記法の略称
- RPN配列 => RPNへ変換した時に出力される配列。AB+の場合、['A', 'B', '+']となる

## 使い方
1. distフォルダ内のjavascriptファイルをダウンロードします
2. その中のcoaca.jsファイルを実行したいjavascriptファイル内にてimportします
3. インスタンス化をします

## 機能一覧
### インポート
```js
import {Calc, ConvertRpn, Variable} from './coaca/coaca.js'
```
クラス名とそのクラスの役割です。必要に応じて変更してください。
| クラス名 | 内容 |
| :-------: | :-------: |
| Calc  | 計算  |
| ConvertRpn  | RPNへの変換  |
| Variable | 計算式の変数に関する内容 |

### RPN配列の生成
```js
const convertRpn = new ConvertRpn()
convertRpn.setFormula('11+16')
const rpnArr = convertRpn.convertRpn()
console.log(rpnArr.join(' ')) // 11 16 +
```
RPN配列を生成します。

### 計算
```js
const calc = new Calc()
calc.setRpnArr(rpnArr) // rpnArr = ['11', '16', '+']
const res = calc.calc()
console.log(res) // 31
```
RPN配列から計算を行います。

### 変数機能について
#### 追加
```js
const variable = new Variable()
variable.addVariable('x', 20)
```
変数の追加を行います。上の例では、変数x(初期値20)を設定してます。

#### 値の変更
```js
variable.changeVariable('x', 10)
```
変数の値を変更します。

#### 変数の削除
```js
variable.removeVariable('x')
```
変数を削除します。

#### 変数の代入
```js
let rpnArr = ['11', 'x', '+']

/* xに16を代入 */

rpnArr = variable.convertVariable(rpnArr) // ['11', '16', '+']
```
変数を代入します。