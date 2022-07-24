// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("./models/user");
const bcrypt = require("bcryptjs");
const UserModelInstance = new UserModel();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        // usernameField: "username",
        // passwordField: "password",
        // passReqToCallback: true,
      },
      async function verify(email, password, done) {
        try {
          const user = await UserModelInstance.findOneByEmail(email);
          consoele.log(user);

          if (!user) {
            throw createError(
              401,
              "Incorrect username or password or user does not exist"
            );
          }
          bcrypt.compare(password, user.password, (err, result) => {
            console.log("bCrpt working in passport");
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    return cb(null, UserModelInstance.findOneById(id));
  });
};

// module.exports = (passport) => {
//   // Initialize passport
//   // app.use(passport.initialize());
//   // app.use(passport.session());

//   // Set method to serialize data to store in cookie
//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   // Set method to deserialize data stored in cookie and attach to req.user
//   passport.deserializeUser((id, done) => {
//     done(null, { id });
//   });

//   // Configure local strategy to be use for local login
//   passport.use(
//     new LocalStrategy(async (email, password, done) => {
//       try {
//   const user = await UserModelInstance.findOneByEmail(email);

//         // const user = await AuthServiceInstance.login({
//         //   email,
//         //   password,
//         // });
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     })
//   );

//   return passport;
// };
