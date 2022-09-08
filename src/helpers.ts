import type { IName } from "./solve/data";

function formatName(name: IName): string {
    return `${name.firstName} ${name.title ? name.title + " " : ""}${name.name}`;
}

export {
    formatName,
}