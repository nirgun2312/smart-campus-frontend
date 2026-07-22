interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, ...props }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-gray-900
          focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 transition
          ${error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200'} ${props.className ?? ''}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
