import React, { useId } from 'react'
import { get } from '../../utils/api';
import { Toast } from '../../utils/swal';
import Select from "react-select";
import _, { debounce } from 'lodash';

const MechanicOption = ({
    onChange,
    label = "Pilih Mekanik",
    name = "",
    noLabel = false,
    value,
    layout = "row"
}) => {
    const [data, setData] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [selected, setSelected] = React.useState([]);

    const getList = () => {
        get(`/mekanik`, { search })
            .then(result => {
                setData(result?.rows?.map(item => ({
                    value: item?.id,
                    label: item?.mekanik
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
        get(`/mekanik/${id}`)
            .then(result => {
                let newData = _.uniqBy([...selected, {
                    value: result?.id,
                    label: result?.mekanik
                }], "value");
                setSelected(newData);
            });
    }

    const onInputChange = React.useCallback(
        debounce((value) => {
            setSearch(value);
        }, 500),
        []
    )

    const onChangeHandler = (value) => {
        const updatedValue = value?.map(item => ({
            mekanik: item?.value
        }));
        setSelected(value);
        onChange(updatedValue);
    }

    React.useEffect(() => {
        getList();
    }, [search]);

    const labelClass = `input-label`;

    return (
        <div className={`relative ${layout === "row" ? "field-input" : "flex flex-col"}`}>
            {!noLabel && (
                <label htmlFor={name} className={labelClass}>{label}</label>
            )}
            <div className="input-column">
                <Select
                    instanceId={useId()}
                    isMulti={true}
                    value={selected}
                    options={data}
                    onInputChange={onInputChange}
                    onChange={onChangeHandler}
                />
            </div>
        </div>
    )
}

export default MechanicOption