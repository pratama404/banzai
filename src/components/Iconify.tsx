import React from "react";

interface IconProps {
  icon: string;
}

export default function Iconify({ icon }: IconProps) {
  return React.createElement("iconify-icon", { icon });
}
