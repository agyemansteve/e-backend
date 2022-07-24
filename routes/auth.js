const express = require("express");
const passport = require("passport");
const AuthService = require("../services/AuthService");
const AuthServiceInstance = new AuthService();

const router = express.Router();

/* GET /auth/
 *
 * This route prompts the user to log in.
 */
router.get("/", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login",

  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const response = await AuthServiceInstance.login({
        email,
        password,
      });
      // console.log("response " + JSON.stringify(response));
      const data = JSON.stringify(response);

      // res.status(200).send(data);

      if (response) {
        // res.status(200).send(response);
        res.status(200).render("index", { title: "Express", name: data });
      } else {
        // res.status(401).send("invalid credentials");
        res.status(401).render("login");
      }
    } catch (err) {
      next(err);
    }
  }
);

/* POST /logout
 *
 * This route logs the user out.
 */
router.post("/logout", function (req, res, next) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.send("Logout successful");
      }
    });

    req.logout();
  } else {
    res.end();
  }

  // req.logout();
  // res.send("log out route");
  res.redirect("/");
});

/* GET /auth/signup
 *
 * This route prompts the user to sign up.
 *
 * The 'signup' view renders an HTML form, into which the user enters their
 * desired username and password.  When the user submits the form, a request
 * will be sent to the `POST /signup` route.
 */
router.get("/signup", function (req, res, next) {
  res.render("signUp");
});

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */
router.post("/signup", async function (req, res, next) {
  // res.send("post request sent");
  try {
    const data = req.body;
    // console.log(data);

    const response = await AuthServiceInstance.register(data);

    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    // next(err);
  }

  res.render("login");
});

module.exports = router;
