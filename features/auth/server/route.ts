import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { signInSchema } from "../schemas/signin-schema";

const app = new Hono()
    .post("/login", 
        zValidator("json", signInSchema),
        (c) => {
            return c.json({ success: "Ok" })
        }
    )


export default app;