import Box from "@mui/material/Box";
import { calculateTime } from "../../utils/CalculateTime";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { AiFillDelete } from "react-icons/ai";
import { BiMessageSquareEdit } from "react-icons/bi";
import { COLUMNS } from "@/public/assets/constants";

const TaskTable = ({
  addTaskClickHandler,
  isLoading,
  rows,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteModal,
  handleModalOpen,
  totalPages,
  rowsPerPage,
  page,
}) => {
  return (
    <div className="relative overflow-hidden">
      <Box
        sx={{
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <TableContainer component={Paper}>
          <Toolbar>
            <Button
              color="primary"
              startIcon={<AddIcon />}
              onClick={addTaskClickHandler}
            >
              Add Task
            </Button>
          </Toolbar>
          <Table aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow className="">
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              ) : (
                rows?.map((row) => (
                  <TableRow key={row.title}>
                    <TableCell align="left" width={180} className="capitalize">
                      {row.title}
                    </TableCell>
                    <TableCell align="left" width={180} className="capitalize">
                      {calculateTime(row.deadline)}
                    </TableCell>
                    <TableCell align="left" width={220} className="capitalize">
                      <div className="flex items-center justify-start gap-2 capitalize">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            row?.status.toLowerCase() === "in progress"
                              ? "bg-yellow-300"
                              : row?.status.toLowerCase() === "done"
                              ? "bg-blue-500"
                              : row?.status.toLowerCase() === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } drop-shadow-sm`}
                        ></span>
                        <span className="font-semibold">{row?.status}</span>
                      </div>{" "}
                    </TableCell>
                    <TableCell align="left" width={100} className="capitalize">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center justify-center p-2 rounded-full hover:bg-blue-500/40 w-fit hover:cursor-pointer"
                          onClick={(e) => handleModalOpen(e, row)}
                        >
                          <BiMessageSquareEdit
                            size={20}
                            className="text-blue-500"
                          />
                        </div>
                        <div
                          className="flex items-center p-2 rounded-full hover:bg-red-500/40 w-fit hover:cursor-pointer"
                          onClick={(e) => handleDeleteModal(e, row)}
                        >
                          <AiFillDelete size={20} className="text-red-500" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter
              style={{
                width: "100%",
              }}
            >
              <TableRow
                sx={{
                  width: "100%",
                }}
              >
                <TablePagination
                  rowsPerPageOptions={[1, 5]}
                  colSpan={5}
                  count={totalPages}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default TaskTable;
