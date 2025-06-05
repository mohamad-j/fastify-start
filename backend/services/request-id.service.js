export class RequestIdService {
  constructor() {
    this.id = Math.random().toString(36).substring(2, 10);
  }

  getId() {
    return this.id;
  }
}
