import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import dotenv from "dotenv";//We import dotenv in a Node.js application to load environment variables from a (.env) file into (process.env)
import connectDB from "./utils/db.js";

dotenv.config({});

const app = express();

//middleware
app.use(express.json()); //data is moved in a (json format) between Client and Server.
app.use(express.urlencoded({ extended: true })); //parse the URL encoded data into nested objects (helps in,req.body).
app.use(cookieParser()); //parse the data coming from frontend which stored in the local stroage of URL.
const corsOption = {
  origin: `http://localhost:5173`, //frontend port
  credentials: true,
};
app.use(cors(corsOption)); //to link for resource-sharing between Client-Server running on different port.

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
  console.log(`The Server is Running at port ${PORT}`);
});
