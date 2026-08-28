import { createClient } from "redis";

const redis = createClient({
    url: process.env.REDIS_URL,
});

redis.on("error", (error) => {
    console.error("Redis Error:", error);
});

redis.on("connect", () => {
    console.log("Redis connecting...");
});

redis.on("ready", () => {
    console.log("Redis ready");
});

redis.on("reconnecting", () => {
    console.log("Redis reconnecting...");
});

export async function connectRedis() {
    if (!redis.isOpen) {
        await redis.connect();
    }
}

export default redis;