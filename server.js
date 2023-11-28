const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
const STOREDATAPATH = "./storeData.json";

const app = express();
const userDetails = getUserData();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(userDetails);
});

app.post("/user", (req, res) => {
  const newUser = req.body;
  newUser.userId = uuid.v4();
  newUser.userAge = getAge(newUser.userDOB);
  userDetails.push(newUser);
  addDetails(userDetails);
  res.send("Data received successfully");
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  const viewUser = userDetails.find((user) => user.userId === id);
  if (viewUser) {
    return res.send(viewUser);
  }
  res.send("user doesn't exist");
});

app.put("/user/:id", (req, res) => {
  const updatedUser = req.body;
  const id = req.params.id;
  const user = userDetails.find((user) => user.userId === id);
  const age = getAge(updatedUser.userDOB);
  if (user) {
    user.userId = id;
    user.userName = updatedUser.userName;
    user.userDOB = updatedUser.userDOB;
    user.userDepartment = updatedUser.userDepartment;
    user.userAge = age;
    addDetails(userDetails);
    return res.send("user updated successfully");
  }
  res.send("user doesn't exist");
});

app.delete("/user/:id", (req, res) => {
  const id = req.params.id;
  const userIndex = userDetails.findIndex((user) => user.userId === id);
  console.log(userIndex);
  if (userIndex !== -1) {
    userDetails.splice(userIndex, 1);
    addDetails(userDetails);
    return res.send("user deleted successfully");
  }
  res.send("user doesn't exist");
});

function getUserData() {
  const data = fs.readFileSync(STOREDATAPATH, "utf8");
  return JSON.parse(data);
}

function addDetails(userDetails) {
  fs.writeFileSync(STOREDATAPATH, JSON.stringify(userDetails));
}

function getAge(dob) {
  const dobArray = dob.split("/");
  const birthDate = new Date(dobArray[2], dobArray[1] - 1, dobArray[0]);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  return age;
}

app.listen(3000);
