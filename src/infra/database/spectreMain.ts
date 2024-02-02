import {Spectre, SpectreDatabases} from "spectre-orm";
import {env} from "../../utils/env";

export const spectreMain = new Spectre(SpectreDatabases.mysql, env.DATABASE_URL)