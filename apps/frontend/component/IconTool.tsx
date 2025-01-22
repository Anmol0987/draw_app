import { ReactNode } from "react"

export const IconTool = ({ icon, activated, onClick }: {
    icon: ReactNode,
    activated: boolean,
    onClick?: () => void
}) => {
    return <div className={`m-2 pointer rounded-full border p-2 bg-black hover:bg-gray ${activated ? "text-black" : "text-white"}`} onClick={onClick}>
    {icon}
</div>
}
