//get homepage
module.exports = {
    getPage(req, res){
        return res.render('index', { title: 'About'});
    }
}
