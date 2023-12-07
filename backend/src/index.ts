import app from "./lib/createServer";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, () => 
  console.log(`Server listening on port ${port}`))