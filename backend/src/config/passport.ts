import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done: any) => {
      try {
        const user = await prisma.admin.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        if (user.password === null) {
          return done(null, false, { message: "Password is null." });
        }

        if (typeof user.password !== 'string') {
          return done(null, false, { message: "Password is not a string." });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;
