import React from "react";
import Button from "@mui/material/Button";
import { ButtonProps, CircularProgress } from "@mui/material";

interface ButtonWithLoadingProps extends ButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  spinnerColor?: "inherit" | "white";
}
export const ButtonCustom = (props: ButtonWithLoadingProps) => {
  const { loading, children, spinnerColor = "white", ...rest } = props;

  if (loading) {
    return (
      <Button>
        <CircularProgress style={{ color: spinnerColor }} size={20} />
      </Button>
    );
  }
  return (
    <Button {...rest} variant={props.variant || "contained"}>
      {children}
    </Button>
  );
};
