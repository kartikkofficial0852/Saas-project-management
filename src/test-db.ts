import { db } from "./prisma/db.js";

// ------------------------------------------  create User ----------------------------------

// const user = await db.orm.public.User.create({
//     name: "Kartik",
//     email: "kartikkofficial08@gmail.com"
// })

// console.log("User", user);

// ------------------------------------------ find users ---------------------------------

// const users = await db.orm.public.User.all()

// console.log("Users:", users);

// -------------------------------------- find user -----------------------------------

// const user = await db.orm.public.User.first({ email: "kartikkofficial08@gmail.com" });

// console.log("User", user);

// -------------------------------------- Update --------------------------------------

// const user = await db.orm.public.User.where({ email: "kartikkofficial08@gmail.com" }).update({ name: "Kartik K." });

// console.log("User", user);

// --------------------------------------- Delete ------------------------------------

// const result = await db.orm.public.User
//     .where({ email: "kartikkofficial08@gmail.com" })
//     .delete();

// console.log("Deleted:", result);

// --------------------------------------- Filtering ---------------------------------

// const users = await db.orm.public.User.where((u) => u.name.eq('Kartik') || u.id.gt(3)).all();

// console.log("Users", users);



// -------------------------------------- Organization -----------------------------------

// const organization = await db.orm.public.Organization.create({
//     name: "Google"
// })

// console.log("Organization:", organization);


// ---------------------------- Linking organization to user ------------------------
// const organization = await db.orm.public.Organization.first();

// if (!organization) {
//     throw new Error("Organization not found");
// }

// const user = await db.orm.public.User.create({
//     name: "Kartik",
//     email: "kartik@example.com",
//     organizationId: organization.id
// });

// console.log("User:", user);


// ------------------------------------------ Getting organization and it's users --------------------------------

// const organizations = await db.orm.public.Organization.include('users').first();

// console.log("Organizations", organizations)

// ---------------------------------------------- User's Organization --------------------------------

// const users = await db.orm.public.User.include('memberships', (membership) => membership.include('organization')).all();

// console.dir(users, { depth: null });

// ---------------------------------------- Many to many organization with users -------------------------------

// const organizations = await db.orm.public.Organization.include('memberships', (membership) => membership.include('user')).all();

// console.dir(organizations, { depth: null });

// ------------------------------------------- Project Creation ---------------------------------------------

// const organization = await db.orm.public.Organization.where((o) => o.memberships.some((m) => m.userId.isNotNull())).include('memberships').first();

// if (!organization) {
//     throw new Error("Organization not found!")
// }

// const project = await db.orm.public.Project.create({
//     name: "Project A",
//     organizationId: organization.id,
//     createdByUserId: organization.memberships[0].userId
// })

// console.dir(project, { depth: null });

// ------------------------------------------------ Organization Projects -----------------------------------------

// const organization = await db.orm.public.Organization
//     .where({ id: 1 })
//     .include('projects')
//     .first();

// console.dir(organization, { depth: null });

// ----------------------------------------------- Fetching Project -------------------------------------------

// const project = await db.orm.public.Project.where({ id: 1 }).include('organization').include('createdByUser').first();

// console.dir(project, { depth: null })
