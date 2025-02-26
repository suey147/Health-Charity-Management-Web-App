/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const admin = require("firebase-admin");
const {FieldValue} = require("firebase-admin/firestore");
const cors = require("cors")({origin: true});
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {authorize, sendEmail, generatePdf} = require("./server");
const {generateEmailTemplate} = require("./server");
const axios = require("axios");
const express = require("express");
const fileParser = require("express-multipart-file-parser");


admin.initializeApp();

exports.getKnowledgeHubDoc = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const docCollection = admin.firestore().collection("knowledgeHub");
      const snapshot = await docCollection.get();
      if (snapshot.empty) {
        return res.status(500).send("No events");
      }
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id, ...doc.data()}));
      res.status(200).send(documents);
    } catch (error) {
      console.error("Error getting knowledgeHub: ", error.message);
      res.status(500).send("Error getting knowledgeHub");
    }
  });
});

exports.addKnowledgeHubDoc = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const docCollection = admin.firestore().collection("knowledgeHub");
      const response = await docCollection.add(req.body);
      res.status(200).send(response);
    } catch (error) {
      console.error("Error adding books: ", error.message);
      res.status(500).send("Error adding books");
    }
  });
});

exports.removeKnowledgeHubDoc = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const id = req.body.id;
      const docRef = admin.firestore().collection("knowledgeHub").doc(id);
      const response = await docRef.delete();
      res.status(200).send(response);
    } catch (error) {
      console.error("Error adding books: ", error.message);
      res.status(500).send("Error adding books");
    }
  });
});

exports.getEvents = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const docCollection = admin.firestore().collection("events");
      const snapshot = await docCollection.get();
      if (snapshot.empty) {
        return res.status(500).send("No events");
      }
      const documents = snapshot.docs.map((doc) => (
        {id: doc.id, ...doc.data()}));
      res.status(200).send(documents);
    } catch (error) {
      console.error("Error getting events: ", error.message);
      res.status(500).send("Error getting events");
    }
  });
});

exports.registerEvent = onRequest((req, res) => {
  cors(req, res, async () => {
    const {userId, eventId} = req.body;
    try {
      const firebase = admin.firestore();
      // Add user to events
      const eventRef = firebase.collection("events").doc(eventId);
      const userRef = firebase.collection("Users").doc(userId);

      const addToUserRes = await userRef.update({
        registeredEvents: FieldValue.arrayUnion(eventRef)});
      // Add to user's registered events
      const addToEventRes= await eventRef.update({
        registeredUsers: FieldValue.arrayUnion(userRef)});
      res.status(200).send({addToUserRes, addToEventRes});
    } catch (error) {
      console.error("Error registering event: ", error.message);
      res.status(500).send("Error registering event");
    }
  });
});

exports.getUserRegisteredEvents = onRequest((req, res) => {
  cors(req, res, async () => {
    const {userId} = req.body;
    try {
      const firebase = admin.firestore();
      const userRef = firebase.collection("Users").doc(userId);
      const snapshot = await userRef.get();
      if (snapshot.empty) {
        return res.status(400).send("User not found");
      }
      const data = snapshot.data();
      const referencesArray = data.registeredEvents;

      if (referencesArray.length == 0) {
        return res.status(200).send("No registered events references found");
      }

      const fetchPromises = referencesArray.map((ref) => ref.get());
      const referencedDocs = await Promise.all(fetchPromises);

      const results = referencedDocs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(200).send(results);
    } catch (error) {
      console.error("Error registering event: ", error.message);
      res.status(500).send("Error registering event");
    }
  });
});


exports.countUsers = onDocumentCreated("Users/{docId}", async (event)=>{
  try {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }
    const userData = snapshot.data();
    const role = userData.role;

    const userCountRef = admin.firestore().collection("Count").doc("users");
    const userCountSnapshot = await userCountRef.get();
    if (userCountSnapshot.empty) {
      await userCountSnapshot.set(
          {admin: 0, volunteer: 0, participant: 0, donor: 0},
          {merge: true});
    }
    const count = userCountSnapshot.data();

    await userCountRef.update({
      [role]: count[role]+1});

    console.log(`Role ${role} updated`);
  } catch (error) {
    console.error("Error capitalizing book data: ", error.message);
  }
});


exports.getUsers = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const firebase = admin.firestore();
      const userRef = firebase.collection("Users");
      const snapshot = await userRef.get();
      if (snapshot.empty) {
        return res.status(400).send("User not found");
      }
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(200).send(results);
    } catch (error) {
      console.error("Error retrieving users: ", error.message);
      res.status(500).send("Error retrieving users");
    }
  });
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors);
app.use(fileParser);
app.post("/sendEmail", async (req, res) => {
  cors(req, res, async () => {
    try {
      const {data, user} = req.body;
      if (!data) {
        return res.status(400).send("No file upload.");
      }
      const attachment = generatePdf(data);

      const options = {
        recipients: user.email,
        subject: "Registered Events",
        body: generateEmailTemplate(user.username,
            "Please find the attached report."),
        attachment: attachment,
        filename: "Event_registered_confirmation.pdf",
      };
      authorize()
          .then(
              (auth) => {
                sendEmail(auth, options);
                res.status(200).json("sent receipt");
              },
          )
          .catch(console.error);
      res.status(200).send("Email sent");
    } catch (error) {
      res.status(500).send({error: "Unable to fetch events"});
    }
  });
});

app.post("/sendBulkEmail", (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.files[0] == "undefined") {
        return res.status(400).send("No file or user data provided.");
      }
      const {
        originalname,
        buffer,
      } = req.files[0];
      const {users, subject, emailBody} = req.body;

      const options = {
        recipients: users,
        subject: subject,
        body: emailBody,
        attachment: buffer,
        filename: originalname,
      };
      authorize()
          .then(
              (auth) => {
                sendEmail(auth, options);
                res.status(200);
              },
          )
          .catch(console.error);
      res.status(200).send("Email sent");
    } catch (error) {
      res.status(500).send({error: "Unable to fetch events"});
    }
  });
});

app.get("/api/events", async (req, res) => {
  try {
    const response = await axios.get(
        "https://getevents-bj37ljbsda-uc.a.run.app",
    );
    const documents = response.data;
    const formattedDocs = documents.map((doc) => {
      const formattedData = {...doc};
      if (formattedData.date) {
        console.log(doc.date);
        const eventDate = new Date(doc.date._seconds*1000 );
        formattedData.date = eventDate;
      }
      if (formattedData.start) {
        const eventDate = new Date(doc.start._seconds * 1000);
        formattedData.start = eventDate;
      }
      if (formattedData.end) {
        const eventDate = new Date(doc.end._seconds * 1000);
        formattedData.end = eventDate;
      }
      delete formattedData.registeredUsers;
      return formattedData;
    });
    res.status(200).send(formattedDocs);
  } catch (error) {
    res.status(500).send({error: "Unable to fetch events"});
  }
});


app.get("/api/knowledgehub", async (req, res) => {
  try {
    const docCollection = admin.firestore().collection("knowledgeHub");
    const snapshot = await docCollection.get();
    if (snapshot.empty) {
      return res.status(500).send("No events");
    }
    const documents = snapshot.docs.map((doc) => ({
      id: doc.id, ...doc.data()}));
    res.status(200).send(documents);
  } catch (error) {
    console.error("Error getting knowledgeHub: ", error.message);
    res.status(500).send("Error getting knowledgeHub");
  }
});

exports.app = onRequest(app);
