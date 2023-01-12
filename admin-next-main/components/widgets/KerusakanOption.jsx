import React, { useId } from 'react'
import { get } from '../../utils/api';
import { Toast } from '../../utils/swal';
import Select from "react-select";
import { debounce } from 'lodash';

const KerusakanOption = ({
    onChange,
    label = "Pilih Kerusakan",
    name = "",
    noLabel = false,
    value
}) => {
    const [data, setData] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [selected, setSelected] = React.useState(null);

    const getList = () => {
        get(`/kerusakan`, { search })
            .then(result => {
                setData(result?.rows?.map(item => ({
                    value: item?.id,
                    label: item?.kerusakan,
                    durasi: item?.durasi
                })));
            })
            .catch(error => {
                Toast.fire({
                    text: error ?? "Gagal memuat data",
                    icon: "error"
                });
            })
    }

    const getValue = (id) => {
        get(`/kerusakan/${id}`)
            .then(result => {
                if (result?.id) {
                    setSelected({
                        value: result?.id,
                        label: result?.kerusakan
                    });
                } else {
                    setSelected(null)
                }
            });
    }

    const onInputChange = React.useCallback(
        debounce((value) => {
            setSearch(value);
        }, 500),
        []
    )

    const onChangeHandler = (value) => {
        const getItem = data.find(item => item?.value === value?.value);
        onChange(getItem);
    }

    React.useEffect(() => {
        getList();
    }, [search]);

    React.useEffect(() => {
        setTimeout(() => {
            getValue(value?.value);
        }, 100);
    }, [value]);

    const labelClass = `input-label`;

    return (
        <div className="relative flex flex-col">
            {!noLabel && (
                <label htmlFor={name} className={labelClass}>{label}</label>
            )}
            <div className="input-column">
                <Select
                    placeholder="Pilih Kerusakan"
                    instanceId={useId()}
                    id={useId()}
                    value={selected}
                    options={data}
                    onInputChange={onInputChange}
                    onChange={onChangeHandler}
                />
            </div>
        </div>
    )
}

export default KerusakanOption