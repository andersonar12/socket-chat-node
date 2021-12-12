
let socket = io();

let params = new URLSearchParams(window.location.search)

if(!params.has('name')||!params.has('room')){
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

var user = { name: params.get("name"), room: params.get("room") };

//Reenderizar Mensaje

const renderMessage = (message, me) => {

  let date = new Date(message.date)
  let time = date.getHours() + ':' + date.getMinutes()
  let adminClass = 'info'

  if (message.name == 'Admin') {
    adminClass = 'danger'
  }

  let chatBox = document.getElementById("divChatbox");
  let divElement = document.createElement("li")


  if (me) {
    divElement.innerHtml = `<li class="reverse">
      <div class="chat-content">
          <h5>${message.name}</h5>
          <div class="box bg-light-inverse">${message.message}</div>
      </div>
      <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
      <div class="chat-time">${time}</div>
    </li>`;
  } else {
    
    divElement.innerHTML = `
    </li><div class="chat-img">
        <img src="assets/images/users/1.jpg" alt="user" />
      </div>
      <div class="chat-content">
        <h5>${message.name}</h5>
        <div class="box bg-light-${adminClass}">${message.message}</div>
      </div>
      <div class="chat-time">${time}</div></li>`;
  }

  chatBox.append(divElement);
};

// escuchar
socket.on('createMessage', (message)=> {
    console.log('Servidor',message);
    renderMessage(message,false)
});


//Escuchar cambios de usuario
socket.on('listPersons', (message)=> {
    console.log('Personas Conectadas',message);

});

//Mensajes privados
socket.on('privateMessage', (message)=> {
    console.log('Mensaje privado',message);
});


//Logica de Vue
const APP = new Vue({
  el: "#app",
  data: {
    persons: [],
    room: true,
    textMessage: null,
  },
  created() {
    let paramsChat = new URLSearchParams(window.location.search);
    this.room = paramsChat.has("room") ? paramsChat.get("room") : "";
    console.log("Created Cycle");

    socket.on("connect", () => {
      console.log("Connected to Server");
      socket.emit("enterChat", user, (persons) => {
        console.log("Users connected", persons);
        let users = document.getElementById("divUsuarios");
        users.innerHTML = "";
        this.persons = persons;
      });
    });
  },
  methods: {
    clickUser(event) {
      const id = event.target.getAttribute("data-id");
      if (!id) return;
      console.log(id);
    },
    sendMessage(e) {
      e.preventDefault();
      if (!this.textMessage || this.textMessage.length == 0) return;
      console.log(this.textMessage);

      socket.emit(
        "createMessage",
        { name: user.name, message: this.textMessage },
        (resp) => {
          /* console.log('mensaje enviado',resp) */
          this.textMessage = "";
          renderMessage(resp,true);
        }
      );
    },
  },
});


