import googleOAuth from "passport-google-oauth20";
import { UserModel } from "../database/allmodel";

const GoogleStrategy = googleOAuth.Strategy;

export default (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:4000/auth/google/callback",
            },
            //after authentication from google we get these values
            //done is inbuilt function like next to tell google to continue its work with some details that we provide
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    fullname: profile.displayName,
                    email: profile.emails[0].value,
                    profilePic: profile.photos[0].value,
                };

                try {
                    // check if the user exist
                    const user = await UserModel.findOne({
                        email: newUser.email,
                    });

                    if (user) {
                        // generate token
                        const token = user.generateJwtToken();

                        // return user
                        done(null, { user, token });
                    } else {
                        // create new user
                        const user = await UserModel.create(newUser);

                        // generate token
                        const token = user.generateJwtToken();

                        // return user
                        done(null, { user, token });
                    }
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
    //configurations to de/serialise user
    passport.serializeUser((userData, done) => done(null, { ...userData }));
    passport.deserializeUser((id, done) => done(null, id));
};
