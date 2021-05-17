const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const selectProps = 'email password _id'
router.get('/', (req, res, next) => {
    User.find()
        .select(selectProps)
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
})
router.post('/register', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(result =>{
            if (result.length != 0) 
                return res.status(409).json({message: "There already exists a user with such email"})
            else {
                bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    if (err) return res.status(500).json({error: err})
                    else {
                        const newUser = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        newUser.save()
                            .then(() => {
                                res.status(201).json({
                                    message: 'User was successfully registered',
                                    user: {
                                        email: req.body.email,
                                        password: hash
                                    }
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({error: err})
                            })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
})
router.delete('/:userId', (req, res, next) => {
    User.findById(req.params.userId)
        .then(result => {
            if (result!=null){
                User.remove({_id: req.params.userId})
                    .exec()
                    .then(() => {
                        res.status(200).json({message: "User was deleted"})
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({error: err})
                    })
            } else res.status(404).json({message: "There is no user with such id"})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
})
module.exports = router