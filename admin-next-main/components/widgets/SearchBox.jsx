import { debounce } from 'lodash'
import React from 'react'

const SearchBox = ({ onChange }) => {
    const [search, setSearch] = React.useState("");
    // eslint-disable-next-line
    const onSearchChange = React.useCallback(debounce((event) => {
        setSearch(event.target.value);
    }, 500), []);
    React.useEffect(() => {
        onChange(search);
        // eslint-disable-next-line
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