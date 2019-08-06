const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const { Parser } = require("json2csv");
const fields = require("./fields.json");

var serviceAccount = require("./kimendoz-survey-firebase-adminsdk-3ke6d-9829c21100.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kimendoz-survey.firebaseio.com"
});

exports.exportAllResponses = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    let responsesRef = admin.firestore().collection("responses");
    let allResponses = responsesRef
      .get()
      .then(snapshot => {
        const allDocs = [];

        snapshot.forEach(doc => {
          allDocs.push(Object.assign({}, { sessionId: doc.id }, doc.data()));
        });

        // Pre-process firestore documents
        // Convert arrays to objects with number keys for json2csv
        let processedDocs = allDocs.map(doc => {
          if (doc.pages.hasOwnProperty("task2-quiz")) {
            doc.pages["task2-quiz"].data = {
              ...doc.pages["task2-quiz"].data
            };
          }

          if (doc.pages.hasOwnProperty("task2-word-recall-questions")) {
            doc.pages["task2-word-recall-questions"].data = {
              ...doc.pages["task2-word-recall-questions"].data
            };
          }

          return doc;
        });

        const parseOptions = {
          fields
        };

        const parser = new Parser(parseOptions);
        const csv = parser.parse(processedDocs);

        response.setHeader(
          "Content-disposition",
          "attachment; filename=report.csv"
        );
        response.set("Content-Type", "text/csv");

        return response.status(200).send(csv);
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  });
});
