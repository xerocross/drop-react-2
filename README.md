# Drop-React-2

As I affectionately call this application in all it's forms, "Drop", is an app for storing text information of any kind for any reason. You "drop" it in the app so you don't have to remember it. What's cool about Drop is that you can use #hashtags in your drops (dropped text items) and Drop intelligently registers hashtags as keywords. Then you can search among your drops using hashtags, and if you use more than one your search is the intersection rather than the union of the results for the individual hashtags. That is what I consider useful and novel about Drop.

Also, the search field and the text-entry field are the same, and as you type in the field, search results are updated with each keystroke.

## Version 2.x Release June 2023

This is an entirely new port of my earlier Drop-React (https://github.com/xerocross/drop-react), which I wrote in 2019. This isn't an update. Rather, I rebuilt the project entirely on up-to-date platforms and packages (as of June 2023) and ported the code over. In a sense, therefore, it is quite modern because it is built on modern platforms. In a sense, it is still code from 2019 because I did not change the architecture or rewrite the code in modern idioms. The architectural choices and JavaScript idioms are those that were current to me in 2019.

## Technology

This is a **React/Redux** application, meaning it uses Redux architecture to maintain a global state. I'm still not sure I was ever sold on that, but it was very much the style of the time in 2019. It uses a **MongoDB** database on the backend for persistence. That was a novel advancement for me at the time as I was trained originally as a frontend engineer, and I wrote frontend widgets with entirely static backends.

The backend code of this app is not located here. It's a very small and simple express server that handles interactions with the database. I call it thin-data-backend, but it is not worth publishing. 

## To-Do

There are still perhaps a thousand violations of my own eslint rule-set, and I think many of the unit tests need
to be improved using proper asynchronous functions. These are things I may get around to improving one day, but
the app works, and that is my main concern.

I don't plan any major changes or improvements to the nature of the app. I consider it stable.

## Create-react-app Boilerplate

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

#### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

#### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

#### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

#### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

#### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
