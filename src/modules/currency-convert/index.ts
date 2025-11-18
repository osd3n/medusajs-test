import CurrencyConvertModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const CURRENCY_CONVERT_MODULE = "currency_convert";

export default Module(CURRENCY_CONVERT_MODULE, {
  service: CurrencyConvertModuleService,
});
