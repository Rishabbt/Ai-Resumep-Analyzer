import { type FormEvent, useState } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');
        const feedback = await ai.feedback(
            uploadedImage.path,
            prepareInstructions({ jobTitle, jobDescription })
        );
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="dark-page" >
            <Navbar />
            <div className="dark-upload-body">
                {isProcessing ? (
                    <div className="dark-processing">
                        <img src="/images/resume-scan.gif" style={{ width: 220, opacity: 0.75 }} alt="analyzing" />
                        <div className="dark-status-text">{statusText}</div>
                    </div>
                ) : (
                    <>
                        <div className="dark-upload-header">
                            <div className="dark-upload-title">Analyze your resume</div>
                            <div className="dark-upload-sub">Get an ATS score + AI feedback tailored to the job</div>
                        </div>
                        <form id="upload-form" onSubmit={handleSubmit} className="dark-upload-form" style={{ all: 'unset', display: 'contents' }}>
                            <div className="dark-upload-form">
                                <div className="dark-form-row">
                                    <div className="dark-form-group">
                                        <div className="dark-form-label">Company</div>
                                        <input
                                            className="dark-form-input"
                                            type="text"
                                            name="company-name"
                                            placeholder="e.g. Google"
                                        />
                                    </div>
                                    <div className="dark-form-group">
                                        <div className="dark-form-label">Job Title</div>
                                        <input
                                            className="dark-form-input"
                                            type="text"
                                            name="job-title"
                                            placeholder="e.g. SWE"
                                        />
                                    </div>
                                </div>
                                <div className="dark-form-group">
                                    <div className="dark-form-label">Job Description</div>
                                    <textarea
                                        className="dark-form-textarea"
                                        name="job-description"
                                        placeholder="Paste the job description here..."
                                    />
                                </div>
                                <div className="dark-form-group">
                                    <div className="dark-form-label">Resume</div>
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>
                                <button
                                    className="dark-submit-btn"
                                    type="submit"
                                    disabled={!file}
                                >
                                    Analyze Resume →
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}

export default Upload;