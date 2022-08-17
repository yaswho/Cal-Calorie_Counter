const express = require('express');
const router = express.Router();


router.get('/', (req,res)=>{

    res.render("index");
})

router.get('/registro/:authId',(req,res) =>{

    res.render('registro', { session: req.params.authId });

})



module.exports = router;