import React from 'react'
import Modal from './Modal'
import Image from 'next/image'

const ImagePreview = React.forwardRef((props, _ref) => {
    const { source = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg", onClose = () => null } = props;
    const [showModal, setShowModal] = React.useState(false);

    const closeModal = () => {
        onClose();
        setShowModal(false);
    }

    const viewSource = () => {
        window.open(source, "_blank");
    }

    React.useImperativeHandle(_ref, () => ({
        openModal: () => setShowModal(true)
    }));

    return (
        <Modal show={showModal} onClose={closeModal}>
            <div className="relative w-72 h-72 md:w-full md:h-96 cursor-pointer" onClick={viewSource}>
                <Image
                    src={source}
                    alt=""
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 576px) 100vw, 100vw"
                />
            </div>
            <h4 className="text-center text-sm text-gray-500">Klik gambar untuk memperbesar</h4>
        </Modal>
    )
});

ImagePreview.displayName = "ImagePreview";

export default ImagePreview