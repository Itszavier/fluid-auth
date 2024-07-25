/** @format */

import { AuthHandler, Session } from "../lib/index";
import { LocalProvider } from "../lib/providers";

const user = {
  id: "fewffewfewfewffwfewfwefew",
  name: "Imani Brown",
  email: "imanibrown421@gmail.com",
};

const Local = new LocalProvider({
  async verify(email, password) {
    return user;
  },
});

const session = new Session({
  secret: "session secret",
  name: "fluid-auth",
  serializeUser(userData) {
    return userData.id;
  },

  deserializeUser: async (data) => {
    return user;
  },

  cookie: {
    secure: false,
    httpOnly: true,
  },
});

const authHandler = new AuthHandler({
  providers: [Local],
  session,
  origin: process.env.ORIGIN as string,
});

export default authHandler;
