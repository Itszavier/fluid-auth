import { AuthHandler, Session } from "../lib/index";
import { LocalProvider } from "../lib/providers";

const user = {
  id: "fewffewfewfewffwfewfwefew",
  name: "Imani Brown",
  email: "imanibrown421@gmail.com",
  password: "test",
};

const Local = new LocalProvider({
  async verify(email, password) {
    return user;
  },
});

const session = new Session({
  cookie: {},
  async serializeUser(user) {
    console.log("serializedUser");
    return user.id;
  },

  async deserializeUser(id) {
    console.log("serializedUser");
    return user;
  },
});

const authHandler = new AuthHandler({
  providers: [Local],
  session,
  origin: process.env.ORIGIN as string,
});

export default authHandler;
