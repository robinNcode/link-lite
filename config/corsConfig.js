const corsOptions = {
    origin: "*", // Allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

module.exports = corsOptions;
