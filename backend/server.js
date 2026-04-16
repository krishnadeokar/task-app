

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI))
  .then(() => console.log("MongoDB Connected"))
  .     catch((err) => console.log(err));

  const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);    

const app = express();
app.use(cors());
app.use(express.json());


app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();

  const tasks = await Task.find();
  res.json(tasks);
});

app.put("/tasks/:id", async (req, res) => {
  await Task.findByIdAndUpdate(
    req.params.id,
    { $set: req.body } // 👈 IMPORTANT FIX
  );

  const tasks = await Task.find();
  res.json(tasks);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
