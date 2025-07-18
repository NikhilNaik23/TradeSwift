import authApi from "../routes/authRoute.js";
import chatApi from "../routes/chatRoute.js";
import router from "../routes/orderRoute.js";
import productsApi from "../routes/productRoute.js";
import reportRoute from "../routes/reportRoute.js";
import wishlistRoute from "../routes/wishlistRoute.js";

const apis = (app) => {
  app.use("/api/auth", authApi);
  app.use("/api/products", productsApi);
  app.use("/api/messages", chatApi);
  app.use("/api/wishlist", wishlistRoute);
  app.use("/api/reports", reportRoute);
  app.use("/api/orders", router);
};
export default apis;
