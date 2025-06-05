export class UserService {
  constructor() {
    this.users = [{ id: 1, name: 'Alice' }];
  }

  getAll() {
    return this.users;
  }

  getById(id) {
    return this.users.find(u => u.id === id);
  }

  create(user) {
    const newUser = { id: Date.now(), ...user };
    this.users.push(newUser);
    return newUser;
  }
}
