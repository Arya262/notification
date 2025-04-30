export default function SuccessErrorMessage({ successMessage, errorMessage }) {
    return (
      <>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      </>
    );
  }
  