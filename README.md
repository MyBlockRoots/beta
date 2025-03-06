# My Block Roots

A platform for creating, visualizing, and permanently storing family trees on the blockchain.

## Features

- **Interactive Family Tree**: Build and visualize your family tree using an intuitive interface.
- **GEDCOM Import**: Upload your existing GEDCOM files to automatically generate family trees.
- **Blockchain Storage**: Permanently store your family history on Arweave and record transactions on Polygon.
- **User Authentication**: Secure login and registration system.
- **Responsive Design**: Works on desktop and mobile devices.

## Technology Stack

- **Frontend**: React, GoJS (for family tree visualization)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Blockchain**: Arweave (for permanent storage), Polygon (for transactions)
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd my-block-roots
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables
- Create a `.env` file in the server directory based on the `.env.example` template
- Fill in your database credentials and JWT secret

4. Set up the database
```bash
# Create a PostgreSQL database named 'blockroots'
createdb blockroots
```

5. Start the development servers
```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm start
```

6. The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. Register a new account or log in with existing credentials
2. Create a new family tree by adding individuals and relationships
3. Alternatively, upload a GEDCOM file to automatically generate a family tree
4. View and edit your family tree in the interactive diagram
5. Save your family tree to the blockchain for permanent storage

## Blockchain Integration

The application uses:
- **Arweave** for permanent storage of GEDCOM files
- **Polygon** for recording transaction details, ensuring low fees and fast processing

To enable blockchain functionality, you'll need to:
1. Create an Arweave wallet and add the key to your `.env` file
2. Create a Polygon wallet and add the private key to your `.env` file

## Deployment

For production deployment:
1. Build the React frontend
```bash
cd client
npm run build
```

2. Deploy the frontend to a static hosting service like Vercel or Netlify
3. Deploy the backend to a cloud server (AWS, Digital Ocean, etc.)
4. Set up a production PostgreSQL database

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact: support@myblockroots.com 