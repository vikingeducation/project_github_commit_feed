## Project github commit feed

This application will build a feed to display the Github commits for a given repo. The application will also have a webhook to a respository (in this case my repository). Using [ngrok](https://ngrok.com/) to allow Github webhooks to send requests to my local server.

In order to access the commits for a given user, the library [Node-Github (Github)](https://github.com/mikedeboer/node-github) is being to access the Github API.

In order to run the application you can run the ```app.js``` file, but a token is needed when starting the application. In order to use a token make a ```.env``` file in the root directory of the project and type your key like so ```GITHUB_TOKEN=whateveryourtokeis```

The retrieved commits when the form is submitted are displayed on the html page as well as in a json file. 

![Github Commit Feed](https://user-images.githubusercontent.com/10369374/26847395-e997c98e-4aca-11e7-97ed-33ca213ca862.PNG)
