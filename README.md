QUIZ APPLICATION
-----------------
OVERVIEW:
-------------
This project is a quiz application built with React, featuring role-based navigation, test management, and advanced anti-cheating measures. It is fully responsive and designed to provide a seamless user experience for both students and admins.


SCREENSHOTS:
--------------
![](public/2.png)
![](public/1.png)
![](public/3.png)
![](public/4.png)
![](public/5.png)
![](public/6.png)
![](public/7.png)
![](public/8.png)
![](public/9.png)
![](public/10.png)
![](public/11.png)
![](public/12.png)


FEATURES:
---------------

1. Role-Based Navigation:
--------------------------
     Different views and functionalities based on user roles (student or admin).

2. Test Management:
---------------------
     Admins can create, edit, and delete tests. Students can view and take tests.

3. Responsive Design:
-----------------------------
    Modern and responsive UI for both admin and student views.

4. Authentication: Secure login and role verification:
----------------------------------------------------------
     Toast Notifications: Error and success messages using react-toastify.


TECHNOLOGY STACK:
-----------------------

Frontend:
------------------

1. React

2. Tailwind CSS

3. React Router

4. Axios

5. React Toastify

6. React-Cam


Backend:
--------------------

1. Node.js

2. Express

3. MongoDB (for storing test data and user profiles)

4. JWT (for authentication)     


SETUP AND INSTALLATIONS:
--------------------------
Clone the Repository:
-----------------------
    git clone https://github.com/SonuYadav12/CipherSchoolsAssignment.git

Navigate to the Project Directory:
---------------------------------

    cd CipherSchoolsAssignment

Install Dependencies:
-------------------------
For the frontend:
--------------------

     cd myquiz
     npm install


For the backend (if you are working on it locally):
----------------------------------------------------

      cd backend
      npm install

Set Up Environment Variables:
------------------------------------

    Create a .env file in the backend directory with the following variables:

    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    JWT_REFRESH_SECRET=your-jwt-refresh-secret
    PORT=3000
    EMAIL_USER=your-email
    EMAIL_PASS=your-email-password


Run the Application:
-------------------------

Start the backend server:
---------------------------

    cd backend
    node ./server.js


Start the frontend application::
-------------------------------------
      cd myquiz
      npm start

The application should now be running at http://localhost:3000.
----------------------------------------------------------------


FOLDER STRUCTURE:
------------------------
````
/myquiz
  /public
  /src
    /pages
    App.js
    index.js

/backend
  /models
  /routes
  /controllers
  /middleware
  server.js
````

FOLDER DESCRIPTION:
---------------------------

1. /myquiz/src/pages: Contains all page components for different routes (e.g., StudentHome, AdminPage).

2. /myquiz/src/App.js: The main application component that renders the pages.


3. /backend/models: Contains Mongoose models for MongoDB.

4. /backend/routes: Contains Express routes for different API endpoints.

5. /backend/controllers: Contains functions for handling API requests.

6. /backend/middleware: Contains middleware for authentication and validation.

PAGES:
----------------

Navbar:
--------------
The Navbar component dynamically adjusts its title based on the user’s role and provides navigation options.

Props:
----------
user (object): Contains user information including name, profilePicture, and role.

onUserClick (function): Callback function for clicking on the user profile.

onLogout (function): Callback function for logging out.


USAGE :
---------------
````
1. <Navbar user={user} onUserClick={() => navigate('/user')} onLogout={handleLogout} />

````
StudentHome:
-------------
     The StudentHome component displays a list of available tests for students. It also includes a Navbar and handles loading states.


KEY FEATURES:
----------------------

1. Fetches tests from the API and displays them with images.

2. Provides a link to start each test.

3. Handles user logout.

AdminPage :
--------------

    The AdminPage component is a placeholder for admin functionalities.It also includes a Navbar and checks if the user is an admin.


API Endpoints:
---------------------

1. POST /api/auth/login: Authenticate users and return a JWT token.

2. GET /api/auth/me: Get the current user’s details (requires authentication).

3. GET /api/tests: Retrieve a list of tests (requires authentication).

4. POST /api/tests: Create a new test (admin only).

5. PUT /api/tests/ : Update an existing test (admin only).

6. DELETE /api/tests/ : Delete a test (admin only).


USAGE:
-------------

For Students:
--------------
     Log in and navigate to the StudentHome page to view available tests and start them.

For Admins:
------------
       Log in and navigate to the AdminPage to manage tests and users.


CONTRIBUTING:
--------------------
1. Fork the repository.

2. Create a new branch (git checkout -b feature/your-feature).

3. Make your changes.

4. Commit your changes (git commit -am 'Add new feature').

5. Push to the branch (git push origin feature/your-feature).

6. Create a new Pull Request.


LICENSE:
-----------------

This project is licensed under the MIT License. See the LICENSE file for details.
