const Responses =(res,statusCode,headers={},key={})=>{
    res.writeHead(statusCode,headers);
    res.write(JSON.stringify(key));
    res.end();
}
const SqlQuery = async (sql,AsyncConnection,{username,email,password,repassword})=> {
    try {
        await AsyncConnection.query(sql, [
          username,
          email,
          password,
          repassword,
        ]);
    } catch (error) {
        throw error
    }
}

module.exports={Responses,SqlQuery}