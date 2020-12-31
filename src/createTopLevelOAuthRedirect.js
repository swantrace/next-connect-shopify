import createTopLevelRedirect from './createTopLevelRedirect';
import { createTopLevelOAuthCookie } from './helpers';

export default function createTopLevelOAuthRedirect(apiKey, path) {
  const redirect = createTopLevelRedirect(apiKey, path);
  return (req, res) => {
    createTopLevelOAuthCookie(req, res);
    redirect(req, res);
  };
}
