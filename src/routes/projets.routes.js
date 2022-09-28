const connection = require("../db-config.js");
const router = require("express").Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM projets", (err, result)=> {
        if(err) {
            return res.status(500).send("error retrieving projectsDB from database");
        } else {
            return res.json(result);
        }
    });
});

router.get("/:id", (req, res) => {
    const projetId = req.params.id;
    connection.query("SELECT * FROM projets WHERE id=?", 
    [projetId],
    (err, results) => {
        if(err) {
            return res.status(500).send("error retrieving specific project from database");
        } else {
            if(results.length) res.json(results[0]);
            else res.status(404).send("project not found");
        }
    })
});

router.post("/", (req, res) => {
    const {title, summary, content} = req.body;
    connection.query('INSERT INTO projects (title, summary, content) VALUES (?,?)', [title,summary, content],
    (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving a specific project from database');
        } else {
            const id= result.insertId;
            const createdProject = { id, title, summary, content};
            res.status(201).json(createdProject);
        }
    })
});

router.put('/:id', (req, res) => {
    connection.query(
        'UPDATE projects SET ? WHERE id = ?',
        [req.body, req.params.id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error updating a specific project');
            } else {
                if (result.affectedRows) {
                    const updatedProject = {
                        id: req.params.id,
                        name: req.body.name
                    };
                    return res.status(200).json(updatedProject);
                } else {return res.status(404).send('Project not found.');
                }
            }
        }
    );
});

router.delete('/:id', (req, res) => {
    const projectId =req.params.id;
    connection.query(
        'DELETE FROM post WHERE id = ?',
        [projectId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error while deleting a post');
            } else {
                if (result.affectedRows) res.status(200).send('Yay, project deleted correctly')
                else res.status(404).send('Project not found :(')
            }
        } 
    )
});



module.exports = router;