// Home page view controller 
export function homeView(request, response) {
    response.render('home', { title: `Home | ${process.env.APP_NAME}`});
}