// @ts-nocheck
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { taskActions } from "../../store/reducers/tasks";
import toast from "react-hot-toast";
import TaskModal from "@/components/Modal/TaskModal";
import { HOST } from "@/utils/server";
import axios from "axios";
import TaskTable from "../Table/TaskTable";
import DeleteModal from "../Modal/DeleteModal";

const tasks = async (page, limit) => {
  try {
    const res = await fetch(`${HOST}/api/tasks?page=${page}&limit=${limit}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};

const createNewTask = async ({ taskData }) => {
  try {
    const { data } = await axios.post(`${HOST}/api/tasks/`, taskData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

const updateTask = async ({ taskData }) => {
  try {
    const { data } = await axios.put(
      `${HOST}/api/tasks/`,
      { ...taskData },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

const Tasks = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const dispatch = useDispatch();
  const { data, refetch, isLoading } = useQuery({
    queryFn: () => tasks(page + 1, rowsPerPage),
    queryKey: ["tasks/fetch-tasks", page, rowsPerPage],
  });
  const { taskData, modalOpen, status } = useSelector((state) => state.task);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (data) {
      // console.log(data);
      setRows(data?.tasks);
      // setTotalPages(data?.metadata?.totalPages);
    }
  }, [data, modalOpen]);

  const handleModalOpen = (e, row) => {
    dispatch(taskActions.setModalOpen(!modalOpen));
    dispatch(taskActions.setTaskData(row));
    dispatch(taskActions.setStatus(row.status));
    dispatch(taskActions.setIsNew(false));
  };

  // create new task
  const { mutate: createNewMutate, isLoading: createNewIsLoading } =
    useMutation({
      mutationFn: (fulltaskData) => {
        return createNewTask({ taskData: fulltaskData });
      },
      onSuccess: (data) => {
        refetch();
        toast.success("Task created successfully!");
        dispatch(taskActions.setTaskData(data));
        dispatch(taskActions.setStatus(data.status));
        dispatch(taskActions.setModalOpen(false));
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
    });

  const handleCreateNewSubmit = () => {
    createNewMutate(taskData);
  };

  const { mutate, isLoading: updateIsLoading } = useMutation({
    mutationFn: (fulltaskData) => {
      return updateTask({ taskData: fulltaskData });
    },
    onSuccess: (data) => {
      refetch();
      toast.success("Task updated successfully!");
      dispatch(taskActions.setTaskData(data));
      dispatch(taskActions.setStatus(data.status));
      dispatch(taskActions.setModalOpen(false));
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (taskData?._id && status) {
      mutate(taskData);
    }
  };

  const addTaskClickHandler = () => {
    dispatch(taskActions.setModalOpen(true));
    dispatch(taskActions.setStatus("active"));
    dispatch(taskActions.setIsNew(true));
    dispatch(
      taskActions.setTaskData({
        title: "",
        description: "",
        status: "active",
        deadline: Date.now(),
        createdAt: Date.now(),
      })
    );
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
    refetch();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    refetch();
  };

  const handleDeleteModal = (e, row) => {
    setDeleteModal(true);
    setDeleteModalId(row._id);
  };

  return (
    <div className="relative flex flex-1 flex-col gap-7 overflow-hidden px-10 py-14">
      <div className="">
        <h1 className="font-semibold md:text-xl">To Do</h1>
        <div className="mt-4 w-full border-b-2 border-slate-300" />
      </div>
      <TaskTable
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleDeleteModal={handleDeleteModal}
        rows={rows}
        addTaskClickHandler={addTaskClickHandler}
        handleModalOpen={handleModalOpen}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        page={page}
      />
      <TaskModal
        refetch={refetch}
        userInfo={userInfo}
        handleCreateNewSubmit={handleCreateNewSubmit}
        createNewIsLoading={createNewIsLoading}
        handleUserSubmit={handleSubmit}
        successIsLoading={updateIsLoading}
      />
      <DeleteModal
        open={deleteModal}
        setOpen={setDeleteModal}
        id={deleteModalId}
        refetch={refetch}
      />
    </div>
  );
};

export default Tasks;
