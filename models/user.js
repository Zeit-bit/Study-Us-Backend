import mongoose, { model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    profilePic: { type: String, default: '' },
    level: { type: Number, default: 1 },
    currentExp: { type: Number, default: 0 },
    totalExp: { type: Number, default: 100 },
    points: { type: Number, default: 0 },

    badges: [{ type: String }],

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
)

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = document._id
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
  }
})

const User = model('User', userSchema)

export default User
