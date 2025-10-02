import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import type { FileUploadProps } from "./types";

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 2,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
    onFilesChange(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "#263b51" }}
      >
        Attachments (Optional)
      </label>

      {/* Upload Button */}
      <div className="mb-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          style={{ color: "#456882" }}
          disabled={files.length >= maxFiles}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Files ({files.length}/{maxFiles})
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center">
                <ImageIcon
                  className="w-4 h-4 mr-2"
                  style={{ color: "#456882" }}
                />
                <span className="text-sm truncate" style={{ color: "#263b51" }}>
                  {file.name}
                </span>
                <span className="text-xs ml-2" style={{ color: "#456882" }}>
                  ({Math.round(file.size / 1024)}KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
