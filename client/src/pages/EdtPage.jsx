import Link from '../components/Link.jsx'
export default function EdtPage({ isAdmin }) {
    const names = ['name1', 'name2', 'name3'] // TODO: change with request to get user names
    const userIds = ['id1', 'id2', 'id3'] // TODO: change with request to get user ids

    return (
        <div className="flex items-start justify-center min-h-screen bg-gray-100">
            {names.map((name, index) => (
                <div key={name} className="card m-10 p-4 border rounded shadow">
                    <Link
                        text={name}
                        href={`${userIds[index]}`}
                        color={"black"}
                    />
                </div>
            ))}
        </div>
    )
}