import { CalcApplication } from "./modules/Application/calcApplication.js";
import { ConvertApplication } from "./modules/Application/convertApplication.js";
import { VariableApplication } from "./modules/Application/variableApplication.js";

const calcApplication = CalcApplication
const convertApplication = ConvertApplication
const variableApplication = VariableApplication

export { calcApplication as Calc, convertApplication as ConvertRpn, variableApplication as Variable }