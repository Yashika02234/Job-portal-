/* use of middleware :- middleware in Node.js & Express acts as a bridge (protocol or instruction layer) 
between the request (client) and the response (server). It processes requests before they reach the final route 
handler and can modify the request, response, or even terminate the request before it reaches the next stage.*/

import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).jason({
        message: "User not Authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).jason({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId;
    next(); // move to next route
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
