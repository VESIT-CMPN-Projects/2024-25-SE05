const express = require("express");
const router = express.Router();

// POST route for setting the language
router.post("/set-language", (req, res) => {
  const lang = req.body.lang || "en";
  res.cookie("locale", lang); // Must match the name used in i18n.configure
  res.setLocale(lang); // Apply to current request
  res.redirect("back"); // Go back to the same page
});

// Root route (index page)
router.get("/", (req, res) => {
  res.render("index", { currentPage: "index", locale: req.getLocale() });
});

module.exports = router;
