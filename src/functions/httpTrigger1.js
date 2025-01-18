module.exports = async function (context, req) {
    context.log("HTTP trigger function processed a request.");

    // Eingabeparameter abrufen
    const activity = req.query.activity;
    const duration = parseFloat(req.query.duration);
    const weight = parseFloat(req.query.weight);

    // Validierung der Eingabewerte
    if (!activity || isNaN(duration) || isNaN(weight)) {
        context.res = {
            status: 400,
            body: "Bitte geben Sie gültige Werte für activity, duration und weight ein."
        };
        return;
    }

    // MET-Werte für verschiedene Sportarten
    const activityMETs = {
        laufen: 8.3, // Laufen bei mittlerem Tempo (~8 km/h)
        schwimmen: 6.0, // Schwimmen (mäßig intensiv)
        radfahren: 7.5, // Radfahren (15-18 km/h)
        yoga: 2.5, // Yoga
        tanzen: 4.5, // Tanzen (mäßig intensiv)
        wandern: 6.0 // Wandern
    };

    // Aktivität überprüfen
    const metValue = activityMETs[activity.toLowerCase()];
    if (!metValue) {
        context.res = {
            status: 400,
            body: `Die Aktivität "${activity}" wird nicht unterstützt. Unterstützte Aktivitäten sind: ${Object.keys(activityMETs).join(", ")}.`
        };
        return;
    }

    // Kalorienverbrauch berechnen
    const caloriesBurned = metValue * weight * (duration / 60);

    // Ergebnis zurückgeben
    context.res = {
        status: 200,
        body: {
            message: `Der geschätzte Kalorienverbrauch für ${duration} Minuten ${activity} beträgt ${caloriesBurned.toFixed(2)} Kalorien.`,
            activity,
            duration,
            weight,
            caloriesBurned: caloriesBurned.toFixed(2)
        }
    };
};
