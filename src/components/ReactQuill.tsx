"use client";
import { Box, FormHelperText, styled } from "@mui/material"; // import dynamic from "next/dynamic";

interface IProps {
  box_height?: number;
}

const Container = styled(Box)<IProps>(({ theme, box_height }) => ({
  "& .ql-toolbar": {
    borderColor: "transparent",
    borderRadius: "12px 12px 0px 0px",
    backgroundColor: theme.palette.divider,
  },
  "& .ql-editor": {
    minHeight: box_height ?? 500,
  },
  "& .ql-container": {
    minHeight: box_height ?? 500,
    borderColor: theme.palette.divider,
  },
})); // ===================================================

// ===================================================
const ReactQuill = ({ error, box_height }) => {
  return (
    <Container box_height={box_height}>
      {/* <CustomQuill theme="snow" modules={modules} {...props} /> */}
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Container>
  );
};

// const modules = {
//   toolbar: [
//     [
//       {
//         header: [1, 2, 3, 4, 5, 6, false],
//       },
//     ],
//     [
//       {
//         font: [],
//       },
//     ],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [
//       {
//         list: "ordered",
//       },
//       {
//         list: "bullet",
//       },
//       {
//         indent: "-1",
//       },
//       {
//         indent: "+1",
//       },
//     ],
//     ["link", "image", "video"],
//     ["clean"],
//   ],
// };
export default ReactQuill;
