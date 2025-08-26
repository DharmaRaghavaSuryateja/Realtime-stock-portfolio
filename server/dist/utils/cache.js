import NodeCache from 'node-cache';
import { successResponse } from './response';
export const cache = new NodeCache({ stdTTL: 60, checkperiod: 60 });
export function constructCacheKey(req, key, isPublic = false) {
    if (isPublic) {
        return req.originalUrl;
    }
    return key && req.user ? `${key}:${req.user.userId}` : req.originalUrl;
}
export function setCache(req, key, data, isPublic = false) {
    const _key = constructCacheKey(req, key, isPublic);
    if (!cache.get(_key)) {
        cache.set(_key, data);
    }
}
export function removeCache(req, key, isPublic = false) {
    cache.del(constructCacheKey(req, key, isPublic));
}
export function cacheMiddleware(key, isPublic = false) {
    return (req, res, next) => {
        const cachedResponse = cache.get(constructCacheKey(req, key, isPublic));
        if (cachedResponse) {
            return successResponse(res, cachedResponse);
        }
        next();
    };
}
export const GET_MY_STOCKS_KEY = 'GET_MY_STOCKS_KEY';
