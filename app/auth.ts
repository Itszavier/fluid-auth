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
    if (email !== user.email && password !== user.password) {
      throw Error("Invalid Email or password");
    }

    return user;
  },
});

const session = new Session({
  cookie: {},
  async serializeUser(user) {
    return user.id;
  },

  async deserializeUser(id) {
    return user;
  },
});

const authHandler = new AuthHandler({
  providers: [Local],
  session,
  origin: process.env.ORIGIN as string,
});

export default authHandler;
