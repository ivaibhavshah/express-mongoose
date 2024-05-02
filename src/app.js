import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}));

// Set to accept json limit
app.use(express.json({limit: '5mb'}));

//  getting data from query/ url parameters
app.use(express.urlencoded({ extended: true, limit : '5mb' }));

// assets folder path for static files 
app.use(express.static("public"));

app.use(cookieParser())
export {app};