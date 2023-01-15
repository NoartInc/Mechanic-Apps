import React, { useId } from 'react'
import { get } from '../../utils/api';
import { Toast } from '../../utils/swal';
import Select from "react-select";
import { debounce } from 'lodash';

const GudangMekanikOption = ({
    onChange,
    label = "Pilih Sparepart",
    name = "",
    noLabel = false,
    value
}) => {
    const [data, setData] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [selected, setSelected] = React.useState(null);

    const getList = () => {
        get(`/gudangMekanik`, { search })
            .then(result => {
                setData(result?.rows?.map(item => ({
                    value: item?.id,
                    label: item?.sparepart,
                    stok: item?.stok
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
        get(`/gudangMekanik/${id}`)
            .then(result => {
                if (result?.id) {
                    setSelected({
                        value: result?.id,
                        label: result?.sparepart
                    });
                } else {
                    setSelected(null)
                }
            });
    }

    // eslint-disable-next-line
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
        // eslint-disable-next-line
    }, [search]);

    React.useEffect(() => {
        setTimeout(() => {
            getValue(value?.value);
        }, 100);
        // eslint-disable-next-line
    }, [value]);

    const labelClass = `input-label`;

    return (
        <div className="relative flex flex-col">
            {!noLabel && (
                <label htmlFor={name} className={labelClass}>{label}</label>
            )}
            <div className="input-column">
                <Select
                    placeholder="Pilih Sparepart"
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

export default GudangMekanikOption