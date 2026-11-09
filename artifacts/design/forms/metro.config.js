const config=require('../../../metro.config');
module.exports={...config,server:{...config.server,enhanceMiddleware:middleware=>(req,res,next)=>{if(req.url.startsWith('/index.bundle'))req.url=req.url.replace('/index.bundle','/artifacts/design/forms/native-preview.bundle');return middleware(req,res,next);}}};
