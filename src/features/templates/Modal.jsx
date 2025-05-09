import React, { useState } from "react";
import FormFields from "./components/FormFields";
import TemplateType from "./components/TemplateType";
import FooterAndActions from "./components/FooterAndActions";
import PreviewPanel from "./components/PreviewPanel";

const defaultValues = {
  elementName: "",
  category: "",
  language: "",
  header: "",
  footer: "",
  format: "",
  templateType: "text",
  actionType: "none",
  previewImage: null,
};

const TemplateModal = ({ isOpen, onClose, onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFormData({ ...formData, previewImage: previewURL });
    }
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, previewImage: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.elementName.trim()) newErrors.elementName = "Template name is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.language) newErrors.language = "Language is required.";
    if (!formData.format.trim()) newErrors.format = "Format text is required.";
    if (formData.footer.length > 60) newErrors.footer = "Footer must be under 60 characters.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const newTemplate = {
      id: Date.now(),
      ...formData,
    };

    onSubmit(newTemplate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Template</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-4">
            <FormFields formData={formData} handleChange={handleChange} errors={errors} />
            <TemplateType formData={formData} handleChange={handleChange} errors={errors} />
            <FooterAndActions formData={formData} handleChange={handleChange} errors={errors} />

            <div className="flex justify-start gap-4 pt-4">
              <button
                type="submit"
                className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100"
              >
                Cancel
              </button>
            </div>
          </div>

          <PreviewPanel
            formData={formData}
            handleImageChange={handleImageChange}
            handleImageRemove={handleImageRemove}
          />
        </form>
      </div>
    </div>
  );
};

export default TemplateModal;
