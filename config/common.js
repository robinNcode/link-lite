export function getApiUrl() {
    if (process.env.APP_ENV === 'production') {
        return process.env.API_URL;
    } else {
        return process.env.DEV_API_URL;
    }
}

export function getDbUrl() {
    if (process.env.APP_ENV === 'production') {
        return process.env.MONGO_URI_PROD;
    } else {
        return process.env.MONGO_URI;
    }
}

