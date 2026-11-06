import redisClient from "../config/redis.js";

export async function getOrSetCache(key, ttlSeconds, fetchData) {
  // 1. Check Redis first
  if (redisClient.isReady) {
    try {
      const cachedData = await redisClient.get(key);

      // 2. Cache hit
      if (cachedData !== null) {
        console.log("CACHE HIT:", key);
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.error("Redis GET failed:", error.message);
    }
  }

  // 3. Cache miss: fetch from PostgreSQL
  console.log("CACHE MISS:", key);

  const data = await fetchData();

  // 4. Save the result in Redis
  if (redisClient.isReady && data !== null && data !== undefined) {
    try {
      await redisClient.set(key, JSON.stringify(data), {
        EX: ttlSeconds,
      });

      console.log("DATA SAVED TO CACHE:", key);
    } catch (error) {
      console.error("Redis SET failed:", error.message);
    }
  }

  // 5. Return the database result
  return data;
}
