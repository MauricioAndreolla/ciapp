import { useMemo } from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

const Table = ({ data, columns, onEdit, onDelete }) => {
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        pageOptions,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        setPageSize,
        setGlobalFilter,
        state,
    } = useTable(
        {
            columns: columns,
            data: data,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { globalFilter, pageIndex, pageSize } = state;

    const handleSearch = (e) => {
        const value = e.target.value || '';
        setGlobalFilter(value.toLowerCase());
    };

    const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize]);

    if (data.length === 0) {
        return <div className="col-md-12 zero-count">Nenhum registro localizado.</div>;
    }

    return (
        <>
            <div className="col-md-2 search-table">
                <i className="fas fa-search"></i>
                <input className="form-control shadow-none input-custom" value={globalFilter} onChange={handleSearch} placeholder="Pesquisar..." />
            </div>
            <table className="table table-bordered table-hover" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                >
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " ▼"
                                                : " ▲"
                                            : ""}
                                    </span>
                                </th>
                            ))}

                            <th className="table-actions"></th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                ))}
                                <td>
                                    <button className="btn" title="Editar" onClick={() => onEdit(row.original)}> <i className="fa fa-edit"></i></button>
                                    <button className="btn" title="Excluir" onClick={() => onDelete(row.original)}> <i className="fa fa-trash"></i></button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="table-btn-footer">
                <button className="btn btn-default" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Anterior
                </button>
                <span>
                    Página{" "}
                    {pageIndex + 1} de {totalPages}
                </span>
                <button className="btn btn-default" onClick={() => nextPage()} disabled={!canNextPage}>
                    Próxima
                </button>
                <select
                    className="select-custom w-1 form-select form-select-md"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Mostrar {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );

}

export default Table;