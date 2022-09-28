const router = require("express").Router();

const postsRouter = require("./posts.routes");
const projetsRouter = require("./projets.routes")

router.use("/posts", postsRouter);
router.use("/projets", projetsRouter);

module.exports = router;