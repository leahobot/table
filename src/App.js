import React, {useState} from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import {TablePaginationActions} from "./components/Pagination";
import Paper from "@mui/material/Paper";
import {
	StyledTableCell,
	StyledTableRow,
	stableSort,
	getComparator,
} from "./components/Utility";
import PropTypes from "prop-types";
import TableSortLabel from "@mui/material/TableSortLabel";
import {EnhancedTableToolbar} from "./components/Utility";
import {visuallyHidden} from "@mui/utils";
import {useStateContext} from "./context/ContextProvider";
import "./App.css";

const headCells = [
	{
		id: "nameUn",
		label: "Name of Country (English)",
	},
	{
		id: "name",
		label: "Name of Country (Czech)",
	},
];

function EnhancedTableHead(props) {
	const {order, orderBy, onRequestSort} = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead style={{backgroundColor: "#5596e6c2"}}>
			<TableRow>
				<StyledTableCell align='left'>Code</StyledTableCell>
				{headCells.map((headCell) => (
					<StyledTableCell
						key={headCell.id}
						align='left'
						sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component='span' sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</StyledTableCell>
				))}
				<StyledTableCell align='center'>Continent</StyledTableCell>
				<StyledTableCell align='center'>HasStates</StyledTableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const App = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("");
	const [selected, setSelected] = useState([]);
	const {filterModal, setFilterModal, filteredRows, setFilteredRows, rows} =
		useStateContext();

	const filterStates = () => {
		setFilterModal(false);

		const newRows = rows.filter((row) =>
			row.hasStates.toLowerCase().includes("true"),
		);

		setFilteredRows(newRows);
	};

	const emptyRows =
		page > 0
			? Math.max(
					0,
					(1 + page) * rowsPerPage -
						(filteredRows.length > 0 ? filteredRows.length : rows.length),
			  )
			: 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = (filteredRows.length > 0 ? filteredRows : rows).map(
				(n) => n.name,
			);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	return (
		<section className='table-section'>
			<h1>Countries</h1>
			<Box sx={{width: "100%"}}>
				<Paper sx={{width: "100%", mb: 2}}>
					<EnhancedTableToolbar numSelected={selected.length} />
					<TableContainer component={Paper}>
						<Table
							sx={{minWidth: 700}}
							aria-labelledby='tableTitle'
							aria-label='customized table'>
							<EnhancedTableHead
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={
									filteredRows.length > 0 ? filteredRows.length : rows.length
								}
							/>
							<TableBody>
								{stableSort(
									filteredRows.length > 0 ? filteredRows : rows,
									getComparator(order, orderBy),
								)
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row) => {
										const isItemSelected = isSelected(row.name);

										return (
											<StyledTableRow
												key={row.id}
												aria-checked={isItemSelected}
												tabIndex={-1}
												selected={isItemSelected}>
												<StyledTableCell align='left'>
													{row.code}
												</StyledTableCell>
												<StyledTableCell component='th' scope='row'>
													{row.nameUn}
												</StyledTableCell>
												<StyledTableCell align='left'>
													{row.name}
												</StyledTableCell>
												<StyledTableCell align='center'>
													{row.continent}
												</StyledTableCell>
												<StyledTableCell align='center'>
													{row.hasStates}
												</StyledTableCell>
											</StyledTableRow>
										);
									})}
								{emptyRows > 0 && (
									<StyledTableRow style={{height: 53 * emptyRows}}>
										<StyledTableCell colSpan={6} />
									</StyledTableRow>
								)}
							</TableBody>
							<TableFooter>
								<StyledTableRow>
									<TablePagination
										rowsPerPageOptions={[
											5,
											10,
											15,
											20,
											{label: "All", value: -1},
										]}
										colSpan={5}
										sx={{
											fontSize: 14,
											fontWeight: 600,
										}}
										count={
											filteredRows.length > 0
												? filteredRows.length
												: rows.length
										}
										rowsPerPage={rowsPerPage}
										page={page}
										SelectProps={{
											inputProps: {
												"aria-label": "rows per page",
											},
											native: false,
										}}
										onPageChange={handleChangePage}
										onRowsPerPageChange={handleChangeRowsPerPage}
										ActionsComponent={TablePaginationActions}
									/>
								</StyledTableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</Paper>
			</Box>
			{filterModal && (
				<div className='filter-modal'>
					<p>Filter By:</p>
					<ul>
						<li onClick={filterStates}>Has States</li>
					</ul>
				</div>
			)}
		</section>
	);
};

export default App;
