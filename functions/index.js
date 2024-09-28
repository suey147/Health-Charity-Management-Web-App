/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const admin = require("firebase-admin");
const { UserRecord } = require("firebase-admin/auth");
const {FieldValue} = require("firebase-admin/firestore");
const { user } = require("firebase-functions/v1/auth");
const cors = require("cors")({origin: true});
const {onRequest} = require("firebase-functions/v2/https");

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
    const {userId, registeredEvent} = req.body;
    try {
      const firebase = admin.firestore();
      const eventRef = firebase.collection("events").doc(registeredEvent);
      const docRef = admin.firestore().collection("users").doc(userId);
      const response = await docRef.update({events:
        FieldValue.arrayUnion(eventRef)});
      res.status(200).send(response);
    } catch (error) {
      console.error("Error registering event: ", error.message);
      res.status(500).send("Error registering event");
    }
  });
});

exports.registerUser = onRequest((req, res) => {
  cors(req, res, async () => {
    const userdata = req.body;
    const email = userdata.email;
    const password = userdata.password;
    console.log(userdata);
    admin.auth().createUser({
      email: email,
      password: password})
        .then(async (UserRecord) => {
          const docCollection = admin.firestore().collection("Users");
          const response =await docCollection.doc(UserRecord.uid).set(userdata);
          res.status(200).send(response);
        })
        .catch((error) => {
          console.error("Error create new user: ", error.message);
          res.status(500).send("Error creating new user");
        });
  });
});

