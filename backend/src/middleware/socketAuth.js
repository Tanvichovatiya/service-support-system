import { verifyToken } from "../utils/jwt.js";

export const socketAuth = (socket, next) => {
  try {
    
    let token = socket.handshake.auth?.token;

    if (!token) {
      const cookieHeader = socket.handshake.headers.cookie;

      if (cookieHeader) {
        const tokenCookie = cookieHeader.split(";").find((cookie) => cookie.trim().startsWith("token="));
        // console.log("tokenCookie:",tokenCookie)
        if (tokenCookie) {
          token = decodeURIComponent(
            tokenCookie.trim().substring("token=".length)
          );
          // console.log("token:",token)
        }
      }
    }

    if (!token) {
      return next(new Error("Token missing"));
    }
    const decoded = verifyToken(token);
    // console.log("decode :",decoded)
    if (!decoded) {
      return next(new Error("Invalid token"));
    }

    socket.user = decoded;
    
    // console.log(
    //   `Socket authenticated: ${decoded.role} - ${decoded.id}`
    // );

    next();

  } catch (error) {
    console.error(
      "Socket authentication error:",
      error.message
    );

    next(new Error("Socket authentication failed"));
  }
};