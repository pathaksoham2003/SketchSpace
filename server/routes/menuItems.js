import express from "express";
import keycloak from "../middlewarre/keycloak.js";
const router =  express.Router();

const menuItems = [
    {
        message : "Succesfull"
    }
]

router.get("/menu-items", 
[keycloak.protect()],
async ( req, res, next) => {
  try {
    let filtered = menuItems.filter(item => {
      if (item.onMenu === true) {
        return item;
      }
    });

    // Return filtered data
    res.json(filtered);
  } catch (error) {
    return next(error);
  }
});

router.post("/login",(req,res)=>{
    const {username,password} = req.body;
    keycloak.lo
})

export default router