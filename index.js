const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

let db;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/employee", async (req, res) => {
  const employee = [];
  await db
    .collection("employee")
    .find()
    .forEach((element) => {
      employee.push(element);
    });
  console.log(employee);
  res.send(employee);
});

app.post("/api/uptemployee", (req, res) => {
  const obj_id = req.body.obj_id;
  const obj = req.body.obj;
  db.collection("employee")
    .updateOne(
      { _id: ObjectId(obj_id.id) },
      {
        $set: obj,
      }
    )
    .then(
      db
        .collection("employee")
        .findOne({ _id: ObjectId(obj_id.id) })
        .then(function (document) {
          res.send(document);
        })
    );
});

app.post("/api/delemployee", (req, res) => {
  const obj_id = req.body;
  db.collection("employee")
    .deleteOne({ _id: ObjectId(obj_id.id) })
    .then(res.send("Employee Information Deleted"));
});

app.post("/api/newemployee", (req, res) => {
  const obj = req.body;
  db.collection("employee")
    .findOne(obj)
    .then(function (document) {
      if (document !== null) {
        res.json("Object Already Present");
      } else {
        db.collection("employee")
          .insertOne(obj)
          .then(function () {
            res.json(obj);
          });
      }
    });
});

const PORT = process.env.PORT || 7000;

const client = new MongoClient(
  "mongodb+srv://Absaar:password1548@cluster0.oaxoi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

client.connect().then(function (mClient) {
  db = mClient.db();
  console.log("Mongodb Connection is successful");
  app.listen(PORT, function () {
    console.log("Server Started on port 7000");
  });
});
