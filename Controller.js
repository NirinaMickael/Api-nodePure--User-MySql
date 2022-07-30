const { Datas } = require("./db");
const { headers } = require("./config");
const jwt = require("jsonwebtoken");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");
const DatabaseConnect = require("./connect");
const {
  Responses,
  SqlQueryInsertion,
  SqlQuerySelect,
  SqlQuerySelectAllUser,
  SqlQuerySelectJwt,
} = require("./service");
const Controller = {
  LoginUser: (req, res) => {
    let chunks = [];
    var Data = "";
    let responseError = "";
    let AsyncConnection = DatabaseConnect.connect;
    req.on("data", (chunck) => chunks.push(chunck));
    req.on("end", async () => {
      const data = Buffer.concat(chunks);
      Data = data.toString("utf-8");
      const { email, password } = JSON.parse(Data);
      let test = false;
      try {
        var [sqlResponse] = await SqlQuerySelect(AsyncConnection, {
          email,
          password,
        });
        if (sqlResponse.length > 0) test = true;
      } catch (error) {
        console.log(error);
      }
      if (test) {
        const DataSend = { data: sqlResponse[0], success: true };
        try {
          const token = jwt.sign(
            { data: sqlResponse[0].email },
            "process.env.jwtkey",
            {
              algorithm: "HS256",
              expiresIn: "1h",
            }
          );
          Responses(
            res,
            202,
            { ...headers, Authorization: "Bearer " + token },
            { ...DataSend, token: token }
          );
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        responseError = { data: [], success: false };
        Responses(res, 404, headers, responseError);
      }
    });
  },
  SignUser: (req, res) => {
    let chunks = [];
    var Data = "";
    let responseError = "";
    let AsyncConnection = DatabaseConnect.connect;
    req.on("data", (chunck) => chunks.push(chunck));
    req.on("end", async () => {
      const data = Buffer.concat(chunks);
      Data = data.toString("utf-8");
      const { username, name, email, password, repassword } = JSON.parse(Data);
      //tester les champ;
      if (!email && !username && !password && !repassword && !name) {
        responseError = { success: false, message: "all fields is required" };
        Responses(res, 201, {}, responseError);
      }
      try {
        const sql =
          "INSERT INTO User (name,username,email,password,repassword) VALUES (?,?,?,?,?)";
        let keys = { name, username, email, password, repassword };
        await SqlQueryInsertion(sql, AsyncConnection, keys);
        Responses(res, 201, headers, {
          success: true,
          data: { ...JSON.parse(Data) },
        });
      } catch (error) {
        responseError = { success: false, message: error.sqlMessage };
        Responses(res, 409, headers, responseError);
      }
    });
  },
  AllUser: async (req, res) => {
    let AsyncConnection = DatabaseConnect.connect;
    try {
      const [response] = await SqlQuerySelectAllUser(AsyncConnection);
      Responses(res, 200, headers, response);
    } catch (error) {
      responseError = { success: false, message: error.sqlMessage };
      Responses(res, 409, headers, responseError);
    }
  },
  AccessDashboard: async (req, res) => {
    let AsyncConnection = DatabaseConnect.connect;
    // const { rawHeaders } = req;
    // console.log(req.url);
    var tabChunk = [];
    req.on("data", (chunck) => tabChunk.push(chunck));
    req.on("end", async () => {
      let token = Buffer.concat(tabChunk).toString("utf-8");
      try {
        let decodedToken = jwt.verify(token, "process.env.jwtkey");
        try {
          const [response] = await SqlQuerySelectJwt(
            AsyncConnection,
            decodedToken.data
          );
          if (response.length > 0) {
            try {
              const [response] = await SqlQuerySelectAllUser(AsyncConnection);
              const new_time = (time)=>new Date(time*1000).toLocaleTimeString('en-US')
              Responses(res, 200, headers, {success:true,data:response,ttl:{exp:new_time(decodedToken.exp),iat:new_time(decodedToken.iat)}});
            } catch (error) {
              responseError = { success: false, message: error.sqlMessage };
              Responses(res, 409, headers, responseError);
            }
          } else {
            Responses(res, 403, headers, {
              success: false,
              message: error.message,
              error: "Token invalied",
            });
          }
        } catch (error) {
          responseError = { success: false, message: error.sqlMessage };
          Responses(res, 409, headers, responseError);
        }
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          Responses(res, 403, headers, {
            success: false,
            message: error.message,
            expiresAt: error.expiredAt,
          });
        } else {
          Responses(res, 403, headers, {
            success: false,
            message: error.message,
          });
        }
      }
    });
  },
};
module.exports = { Controller };
