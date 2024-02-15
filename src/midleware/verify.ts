
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

const SECRET_KEY = '1234';

export default function verifyKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    verify_signature(req);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

const verify_signature = (req: Request) => {
  try {
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const trusted = Buffer.from(`sha256=${signature}`, "ascii");
    const untrusted = Buffer.from(
      req.header("x-hub-signature-256") ?? "",
      "ascii"
    );

    if (!crypto.timingSafeEqual(trusted, untrusted)) {
      throw new Error("Invalid signature");
    }

    // La firma es válida
    return true;
  } catch (err) {
    throw new Error(`Error verifying signature: ${err}`);
  }
};
