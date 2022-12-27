# Vinaa
Quiz app built with NextJS, styled-components, and SQLite

### Usage
First, you need to set the necessary environment variables:
+ `GOOGLE_CLIENT_ID` - Google client ID (necessary for auth); find it in the "Credentials" section of the Google Console
+ `GOOGLE_CLIENT_SECRET` - Google client secret
+ `NEXTAUTH_SECRET` - A random string, preferably 16 bytes, used to hash JWTs (handled by the [`next-auth`](https://npmjs.com/package/next-auth) package)
+ `NEXTAUTH_URL` - set this to your project's domain (or you will be redirected incorrectly)
+ `SUBSCRIPTION_KEY` - the subscription key for the Microsoft Speech API (used for tamil audio)
+ `ADMINS` - a JSON array of admin emails (e.g. `["email@example.com']`)

For production:
```shell
npm run build # if project isn't yet built
npm start
```
Development mode:
```shell
npm run dev
```

### Development
There are 6 root directories:
+ `assets` - contains assets that will be imported to React components
+ `components` - this contains reusable components from the project
+ `pages` - a required NextJS directory for file-system routing
+ `public` - assets you wish to be exposed by the server are stored here
+ `server` - this directory contains all the server-side logic for this project

Misc files:
+ `next.config.js` - custom config for the nextjs app
+ `jsconfig.json` - used to configure import aliases (e.g. `import xyz from "@/api/xyz"` instead of `import xyz from "../../api/xyz"`)

This project uses SQLite as the database, and because this project doesn't rely on an API server, you can deploy your entire project just by running only this app!

The code is commented where comments are due, so go ahead! Remix and play around.

### License
MIT

### Credits
This project was written by [@codergautam](https://github.com/codergautam) with special thanks to [@codingjlu](https://replit.com/@codingjlu)
