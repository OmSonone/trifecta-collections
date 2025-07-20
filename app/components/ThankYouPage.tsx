export default function ThankYouPage() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold text-white">
        Thank you for the details
      </h1>
      <p className="text-lg text-gray-300">
        We&apos;ll contact you soon
      </p>
      
      <div className="mt-8">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white text-black rounded font-medium hover:bg-gray-200 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    </div>
  );
}
