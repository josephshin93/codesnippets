import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

main.use("/api/v1", app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

// Warmup
app.get("/warmup", (req, res) => {
  res.send("Warming up friendooo");
});

// Add fight
app.post("/fights", async (request, response) => {
  try {
    const { winner, loser, title } = request.body;
    const data = {
      winner,
      loser,
      title
    };
    const fightRef = await db.collection("fights").add(data);
    const fight = await fightRef.get();

    response.json({
      id: fightRef.id,
      data: fight.data()
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * SIDEBAR
 * GET the left sidebar from a User document
 * Query requires user ID
 * Returns:
 * 1. Profile picture
 * 2. Team names associated with user (string array)
 */
app.get("/sidebar/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) throw new Error("User ID is required");

    // Firestore query
    const user = await db
      .collection("users")
      .doc(userId)
      .get();

    if (!user.exists) {
      throw new Error("User does not exist");
    }

    res.json({
      picture: user.get("profilePic"),
      teams: user.get("teams")
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * NEW SNIPPET
 * GET a list of available teams to populate the form's 'Team' dropdown menu
 * Query requires nothing explicit
 * Returns:
 * 1. Team names available (string array)
 */
app.get("/snippets/new", async (req, res) => {
  try {
    // Firestore query
    const teams = await db
      .collection("teams")
      .doc("overview")
      .get();

    if (!teams.exists) {
      throw new Error("No teams available");
    }

    res.json({
      teams: teams.get("teams")
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * TEAM SETTING
 * GET a list of members in this team, their roles, & subscription times
 * Query requires team ID
 * Returns:
 * 1. Team member names
 * 2. Team member roles (also pending)
 * 3. Reminder time
 * 4. Subscription time
 */
app.get("/teams/:teamId", async (req, res) => {
  try {
    const teamId = req.params.teamId;

    if (!teamId) throw new Error("Team ID is required");

    // Firestore query
    const teams = await db
      .collection("teams")
      .doc(teamId)
      .get();

    if (!teams.exists) {
      throw new Error("Team doesn't exist!");
    }

    // Would it be better to just pass in teams.data()
    // Less wordy here but you get all the data back to client/server
    res.json({
      members: teams.get("members"),
      roles: teams.get("roles"),
      digest: teams.get("subscription.digest"),
      reminder: teams.get("subscription.reminder")
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * RECENT SNIPPETS
 * GET all relevant snippet data, the last 20 from everybody
 * Query requires nothing explicit
 * Returns:
 * 1. Snippet status
 * 2. Snippet title
 * 3. Snippet comment (how much to clip? done server-side?)
 * 4. Owner's profile picture
 * 5. Snippet total like count
 * 6. Snippet total comment count
 * 7. Snippet time created
 */
app.get("/snippets/recent", async (req, res) => {
  try {
    // Firestore query creates a reference then grabs data
    const recentSnippets = await db
      .collection("snippets")
      .orderBy("timeCreated", "desc")
      .limit(20)
      .get();

    const snippets: any = [];
    recentSnippets.forEach(doc => {
      snippets.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.json(snippets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add new user
app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const data = {
      firstName,
      lastName,
      email
    };
    const userRef = await db.collection("users").add(data);
    const user = await userRef.get();

    res.json({
      userId: userRef.id,
      data: user.data()
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// View a user
app.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) throw new Error("User ID is required");

    const user = await db
      .collection("users")
      .doc(userId)
      .get();

    if (!user.exists) {
      throw new Error("User does not exist.");
    }

    res.json({
      userId: user.id,
      data: user.get("")
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
