const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projects = projectData.map(project => {
                const sector = sectorData.find(s => s.id === project.sector_id);
                return { 
                    ...project, 
                    sector: sector ? sector.sector_name : "Unknown" 
                };
            });

            if (projects.length === 0) {
                reject("No projects available after initialization");
            } else {
                console.log("Projects initialized successfully with", projects.length, "items.");
                resolve();
            }
        } catch (error) {
            reject("Failed to initialize projects: " + error.message);
        }
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length === 0) {
            reject("No projects available");
        } else {
            resolve(projects);
        }
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            resolve(project);
        } else {
            reject(`Project with ID ${projectId} not found`);
        }
    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        if (!sector) {
            reject("No sector specified");
            return;
        }

        const normalizedSector = sector.trim().toLowerCase();
        const filteredProjects = projects.filter(p => 
            p.sector.toLowerCase() === normalizedSector
        );

        if (filteredProjects.length > 0) {
            console.log(`Found ${filteredProjects.length} projects in sector: ${sector}`);
            resolve(filteredProjects);
        } else {
            console.log(`No projects found for sector: ${sector}`);
            reject(`No projects found in sector: ${sector}`);
        }
    });
}

module.exports = { 
    initialize, 
    getAllProjects, 
    getProjectById, 
    getProjectsBySector 
};