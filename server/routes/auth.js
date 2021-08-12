const express = require('express'); 
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation , loginValidation } = require('../models/validation');

router.post('/register',async(req,res)=>{
    // validating data
    const { error } = registerValidation(req.body);  
    if(error) return res.status(400).send(error.details[0].message);

    // check if the user is already in the database
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const newUser = new User({
                username: req.body.username,
                email:req.body.email,
                password: hashedPassword
    });
    try
    {
        const savedUser = await newUser.save();
        //res.send({ newUser: user_id});
        res.send(savedUser);
    }
    catch(err)
    {
        res.status(400).send(err);
    }

});

// Login
router.post('/login',async(req,res)=>{
    // validating data
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email is not registered');

    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid Passowrd');

    //  res.send('Logged in!');
    const token = jwt.sign({ _id:user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
});

/*-------DECODE USER TOKEN--------*/
// router.post('/decode',async(req, res)=> {
//     //encrypted JWT
//     var token = req.body.token;
//     //if encrypted JWT is not null
//     if (token) {
//         //decode the encrypted JWT using the JWT secret 
//           try {
//             var decoded = jwt.decode(token, app.get(process.env.TOKEN_SECRET));
//             //if successful send a success message to the front-end
//             res.json({
//                 auth: true
//             })
//         //encrypted JWT cannot be decrypted
//           } catch (err) {
//             console.log(err);
//           }
//       //encrypted JWT is null
//     } else {
//           console.log("token does not exist");
//     }
// });

module.exports = router;