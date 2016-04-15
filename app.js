var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    socket.on('led', function(data) {
        console.log(data);
    });
});

app.use(express.static(__dirname + '/static'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('index');
});

var state = true;
function tick() {
    console.log('but= ' + state);
    io.emit('but', { state: state });
    state = !state;
}
setInterval(tick, 3000);

server.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
