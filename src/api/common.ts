import { get } from "@/request";

export const getAliToken = () => get<ApiSystem.AliToken>("/third/get_token");
