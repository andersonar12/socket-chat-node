const { io } = require('../server.js');
const {Users}= require('../classes/users.js')
const users = new Users()
const { createMessage } = require('../utilities/utilities.js');

io.on('connection', (client) => {

    client.on('enterChat',(userConnected,callback) => {

        /* console.log(userConnected) */;
        if(!userConnected.name || !userConnected.room){
            return callback({err:'The name/room is necesary'})
        }

        const ROOM = userConnected['room']

        client.join(ROOM)
        const persons = users.addPerson(client.id,userConnected.name,ROOM)
        client.broadcast.to(ROOM).emit('listPersons',users.getPersons())
        client.broadcast.to(ROOM).emit('createMessage', createMessage('Admin',`${userConnected.name} se unio`))
        callback(persons)
       
    });

    client.on('createMessage', (data,callback) => {
        const person = users.getPerson(client.id)
        const message = createMessage(person.name,data.message)
        
        client.broadcast.to(person.room).emit('createMessage', message)
        
        callback(message)
      });

    client.on('disconnect', () => {
      const personDeleted = users.deletePerson(client.id)
      const ROOM = personDeleted['room']

      client.broadcast.to(ROOM).emit('createMessage', createMessage('Admin', `${personDeleted.name} left the chat`))
      client.broadcast.to(ROOM).emit('listPersons',users.getPersonsByChatRoom(ROOM))
    });

    //Mensajes privados
    client.on('privateMessage', (data)=>{
        const person = users.getPerson(client.id)
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name,data.message))

    })


});