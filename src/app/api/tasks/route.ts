import { remultNextApp } from "remult/remult-next";
import { Task } from "@/app/lib/Task";

const api = remultNextApp({
  entities: [Task],
});

export const { POST, PUT, DELETE, GET } = api;