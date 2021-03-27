import nextConnect from "next-connect";
import sdc from "./fetch_data";

async function Api(req, res, next) {
  let query = req.query;
  let data = await sdc(query.items, req.query.locations, query.q);

  res.json(data.body);

  return next();
}
const middleware = nextConnect();
middleware.use(Api);
export default middleware;
