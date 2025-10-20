import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function toTitleCase(str:any) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatter(arr: any[]) {
  return arr.map(obj => {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (
        typeof obj[key] === "string" &&
        key !== "image" &&
        key !== "maps"
      ) {
        newObj[key] = toTitleCase(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  });
}



// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
