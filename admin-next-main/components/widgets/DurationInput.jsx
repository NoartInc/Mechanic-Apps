import React from 'react'
import { randId } from '../../utils/helper';
import moment from 'moment';

export const durationTemplate = [
    {
        value: "minutes",
        label: "Menit"
    },
    {
        value: "hours",
        label: "Jam"
    },
    {
        value: "days",
        label: "Hari",
    },
    {
        value: "weeks",
        label: "Minggu"
    },
    {
        value: "months",
        label: "Bulan"
    },
    {
        value: "years",
        label: "Tahun"
    }
];

const DurationInput = ({
    onChange,
    name,
    value,
    label,
    className = "",
    errors = null,
    touched = null
}) => {
    const [numberDuration, setNumberDuration] = React.useState(value ? value?.split(" ")[0] : 1);
    const [stringDuration, setStringDuration] = React.useState(value ? value?.split(" ")[1] : "hours");
    const inputClass = `text-input ${errors[name] && touched[name] ? 'border border-red-600' : ''}`.trim(' ');
    const labelClass = `input-label`;

    React.useEffect(() => {
        setTimeout(() => {
            onChange(`${numberDuration} ${stringDuration}`, moment.duration(numberDuration, stringDuration).as("seconds") ?? 3600);
        }, 300);
        // eslint-disable-next-line
    }, [numberDuration, stringDuration]);

    return (
        <div className={`relative field-input ${className}`.trim(' ')}>
            <label htmlFor={name} className={labelClass}>
                {label}
            </label>
            <div className="input-column">
                <div className="flex justify-between items-center md:justify-start gap-x-1 w-full md:w-1/2">
                    <input
                        type="number"
                        id={`number_duration_${randId()}`}
                        placeholder="1"
                        className={inputClass}
                        onChange={(event) => setNumberDuration(event.target.value)}
                        value={numberDuration}
                    />
                    <select
                        className={inputClass}
                        value={stringDuration}
                        id={`string_duration_${randId()}`}
                        onChange={(event) => setStringDuration(event.target.value)}
                    >
                        {durationTemplate.map((duration, index) => (
                            <option value={duration?.value} key={index}>
                                {duration?.label}
                            </option>
                        ))}
                    </select>
                </div>
                {errors[name] && touched[name] ? (
                    <small className="text-red-600" style={{ fontSize: 12 }}>
                        {errors[name]}
                    </small>
                ) : null}
            </div>
        </div>
    )
}

export default DurationInput