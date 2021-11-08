const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

router.use(morgan('tiny'));

router.get('/', auth, async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select('-password');
        res.json(user);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error.');
    }
});

const loginValidations = [
    check('email', 'Please enter a valid email.').isEmail(),
    check('password', 'Please enter a valid password.').not().isEmpty()
]
router.post('/', loginValidations, async (req, res, next) => {
    try {
        const loginErrors = validationResult(req);

        const errMsg = 'The information provided does not match ours.';
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) throw new Error(errMsg);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error(errMsg);

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 36000000 },
            (err, token) => {
                if (err) throw new err;
                res.json({ token });
            }
        )
    }
    catch (err) {
        res.status(400).json({ errors: [{ "msg": err.message }] });
    }
});

module.exports = router;