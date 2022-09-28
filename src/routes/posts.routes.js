const connection = require("../db-config.js");
const router =  require("express").Router();

router.get("/", (req, res) => {
    connection.query("SELECT * FROM post", (err, result)=> {
        if(err) {
            return res.status(500).send("error retrieving skills from database");
        } else {
            return res.json(result);
        }
    });
});

router.get("/:id", (req, res) => {
    const postId = req.params.id;
    connection.query("SELECT * FROM post WHERE id=?", 
    [postId],
    (err, results) => {
        if(err) {
            return res.status(500).send("error retrieving specific post from database");
        } else {
            if(results.length) res.json(results[0]);
            else res.status(404).send("post not found");
        }
    })
});

router.post("/", (req, res) => {
    const {title, summary, content} = req.body;
    connection.query('INSERT INTO post (title, summary, content) VALUES (?,?)', [title,summary, content],
    (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving post from database');
        } else {
            const id= result.insertId;
            const createdPost = { id, title, summary, content};
            res.status(201).json(createdPost);
        }
    })
});

router.put('/:id', (req, res) => {
    connection.query(
        'UPDATE post SET ? WHERE id = ?',
        [req.body, req.params.id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error updating a post');
            } else {
                if (result.affectedRows) {
                    const updatedPost = {
                        id: req.params.id,
                        name: req.body.name
                    };
                    return res.status(200).json(updatedPost);
                } else {return res.status(404).send('Post not found.');
                }
            }
        }
    );
});

router.delete('/:id', (req, res) => {
    const postId =req.params.id;
    connection.query(
        'DELETE FROM post WHERE id = ?',
        [postId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error while deleting a post');
            } else {
                if (result.affectedRows) res.status(200).send('Yay, post deleted correctly')
                else res.status(404).send('Post not found :(')
            }
        } 
    )
});

module.exports = router;