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

const TodoSchema = new Schema({
  title: String,
  description: String,
});

const todoModal = mongoose.model("Todo", TodoSchema);

export default todoModal;
