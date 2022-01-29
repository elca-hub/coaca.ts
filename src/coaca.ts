import { CalcApplication } from "./modules/application/calcApplication.js";
import { ConvertApplication } from "./modules/application/convertApplication.js";
import { VariableApplication } from "./modules/application/variableApplication.js";

const calcApplication = CalcApplication
const convertApplication = ConvertApplication
const variableApplication = VariableApplication

export { calcApplication as Calc, convertApplication as ConvertRpn, variableApplication as Variable }