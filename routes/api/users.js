
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const gravatar = require('gravatar');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('config');

router.use(morgan('tiny'));

const createReqValidations = [
    check('name', 'Name is required.').not().isEmpty(),
    check('password', 'Please enter a password that is at least 6 characters.').isLength({min: 6}),
    check('email', 'Please enter an email.').isEmail()
]
router.post('/', createReqValidations, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({errors: [{msg: 'User already exists.'}]})
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

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
                if (err) throw err;
                res.json({ token });
            }
        );
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error.');
    }
});

module.exports = router;