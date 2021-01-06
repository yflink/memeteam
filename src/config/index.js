import development from "./development.config";
import production from "./production.config";
import example from "./example.config";
import imgur from "./imgur.config";
const env = process.env.APP_ENV || 'example';

const config = {
  example,
  development,
  production,
};

export default {
  ...config[env],
  imgur,
};
