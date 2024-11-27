import React from "react";

export interface BasicProps {
    mobile: boolean,
    vertical: boolean,
    setShowCover: React.Dispatch<React.SetStateAction<boolean>>
}