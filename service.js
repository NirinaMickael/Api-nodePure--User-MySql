const Responses =(res,statusCode,headers={},key={})=>{
    res.writeHead(statusCode,headers);
    res.write(JSON.stringify(key));
    res.end();
}
const SqlQueryInsertion = async (sql,AsyncConnection,{name,username,email,password,repassword})=> {
    try {
        await AsyncConnection.query(sql, [
          username,
          name,
          email,
          password,
          repassword,
        ]);
    } catch (error) {
        throw error
    }
}
const SqlQuerySelect = async (AsyncConnection,{email,password})=> {
    const sql = "SELECT * FROM User WHERE email= ? AND password=?";
    return new Promise(res=>res(AsyncConnection.query(sql,[email,password])));
}
const SqlQuerySelectJwt = async (AsyncConnection,email)=> {
    const sql = "SELECT * FROM User WHERE email= ?";
    return new Promise(res=>res(AsyncConnection.query(sql,[email])));
}
const SqlQuerySelectAllUser = async (AsyncConnection)=>{
    const sql = "SELECT id,username,name,email,get_date FROM User";
    return new Promise(res=>res(AsyncConnection.query(sql)));
}
module.exports={Responses,SqlQueryInsertion,SqlQuerySelect,SqlQuerySelectAllUser,SqlQuerySelectJwt}