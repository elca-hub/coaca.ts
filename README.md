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
- [ ] データ型のチェック
- [x] sin(...)やln(...)、!(...)のような数式を実装
- [x] オニオンアーキテクチャの実装🧅

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

## エラー処理について
coaca.tsは**まともなエラー処理をしてません**。特に数学的なエラー(無限大etc.)は全く対処してませんのでご注意ください。

## 演算子について
coaca.tsは以下の演算子によって計算を行います。
| 演算子 | 内容 |
| :-------: | :-------: |
| + | 足し算  |
| - | 引き算  |
| / | 割り算 |
| * | 掛け算 |
| % | 割り算 |
| ^ | 冪乗 |
| A_B | Bを底数としたAの対数 |

また、**特殊演算子**として以下の演算子を提供しています。
| 演算子 | 内容 |
| :-------: | :-------: |
| ! | 累乗  |
| sin/cos/tan | 三角関数 |
| asin/acos/atan | 逆三角関数 |
| ln | 底数10の対数 |
| rad | ラジアン角度への変換 |
| abs | 絶対値 |

この演算子は以下のように記述します。
```js
const pattern1 = sin[rad[90]]

const pattern2 = abs[5-10]
```

## 変数について
### 条件
#### 追加時
1. 特殊演算子並びに演算子、デフォルト変数を変数名に使用しない
2. 20字以内で命名

#### 変更時
1. デフォルト変数の値を変更しない

#### 削除時
1. デフォルト変数を削除しない

### デフォルト変数について
coaca.tsでは、**デフォルト変数**を提供しています。なお、この変数を利用するには**Variableクラスを用いて代入する必要があります**。
| デフォルト変数名 | 内容 |
| :-------: | :-------: |
| pie | 円周率  |
| e | ネイピア数 |
| K | 1,000 |
| M | 1,000,000 |
| G | 1,000,000,000 |
| m | 0.001 |
| μ | 0.000001 |
| n | 0.000000001 |

## 使用例
### ヘロンの公式
```js
import {Calc, ConvertRpn, Variable} from '../dist/coaca.js'

const variableList = {
  a: 15,
  b: 13,
  c: 14
}

const setVariableList = (variable, variableList) => {
  for (let key in variableList) {
    variable.addVariable(key, variableList[key])
  }
}

/* sを求める処理 */
const s = () => {
  const convert = new ConvertRpn()
  convert.setFormula('(a+b+c)/2')
  let rpnArr = convert.convertRpn()

  const variable = new Variable()
  setVariableList(variable, variableList)
  rpnArr = variable.convertVariable(rpnArr)

  const calc = new Calc()
  return calc.calc(rpnArr)
}

const res = s => {
  const convert = new ConvertRpn()
  convert.setFormula('(s*(s-a)*(s-b)*(s-c))^(1/2)')
  let rpnArr = convert.convertRpn()

  const variable = new Variable()
  setVariableList(variable, variableList)
  variable.addVariable('s', s)
  rpnArr = variable.convertVariable(rpnArr)

  const calc = new Calc()
  return calc.calc(rpnArr)
}

console.log(res(s())) // 84
```