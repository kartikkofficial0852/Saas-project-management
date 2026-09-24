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


// -------------------------------------- Task Status Creation --------------------------------------

// const project = await db.orm.public.Project
//     .where({ id: 1 })
//     .first();

// if (!project) {
//     throw new Error("Project not found!");
// }

// const todo = await db.orm.public.TaskStatus.create({
//     name: "Todo",
//     position: 1,
//     projectId: project.id
// });

// const inProgress = await db.orm.public.TaskStatus.create({
//     name: "In Progress",
//     position: 2,
//     projectId: project.id
// });

// const done = await db.orm.public.TaskStatus.create({
//     name: "Done",
//     position: 3,
//     projectId: project.id
// });

// console.dir(
//     { todo, inProgress, done },
//     { depth: null }
// );

// // -------------------------------------- Task Creation --------------------------------------

// const user = await db.orm.public.User.first();

// if (!user) {
//     throw new Error("User not found!");
// }

// const task = await db.orm.public.Task.create({
//     title: "Implement Authentication",
//     description: "Build JWT based authentication",
//     projectId: project.id,
//     createdByUserId: user.id,
//     statusId: todo.id
// });

// console.dir(task, { depth: null });

// // -------------------------------------- Fetch Task --------------------------------------

// const taskWithRelations = await db.orm.public.Task
//     .where({ id: task.id })
//     .include("project")
//     .include("status")
//     .include("createdByUser")
//     .first();

// console.dir(taskWithRelations, { depth: null });



// -------------------------------------- Get Existing Project --------------------------------------

// const project = await db.orm.public.Project
//     .where({ id: 1 })
//     .first();

// if (!project) {
//     throw new Error("Project not found!");
// }


// // -------------------------------------- Get Existing User --------------------------------------

// const user = await db.orm.public.User.first();

// if (!user) {
//     throw new Error("User not found!");
// }


// // -------------------------------------- Get Existing Task --------------------------------------

// const task = await db.orm.public.Task
//     .where({ title: "Implement Authentication" })
//     .first();

// if (!task) {
//     throw new Error("Task not found!");
// }

// console.dir(task, { depth: null });


// // -------------------------------------- Comment Creation --------------------------------------

// const comment = await db.orm.public.Comment.create({
//     content: "JWT authentication implementation is in progress.",
//     taskId: task.id,
//     createdByUserId: user.id
// });

// console.dir(comment, { depth: null });

// // -------------------------------------- Label Creation --------------------------------------

// const backendLabel = await db.orm.public.Label.create({
//     name: "Backend",
//     projectId: project.id
// });

// console.dir(backendLabel, { depth: null });

// // -------------------------------------- Attach Label to Task --------------------------------------

// const taskLabel = await db.orm.public.TaskLabel.create({
//     taskId: task.id,
//     labelId: backendLabel.id
// });

// console.dir(taskLabel, { depth: null });

// // -------------------------------------- Fetch Task with Comments + Labels --------------------------------------

// const completeTask = await db.orm.public.Task
//     .where({ id: task.id })
//     .include("comments")
//     .include("labels", (label) => label.include("label"))
//     .first();

// console.dir(completeTask, { depth: null });



// ------------------------------------------------ Check constraints --------------------------------------------------


// -------------------------------------- Get Existing Project --------------------------------------

const project = await db.orm.public.Project
    .where({ id: 1 })
    .first();

if (!project) {
    throw new Error("Project not found!");
}


// -------------------------------------- Get Existing User --------------------------------------

const user = await db.orm.public.User.first();

if (!user) {
    throw new Error("User not found!");
}


// -------------------------------------- Get Existing Task --------------------------------------

const task = await db.orm.public.Task
    .where({ title: "Implement Authentication" })
    .first();

if (!task) {
    throw new Error("Task not found!");
}


// -------------------------------------- Get Existing Task Status --------------------------------------

const todo = await db.orm.public.TaskStatus
    .where({
        projectId: project.id,
        name: "Todo"
    })
    .first();

if (!todo) {
    throw new Error("Todo status not found!");
}


// // -------------------------------------- Create Comment --------------------------------------

// const comment = await db.orm.public.Comment.create({
//     content: "Authentication implementation is in progress.",
//     taskId: task.id,
//     createdByUserId: user.id
// });

// console.log("Comment:", comment);

// -------------------------------------- Get/Create Comment --------------------------------------

let comment = await db.orm.public.Comment
    .where({
        taskId: task.id,
        content: "Authentication implementation is in progress."
    })
    .first();

if (!comment) {
    comment = await db.orm.public.Comment.create({
        content: "Authentication implementation is in progress.",
        taskId: task.id,
        createdByUserId: user.id
    });
}

console.log("Comment:", comment);


// // -------------------------------------- Create Label --------------------------------------

// const label = await db.orm.public.Label.create({
//     name: "Backend",
//     projectId: project.id
// });

// console.log("Label:", label);


// // -------------------------------------- Create Task Label --------------------------------------

// const taskLabel = await db.orm.public.TaskLabel.create({
//     taskId: task.id,
//     labelId: label.id
// });

// console.log("Task Label:", taskLabel);

// -------------------------------------- Get/Create Label --------------------------------------

let label = await db.orm.public.Label
    .where({
        projectId: project.id,
        name: "Backend"
    })
    .first();

if (!label) {
    label = await db.orm.public.Label.create({
        name: "Backend",
        projectId: project.id
    });
}

console.log("Label:", label);

// -------------------------------------- Get/Create Task Label --------------------------------------

let taskLabel = await db.orm.public.TaskLabel
    .where({
        taskId: task.id,
        labelId: label.id
    })
    .first();

if (!taskLabel) {
    taskLabel = await db.orm.public.TaskLabel.create({
        taskId: task.id,
        labelId: label.id
    });
}

console.log("Task Label:", taskLabel);


// -------------------------------------- Fetch Task With Relations --------------------------------------

const taskDetails = await db.orm.public.Task
    .where({ id: task.id })
    .include("comments")
    .include("labels", (taskLabel) => taskLabel.include("label"))
    .first();

console.dir(taskDetails, { depth: null });