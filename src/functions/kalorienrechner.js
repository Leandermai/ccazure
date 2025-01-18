const { app } = require("@azure/functions");

app.http("kalorienrechner", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (req, context) => {
    context.log("JavaScript HTTP trigger function processed a request.");

    let activity, duration, weight;
    // Handle POST request (JSON body)
    if (req.method === "GET") {
      duration = parseInt(req.query.get("duration"));
      weight = parseInt(req.query.get("weight"));
      activity = req.query.get("activity");
    } else if (req.method === "POST") {
      const body = await req.json();
      ({ activity, duration, weight } = body);
    }

    // Validierung der Eingabewerte
    if (!activity || isNaN(duration) || isNaN(weight)) {
      context.log("Invalid input values.");
      context.res = {
        status: 400,
        body: `Falsche Eingabewerte. Bitte geben Sie gültige Werte für activity, duration und weight ein.`,
      };
      return;
    }

    // MET-Werte von Sportarten
    const activityMETs = {
      laufen: 8.3,
      schwimmen: 6.0,
      radfahren: 7.5,
      yoga: 2.5,
      tanzen: 4.5,
      wandern: 6.0,
    };

    // Check ob Aktivität vorhanden ist
    const metValue = activityMETs[activity.toLowerCase()];
    if (!metValue) {
      context.log("Unsupported activity.");
      context.res = {
        status: 400,
        body: `Die Aktivität "${activity}" wird nicht unterstützt. Unterstützte Aktivitäten sind: ${Object.keys(
          activityMETs
        ).join(", ")}.`,
      };
      return;
    }

    // Kalorienverbrauch berechnen
    const caloriesBurned = metValue * weight * (duration / 60);

    // Antwort zurückgeben
    context.res = {
      status: 200,
      body: `Der geschätzte Kalorienverbrauch für ${duration} Minuten ${activity} beträgt ${caloriesBurned.toFixed(
        2
      )} Kalorien.`,
      activity,
      duration,
      weight,
      caloriesBurned: caloriesBurned.toFixed(2),
    };

    return context.res;
  },
});
