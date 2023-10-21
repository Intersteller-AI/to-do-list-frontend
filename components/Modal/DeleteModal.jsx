import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { HOST } from "@/utils/server";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const deleteTask = async (id) => {
  try {
    const { data } = await axios.delete(`${HOST}/api/tasks/${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export default function DeleteModal({ open, setOpen, refetch, id }) {
  const { mutate, isLoading } = useMutation({
    mutationFn: (id) => deleteTask(id),
    onSuccess: (data) => {
      refetch();
      toast.success("Item deleted successfully!");
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (id) {
      //   console.log(id);
      mutate(id);
    }
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to delete you to do item?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={handleSubmit}>
              Delete
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}
