const {Controller} = require('./Controller');
const {headers} = require('./config')
const route = (req, res, url, method) => {
  
  if (url == "login" && method == "POST") {
    Controller.LoginUser(req,res);
  } else if (url == "register" && method == "POST") {
    Controller.SignUser(req,res);
  } else if (url == "alluser" && method == "GET") {
    Controller.AllUser(req,res);
  }else if (url == "dashboard" && method == "GET") {
    Controller.AccessDashboard(req,res);
  }else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({message:'Not found',success:false}))
    res.end();
  }
};
module.exports={route}