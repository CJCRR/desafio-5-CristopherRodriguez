import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";

const router = Router();

router.get('/', async(req,res)=> {
    try{
        let users = await userModel.find()
        res.status(200).send({
            status:200,
            result:"success",
            payload:users
        })
    }
    catch(error){
        console.log("cannot get users with mongoose: "+ error)
        res.status(500).send({
            status:500,
            result:"error",
            error:"error getting data from DB"
        })
    }
});

router.post("/", async (req,res) => {

    let {first_name, last_name, email} = req.body;

    if(!first_name || !last_name || !email ) {
        res.status(400).send({
            status:400,
            result:"error",
            error:"imcomplete values"
        })
    }
    try{
        let result = await userModel.create({
            first_name,
            last_name,
            email
        });

        res.status(200).send({
            status:200,
            result:"sucess",
            payload:result
        })
    }
    catch(error){
        console.log("cannot get users with mongoose: "+ error);
        res.status(500).send({
            status:500,
            result:"error",
            error:"error getting data from DB"
        })
    }
    
});

router.put( "/:uid", async (req,res)=> {

    let {uid} = req.params;

    let userToReplace = req.body;

    if(!userToReplace.first_name || !userToReplace.last_name || !userToReplace.email) {
        res.status(400).send({
            status:400,
            result:"error",
            error:"imcomplete values"
        })
    }
    try{
        let result = await userModel.updateOne({_id:uid}, userToReplace)
        res.status(200).send({
            status:200,
            result:"sucess",
            payload:result
        })
    }
    catch(error) {
        console.log("cannot update user on mongo: "+ error);
        res.status(500).send({
            status:500,
            result:"error",
            error:"error getting data from DB"
        })
    }
})

router.delete("/:uid" ,async (req,res)=>{
    let {uid} = req.params;

    try {
        let result = await userModel.deleteOne({_id:uid});
        res.status(200).send({
            status:200,
            result:"sucess",
            payload:result
        })
    }
    catch(error){
        console.log("cannot update user on mongo: "+ error);
        res.status(500).send({
            status:500,
            result:"error",
            error:"error getting data from DB"
        })
    }
})

export default router;