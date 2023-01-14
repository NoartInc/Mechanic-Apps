import React, { useId } from 'react'
import { get } from '../../utils/api';
import { Toast } from '../../utils/swal';
import Select from "react-select";
import { debounce } from 'lodash';

const RoleOption = ({
    onChange,
    label = "Pilih Role",
    name = "",
    noLabel = false,
    value,
    layout = "row"
}) => {
    const [data, setData] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [selected, setSelected] = React.useState(undefined);

    const getList = () => {
        get(`/roles`, { search })
            .then(result => {
                setData(result?.rows?.map(item => ({
                    value: item?.id,
                    label: item?.roleName
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
        if (id) {
            get(`/roles/${id}`)
                .then(result => {
                    setSelected({
                        value: result?.id,
                        label: result?.roleName
                    });
                });
        }
    }

    const onInputChange = React.useCallback(
        debounce((value) => {
            setSearch(value);
        }, 500),
        []
    )

    const onChangeHandler = (value) => {
        onChange(value?.value);
    }

    React.useEffect(() => {
        getList();
    }, [search]);

    React.useEffect(() => {
        setTimeout(() => {
            getValue(value);
        }, 500);
    }, [value]);

    const labelClass = `input-label`;

    return (
        <div className={`relative ${layout === "row" ? "field-input" : "flex flex-col"}`}>
            {!noLabel && (
                <label htmlFor={name} className={labelClass}>{label}</label>
            )}
            <div className="input-column">
                <Select
                    instanceId={useId()}
                    value={selected}
                    options={data}
                    onInputChange={onInputChange}
                    onChange={onChangeHandler}
                />
            </div>
        </div>
    )
}

export default RoleOption