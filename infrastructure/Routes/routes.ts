import express from 'express';
import {billRouter} from './BillRoute';
import {productRouter} from './ProductRoute';
import { billDetailsRouter } from '../../infrastructure/Routes/BillDetailsRoute';

const mainRouter = express.Router();

// Usar las rutas de facturas
mainRouter.use('/', billRouter);
mainRouter.use('/', productRouter);
mainRouter.use('/',billDetailsRouter)

export default mainRouter;