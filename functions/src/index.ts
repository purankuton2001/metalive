import * as functions from "firebase-functions";
import admin from "firebase-admin";
import moment from "moment";

admin.initializeApp(functions.config().firebase);
// データベースの参照を作成
// const fireStore = admin.firestore();
const bucket = admin.storage().bucket();
exports.liveFetch = functions.https.onRequest(async (req, res) => {
  bucket.file(req.body.fileName).getSignedUrl(
    {
      action: "read",
      expires: moment().utc().add(10, "minutes").format(),
    },
    (err, url) => {
      if (err) {
        console.error(err);
        res.status(500).end();
        return;
      }
      res.send(url);
    }
  );
});
