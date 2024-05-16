# GeoData Management System

This project is a GeoData Management System built using Next.js, Prisma, and PostgreSQL. It is designed to provide users with the capability to upload and manage geographical data, with features that allow for viewing, editing, and analyzing geo-spatial data.

## Features

- User Authentication and Authorization
  - Login and Registration
  - Role-based access control (Users and Admins)
- GeoJSON data upload and visualization
- Responsive web design

## Technologies

- **Next.js**: The React framework for production - used for SSR and API routes.
- **Prisma**: Next-generation ORM for Node.js and TypeScript - used for database management.
- **PostgreSQL**: Robust RDBMS - used as the primary data storage solution.
- **Tailwind CSS**: Utility-first CSS framework for rapidly building custom designs.
- **React-Leaflet**: For interactive mapping and geo-data visualization.

## Live Demo
Check out the live demo of this project deployed on Heroku: [GeoData Management System](https://geodata-management-0af4c1d88e41.herokuapp.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js (LTS version recommended)
- PostgreSQL
- npm or yarn

### Installing

A step-by-step series of examples that tell you how to get a development environment running.

1. **Clone the repository**

   ```bash
   git clone https://github.com/arjunsumarlan/geodata-management.git
   cd geodata-management
   ```
2. **Install the dependencies:**
    ```bash
    npm install
    ```

3. **Set up environtment variables**

    Create a `.env` file in the root directory based on the `.env.example` template. You can start by copying the example file:
    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with the necessary details. Here are the key environment variables you need to set:
    * **DATABASE_URL**: Your Database URL.
    * **JWT_SECRET**: Your JWT Secret Key.

    Example of `.env` contents:
    ```plaintext
    DATABASE_URL="postgresql://postgres:admin@localhost:5432/postgres"
    JWT_SECRET="your_secret_key"
    ```

4. **Run the database migrations**

    ```plaintext
    npm run db:migrate -- "MIGRATION_NAME"
    ```
    Replace `MIGRATION_NAME` with your migration name, such as: `AddUserTable`

5. **Start the development server**

    ```plaintext
    npm run dev
    ```
    Navigate to http://localhost:3000 to view the app.

### Deploying to Heroku
To deploy this project to Heroku, follow these steps:

1. **Install the Heroku CLI**: If you haven't already, install the Heroku CLI from [here](https://devcenter.heroku.com/articles/heroku-cli).

2. **Log in to your Heroku account**:
    ```bash
    heroku login
    ```
3. **Create a new Heroku application**:
    ```bash
    heroku create geodata-management
    ```
4. **Add PostgreSQL add-on**:
    ```bash
    heroku addons:create heroku-postgresql:hobby-dev
    ```
5. **Set up environment variables**:
    ```bash
    heroku config:set JWT_SECRET="your_secret_key"
    ```
6. **Deploy your code**:
    ```bash
    git push heroku main
    ```
7. Run database migrations:
    ```bash
    heroku run npm run db:migrate -- "MIGRATION_NAME"
    ```
8. Open the application:
    ```bash
    heroku open
    ```

### Running the tests

To run the tests, use the following command:
```bash
npm test
```
This command will execute all tests written in the `tests/` directory.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is [MIT licensed](https://github.com/arjunsumarlan/geodata-management/blob/main/LICENSE).

## Contact
If you have any questions, please contact me at [arjunsumarlan@gmail.com](arjunsumarlan@gmail.com).

