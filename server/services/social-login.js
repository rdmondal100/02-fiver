const User = require("../models/User");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require("dotenv");
const { handleCreateUser, handleCreateUserProfile } = require("../controllers/authController");

dotenv.config();
const randomNum = Math.floor(1000 + Math.random() * 9000); // generates a 4-digit random number

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const email = profile.emails[0].value;
            const name = profile.displayName;

            // 1. Check if user already exists
            let user = await User.findOne({ email });
            if (!user) {
                // 2. If not, create user
                user = await handleCreateUser({
                    name,
                    email,
                    password: `${name}_random`,
                    dateOfBirth: null,
                    location: ''
                })
                await handleCreateUserProfile({
                    userId: user?._id, name, tandemID: `${name}_${user?.role}_${randomNum}`, dateOfBirth: null, location: "",
                    country: "", profileCompleted: false, learningLanguage: ""
                })
            }
            // 5. Return user and token
            return cb(null, user);

        } catch (error) {
            console.error('Google authentication error:', error);
            return cb(error, null);
        }
    }));

// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: process.env.FACEBOOK_APP_ID,
//             clientSecret: process.env.FACEBOOK_APP_SECRET,
//             callbackURL: `${process.env.BASE_URL}/api/auth/facebook/callback`,
//             profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
//         },
//         async (accessToken, refreshToken, public_profile, cb) => {
//             try {
//                 const { email, first_name, last_name } = public_profile._json;
//                 // Check if user exists
//                 let user = await User.findOne({ email });
//                 if (!user) {
//                     const userName = `${first_name} ${last_name}`;
//                     user = await handleCreateUser({
//                         name: userName,
//                         email,
//                         password: `${userName}_random`,
//                         dateOfBirth: null,
//                         location: ''
//                     });

//                     await handleCreateUserProfile({
//                         userId: user._id,
//                         name: userName,
//                         tandemID: `${first_name}_${user.role}_${randomNum}`,
//                         dateOfBirth: null,
//                         location: "",
//                         country: "", profileCompleted: false, learningLanguage: ""
//                     });
//                 }
//                 return cb(null, user); // ✅ fixed here
//             } catch (error) {
//                 console.error(error);
//                 return cb(error, null); // ✅ fixed here
//             }
//         }
//     )
// );

module.exports = passport