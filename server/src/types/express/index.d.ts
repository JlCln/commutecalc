import { N } from "@faker-js/faker/dist/airline-C5Qwd7_q";

declare global {
  namespace Express {
    export interface Request {
      /* ************************************************************************* */
      userId?: number;
      /* ************************************************************************* */
    }
  }
}
