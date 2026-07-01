import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { roomRouter } from "./roomRoutes.js";
import { bookingRouter } from "./bookingRoutes.js";
import { enquiryRouter } from "./enquiryRoutes.js";
import { dashboardRouter } from "./dashboardRoutes.js";
import { blogRouter } from "./blogRoutes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/rooms", roomRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/enquiries", enquiryRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/blogs", blogRouter);
