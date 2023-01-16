import React from 'react'

const FileUpload = ({ onChange, fileType = "image/*" }) => {
    const [selectedFile, setSelectedFile] = React.useState(undefined);
    const [draggedFile, setDraggedFile] = React.useState(null);

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const allowDrop = (ev) => {
        ev.preventDefault();
        setDraggedFile(ev);
    }

    const drop = (ev) => {
        ev.preventDefault();
        const data = ev.dataTransfer.items;
        if (data) {
            const dataFile = data[0].getAsFile();
            setSelectedFile(dataFile);
        }
    }

    React.useEffect(() => {
        onChange(selectedFile);
        // eslint-disable-next-line
    }, [selectedFile]);

    return (
        <div className="max-w-xl">
            <label
                className={`drop-file-content ${draggedFile ? "dragged-content" : ""}`.trim(" ")}
                onDragOver={allowDrop}
                onDrop={drop}
                onDragEnd={() => setDraggedFile(null)}
            >
                <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${selectedFile ? "text-blue-600" : "text-gray-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className={`font-medium ${selectedFile ? "text-blue-600" : "text-gray-600"}`}>
                        {!selectedFile ? (
                            <>
                                <span>Drop files to Attach, or</span>
                                <span className="text-blue-600 underline ml-1">browse</span>
                            </>
                        ) : (
                            <span style={{ fontSize: 12 }}>{selectedFile?.name}</span>
                        )}
                    </span>
                </span>
                <input type="file" name="file_upload" className="hidden" onChange={onFileChange} accept={fileType} />
            </label>
        </div>

    )
}

export default FileUpload