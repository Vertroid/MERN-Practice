let db = new Mongo().getDB("issuetracker");
db.issues.remove({});
db.issues.insert([
    {
        status: 'open',
        owner: "Ravan",
        created: new Date(),
        effort: 5,
        completionDate: undefined,
        title: 'Error in console clicking.'
    },
    {
        status: 'closed',
        owner: 'Eddie',
        created: new Date(),
        effort: 10,
        completionDate: undefined,
        title: 'Missing border'
    }
]);

db.issues.createIndex({status: 1});
db.issues.createIndex({owner: 1});
db.issues.createIndex({created: 1});