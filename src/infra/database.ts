import { PrismaClient } from "@prisma/client";
import type { ITXClientDenyList } from "@prisma/client/runtime/library";

export const prisma = new PrismaClient();

export type Database = Omit<PrismaClient, ITXClientDenyList>;
