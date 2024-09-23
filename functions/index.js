/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import createNewDocument from "@/models/knowledgeHubDocument";
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const cors = require("cors")({origin: true});
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.manageKnowledeHub = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // check and create knowledgeHub collection if it does not exist
      const knowledgeHubCollection = admin.firestore().collection("books");
      const knowledgeHubSnapshot = await knowledgeHubCollection.get();

      if (knowledgeHubCollection) {
        const newDocRef = admin.firestore().collection("knowledgeHub").doc();
        await newDocRef.set(createNewDocument());
        console.log("knowledgeHub collection initialized.");
      } else {
        console.log("knowledgeHub collection already exists.");
      }

      // Fetch all documents from the knowledgeHub Collection
      const knowledgeHubDocs = [];
      knowledgeHubSnapshot.forEach((doc) => {
        knowledgeHubDocs.push({id: doc.id, ...doc.data()});
      });

      res.status(200).json({
        knowledgeHubDocuments: knowledgeHubDocs,
      });
    } catch (error) {
      console.error("Error counting books: ", error.message);
      res.status(500).send("Error counting books");
    }
  });
});
