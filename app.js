var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var os = require('os');

if (os.cpus()[0].model.indexOf('ARM') > -1) {
    var Gpio = require('pigpio').Gpio,
        button = new Gpio(23, {
            mode: Gpio.INPUT,
            pullUpDown: Gpio.PUD_UP,
            edge: Gpio.EITHER_EDGE
        }),
        led = new Gpio(16, {mode: Gpio.OUTPUT});

    button.on('interrupt', function (level) {
        console.log('but= ' + level);
        io.emit('but', { state: level });
    });
}
else {
    var state = true;
    function tick() {
        console.log('but= ' + state);
        io.emit('but', { state: state });
        state = !state;
    }
    setInterval(tick, 3000);
}

io.on('connection', function(socket) {
    socket.on('led', function(data) {
        console.log(data);
        console.log(Gpio);
        if (Gpio)
            led.digitalWrite(level);
    });
});

app.use(express.static(__dirname + '/static'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('index');
});

server.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
