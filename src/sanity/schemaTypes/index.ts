import { product, productCategory, project } from "./catalog";
import { member } from "./member";
import { post } from "./post";
import { quoteRequest } from "./quoteRequest";
import { homePage, siteSettings } from "./singletons";

export const SINGLETONS = ["siteSettings", "homePage"] as const;

export const schemaTypes = [siteSettings, homePage, member, productCategory, product, project, post, quoteRequest];
