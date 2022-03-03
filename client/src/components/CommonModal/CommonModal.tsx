import React, { Dispatch, SetStateAction } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import { Button, Box, DialogContent } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogActions from "@mui/material/DialogActions";

import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

interface CommonModalProps {
  children: React.ReactNode;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  title: string;
  // eslint-disable-next-line react/require-default-props
  desc?: string;
  // eslint-disable-next-line react/require-default-props
  onSubmit?: () => void;
  // eslint-disable-next-line react/require-default-props
  loading?: boolean;
  // eslint-disable-next-line react/require-default-props
  transitionDir?: "left" | "right" | "up" | "down";
}

const CommonModal = ({
  children,
  open,
  setOpen,
  title,
  desc,
  onSubmit,
  loading,
  transitionDir,
}: CommonModalProps) => {
  const handleClose = () => {
    setOpen(false);
  };
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction={transitionDir} ref={ref} {...props} />;
  });
  return (
    <div>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        maxWidth="laptop"
        TransitionComponent={transitionDir ? Transition : undefined}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{desc}</DialogContentText>
          {children}
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            {onSubmit && (
              <LoadingButton
                style={{ marginLeft: "10px" }}
                loading={loading}
                variant="contained"
                onClick={onSubmit}
              >
                Save
              </LoadingButton>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommonModal;
