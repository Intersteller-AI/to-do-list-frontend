import { ModalClose } from "@mui/joy";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React from "react";

const CalenderModal = ({ handleCalenderChange, taskData, isCelenderVisible, setIsCelenderVisible }) => {
  return (
    <div
      className={`absolute top-0 right-0 z-20 rounded-md bg-white py-2 px-4 drop-shadow-md ${
        isCelenderVisible ? "block" : "hidden"
      } scale-90 md:scale-100`}
    >
      <ModalClose
        onClick={() => setIsCelenderVisible(false)}
        variant="outlined"
        sx={{
          bgcolor: "background.surface",
        }}
      />
      {/* calender */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoItem label="Controlled calendar">
          <DateCalendar
            minDate={dayjs(Date.now())}
            value={dayjs(taskData?.deadline)}
            onChange={handleCalenderChange}
          />
        </DemoItem>
      </LocalizationProvider>
    </div>
  );
};

export default CalenderModal;
