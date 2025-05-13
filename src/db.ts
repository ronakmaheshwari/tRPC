import mongoose, { Schema } from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
});

const TodoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const userModal = mongoose.model("User",UserSchema);
const todoModal = mongoose.model("Todo", TodoSchema);

export {todoModal,userModal};
