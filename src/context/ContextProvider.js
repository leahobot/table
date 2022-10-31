import React, {useState, createContext, useContext} from "react";
import countryData from "../data/countryData.json";

const StateContext = createContext();

export const ContextProvider = ({children}) => {
	const [filterModal, setFilterModal] = useState(false);
	const [filteredRows, setFilteredRows] = useState([]);
	const rows = countryData["countries"];

	return (
		<StateContext.Provider
			value={{
				filterModal,
				setFilterModal,
				filteredRows,
				setFilteredRows,
				rows,
			}}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
