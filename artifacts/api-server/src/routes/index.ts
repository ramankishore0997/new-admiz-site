import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import applicationsRouter from "./applications";
import documentsRouter from "./documents";
import notificationsRouter from "./notifications";
import supportRouter from "./support";
import adminRouter from "./admin";
import paymentsRouter from "./payments";
import accountsRouter from "./accounts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(applicationsRouter);
router.use(documentsRouter);
router.use(notificationsRouter);
router.use(supportRouter);
router.use(adminRouter);
router.use(paymentsRouter);
router.use(accountsRouter);

export default router;
