import {readFileSync} from "fs";

export function graphqlLoader(path: string) {
    return readFileSync(path, {encoding: "utf-8"})
}