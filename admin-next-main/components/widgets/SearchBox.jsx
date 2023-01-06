import { debounce } from 'lodash'
import React from 'react'

const SearchBox = ({ onChange }) => {
    const [search, setSearch] = React.useState("");
    const onSearchChange = React.useCallback(debounce((event) => {
        setSearch(event.target.value);
    }, 500), []);
    React.useEffect(() => {
        onChange(search);
    }, [search]);
    return (
        <div>
            <input
                type="text"
                className="input hidden md:block"
                placeholder="Search Disini"
                onChange={onSearchChange}
            />
        </div>
    )
}

export default SearchBox