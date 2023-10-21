export const COLUMNS = [
  { field: "title", headerName: "Title", width: 220 },
  {
    field: "deadline",
    headerName: "Deadline",
    width: 180,
    align: "left",
    headerAlign: "left",
    valueGetter: (params) => calculateTime(params.row.deadline),
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 180,
  },
];
