import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import config from './config'

if (!config.GITHUB_CLIENT_ID || !config.GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub client ID and client secret must be defined in the config');
  }
  
export default passport.use(
  new GitHubStrategy(
    {
      clientID: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/github/callback',
    },
    (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (error: unknown, user?: unknown) => void
    ) => {
      return done(null, profile);
    }
  )
);
