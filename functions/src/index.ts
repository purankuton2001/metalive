import * as functions from "firebase-functions";
import admin, { firestore } from "firebase-admin";
import DocumentData = firestore.DocumentData;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "metalive-348103.appspot.com",
});
const fireStore = admin.firestore();
exports.liveFetch = functions.https.onRequest(async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    const live = await fireStore
      .collection("lives")
      .doc(<string>id)
      .get();
    const data = live.data();
    if (data) {
      const directions = await fireStore
        .collection("lives")
        .doc(<string>id)
        .collection("directions")
        .get();
      if (!directions.empty) {
        data.directions = [];
        await Promise.all(
          directions.docs.map(async (direction) => {
            const d = await direction.data();
            d.id = direction.id;
            d.voters = [];
            const voters = await fireStore
              .collection("lives")
              .doc(<string>id)
              .collection("directions")
              .doc(d.id)
              .collection("voters")
              .get();
            await Promise.all(
              voters.docs.map(async (voter) => {
                const voterData = await voter.data();
                d.voters.push(voterData);
              })
            );
            data.directions.push(d);
          })
        );
        res.send(data);
      } else {
        res.send(data);
      }
    } else {
      console.error("data is undefined");
      res.status(500).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).end();
    return;
  }
});
exports.voteCheck = functions.https.onRequest(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cors = require("cors")({ origin: true });
  return cors(req, res, async () => {
    try {
      res.set("Access-Control-Allow-Origin", "http://localhost:3000");
      res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      const decodedToken = await admin.auth().verifyIdToken(req.body.token);
      if (decodedToken) {
        const vote = await fireStore
          .collection("users")
          .doc(decodedToken.uid)
          .collection("votes")
          .doc(req.body.id)
          .get();
        if (vote.exists) {
          const data = await vote.data();
          res.send({ index: req.body.directions.indexOf(data?.id) });
        } else {
          res.send({ index: -1 });
          return;
        }
      } else {
        console.error("can not verify token");
        res.status(500).end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).end();
      return;
    }
  });
});
exports.directionPost = functions.https.onRequest(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cors = require("cors")({ origin: true });
  return cors(req, res, async () => {
    try {
      res.set("Access-Control-Allow-Origin", "http://localhost:3000");
      res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      const decodedToken = await admin.auth().verifyIdToken(req.body.token);
      if (decodedToken) {
        await fireStore
          .collection("users")
          .doc(decodedToken.uid)
          .collection("directions")
          .add(req.body.direction);
        res.status(204).end();
        return;
      } else {
        console.error("can not verify token");
        res.status(500).end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).end();
      return;
    }
  });
});
exports.directionVote = functions.https.onRequest(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cors = require("cors")({ origin: true });
  return cors(req, res, async () => {
    try {
      res.set("Access-Control-Allow-Origin", "http://localhost:3000");
      res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      const decodedToken = await admin.auth().verifyIdToken(req.body.token);
      if (decodedToken) {
        await fireStore
          .collection("users")
          .doc(decodedToken.uid)
          .collection("votes")
          .doc(req.body.direction.liveId)
          .set(req.body.direction);
        res.status(204).end();
        return;
      } else {
        console.error("can not verify token");
        res.status(500).end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).end();
      return;
    }
  });
});
exports.livePost = functions.https.onRequest(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cors = require("cors")({ origin: true });
  return cors(req, res, async () => {
    try {
      res.set("Access-Control-Allow-Origin", "http://localhost:3000");
      res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      const decodedToken = await admin.auth().verifyIdToken(req.body.token);
      if (decodedToken) {
        await fireStore
          .collection("users")
          .doc(decodedToken.uid)
          .collection("lives")
          .add(req.body.direction);
        res.status(204).end();
        return;
      } else {
        console.error("can not verify token");
        res.status(500).end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).end();
      return;
    }
  });
});

exports.onUserDirectionWrited = functions.firestore
  .document("users/{uid}/directions/{directionID}")
  .onWrite(async (change, context) => {
    const { directionID } = context.params;
    const data = change.after.data();
    if (data) {
      await fireStore
        .collection("lives")
        .doc(data.liveId)
        .collection("directions")
        .doc(directionID)
        .set(<DocumentData>data);
    } else {
      const d = change.before.data();
      await fireStore
        .collection("lives")
        .doc(d?.liveId)
        .collection("directions")
        .doc(directionID)
        .delete();
    }
  });

exports.onUserVotesWrited = functions.firestore
  .document("users/{uid}/votes/{directionID}")
  .onWrite(async (change, context) => {
    const { uid } = context.params;
    const user = await fireStore.collection("users").doc(uid).get();
    const data = change.after.data();
    if (data) {
      await fireStore
        .collection("lives")
        .doc(data.liveId)
        .collection("directions")
        .doc(data.id)
        .collection("voters")
        .doc(uid)
        .set(<DocumentData>user.data());
    }
    const d = change.before.data();
    if (d) {
      await fireStore
        .collection("lives")
        .doc(d.liveId)
        .collection("directions")
        .doc(d.id)
        .collection("voters")
        .doc(uid)
        .delete();
    }
  });

exports.onUserLiveWrited = functions.firestore
  .document("users/{uid}/lives/{liveID}")
  .onWrite(async (change, context) => {
    const { liveID } = context.params;
    const data = change.after.data();
    await fireStore
      .collection("lives")
      .doc(liveID)
      .set(<DocumentData>data);
  });
