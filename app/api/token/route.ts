
import HandleResponse from "@app/_helpers/Handler";
import { jwtVerify, SignJWT } from "jose";
import { headers, cookies } from 'next/headers'

export async function GET(req: Request) {
    try {
        const authorization = (await headers()).get('Authorization') && (`${(await headers()).get('Authorization')}`.startsWith('Bearer') || `${(await headers()).get('Authorization')}`.startsWith('bearer')) ? (await headers()).get('Authorization') : false;
        if (!authorization) {
            return HandleResponse({
                type: "BAD_REQUEST",
                message: "refresh token is missing"
            })
        };
        const token = authorization.split(" ")[1];
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXTAUTH_SECRET!));
        if (!payload?.refresh) {
            return HandleResponse({
                type: "UNAUTHORIZED",
                message: "refresh token is wrong"
            })
        }
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + (5 * 60); // 5 minutes from now in seconds
        const accesstoken = await new SignJWT({ access: payload?.refresh })
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET!))
        ;(await cookies()).set("accessToken", accesstoken, { expires: new Date((iat + (5 * 60)) * 1000) })
        ;(await cookies()).set("accessTokenExpire", new Date((iat + (5 * 60)) * 1000).toISOString(), { expires: new Date((iat + (5 * 60)) * 1000) })
        return HandleResponse({ type: "SUCCESS", message: "", data: { accesstoken } })
    } catch (error: any) {
        (await cookies()).delete('refreshToken');
        (await cookies()).delete('accessToken');
        return HandleResponse({
            type: "UNAUTHORIZED",
            message: "refresh token is wrong"
        })
    }
}