// @ts-nocheck
import { ModalClose, Sheet } from "@mui/joy";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { taskActions } from "@/store/reducers/tasks";
import CalenderModal from "./CalenderModal";
import CommentsContainer from "../Comments/CommentsContainer";
import { calculateTime } from "@/utils/CalculateTime";

const SideTag = ({ label, value, pointer = false, onClick, time = false }) => (
  <>
    {time ? (
      <h1
        className={`${
          pointer ? "cursor-pointer" : ""
        } text-sm font-semibold capitalize md:text-lg`}
        onClick={onClick}
      >
        {label} :{" "}
        <span className="w-full truncate font-normal">
          {new Date(value).toDateString()}
        </span>
      </h1>
    ) : (
      <h1
        className={`${
          pointer ? "cursor-pointer" : ""
        } text-sm font-semibold capitalize md:text-lg`}
        onClick={onClick}
      >
        {label} : <span className="w-full truncate font-normal">{value}</span>
      </h1>
    )}
  </>
);

const TaskModal = ({
  successIsLoading,
  handleUserSubmit,
  userInfo,
  handleCreateNewSubmit,
  createNewIsLoading,
  refetch,
}) => {
  const { modalOpen, status, isNew, taskData } = useSelector(
    (state) => state.task
  );
  const dispatch = useDispatch();
  const changeRef = useRef();
  const [isCelenderVisible, setIsCelenderVisible] = useState(false);

  const handleModalClose = () => {
    dispatch(taskActions.setModalOpen(false));
    dispatch(taskActions.setTaskData({}));
    dispatch(taskActions.setIsNew(false));
  };

  const handleChange = (event) => {
    dispatch(taskActions.setStatus(event.target.value));
    if (taskData.user === userInfo._id) {
      dispatch(
        taskActions.setTaskData({
          ...taskData,
          status: event.target.value,
        })
      );
    }
    changeRef.current.style.display = "block";
  };

  const handleCalenderChange = (newValue) => {
    dispatch(
      taskActions.setTaskData({
        ...taskData,
        deadline: newValue.toISOString(),
      })
    );
    changeRef.current.style.display = "block";
    setIsCelenderVisible(false);
  };

  const handleModalChange = (e) => {
    dispatch(
      taskActions.setTaskData({
        ...taskData,
        [e.target.name]: e.target.value,
      })
    );
    changeRef.current.style.display = "block";
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={handleModalClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sheet
        sx={{
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose
          onClick={handleModalClose}
          variant="outlined"
          sx={{
            bgcolor: "background.surface",
          }}
        />
        <div className="relative mt-10 flex h-[80vh] w-[85vw] flex-col md:h-[70vh] md:w-[70vw]">
          {/* title bar */}
          <div className="flex w-full items-center justify-between border-b-2 py-2 px-3">
            {isNew || taskData?.user === userInfo?._id ? (
              <input
                className="bg-transparent text-xl font-semibold outline-none md:text-3xl"
                onChange={handleModalChange}
                value={taskData?.title}
                name="title"
                placeholder="Give Title"
              />
            ) : (
              <h1 className="text-xl font-semibold  capitalize md:text-3xl">
                {taskData?.title}
              </h1>
            )}
            <div className="flex items-center justify-start gap-2 capitalize">
              <span
                className={`h-2 w-2 rounded-full ${
                  taskData?.status === "in progress"
                    ? "bg-yellow-300"
                    : taskData?.status === "closed"
                    ? "bg-neutral-500"
                    : taskData?.status === "active"
                    ? "bg-green-500"
                    : "bg-red-500"
                } drop-shadow-sm`}
              ></span>
              <span className="font-semibold">{taskData?.status}</span>
            </div>{" "}
          </div>
          <div className="custom-scrollbar mt-2 h-full overflow-y-auto px-4">
            {/* description and info section */}
            <div className="flex h-[80%] flex-col-reverse border-b-2 border-slate-300 py-2 md:flex-row">
              <div className="mt-6 h-full flex-1 border-b-2 md:mt-0 md:border-r-2 md:border-b-0">
                {isNew || taskData?.user === userInfo?._id ? (
                  <textarea
                    placeholder="Description about your task..."
                    value={taskData.description}
                    onChange={handleModalChange}
                    className="custom-scrollbar h-full w-full border border-slate-300 py-2 px-3 font-medium outline-none md:border-r-0 rounded-md"
                    name="description"
                    style={{
                      resize: "none",
                    }}
                  />
                ) : (
                  <p className="font-medium">{taskData?.description}</p>
                )}
              </div>
              <div className="flex flex-[0.4] flex-col gap-6 py-2 md:relative md:px-4">
                <div className="flex flex-col gap-1 md:gap-2">
                  <SideTag
                    time
                    pointer={isNew || taskData?.user === userInfo?._id}
                    label={"Deadline"}
                    value={taskData?.deadline}
                    onClick={() => setIsCelenderVisible(true)}
                  />
                  {/* calender modal */}
                  <CalenderModal
                    isCelenderVisible={isCelenderVisible}
                    setIsCelenderVisible={setIsCelenderVisible}
                    taskData={taskData}
                    handleCalenderChange={handleCalenderChange}
                  />
                  <SideTag
                    label={"Assigned Date"}
                    value={calculateTime(taskData?.createdAt)}
                  />
                </div>
                <div className="">
                  <FormControl onChange={handleModalChange}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      {status}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={status}
                      onChange={handleChange}
                      autoWidth
                      label="Status"
                    >
                      <MenuItem value={"active"}>Active</MenuItem>
                      <MenuItem value={"in progress"}>In Progress</MenuItem>
                      <MenuItem value={"closed"}>Closed</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            {/* comment section and submit button */}
            <div className={`mt-2 flex flex-col-reverse md:flex-row`}>
              <div
                className={`flex-1 py-2 md:pr-6 ${isNew ? "hidden" : "block"}`}
              >
                <CommentsContainer
                  logginedUserId={userInfo?._id}
                  comments={taskData?.comments}
                  className="mt-10"
                  taskId={taskData?._id}
                  refetch={refetch}
                />
              </div>
              <div className="w-full py-2 md:flex-[0.4] md:px-4">
                <div
                  ref={changeRef}
                  className={`relative`}
                  style={{
                    display: "none",
                  }}
                >
                  {successIsLoading || createNewIsLoading ? (
                    <LoadingButton loading variant="outlined">
                      Submit
                    </LoadingButton>
                  ) : (
                    <Button
                      onClick={isNew ? handleCreateNewSubmit : handleUserSubmit}
                      variant="outlined"
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sheet>
    </Modal>
  );
};

export default TaskModal;
