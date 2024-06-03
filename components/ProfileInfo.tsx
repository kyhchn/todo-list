import React from "react";
import { User } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

interface ProfileStruct {
  name: string | null | undefined;
  imageUrl: string | null | undefined;
}

export default function ProfileInfo(profileStruct: ProfileStruct) {
  return (
    <div className="flex flex-row items-center justify-start gap-x-4">
      <div className="size-8 bg-blue-100 rounded-full">
        {profileStruct.imageUrl ? (
          <Image
            src={profileStruct.imageUrl}
            className="rounded-full"
            alt="profile-image"
            width={32}
            height={32}
          />
        ) : (
          <User size={32} />
        )}
      </div>
      <p>{profileStruct.name || ""}</p>
    </div>
  );
}
