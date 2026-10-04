export function ValidationErrorMessage({render}: { render: boolean }) {
    if (!render) return null
    else return <span className="error">Please fill all fields.</span>
}