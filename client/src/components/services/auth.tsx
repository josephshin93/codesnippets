

// Citation: https://hackernoon.com/m-e-r-n-stack-application-using-passport-for-authentication-920b1140a134
// export const userAuthorized = (props: RouteProps) => {
//     if (props.location && props.location.search) {
//         const query = queryString.parse(props.location.search);
//         if (query.token) {
//             localStorage.setItem('token', query.token);
//             return true;
//         }
//     }
//     // check for existing token
//     // TODO: validate it
//     if (localStorage.getItem('token')) return true;
//     return false;
// };

export const userAuthorized = ():boolean => {
    // check for existing token
    // TODO: validate token, parse token to extract user info?
    if (localStorage.getItem('user')) return true;
    return false;
}