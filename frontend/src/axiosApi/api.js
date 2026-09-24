import axios from 'axios'

 const api = axios.create({
  baseURL : process.env.NEXT_PUBLIC_API || 'http://localhost:4000'
})

api.interceptors.request.use((config)=>{

  console.log("req url:",config.url)
  const publicRoutes=["/auth/register","/auth/login","/auth/verifyotp"]

  if(!publicRoutes.includes(config.url)){

    const token=sessionStorage.getItem("token")

    if(token){
      config.headers.Authorization=`Bearer ${token}`
    } 
  }
   return config
})

export default api;