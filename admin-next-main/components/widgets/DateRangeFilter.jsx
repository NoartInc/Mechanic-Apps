import React from 'react'
import InputForm from './InputForm'
import moment from 'moment';

const initStart = moment().subtract(1, 'months').format("YYYY-MM-DD");
const initEnd = moment().format("YYYY-MM-DD")

const DateRangeFilter = ({ onChange, value }) => {
    const [dateRangeFilter, setDateRangeFilter] = React.useState({
        startDate: value?.startDate ? value?.startDate : initStart,
        endDate: value?.endDate ? value?.endDate : initEnd
    });

    const onInputChange = (event) => {
        const { value, name } = event.target;
        setDateRangeFilter(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    React.useEffect(() => {
        onChange({
            dateRange: dateRangeFilter
        });
        // eslint-disable-next-line
    }, [dateRangeFilter]);

    return (
        <div className="flex flex-col md:flex-row justify-start md:justify-center items-center gap-x-4">
            <div className="mb-3 flex-grow">
                <InputForm
                    label="Dari Tanggal"
                    name="startDate"
                    value={dateRangeFilter?.startDate}
                    onChange={onInputChange}
                    type="date"
                    validation={false}
                />
            </div>
            <div className="mb-3 flex-grow">
                <InputForm
                    label="Sampai Tanggal"
                    name="endDate"
                    value={dateRangeFilter?.endDate}
                    onChange={onInputChange}
                    type="date"
                    validation={false}
                    min={dateRangeFilter?.startDate}
                />
            </div>
        </div>
    )
}

export default DateRangeFilter