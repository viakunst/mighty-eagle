export interface User {
  token: string;
}

export class UserStorage {
  static saveUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static removeUser() {
    localStorage.removeItem('user');
  }

  static getUser(): User {
    return JSON.parse(localStorage.getItem('user') ?? 'null');
  }
}

export const cognitoAttributes = [
  {
    Name: 'address',
    Value: '',
  },
  {
    Name: 'gender',
    Value: '',
  },
  {
    Name: 'name',
    Value: '',
  },
  {
    Name: 'nickname',
    Value: '',
  },
];
