import express, { Application, Request, Response } from "express";
// import { prisma } from "./app/lib/prisma";
import { IndexRoutes } from "./app/routes";



const app: Application = express();


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/api/v1', IndexRoutes)

// Basic route
app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'API is working',
        method: req.method,
        path: req.originalUrl,
        query: req.query,
    });
});

app.use()


export default app;