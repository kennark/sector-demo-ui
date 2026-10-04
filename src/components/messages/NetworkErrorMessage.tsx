export function NetworkErrorMessage({render}: { render: boolean }) {
    if (!render) return null
    else return <span className="error">There seems to be an issue with the connection... Please try again.</span>
}