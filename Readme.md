#Installation

```
git clone git@github.com:DanielCoulbourne/socket-to-em.git
cd socket-to-em
npm install
```

#Usage

```
node index.js [--socket "XXX"] [--hook "XXX"] [--events "XXX,YYY"] [--slack "XXX"]
```

This script accepts 4 arguments.

### --socket (required)
This is the websocket server that you will be subscribing to 

### --hook (required)
This is the endpoint we will forward the post request too

### --events (required)
This is a comma separated list of the websocket events you want to subscribe to.

### --slack (optional)
This is the Slack webhook URL you can use to monitor your script.