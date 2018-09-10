const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');

const router = express.Router();

// load user model
const User = require('../../models/User');

// @route   GET /api/users/test
// @desc    Tests the users route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'users works'}));

// @route   GET /api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
    const { errors, isValid} = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user =>{
            if (user) {
                return res.status(400).json({email: 'Email already exists'})
            }
            const avatar = gravatar.url(this.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            })
        });
});

// @route   GET /api/users/login
// @desc    User login
// @access  Public
router.post('/login', (req, res) => {
    const { email, password} = req.body;

    //find user by email
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                res.status(404).json({email: 'User not found'});
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //create payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };
                        //sign token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                        });

                        // res.json({msg: 'success'})
                    } else {
                        return res.status(400).json({password: 'password incorrect'})
                    }
                })
        })
});


// @route   GET /api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    });
});

module.exports = router;