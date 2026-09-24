import { errorResponse } from "../utils/apiResponse.js";


const authorize = (...allowedRoles) =>{

  return (req,res,next) =>{

    if(!req.user.role){
      return errorResponse(res,{statusCode:401,message:"authentication required"})
    }

    if(!allowedRoles.includes(req.user.role)){
      return errorResponse(res,{statusCode:403,message:"You are not authorized to access this resource"})
    }
    next();
  }
}

export default authorize;