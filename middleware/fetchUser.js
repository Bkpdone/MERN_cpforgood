const jwt = require('jsonwebtoken');
const JWT_Shash = 'Bh@veshPharateisgoodboyhelovebalaji'
const fetchUser = (req, res, next) => {

    //1 get token fromheader
    //2 get id from token and add in req
    const token = req.header('auth-token');
 //   console.log('token=> ',token);
    if (!token) {
        return res.status(401).send({ error: 'Not a Valid Token Authonticated ur Selfed' });
    }
    try {
        const data = jwt.verify(token, JWT_Shash);
        console.log('data in middleware : ',data.user);
        req.user = data.user;
        next();
    }
    catch (err) {
        return res.status(401).send({ error: 'Not a Valid Token Authonticated ur Selfed' });

    }

}

module.exports = fetchUser;