const express = require('express');
const auth = require('../middlewares/security/auth');
const actions = require('../database/actions');

const router = express.Router();

router.post('/login', async (req, res)=> {
    try {
        const params = req.body;
        const user = {
            userName: params.userName,
            password: params.password
        };    
        const result = await actions.Select(`SELECT COUNT(*) as count 
        FROM usuarios
        WHERE nombreUsuario = :userName AND contrasena = :password`, user);

        if(result && Array.isArray(result) && result.length > 0) {
            if(result[0].count == 1) {
                res.status(200).json(auth.generateToken({userName: user.userName}));
            }else {
                res.status(404).json({success: false, msg: "NOT_FOUND_USER"});
            }
        }else{
            res.status(500).json({success: false, msg: "NOT_FOUND_USER"});
        }   
    } catch (error) {
        res.status(404).json({success: false, msg: error.message});
    }
});

module.exports = router;