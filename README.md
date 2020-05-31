# Breakout-Phaser

## What is it?

### Using a local webserver you can easily create an instance of the classic Breakout game and use other devices as controllers!

## How do you do it?

- Clone or download the repository
- Install Node.js if you don't already have it
- Navigate to the root folder using a terminal
- Run `ipconfig` and copy your IPv4 address under wireless LAN adapter Wi-Fi. This is your local server IP-address. Let's name this parameter localServerIP
- Run `node server` to start the server on localhost
- Using the unit you want to present the screen from, navigate to _localServerIP:3000/home/_ in your browser and choose **Be the Game Screen**
- Using the unit for the first controller navigate to the same page but choose **Be Player One**
- Repeat for the second user, but choose to be player two instead.
- Play!

## How does it work?

A **node.js** script (server.js) uses the **express** library to create a local web server from your machine.</br>
Websites created on this server will be available for devices on the same Wi-Fi using the ip address of your unit on the network and the port defined in the server script.</br>
Using **socket.io**, web socket connections are created between clients using the website hosted from the server, and the server itself.</br>
These sockets are created so that designated controller sub-pages on the website will emit events through the socket connection if the value of a slider is changed.</br>
The server takes these values and updates the player objects on the game screen through another socket.
