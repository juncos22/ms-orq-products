import statusServer from './status.routes';
import userServer from './user.routes';
import productServer from './product.routes';

export default {
  allRoutes: [statusServer, userServer, productServer],
};
