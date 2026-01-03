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
import { moduleApi } from "../../api/moduleApi";

const Module = () => {
  const [loading, setLoading] = useState(false);
  //   const [form, setForm] = useState({
  //     key: "",
  //     order: "",
  //     title: "",
  //   });

  const [modules, setModules] = useState([]);

  // Fetch Modules
  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await moduleApi.getAllModules();
      setModules(res.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
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
              <TableCell>Key</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.length > 0 ? (
              modules.map((module, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{module.key}</TableCell>
                  <TableCell>{module.order}</TableCell>
                  <TableCell>{module.title}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Stack spacing={2} direction={"row"}>
                        {/* <IconButton onClick={() => handleEdit(module)}>
                          <Edit fontSize="small" color="success" />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(module._id)}>
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

export default Module;
