# Web Developer Test - User Task Management

This project is the result of the Manage of user Activities Test App

The project includes the following libraries/functionality
- React 16
- Apollo 2
- Express
- Mongoose
- GraphQL
- Authentication: passwordless via JWT
- ES6 syntax
- service workers

Styling:
- material-ui
- styled-components
- storybook

## Step by step guide to get started with this project

### 1. MongoDB
Before doing anything, you need to setup your mongodb conection
### 2. Create the .env file:
Inside both 'server' and 'client' folders there is a .sample.env file. Create a new file called ```.env``` based on the provided ```.sample.env```.

### 3. Running the app locally in dev mode

1. Setup your MONGO_URL env variable inside /server/.env to connect the app with your recently created Mongo instance. In case you are using mLab, remember to use your credentials. In case your are running mongo locally, you can use the default value for MONGO_URL.

3. Install project dependencies, and run the app locally.
```
>> yarn install
>> yarn start
