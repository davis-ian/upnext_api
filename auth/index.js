import { auth, claimCheck } from "express-oauth2-jwt-bearer";

//Auth0 Config
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

const adminClaims = claimCheck((claims) => {
  return claims.permissions.includes("SuperAdmin");
});

const auth0Helper = { jwtCheck, adminClaims };

export default auth0Helper;
