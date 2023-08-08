# Arweave Mailer

An email notification system that sends emails to subscribers when Arweave on-chain transaction(s) occur on their wallet address.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yinkaenoch/arweave-mailer-api.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and provide your MySQL database configuration and every other environment variables. The `example.env` can be used as a reference.

## Usage

1. Create a database. The application uses MySQL for data storage. Create a MySQL database connection and add the database config to the `.env` file.

2. Run the application:

   - Development

   ```
   npm run start:dev
   ```

   - Production

   ```
   npm start
   ```

3. Open PostMan and send a `POST` request to `http://localhost:[PORT]/api/v1/arweave-mailer` to access the application.

## License

This project is licensed under the ISC License.
