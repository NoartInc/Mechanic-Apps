import { IconCheck, IconCloudDownload } from '@tabler/icons'
import React from 'react'
import Modal from './Modal';
import { useAccess } from '../../utils/hooks/useAccess';
import { useRouter } from 'next/router';

const DataExport = ({ children, onApply = null, text = null }) => {
    const [showExport, setShowExport] = React.useState(false);
    const router = useRouter();
    const { canAccess } = useAccess(router?.pathname);

    const onApplyExport = () => {
        setShowExport(false);
        onApply();
    }

    const ApplyButton = () => (
        <div className="flex-shrink-0 mt-3 md:mt-0">
            <button className="button button-primary" onClick={onApplyExport}>
                <IconCheck />
                <span>Download Data</span>
            </button>
        </div>
    );

    if (canAccess("export")) {
        return (
            <div>
                <button type="button" className="button button-primary" onClick={() => setShowExport(true)}>
                    <IconCloudDownload />
                    {text && (
                        <span>{text}</span>
                    )}
                </button>
                <Modal title="Data Export" onClose={() => setShowExport(false)} show={showExport} action={<ApplyButton />}>
                    {children}
                </Modal>
            </div>
        )
    }

    return null;

}

export default DataExport