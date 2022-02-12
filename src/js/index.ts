import { CalcApplication } from './modules/application/calcApplication'
import { ConvertApplication } from './modules/application/convertApplication'
import { VariableApplication } from './modules/application/variableApplication'
import { ViewApplication } from './modules/application/viewApplication'
import { IDescription } from './modules/domain/model/view'

const variable = new VariableApplication()

function submitCalc () {
  const convert = new ConvertApplication()
  const val = document.getElementById('formulaInput') as HTMLInputElement
  convert.setFormula(val.value)
  let rpn = convert.convertRpn()
  rpn = variable.convertVariable(rpn)
  const calc = new CalcApplication()
  calc.setRpnArr(rpn)
  const result = calc.calc(variable)
  val.value = result
}

function variableAdd () {
  const view = new ViewApplication()
  view.createVariableInput(variable)
  view.showAlert()
}

document.getElementById('formulaForm').addEventListener('submit', (e) => {
  e.preventDefault()
  submitCalc()
})

document.getElementById('variableAdd').addEventListener('click', (e) => {
  e.preventDefault()
  variableAdd()
})

function init () {
  const view = new ViewApplication()
  view.viewVariableList(variable.getRepository(), variable)
  const desList: IDescription[] = [
    {
      title: '使い方',
      des: '計算式を入力してエンターキーを押してください。'
    },
    {
      title: '使用できる演算子',
      des: '+ - * / ^ %'
    },
    {
      title: '特殊演算子について',
      des: 'coaca.tsでは特殊演算子が存在します。特殊演算子を使用する場合は[]を使用してください。'
    },
    {
      title: '特殊演算子1. abs',
      des: '絶対値を返します。<br>abs[-1] = 1'
    },
    {
      title: '特殊演算子2. sin, cos, tan',
      des: '三角関数を返します。<br>sin[90] = 1'
    },
    {
      title: '特殊演算子3. asin, acos, atan',
      des: '逆三角関数を返します。<br>asin[1] = 90'
    },
    {
      title: '特殊演算子4. !',
      des: '階乗を行います。<br>![5] = 120'
    },
    {
      title: '特殊演算子5. rad',
      des: 'ラジアンを返します。<br>rad[180] = 3.14.....'
    },
    {
      title: '特殊演算子6. ln',
      des: '自然対数を返します。<br>ln[10] = 2.30.....'
    },
    {
      title: '変数について',
      des: '変数名は<b>演算子、特殊演算子、デフォルト変数に被らない</b>値にしてください。<br>また、<b>数値以外の値は入れないでください</b>。'
    },
    {
      title: 'デフォルト変数について',
      des: 'caoca.tsでは、すでに登録されている変数(デフォルト変数)が存在します。この変数は値を変更することができません。'
    },
    {
      title: 'デフォルト変数1. pie',
      des: '円周率を返します。<br>pie = 3.14.....'
    },
    {
      title: 'デフォルト変数2. e',
      des: '自然対数を返します。<br>e = 2.71.....'
    },
    {
      title: 'デフォルト変数3. K ~ G, m ~ n',
      des: '単位を返します。<br>K = 1000, M = 1000000, G = 1000000000, m = 1000, μ = 0.000001, n = 1000000'
    }
  ]
  view.viewDescription(desList)
}

init()
