exports.verify = function(req, res, next){
    try{
        /* Here we can write our api validation logic*/
        console.log("It is a valid api request")
        next();
    }
    catch(e){
        return res.status(401).send(e.message);
    }
}
