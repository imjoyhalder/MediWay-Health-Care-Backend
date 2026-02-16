import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./jwt";

const getAccessToken = (payload: JwtPayload) => {
    const token = jwtUtils.createToken(payload,)
}