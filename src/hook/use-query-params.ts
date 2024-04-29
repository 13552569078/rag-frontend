import { useLocation } from "react-router-dom";

interface QueryParamsProxy {
  [key: string]: string | null;
}
export function useQueryParams(): QueryParamsProxy {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const proxy = new Proxy(queryParams, {
    get(target, propKey: string | symbol) {
      if (typeof propKey === "string") {
        return target.get(propKey) || null;
      }
      return Reflect.get(target, propKey);
    },
  });
  const typedProxy: QueryParamsProxy = proxy as any;

  return typedProxy;
}
