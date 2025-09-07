const { getApiUrl } = require('../config/common');

const homeView = (request, response) => {
    const apiUrl = getApiUrl();
    response.render('home', { title: `Home | ${process.env.APP_NAME}`, apiUrl: apiUrl});
}

module.exports = { homeView };