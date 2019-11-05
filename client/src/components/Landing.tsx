import React from 'react';

const Landing = () => {
   
    return (
        <div className="container">
            <div className="row">
                <div className="col s11">
                    <h1>Welcome to Boba!</h1>
                    <p>Track code snippets and status reports with Boba!</p>
                    <p>The program we intend to create is essentially a web application that collects and displays status reports and code snippets. We intend to follow the typical architecture of web applications, where the application is divided into frontend, backend, and database. We expect the frontend to offer an interface for users to see, create, and edit information. The backend receives information from the frontend and passes it along to the database; furthermore, we expect the backend to handle the email subscription service as well. Finally, the database will manage the storage, organization, and manipulation of the data. </p>
                </div>
            </div>
        </div>
    );
}

export default Landing;