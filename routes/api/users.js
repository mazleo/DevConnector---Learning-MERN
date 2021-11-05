
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');

const createReqValidations = [
    check('name', 'Name is required.').not().isEmpty(),
    check('password', 'Please enter a password that is at least 6 characters.').isLength({min: 6}),
    check('email', 'Please enter an email.').isEmail()
]
router.post('/', createReqValidations, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    res.send('User added!');
});




module.exports = router;