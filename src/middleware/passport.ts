import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AppError } from '../core/AppError';
import { HTTP_STATUS_CODES } from '../config/statusCodes';
import { Auth } from '../entities/auth/Auth';
import { createJWT } from '../utils/jwt/createJWT';
import { Email } from '../core/email/Email';
import { getUserByEmailQuery, registerByGoogleQuery } from '../entities/auth/sqlQueries';

passport.use(
  new GoogleStrategy(
    {
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      passReqToCallback: true,
    },
    async function (_request, _accessToken, _refreshToken, profile, done) {
      try {
        if (profile.emails) {
          const email = profile.emails[0].value;
          const googleId = profile.id;
          const user = await Auth.getUserByEmail({ email, getUserByEmailQuery });
          let userId = user?.userId;
          if (!user) {
            const result = await Auth.registerByGoogle({ email, googleId, registerByGoogleQuery });
            await new Email({ user: { email } }).sendWellcomeSocialRegistration();
            userId = result.insertId;
          }

          const token = await createJWT({ id: userId });

          return done(null, { token });
        }

        throw new AppError(
          'Failed to log in with Google. Please try again later',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
        );
      } catch (error) {
        done(error);
      }
    },
  ),
);

export default passport;
