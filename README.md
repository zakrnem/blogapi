# Blog API Project

This repository hosts the backend API server for the [Zakrnem's Tech Blog](https://github.com/zakrnem/blog_frontend) project, developed as part of [The Odin Project](https://www.theodinproject.com/) NodeJS Course. The project aims to create a full-stack application where users can access blog posts, create comments after signing up and logging in, and authors can manage content by creating new posts and editing existing ones. Both [client-facing](https://github.com/zakrnem/blog_frontend) and [Content Management System (CMS)](https://github.com/zakrnem/blog_cms) interfaces interact with the backend service through a RESTful API, which stores data in a MongoDB database using Mongoose.

## Technologies Used

- __MongoDB:__ Stores blog data including users, posts, and comments.
- __Mongoose:__ Facilitates communication with the MongoDB database.
- __Postman:__ Used for testing API routes.
- __ChatGPT:__ Aids in content creation by providing assistance in drafting accurate and engaging blog posts.
- __Express:__ Utilized as the server framework.
- __date-fns:__ Enables date formatting.
- __bcryptjs:__ Compares user-provided passwords against stored values in the database.
- __cookie-parser:__ Handles session cookies.
- __cors:__ Enables cross-origin requests.
- __dotenv:__ Manages environment variables.
- __express-async-handler:__ Facilitates handling of asynchronous requests.
- __http-errors:__ Used for creating standard HTTP errors.
- __morgan:__ Logs server actions during development.
- __eslint and prettier:__ Used for code linting and formatting respectively.


## Getting started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 20.11.1)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/zakrnem/blogapi.git
    ```

2. Navigate to project directory:

    ```bash
    cd blogapi
    ```

3. Install dependencies:

    ```bash
    npm i
    ```

### Configuration

Follow these steps to configure the project:

1. Create a `.env` file in the root directory of the project.

2. Add the following environment variables to the `.env` file:

    ```plaintext
    USER_NAME="MongoDB cluster username"
    PASSWORD="MongoDB cluster password"
    URL="MongoDB cluster connection URI"
    SESSION_SECRET="Your Express session secret"
    FRONT_END_URL="http://localhost:5173"
    SALT="Your salt for hashing user passwords"
    ```

    Make sure to replace the placeholder values with your actual MongoDB cluster credentials. Adjust the `FRONT_END_URL` value if necessary.

3. Save the `.env` file.

These environment variables are essential for the proper functioning of the project. Ensure they are correctly set up to establish a connection with your MongoDB cluster.

### Executing the app

```bash
npm run serverstart
```

### Testing API Routes

You can test the API routes using [Postman](https://www.postman.com/) or any other API testing tool. The server runs on http://localhost:3000 by default.






