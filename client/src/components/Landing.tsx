import React from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';



const Landing = (props: any) => {

    // console.log('landing props', props);

    if (props.location.search) {
        const query = queryString.parse(props.location.search);
        if (query.token) {
            localStorage.setItem('user', query.token as string);
            return <Redirect to={{pathname: '/dashboard'}} /> 
        } else if (query.logout) {
            localStorage.removeItem('user');
            return <Redirect to={{pathname: '/'}} /> 
        }
    }
    
    

    return (
        <div>
            <h1>Boba</h1>
            <p>Track code snippets and status reports with Boba!</p>
        </div>
    );
}

export default Landing;