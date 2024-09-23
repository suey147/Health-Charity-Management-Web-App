/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const {onRequest} = require("firebase-functions/v2/https");

admin.initializeApp();

exports.getKnowledgeHubDoc = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const docCollection = admin.firestore().collection("knowledgeHub");
      const snapshot = await docCollection.get();
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id, ...doc.data()}));

      res.status(200).send(documents);
    } catch (error) {
      console.error("Error counting books: ", error.message);
      res.status(500).send("Error counting books");
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
      const docRef = admin.firestore().collection("knowledgeHub").doc(req.body.id);
      const response = await docRef.delete();
      res.status(200).send(response);
    } catch (error) {
      console.error("Error adding books: ", error.message);
      res.status(500).send("Error adding books");
    }
  });
});