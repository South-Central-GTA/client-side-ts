import "@abraham/reflection";
import "./di-resolver";
import {container} from "tsyringe";
import {ClientStartup} from "./client.startup";

container.resolve(ClientStartup);