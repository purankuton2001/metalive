import * as functions from "firebase-functions";
import admin from "firebase-admin";
import moment from "moment";
import { ArtnetDriver, DMX } from "dmx-ts";

const dmx = new DMX();
let universe: any;

admin.initializeApp(functions.config().firebase);
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
exports.addUniverse = functions.https.onRequest(async (req, res) => {
  const { ipAdress } = req.body;
  dmx
    .addUniverse("test", new ArtnetDriver(ipAdress))
    .then(() => {
      res.send("add universe success");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
      return;
    });
});
exports.togglePlayDmx = functions.https.onRequest(async (req, res) => {
  const { parmeter } = req.body;
  const out = {
    1: (parmeter.pan * 255) / 540,
    2: (parmeter.tilt * 270) / 255,
    3: parmeter.color.r * 255,
    4: parmeter.color.g * 255,
    5: parmeter.color.b * 255,
    7: parmeter.dimmer,
    8: parmeter.strobe !== 0 ? 0 : 10 + (parmeter.strobe * 245) / 20,
    9: (1 - parmeter.zoom / 90) * 255,
  };
  try {
    universe?.update(out);
  } catch (err) {
    console.error(err);
    res.status(500).end();
    return;
  }
});
