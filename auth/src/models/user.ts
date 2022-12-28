import mongoose from 'mongoose';
import { Password } from '../services/password';

//An interface that describes the properties that are required to create a new User
interface UserAttrs {
  //Attributes
  email: string;
  password: string;
}
//An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc; //build method
}
//An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);
userSchema.pre('save', async function (done) {
  //a middleware fn in mongoose
  if (this.isModified('password')) {
    //this refers to user doc, isModified is triggered whenever we create a new user or change the password of an existing user
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done(); //calling done because we have now done all the asynchronous work we need to do
});
//add a custom function "build" to the model
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
