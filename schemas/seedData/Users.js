const rawUsers = [{
    firstname: "Ayush",
    lastname: "Bansal",
    email: "ayush@gmail.com",
    password: "12345678",
}];

const Users = rawUsers.map(user => {
    if (!user.username) {
        user.username = user.email;
    }
    return user;
});

export default Users;