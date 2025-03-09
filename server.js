/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});

app.get("/", (req, res) => {
    res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
    res.render("about", { page: "/about" });
});

app.get("/solutions/projects", (req, res) => {
    const { sector } = req.query;
    if (sector) {
        projectData.getProjectsBySector(sector)
            .then(projects => {
                res.render("projects", {
                    projects,
                    page: "/solutions/projects",
                    studentName,
                    studentId,
                    timestamp: new Date()
                });
            })
            .catch(err => {
                res.status(404).render("404", {
                    message: `No projects found for sector: ${sector}`,
                    page: "",
                    studentName,
                    studentId,
                    timestamp: new Date()
                });
            });
    } else {
        projectData.getAllProjects()
            .then(projects => {
                res.render("projects", {
                    projects,
                    page: "/solutions/projects",
                    studentName,
                    studentId,
                    timestamp: new Date()
                });
            })
            .catch(err => {
                res.status(500).render("404", {
                    message: "Unable to load projects",
                    page: "",
                    studentName,
                    studentId,
                    timestamp: new Date()
                });
            });
    }
});

app.get("/solutions/projects/:id", (req, res) => {
    const projectId = parseInt(req.params.id, 10);
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
            res.render("project", {
                project,
                page: "",
                studentName,
                studentId,
                timestamp: new Date()
            });
        })
        .catch(err => {
            res.status(404).render("404", {
                message: "Error retrieving project",
                page: "",
                studentName,
                studentId,
                timestamp: new Date()
            });
        });
});

app.use((req, res) => {
    res.status(404).render("404", {
        message: "Page not found.",
        page: "",
        studentName,
        studentId,
        timestamp: new Date()
    });
});

projectData.initialize()
    .then(() => {
        console.log("Project data initialized successfully.");
    })
    .catch(err => {
        console.error(`Failed to initialize project data: ${err}`);
        process.exit(1);
    });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;