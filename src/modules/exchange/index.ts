import { Module } from "@medusajs/framework/utils";

import ExchangeModuleService from "./service";

export const EXCHANGE_MODULE = "exchange";

export default Module(EXCHANGE_MODULE, {
  service: ExchangeModuleService,
});
