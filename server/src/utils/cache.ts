import NodeCache from 'node-cache';
import { Response, Request, NextFunction } from 'express';
import { successResponse } from './response';

export const cache = new NodeCache({ stdTTL: 60, checkperiod: 60 });

export function constructCacheKey(
  req: Request,
  key: string | null,
  isPublic: boolean = false,
): string {
  if (isPublic) {
    return req.originalUrl;
  }
  return key && req.user ? `${key}:${req.user.userId}` : req.originalUrl;
}

export function setCache<T>(
  req: Request,
  key: string | null,
  data: T,
  isPublic: boolean = false,
) {
  const _key = constructCacheKey(req, key, isPublic);
  if (!cache.get(_key)) {
    cache.set(_key, data);
  }
}

export function removeCache(
  req: Request,
  key: string | null,
  isPublic: boolean = false,
) {
  cache.del(constructCacheKey(req, key, isPublic));
}

export function cacheMiddleware(key: string | null, isPublic: boolean = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const cachedResponse = cache.get(constructCacheKey(req, key, isPublic));
    if (cachedResponse) {
      return successResponse(res, cachedResponse);
    }
    next();
  };
}

export const GET_MY_STOCKS_KEY = 'GET_MY_STOCKS_KEY';
