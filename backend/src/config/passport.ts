import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username: string, password: string, done: any) => {
      try {
        const existingAdminUser = await prisma.admin.findUnique({ 
          where: { username } 
        });

        if (!existingAdminUser) {
          return done(null, false, { message: "Incorrect username." });
        }

        if (existingAdminUser.password === null) {
          return done(null, false, { message: "Password is null." });
        }

        if (typeof existingAdminUser.password !== 'string') {
          return done(null, false, { message: "Password is not a string." });
        }

        const isValidPassword = await bcrypt.compare(
          password, 
          existingAdminUser.password
        );

        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, existingAdminUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await prisma.admin.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
