export function EditMessage({render}: { render: boolean }) {
    if (!render) return null
    else return <span>Data saved! You can edit your entry during this session.</span>
}