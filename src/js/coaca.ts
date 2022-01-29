import { CalcApplication } from "./modules/application/calcApplication";
import { ConvertApplication } from "./modules/application/convertApplication";
import { VariableApplication } from "./modules/application/variableApplication";

const calcApplication = CalcApplication
const convertApplication = ConvertApplication
const variableApplication = VariableApplication

export { calcApplication as Calc, convertApplication as ConvertRpn, variableApplication as Variable }
