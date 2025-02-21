import { Expose, Transform, Type } from 'class-transformer';
import { InitializableEntity } from './intializable.entity';

class Admin {
  @Expose({ name: '_id' })
  id = '';

  firstName = '';
  lastName = '';
  email = '';
  role = 0;
}

export class Credentials extends InitializableEntity {
  status = '';
  message = '';

  @Type(() => Admin)
  @Expose({ name: 'admin' })
  admin = new Admin();

  @Expose({ name: 'accessToken' })
  token = '';

  constructor(init?: Partial<Credentials>) {
    super(init);
    this.initEntity(init);
  }

  get fullName(): string {
    return `${this.admin.firstName} ${this.admin.lastName}`.trim();
  }
}
