/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Melika Kazemi
*  Student ID: 166429233
*  Date: 2025-03-06
*
*  Published URL: 
*
********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

const app = express();

const studentName = "Melika Kazemi";
const studentId = "166429233";

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.render("home", { page: "/" }));

app.get("/about", (req, res) => res.render("about", { page: "/about" }));

app.get("/solutions/projects", (req, res) => {
    const { sector } = req.query;
    if (sector) {
        projectData.getProjectsBySector(sector)
            .then(projects => res.render("projects", {
                projects,
                page: "/solutions/projects",
                studentName,
                studentId,
                timestamp: new Date()
            }))
            .catch(err => res.status(404).render("404", {
                message: err.message,
                page: "",
                studentName,
                studentId,
                timestamp: new Date()
            }));
    } else {
        projectData.getAllProjects()
            .then(projects => res.render("projects", {
                projects,
                page: "/solutions/projects",
                studentName,
                studentId,
                timestamp: new Date()
            }))
            .catch(err => res.status(500).render("404", {
                message: err.message,
                page: "",
                studentName,
                studentId,
                timestamp: new Date()
            }));
    }
});

app.get("/solutions/projects/:id", (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
        return res.status(404).render("404", {
            message: "Invalid project ID",
            page: "",
            studentName,
            studentId,
            timestamp: new Date()
        });
    }
    projectData.getProjectById(projectId)
        .then(project => {
            if (project) {
                res.render("project", {
                    project,
                    page: "",
                    studentName,
                    studentId,
                    timestamp: new Date()
                });
            } else {
                res.status(404).render("404", {
                    message: "Project not found",
                    page: "",
                    studentName,
                    studentId,
                    timestamp: new Date()
                });
            }
        })
        .catch(err => res.status(404).render("404", {
            message: err.message,
            page: "",
            studentName,
            studentId,
            timestamp: new Date()
        }));
});

// Custom 404 Page
app.use((req, res) => {
    res.status(404).render("404", {
        message: "Page not found.",
        page: "",
        studentName,
        studentId,
        timestamp: new Date()
    });
});

// Initialize Project Data
projectData.initialize()
    .then(() => {
        console.log("Project data initialized successfully.");
    })
    .catch(err => {
        console.error(`Failed to initialize project data: ${err}`);
        process.exit(1);
    });

// Export the app for Vercel
module.exports = app;
