export class UserAlreadyExists extends Error {
  constructor() {
    super('User with same email already exists')
  }
}
