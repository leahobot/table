import React, {useState} from "react";
import {styled} from "@mui/material/styles";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import {useStateContext} from "../context/ContextProvider";

export const StyledTableCell = styled(TableCell)(({theme}) => ({
	[`&.${tableCellClasses.head}`]: {
		color: theme.palette.common.white,
		fontSize: 16,
		fontWeight: 600,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 15,
	},
}));

export const StyledTableRow = styled(TableRow)(({theme}) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

export function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

export function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

export function EnhancedTableToolbar() {
	const {setFilterModal, setFilteredRows, rows} = useStateContext();
	const [searchValue, setSearchValue] = useState("");

	const filterSearch = (e) => {
		setSearchValue(e);

		const newRows = rows.filter((row) =>
			row.continent.toLowerCase().includes(searchValue.toLowerCase()),
		);

		setFilteredRows(newRows);
	};

	return (
		<Toolbar
			sx={{
				pl: {sm: 2},
				pr: {xs: 1, sm: 1},
			}}>
			<Typography
				sx={{flex: "1 1 100%"}}
				variant='h5'
				id='tableTitle'
				component='div'>
				Filter Field
			</Typography>
			<input
				type='text'
				value={searchValue}
				onChange={(e) => filterSearch(e.target.value)}
				className='input'
				placeholder='Filter by Continent...'
			/>
			<Tooltip title='Filter by Has States'>
				<IconButton onClick={() => setFilterModal((previous) => !previous)}>
					<FilterListIcon />
				</IconButton>
			</Tooltip>
		</Toolbar>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};
