const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')
const selectProps = 'name description price rating _id'
router.get('/', (req, res, next) => {
    Product.find()
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
router.get('/:productId', (req, res, next) => {
    Product.findById(req.params.productId)
        .select(selectProps)
        .exec()
        .then(result => {

            if (result != null)
                res.status(200).json(result)
            else res.status(404).json({message: 'There is no product with such ID'})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
})
router.post('/', (req, res, next) => {
    const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        rating: req.body.rating
    })
    newProduct.save()
    .then(() => {
        res.status(201).json({
            message: 'product was successfully created',
            product: {
                name: newProduct.name,
                description: newProduct.description,
                price: newProduct.price,
                rating: newProduct.rating
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

module.exports = router