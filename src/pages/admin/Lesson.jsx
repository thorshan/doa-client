import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
// import React, { useState } from "react";
import TitleComponent from "../../components/TitleComponent";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent";
import { lessonApi } from "../../api/lessonApi";

const Lesson = () => {
  const [loading, setLoading] = useState(false);
  //   const [form, setForm] = useState({
  //     key: "",
  //     order: "",
  //     title: "",
  //   });

  const [lessons, setLessons] = useState([]);

  // Fetch Modules
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await lessonApi.getAllLesson();
      setLessons(res.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  if (loading) return <LoadingComponent />;
  return (
    <Box>
      <TitleComponent />

      {/* Data */}
      <Box sx={{ my: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Module</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell>
                    {lesson.level ? lesson.level?.code : "N/A"}
                  </TableCell>
                  <TableCell>
                    {lesson.module ? lesson.module?.key : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        {/* <IconButton onClick={() => handleEdit(lesson)}>
                          <Edit fontSize="small" color="success" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(lesson._id)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton> */}
                      </Stack>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No data found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Lesson;
