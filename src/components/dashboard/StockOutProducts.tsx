"use client";

import { H5 } from "@/components/Typography";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const StockOutProducts = () => {
  const products = [
    {
      id: 1,
      name: "Sản phẩm A",
      stock: 0,
      price: "1,200,000 ₫",
      category: "Thiết bị",
    },
    {
      id: 2,
      name: "Sản phẩm B",
      stock: 0,
      price: "2,500,000 ₫",
      category: "Vật tư",
    },
  ];

  return (
    <Card>
      <H5 p={3} mb={0}>
        Sản phẩm hết hàng
      </H5>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "grey.200" }}>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell align="right">Giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">{product.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default StockOutProducts;
