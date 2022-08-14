import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

interface Porps {
    totalPages: number;
    activeNumber: number;
    onChange?: (event: any) => any
}

const PaginationAction: NextPage<Porps> = (porps) => {
      const [itemsPagination, setItemsPagination] = useState<JSX.Element[]>([])
      

      const getItems = () => {
        let items = [];
        for (let number = 1; number <= porps.totalPages; number++) {
            items.push(
            <Pagination.Item key={number} active={(number == porps.activeNumber)} onClick={() => clickPagination(number, porps.activeNumber)}>
                {number}
            </Pagination.Item>,
            );
        }
        setItemsPagination(items)
      }

      const clickPagination = (page: number, activeNumber: number) => {
        if (page == activeNumber) {
          return false
        }
        if (porps.onChange != undefined) {
          porps.onChange(page)
        }
      }

      useEffect(() => {
        getItems()
      },[porps.activeNumber, porps.totalPages])

    return (
        <div>
            <Pagination size="sm">
                    <Pagination.First />
                    <Pagination.Prev />
                    {itemsPagination}
                    <Pagination.Next />
                    <Pagination.Last />
            </Pagination>
        </div>
    )
}

export default PaginationAction