import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

export const DetailedReportTable = ({ trips }) => {
  const [activeView, setActiveView] = useState("table");

  console.log(trips);
  return (
    <Card className="mt-4">
      <CardBody>
        <CardHeader>
          <h4 className="">Детальный отчет</h4>
        </CardHeader>
        <Tabs
          aria-label="Вид"
          selectedKey={activeView}
          onSelectionChange={setActiveView}
          className="flex justify-center"
        >
          <Tab key="table" title="Таблица">
            <div className="overflow-auto">
              <Table
                aria-label="Таблица поездок"
                className="min-w-full"
                isCompact
              >
                <TableHeader>
                  {trips.header.map((header) => (
                    <TableColumn key={header}>{header}</TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {trips.rows.slice(0, 30).map((trip, index) => (
                    <TableRow key={index}>
                      {trip.map((cell, i) => (
                        <TableCell key={i}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Tab>
          <Tab key="json" title="JSON">
            <pre className="text-sm bg-default-100 p-2 rounded">
              {JSON.stringify(trips, null, 2)}
            </pre>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};
