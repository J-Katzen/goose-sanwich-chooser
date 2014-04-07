// Module dependencies

var express = require('express'),
    mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/goose');

var app = express();
var server = app.listen(1337);
var io = require('socket.io').listen(server);
var Order = require('./models/order');

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(express.favicon());
    app.use(express.static(__dirname + '/public'));
    app.use(express.urlencoded());
    app.use(express.methodOverride());
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/api/orders', function(req, res) {
    var today = new Date().setHours(0,0,0,0);
    var tmr = new Date(today);
    tmr.setDate(tmr.getDate() + 1);
    Order.find({"created": {"$gte": today, "$lt": tmr }},
        function(err, orders) {
            if(err) res.send(err);
            res.json(orders);
    });
});

app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

io.sockets.on('connection', function(socket) {
    socket.on('order:new', function(order) {
        console.log(order);
        var nord = new Order({stripe: order.stripe_id,
                              name: order.name,
                              note: order.note});
        nord.save();
        console.log(nord);
        socket.broadcast.emit('order:new', nord);
    });

    socket.on('order:update', function(order) {
        console.log(order);
        socket.broadcast.emit('order:update', order);
    });

    // socket.on('disconnect', function() {
    //     socket.broadcast.to(socket.room).emit('blitz:chatmsg',
    //         {msg: socket.user_name + ' has disconnected!'});
    //     socket.leave(socket.room);
    // });

});

console.log("express server listening on 1337");