# Installation

1. Clone the repo
```bash
git clone https://github.com/Laurens256/afstudeerproject.git
```

2. Install NPM packages
```bash
npm install
```

3. Add the necessary environment variables: 

##### `apps/client/.env.development`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

##### `apps/server/.env.development`
```
CLIENT_URL=http://localhost:3000
```

3. Start the application
```bash
npm run dev
```

4. Open the application in your browser http://localhost:3000 (or the port you specified in the environment variables)

