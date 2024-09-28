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

