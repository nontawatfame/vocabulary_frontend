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
      const [activeNumber, setActiveNumber] = useState(porps.activeNumber);
      const getItems = () => {
        let items = [];
        let numberInitialize;
        let numberEnd;
        if ((activeNumber - 2) < 1) {
          numberInitialize = 1
        } else if ((activeNumber - 2) == 2) {
          numberInitialize = 1
        } else {
          numberInitialize = activeNumber - 2
        }

        if ((activeNumber + 2) > porps.totalPages) {
          numberEnd = porps.totalPages
        } else if ((activeNumber + 2) == porps.totalPages - 1) {
          numberEnd = porps.totalPages
        } else {
          numberEnd = activeNumber + 2
        }
        for (let number = numberInitialize; number <= numberEnd; number++) {
            items.push(
            <Pagination.Item key={number} active={(number == activeNumber)} onClick={() => clickPagination(number, activeNumber)}>
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
          setActiveNumber(page)
        }
      }

      useEffect(() => {
        getItems()
      },[activeNumber,porps.activeNumber, porps.totalPages])

      const changePage = (page: number) => {
        let pageChange: any
        if (page < 1) {
          pageChange = 1
        } else if (page > porps.totalPages) {
          pageChange = porps.totalPages
        } else {
          pageChange = page
        }
        if (porps.onChange) {
          porps.onChange(pageChange)
        }
        setActiveNumber(pageChange)
      } 

    return (
        <div>
            <Pagination size="sm">
                    <Pagination.First onClick={() => {changePage(1)}}/>
                    <Pagination.Prev onClick={() => {changePage(activeNumber - 1)}}/>
                    {((activeNumber - 1) > 3) ?
                      <>
                      <Pagination.Item  onClick={() => clickPagination(1, activeNumber)}>1</Pagination.Item>
                      <Pagination.Ellipsis/>
                      </>
                     :"" 
                    }
                    {itemsPagination}
                    {((porps.totalPages - activeNumber) > 3) ?
                      <>
                      <Pagination.Ellipsis/>
                      <Pagination.Item  onClick={() => clickPagination(porps.totalPages, activeNumber)}>{porps.totalPages}</Pagination.Item>
                      </>
                     :"" 
                    }
                    <Pagination.Next onClick={() => {changePage(activeNumber + 1)}}/>
                    <Pagination.Last onClick={() => {changePage(porps.totalPages)}}/>
            </Pagination>
        </div>
    )
}

export default PaginationAction