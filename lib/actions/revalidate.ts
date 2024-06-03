"use server";

import { revalidateTag } from "next/cache";

export default async function revalidateCache(tag: string) {
  revalidateTag(tag);
}
