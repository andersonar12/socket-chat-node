class Users{
    constructor(){
       this.persons = [] 
    }

    addPerson(id,name, room){
        let person = { id, name, room}
        this.persons.push(person)
        return this.persons
    }

    getPerson(id){
        let person = this.persons.find(p => p.id === id)
        return person
    }

    getPersons(){
        return this.persons
    }

    getPersonsByChatRoom(room){
        let persons = this.persons.filter((p)=>p.room ===room)
        return persons
    }

    deletePerson(id){
        
        let personDeleted = this.getPerson(id)
       this.persons = this.persons.filter(p =>{
            return this.persons.id != id
        })

        return personDeleted
    }

}

module.exports = {
    Users
}