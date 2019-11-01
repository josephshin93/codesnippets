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

/**
 * Page: SIDEBAR
 * Purpose: GET the left sidebar
 * Requirement: User ID
 * Returns: user document
 * Access document by:
 * 1. data.picture
 * 2. data.teams
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
      id: user.id,
      data: user.data()
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Page: NEW SNIPPET
 * Purpose: GET team names to populate the form's 'Team' dropdown menu
 * Requirement: Nothing explicit
 * Returns: teams/overview document
 * Access response by:
 * 1. data.teams
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
      id: teams.id,
      data: teams.data()
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Page: TEAM SETTINGS
 * Purpose: GET a list of members in this team, their roles, & subscription times
 * Requirement: Team ID
 * Returns: team document
 * Access response by:
 * 1. data.members
 * 2. data.roles
 * 3. data.subscription.digest
 * 4. data.subscription.reminder
 */
app.get("/teams/settings/:teamId", async (req, res) => {
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

    res.json({
      id: teams.id,
      data: teams.data()
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Page: TEAM PAGE
 * Purpose: GET all relevant snippet data, the last 20 from this team
 * Requirement: Team ID
 * Returns: An array of snippet documents
 * Access response by (for each):
 * 1. data.status
 * 2. data.title
 * 3. data.description
 * 4. data.content
 * 5. data.ownerPic
 * 6. data.ownerName
 * 7. data.totalLikes
 * 8. data.totalComments
 * 9. data.timeCreated
 */
app.get("/teams/page/:teamId", async (req, res) => {
  try {
    const teamId = req.params.teamId;

    if (!teamId) throw new Error("Team ID is required");

    // Firestore query
    const teamSnippets = await db
      .collection("snippets")
      .where("teams", "array-contains", teamId)
      .orderBy("timeCreated", "desc")
      .limit(20)
      .get();

    const snippets: any = [];
    teamSnippets.forEach(doc => {
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

/**
 * Page: RECENT SNIPPETS
 * Purpose: GET all relevant snippet data, the last 20 from everybody
 * Requirement: Nothing explicit
 * Returns: An array of snippet documents
 * Access response by (for each):
 * 1. data.status
 * 2. data.title
 * 3. data.description
 * 4. data.content
 * 5. data.ownerPic
 * 6. data.ownerName
 * 7. data.totalLikes
 * 8. data.totalComments
 * 9. data.timeCreated
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
