import { type ClassValue, clsx } from "clsx";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BaseResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

// Function to generate a base response JSON object
export function generateBaseResponse<T>({
  success,
  data,
  message,
}: BaseResponse<T>): BaseResponse<T> {
  return {
    success,
    data,
    message,
  };
}

export function urlParamBuilder(
  mappedObject: Record<string, any>
): URLSearchParams {
  const urlParams = new URLSearchParams();
  Object.entries(mappedObject).forEach(([key, value]) => {
    if (value != null) {
      urlParams.append(key, String(value));
    }
  });
  return urlParams;
}
