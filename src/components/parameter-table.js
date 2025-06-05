import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

export const ParameterTable = ({ parameters }) => {
  return (
    <Table removeWrapper aria-label="Параметры транспортного средства">
      <TableHeader>
        <TableColumn>ПАРАМЕТР</TableColumn>
        <TableColumn>ЗНАЧЕНИЕ</TableColumn>
      </TableHeader>
      <TableBody>
        {parameters.map((param, index) => (
          <TableRow key={index}>
            <TableCell>{param.name}</TableCell>
            <TableCell>
              {param.value} {param.unit}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
