import ratelimiter from "../config/upstash.js";

const rateLimit = async (req, res, next) => {
  try {
    // he
    // const identifier = req.params.userId || req.ip;
    const { success } = await ratelimiter.limit("my-rate-limit");
    // const { success } = await ratelimiter.limit(identifier);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimit;
