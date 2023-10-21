import Image from "next/image";
import React from "react";

const Avatar = ({ src, className }) => {
  return (
    <div>
      <Image
        className={`rounded-full ${className}`}
        width={30}
        height={30}
        alt="Avatar"
        src={src}
      />
    </div>
  );
};

export default Avatar;
