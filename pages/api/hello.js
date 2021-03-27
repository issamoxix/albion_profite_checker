import nextConnect from "next-connect";
import middleware from "../../backend/api/api";

const handler = nextConnect();
handler.use(middleware);
handler.get(async (req, res) => {
  // res.json(doc);
});
export default handler;
