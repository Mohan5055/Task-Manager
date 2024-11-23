import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers'
import HandleResponse from '@app/_helpers/Handler';
import { auth, roleAuth } from '@app/_helpers/auth';

type Role =  'user' | 'admin';
interface IRequest {
    url: string | RegExp,
    method: string,
    role: Role[]
}
const requestArray: IRequest[] = [ // 'user' | 'admin'
    { url: '/api/login', method: "POST", role: ['admin', 'user'] },
    { url: '/api/login', method: "GET", role: ['admin', 'user'] },
    // {url : '/api/signup', method: "POST", role: ['admin','user']}
    // { url: '/api/users', method: "GET", role: ['admin']},
]
export async function middleware(request: NextRequest, event: NextFetchEvent) {
    const checkRequest = requestArray.find((request_: IRequest) => {
        if (request.nextUrl.pathname.search(request_.url) >= 0 && request.method == request_.method) {
            return request_
        }
    })
    if (checkRequest) {
        return await middleware_callback(request, checkRequest.url, checkRequest.method, checkRequest.role,)
    }
    return NextResponse.next({})
}

async function middleware_callback(request: NextRequest, url: string | RegExp, method: string, roles: string[]) {
    if (request.nextUrl.pathname.search(url) >= 0) { //'/api/login'
        if (request.method === method) { // POST
            const authorization = (await headers()).get('Authorization') && (`${(await headers()).get('Authorization')}`.startsWith('Bearer') || `${(await headers()).get('Authorization')}`.startsWith('bearer')) ? (await headers()).get('Authorization') : false;
            if (!authorization) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.headers.set('Cache-Control', 'no-store');
                return response;
                // return HandleResponse({
                //     type: "UNAUTHORIZED",
                //     message: "token is missing"
                // })
            }
            const token = authorization.split(" ")[1];
            const auth_ = await auth(token);
            if (!auth_) {
                return HandleResponse({
                    type: "UNAUTHORIZED",
                    message: "UNAUTHORIZED"
                })
            }
            const user = JSON.parse(auth_ as string)
            const role = roleAuth(roles, user.userRole as string)
            if (!role) {
                return HandleResponse({
                    type: "UNAUTHORIZED",
                    message: "you are not authorized to access this feature"
                })
            }
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('user', auth_ as string)
            return NextResponse.next({
                request: {
                    ...request,
                    headers: requestHeaders
                }
            })
        }
    }
}