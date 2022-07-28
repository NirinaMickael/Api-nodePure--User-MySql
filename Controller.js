const { Datas } = require("./db");
const { headers } = require("./config");
const jwt = require("jsonwebtoken");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");
const DatabaseConnect = require("./connect");
const { Responses, SqlQuery } = require("./service");
const Controller = {
  LoginUser: (req, res) => {
    let chunks = [];
    var Data = "";
    let responseError="";
    req.on("data", (chunck) => chunks.push(chunck));
    req.on("end", () => {
      const data = Buffer.concat(chunks);
      Data = data.toString("utf-8");
      const { email, password } = JSON.parse(Data);
      const test = Datas.some(
        (e) => e.password == password && e.email == email
      );
      if (test) {
        const DataSend = { data: { ...JSON.parse(Data) }, success: true };
        Data = JSON.stringify(DataSend);
        try {
          const token = jwt.sign(
            { ...JSON.parse(Data) },
            "process.env.jwtkey",
            {
              algorithm: "HS256",
              expiresIn: 60,
            }
          );
          Responses(res,202, { ...headers, Authorization: "Bearer " + token },Data);
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        responseError = { data: [], success: false };
        Responses(res,404,headers,responseError)
      }
    });
  },
  SignUser: (req, res) => {
    let chunks = [];
    var Data = "";
    let responseError="";
    let AsyncConnection = DatabaseConnect.connect.promise();
    req.on("data", (chunck) => chunks.push(chunck));
    req.on("end", async () => {
      const data = Buffer.concat(chunks);
      Data = data.toString("utf-8");
      const { email, username, password, repassword } = JSON.parse(Data);
      //tester les champ
      if (!email && !username && !password && !repassword) {
        responseError = {success:false,message:"all fields is required"};
        Responses(res,201,{},responseError)
      }
      try {
        const sql =
          "INSERT INTO User (username,email,password,repassword) VALUES (?,?,?,?)";
        let keys={username,email,password,repassword};
        await SqlQuery(sql,AsyncConnection,keys);
        Responses(res,201,JSON.parse(Data));
      } catch (error) {
        responseError = { success: false, message: error.sqlMessage };
        Responses(res,409,{},responseError);
      }
    });
  },
  AllUser: (req, res) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({ data: Datas, success: true }));
    res.end();
  },
  AccessDashboard: (req, res) => {
    const { rawHeaders } = req;
    try {
      jwt.verify(rawHeaders[1], "process.env.jwtkey");
      res.end("ok");
    } catch (error) {
      res.writeHead(403, headers);
      if (error instanceof TokenExpiredError) {
        res.write(
          JSON.stringify({ message: error.message, expiresAt: error.expiredAt })
        );
        res.end();
      } else {
        res.write(JSON.stringify({ message: error.message }));
        res.end();
      }
    }
  },
};
module.exports = { Controller };
