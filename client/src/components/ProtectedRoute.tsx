import React from 'react';
import {
    Route,
    RouteComponentProps,
    RouteProps,
    Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import {
    State,
    User
} from '../store/stateTypes';


export interface ProtectedRouteProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    user?: User | null;
}

// Citation: https://stackoverflow.com/questions/47747754/how-to-rewrite-the-protected-router-using-typescript-and-react-router-4
const ProtectedRoute = ({component, user, ...rest}:ProtectedRouteProps) => {
    // console.log('protected route props', {component, user, ...rest});
    const routeComponent = (props: any) => (
        user !== null
        ? React.createElement(component, props)
        : <Redirect to={{pathname: '/', state: {from: props.location}}} /> 
    )
    return <Route {...rest} component={routeComponent} />;
};

const mapStateToProps = ({user}: State, props: ProtectedRouteProps): State => {
    return { ...props, user };
};

export default connect(mapStateToProps)(ProtectedRoute);