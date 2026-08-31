import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { roomRouter } from "./roomRoutes.js";
import { roomBlockRouter } from "./roomBlockRoutes.js";
import { bookingRouter } from "./bookingRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";
import { enquiryRouter } from "./enquiryRoutes.js";
import { dashboardRouter } from "./dashboardRoutes.js";
import { settingsRouter } from "./settingsRoutes.js";
import { subscriberRouter } from "./subscriberRoutes.js";
import { mailRouter } from "./mailRoutes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/rooms", roomRouter);
apiRouter.use("/room-blocks", roomBlockRouter);
apiRouter.use("/bookings", bookingRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/enquiries", enquiryRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/subscribers", subscriberRouter);
apiRouter.use("/mail", mailRouter);
