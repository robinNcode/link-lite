
exports.homeView = (request, response) => {
    response.render('home', { title: `Home | ${process.env.APP_NAME}`});
}