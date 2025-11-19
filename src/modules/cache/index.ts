import CacheModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const CACHE_MODULE = "cache";

export default Module(CACHE_MODULE, {
  service: CacheModuleService,
});
