const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/myroom', (req, res) => {
    res.redirect(`/${uuidV4()}`)
    // res.redirect(`/sala/${uuidV4()}`)
})

// app.get('/sala/:room', (req, res) => {
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        // console.log(roomId, userId)
        socket.join(roomId)
        socket.to(roomId).emit("user-connected", userId);

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(3002 || process.env.PORT)