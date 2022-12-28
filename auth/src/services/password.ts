import { scrypt, randomBytes } from 'crypto'; //built-in node library
import { promisify } from 'util'; //scrypt uses callback function but we want to use it in async/await so we import promisify to turn it into a promise

const scryptAsync = promisify(scrypt);

export class Password {
  //static methods are methods we can access without creating an instanse of the class
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex'); //generate a random string
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; // we get back a buffer from scrypt which is an array of raw data inside of it
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // we get back a buffer from scrypt which is an array of raw data inside of it
    return buf.toString('hex') === hashedPassword;
  }
}
