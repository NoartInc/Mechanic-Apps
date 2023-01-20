import React from 'react'
import Layout from '../../components/layouts/Layout'
import { baseUrl, get } from '../../utils/api';
import { useRouter } from 'next/router';
import { Toast } from '../../utils/swal';
import moment from 'moment';
import { ViewFile, statusList } from '.';
import { IconArrowLeft } from '@tabler/icons';
import ImagePreview from '../../components/widgets/ImagePreview';
import { durationTemplate } from '../../components/widgets/DurationInput';
import { getTimeDiff, getTimeDuration } from '../../utils/helper';
import { getKerusakanDuration } from './form';

const Detail = () => {
    const previewRef = React.useRef(null);
    const [row, setRow] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const { id } = router?.query;

    const imagePreviewClass = `p-1 px-2 bg-blue-500 text-white cursor-pointer rounded`;

    const getRow = () => {
        setLoading(true);
        get(`/perbaikan/${id}`)
            .then(result => {
                setRow(result);
            })
            .catch(error => {
                Toast.fire({
                    icon: "error",
                    text: error?.error ?? "Gagal memuat data!"
                });
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            })
    }

    const previewImage = () => {
        previewRef.current.openModal();
    }

    const findJumlahSparepart = (id) => {
        return row?.perbaikanSpareparts?.find(item => item?.gudangmekanik === id)?.jumlah;
    }

    const formatDurasi = (durasi) => {
        let durationValue = durasi?.split(" ");
        return `${durationValue[0]} ${durationTemplate.find(item => item?.value === durationValue[1])?.label}`;
    }

    React.useEffect(() => {
        getRow();
        // eslint-disable-next-line
    }, [id]);

    return (
        <Layout title="Detail Perbaikan">
            {/* Page header (back & No. Laporan) */}
            <div className="card-page mb-3">
                <div className="flex justify-between items-center">
                    <div className="flex-shrink-0">
                        <button
                            className="button button-outline-primary button-small"
                            type="button"
                            onClick={() => router.push('/perbaikan')}
                        >
                            <IconArrowLeft />
                            <span>Kembali</span>
                        </button>
                    </div>
                    <div className="flex-shrink-0 flex pt-1">
                        <DataInfo label="No. Laporan" value={row?.noLaporan} hideLabel />
                    </div>
                </div>
            </div>

            {/* Image photo preview */}
            <ImagePreview ref={previewRef} source={`${baseUrl}/images/${row?.uploadPhotos}`} />

            {/* Data Header Info */}
            <div className="card-page mb-3">
                <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="col-span-12 md:col-span-4">
                        <DataInfo label="User" value={row?.pengguna?.fullName} />
                        <DataInfo label="Tanggal" value={moment(row?.createdAt).format("DD/MM/YYYY")} />
                        <DataInfo label="Jenis Perbaikan" value={<span className="uppercase">{row?.jenisPerbaikan}</span>} />
                        <DataInfo label="Nama Mesin" value={row?.machine?.mesin} />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <DataInfo label="Status" value={(<ReportStatus status={row?.status} />)} />
                        <DataInfo label="Mekanik" value={row?.mekaniks?.map(item => item?.mekanik)?.join(", ")} />
                        <DataInfo
                            label="Foto"
                            value={
                                row?.uploadPhotos ? (
                                    <button
                                        className={imagePreviewClass}
                                        onClick={() => previewImage()}
                                        style={{ fontSize: 12 }}
                                    >
                                        Lihat Foto
                                    </button>
                                ) : (
                                    <span className="text-orange-500">
                                        Belum upload foto
                                    </span>
                                )
                            }
                        />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                        <DataInfo label="Note" value={row?.note} />
                    </div>
                </div>
                <hr className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="col-span-12 md:col-span-5">
                        <h5 className="text-gray-700 font-semibold mb-2">Konsumsi Sparepart</h5>
                        <DetailInfo label="Sparepart" value="Jumlah" header />
                        {row?.spareparts?.map((sparepart, index) => (
                            <DetailInfo
                                key={index}
                                label={sparepart?.sparepart}
                                value={findJumlahSparepart(sparepart?.id)}
                            />
                        ))}
                    </div>
                    <div className="col-span-12 md:col-span-1 mb-3"></div>
                    <div className="col-span-12 md:col-span-6">
                        <h5 className="text-gray-700 font-semibold mb-2">Kerusakan</h5>
                        <div className="grid grid-cols-1 md:grid-cols-12">
                            <div className="col-span-12 md:col-span-5">
                                <DetailInfo label="Mulai" value={moment(row?.startDate).format("DD/MM/YYYY HH:mm")} smallText />
                                <DetailInfo label="Selesai" value={row?.endDate ? moment(row?.endDate).format("DD/MM/YYYY HH:mm") : "-"} smallText />
                            </div>
                            <div className="col-span-12 md:col-span-1"></div>
                            <div className="col-span-12 md:col-span-6">
                                <DetailInfo label="Downtime" value={getTimeDiff(row?.startDate, row?.endDate)} smallText />
                                <DetailInfo label="Estimasi" value={getTimeDuration(getKerusakanDuration(row?.kerusakans))} smallText />
                            </div>
                        </div>
                        <DetailInfo label="Kerusakan" value="Durasi" header />
                        {row?.kerusakans?.map((kerusakan, index) => (
                            <DetailInfo
                                key={index}
                                label={kerusakan?.kerusakan}
                                value={formatDurasi(kerusakan?.durasi)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

const ReportStatus = ({ status }) => {
    const statusClass = `p-1 px-2 rounded uppercase ${statusList?.find(item => item?.status === status)?.className}`;
    return (
        <span className={statusClass} style={{ fontSize: 12 }}>
            {status}
        </span>
    )
}

const DetailInfo = ({ label, value, header = false, smallText = false }) => {
    return (
        <div className={`flex items-center flex-row justify-between gap-x-2 mb-1 p-1 px-2 ${header ? 'bg-gray-100' : 'border-b'}`.trim(' ')}>
            <div className="flex-grow">
                <label
                    className={`${header ? `text-gray-700 font-semibold` : `text-gray-600`} text-sm`}
                    style={{ fontSize: smallText ? 12 : 13.5 }}
                >
                    {label}
                </label>
            </div>
            <div>
                <h5
                    className={`${header ? 'text-gray-700' : ''} font-semibold text-sm`}
                    style={{ fontSize: smallText ? 12 : 13.5 }}
                >
                    {value}
                </h5>
            </div>
        </div>
    )
}

const DataInfo = ({ label, value, hideLabel = false }) => {
    return (
        <div className="flex items-center flex-row justify-between md:justify-start gap-x-2 mb-2">
            <div className={`${hideLabel ? 'hidden md:block' : ''} w-32`}>
                <label className="text-gray-600 text-sm">{label}</label>
            </div>
            <div>
                <h5 className="text-sm font-semibold text-gray-700">{value}</h5>
            </div>
        </div>
    )
}

export default Detail